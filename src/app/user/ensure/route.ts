import { NextResponse } from "next/server"; 
import { prisma } from "@/lib/prisma"; 

export async function POST() {
    // TODO: replace with your auth provider's session/user retrieval
    const email = "dev@example.com"

    const user = await prisma.user.upsert({
        where: { email }, 
        update: { }, 
        create: { email }, 
    });
    
    return NextResponse.json({ user }); 
}
