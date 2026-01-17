import { pool } from "@/lib/db"; 
import { redirect } from "next/navigation"; 

function requireString(value: FormDataEntryValue | null, field: string): string {
    if (typeof value!== "string" || value.trim() === "") {
        throw new Error(`Missing or invalid field: ${field}`); 
    } 
    return value.trim(); 
}

export async function POST(req: Request) {
    const form = await req.formData(); 

    const email = requireString(form.get("email"), "email").toLowerCase(); 
    const bedtime = requireString(form.get("bedtime"), "bedtime"); 
    const wakeTime = requireString(form.get("wakeTime"), "wakeTime");
    const mainIssue = requireString(form.get("mainIssue"), "mainIssue"); 

    const client = await pool.connect(); 
    try {
        await client.query("BEGIN"); 

        // Create or find user
        const userRes = await client.query<{ id: string }>(
            `
            INSERT INTO users (email)
            VALUES ($1)
            ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
            RETURNING id
            `, 
            [email]
        ); 
        const userId = userRes.rows[0]!.id; 

        // Determine next version
        const vRes = await client.query<{ next_version: number }>(
            `
            SELECT COALESCE(MAX(version), 0) + 1 AS next_version
            FROM onboarding_submissions
            WHERE user_id = $1
            `, 
            [userId]
        ); 
        const version = vRes.rows[0]!.next_version; 

        const answers = { bedtime, wakeTime, mainIssue }; 
        
        await client.query(
            `
            INSERT INTO onboarding_submissions (user_id, version, answers_json)
            values ($1, $2, $3::jsonb)
            `, 
            [userId, version, JSON.stringify(answers)]
        );

        await client.query("COMMIT"); 
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release(); 
    }

    return redirect("/onboarding/success"); 
}

