export default function OnboardingPage() {
    return (
        <main style={{ padding: 24 }}>
            <h1>Onboarding</h1>
            <form action="/api/onboarding/submit" method="post">
                <label>
                    Email <br />
                    <input name="email" type="email" required />
                </label>
                <br />
                <label> 
                    Bedtime Target 
                    <input name="bedtime" type="time" required />
                </label>
                <br />

                <label> 
                    Wake time targer

                    <input name="wakeTime" type="time" required />
                </label>

                <label>
                    Main issue
                    <br />
                    <select name="mainIssue" required>
                        <option value="falling_asleep">Falling asleep</option>
                        <option value="staying_asleep">Staying asleep</option>
                        <option value="early_waking">Waking too early</option>
                        <option value="poor_quality">Poor quality sleep</option>
                    </select>
                </label>

                <br /><br />

                <button type="submit">Submit</button>
            </form>
        </main>
    );
}
