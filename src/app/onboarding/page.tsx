import {auth} from "@clerk/nextjs/server"
import Link from "next/link";

export default function OnboardingPage() {
    const {userId} = auth();

  if (!userId) {
    return (
      <main className="p-6">
        <p>You must be signed in.</p>
        <Link className="underline" href="/sign-in">Sign in</Link>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Onboarding</h1>
      <p className="mt-2">Questionnaire goes here next.</p>
    </main>
  );
}
