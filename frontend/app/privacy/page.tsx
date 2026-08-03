import Link from "next/link";

export default function PrivacyPolicy() {
  const lastUpdated = "December 2024";

  return (
    <main style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid var(--border)", padding: "20px 48px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span className="font-serif" style={{ fontSize: 20, fontWeight: 300, color: "var(--text)", letterSpacing: "0.05em" }}>
              Rift
            </span>
          </Link>
          <Link href="/" style={{ fontSize: 14, color: "var(--muted)", textDecoration: "none" }}>
            ← Back to home
          </Link>
        </div>
      </header>

      {/* Content */}
      <article style={{ maxWidth: 800, margin: "0 auto", padding: "64px 48px 96px" }}>
        <h1 className="font-serif" style={{ fontSize: 48, fontWeight: 300, marginBottom: 16, lineHeight: 1.2 }}>
          Privacy <em>Policy</em>
        </h1>
        <p className="font-sans" style={{ fontSize: 15, color: "var(--muted)", marginBottom: 48 }}>
          Last updated: {lastUpdated}
        </p>

        <div className="font-sans" style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text)" }}>
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16, marginTop: 0 }}>Introduction</h2>
            <p style={{ marginBottom: 16 }}>
              Welcome to Rift. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
            <p>
              This privacy policy applies to information we collect about you when you use our link shortening services, including our website, API, and any related services (collectively, the "Services").
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Information We Collect</h2>
            
            <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 24 }}>Information You Provide</h3>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Account information (email, username, password)</li>
              <li style={{ marginBottom: 8 }}>Payment information (processed securely through Stripe)</li>
              <li style={{ marginBottom: 8 }}>Link data (URLs you shorten, custom slugs, titles)</li>
              <li style={{ marginBottom: 8 }}>Profile information (optional: name, company, profile picture)</li>
              <li style={{ marginBottom: 8 }}>Communications with us (support requests, feedback)</li>
            </ul>

            <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 24 }}>Information We Collect Automatically</h3>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Click analytics (IP address, device type, browser, operating system)</li>
              <li style={{ marginBottom: 8 }}>Geographic location data (country, city, region)</li>
              <li style={{ marginBottom: 8 }}>Referrer information (source of traffic)</li>
              <li style={{ marginBottom: 8 }}>Usage data (pages visited, features used, time spent)</li>
              <li style={{ marginBottom: 8 }}>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>How We Use Your Information</h2>
            <p style={{ marginBottom: 16 }}>We use the information we collect to:</p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Provide, maintain, and improve our Services</li>
              <li style={{ marginBottom: 8 }}>Process your transactions and manage your subscription</li>
              <li style={{ marginBottom: 8 }}>Send you technical notices, updates, and support messages</li>
              <li style={{ marginBottom: 8 }}>Provide analytics and insights about your shortened links</li>
              <li style={{ marginBottom: 8 }}>Respond to your comments, questions, and requests</li>
              <li style={{ marginBottom: 8 }}>Monitor and analyze trends, usage, and activities</li>
              <li style={{ marginBottom: 8 }}>Detect, prevent, and address technical issues and fraud</li>
              <li style={{ marginBottom: 8 }}>Comply with legal obligations and protect our rights</li>
            </ul>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Information Sharing</h2>
            <p style={{ marginBottom: 16 }}>We do not sell your personal information. We may share your information in the following circumstances:</p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}><strong>With your consent:</strong> We'll share information when you direct us to</li>
              <li style={{ marginBottom: 8 }}><strong>Service providers:</strong> Third-party vendors who perform services on our behalf (payment processing, analytics, hosting)</li>
              <li style={{ marginBottom: 8 }}><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
              <li style={{ marginBottom: 8 }}><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li style={{ marginBottom: 8 }}><strong>Team members:</strong> With other users in your team account (if applicable)</li>
            </ul>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Data Security</h2>
            <p style={{ marginBottom: 16 }}>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Encryption of data in transit and at rest</li>
              <li style={{ marginBottom: 8 }}>Secure password hashing using bcrypt</li>
              <li style={{ marginBottom: 8 }}>Regular security audits and updates</li>
              <li style={{ marginBottom: 8 }}>Access controls and authentication systems</li>
              <li style={{ marginBottom: 8 }}>Secure infrastructure and hosting providers</li>
            </ul>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Your Rights</h2>
            <p style={{ marginBottom: 16 }}>Depending on your location, you may have the following rights:</p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}><strong>Access:</strong> Request a copy of your personal data</li>
              <li style={{ marginBottom: 8 }}><strong>Correction:</strong> Update or correct your personal data</li>
              <li style={{ marginBottom: 8 }}><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li style={{ marginBottom: 8 }}><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li style={{ marginBottom: 8 }}><strong>Objection:</strong> Object to processing of your personal data</li>
              <li style={{ marginBottom: 8 }}><strong>Restriction:</strong> Request restriction of processing</li>
              <li style={{ marginBottom: 8 }}><strong>Withdraw consent:</strong> Withdraw consent at any time</li>
            </ul>
            <p>To exercise these rights, please contact us at privacy@rift.example.com</p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Cookies and Tracking</h2>
            <p style={{ marginBottom: 16 }}>
              We use cookies and similar tracking technologies to track activity on our Services. You can control cookies through your browser settings. Note that disabling cookies may affect the functionality of our Services.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Data Retention</h2>
            <p>
              We retain your personal data for as long as necessary to provide our Services and fulfill the purposes described in this policy. When you delete your account, we will delete or anonymize your personal data within 30 days, except where we need to retain it for legal obligations.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy and applicable laws.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Children's Privacy</h2>
            <p>
              Our Services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. You are advised to review this policy periodically.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Contact Us</h2>
            <p style={{ marginBottom: 8 }}>
              If you have any questions about this privacy policy, please contact us:
            </p>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              <li style={{ marginBottom: 8 }}>Email: privacy@rift.example.com</li>
              <li style={{ marginBottom: 8 }}>Address: [Your Business Address]</li>
            </ul>
          </section>
        </div>
      </article>
    </main>
  );
}
