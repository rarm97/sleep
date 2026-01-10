import { auth } from "@clerk/nextjs/server"
import { SignedIn, SignedOut, RedirectToSignIn, UserButton} from "@clerk/nextjs"
import Link from "next/link";

export default function DashboardPage() {

  return (
    <main className ="p-6">
        <SignedIn>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className = "mt-4">
                <UserButton />
            </div>
        </SignedIn>

        <SignedOut> 
          <RedirectToSignIn />
        </SignedOut>
    </main>
  );
}
