import Link from "next/link";

export default function TermsOfService() {
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
          Terms of <em>Service</em>
        </h1>
        <p className="font-sans" style={{ fontSize: 15, color: "var(--muted)", marginBottom: 48 }}>
          Last updated: {lastUpdated}
        </p>

        <div className="font-sans" style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text)" }}>
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16, marginTop: 0 }}>Agreement to Terms</h2>
            <p>
              By accessing or using Rift's link shortening services (the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Description of Services</h2>
            <p style={{ marginBottom: 16 }}>
              Rift provides URL shortening and link management services, including but not limited to:
            </p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Link shortening and customization</li>
              <li style={{ marginBottom: 8 }}>Click analytics and tracking</li>
              <li style={{ marginBottom: 8 }}>Custom domain support</li>
              <li style={{ marginBottom: 8 }}>API access for programmatic link management</li>
              <li style={{ marginBottom: 8 }}>Team collaboration features</li>
            </ul>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Account Registration</h2>
            <p style={{ marginBottom: 16 }}>To use certain features of our Services, you must register for an account. When you register, you agree to:</p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Provide accurate, current, and complete information</li>
              <li style={{ marginBottom: 8 }}>Maintain and update your information to keep it accurate</li>
              <li style={{ marginBottom: 8 }}>Maintain the security of your password</li>
              <li style={{ marginBottom: 8 }}>Accept responsibility for all activities under your account</li>
              <li style={{ marginBottom: 8 }}>Notify us immediately of any unauthorized access</li>
            </ul>
            <p>You must be at least 13 years old to use our Services.</p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Acceptable Use</h2>
            <p style={{ marginBottom: 16 }}>You agree not to use our Services to:</p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Violate any laws or regulations</li>
              <li style={{ marginBottom: 8 }}>Infringe on intellectual property rights</li>
              <li style={{ marginBottom: 8 }}>Distribute malware, viruses, or harmful code</li>
              <li style={{ marginBottom: 8 }}>Engage in phishing or fraudulent activities</li>
              <li style={{ marginBottom: 8 }}>Harass, abuse, or harm others</li>
              <li style={{ marginBottom: 8 }}>Distribute spam or unsolicited communications</li>
              <li style={{ marginBottom: 8 }}>Link to illegal content or content that violates these Terms</li>
              <li style={{ marginBottom: 8 }}>Attempt to gain unauthorized access to our systems</li>
              <li style={{ marginBottom: 8 }}>Interfere with or disrupt our Services</li>
              <li style={{ marginBottom: 8 }}>Create links that mislead or deceive users</li>
            </ul>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Content and Links</h2>
            <p style={{ marginBottom: 16 }}>
              You retain ownership of the URLs and content you submit to our Services. However, by using our Services, you grant us a worldwide, non-exclusive, royalty-free license to use, store, and display your links for the purpose of providing the Services.
            </p>
            <p style={{ marginBottom: 16 }}>
              You are solely responsible for the content of the URLs you shorten and the destinations they point to. We reserve the right to:
            </p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Review and remove links that violate these Terms</li>
              <li style={{ marginBottom: 8 }}>Suspend or terminate accounts that repeatedly violate our policies</li>
              <li style={{ marginBottom: 8 }}>Report illegal activity to law enforcement</li>
            </ul>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Subscription Plans and Payments</h2>
            
            <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 24 }}>Billing</h3>
            <p style={{ marginBottom: 16 }}>
              Paid plans are billed in advance on a monthly or annual basis. You authorize us to charge your payment method on a recurring basis for your subscription.
            </p>

            <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 24 }}>Plan Changes</h3>
            <p style={{ marginBottom: 16 }}>
              You may upgrade or downgrade your plan at any time. Upgrades take effect immediately, and you'll be charged a prorated amount. Downgrades take effect at the start of the next billing cycle.
            </p>

            <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 24 }}>Cancellation and Refunds</h3>
            <p style={{ marginBottom: 16 }}>
              You may cancel your subscription at any time. Upon cancellation, you'll retain access until the end of your current billing period. We offer a 14-day money-back guarantee for new subscriptions.
            </p>

            <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 24 }}>Fee Changes</h3>
            <p>
              We may change our subscription fees with 30 days' notice. Fee changes will take effect at the start of your next billing cycle.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Intellectual Property</h2>
            <p style={{ marginBottom: 16 }}>
              The Services, including all content, features, and functionality, are owned by Rift and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              You may not copy, modify, distribute, sell, or lease any part of our Services without our express written permission.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>API Usage</h2>
            <p style={{ marginBottom: 16 }}>
              If you use our API, you agree to:
            </p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Follow our API documentation and guidelines</li>
              <li style={{ marginBottom: 8 }}>Not exceed rate limits specified for your plan</li>
              <li style={{ marginBottom: 8 }}>Keep your API keys secure and confidential</li>
              <li style={{ marginBottom: 8 }}>Not use the API to circumvent plan limitations</li>
            </ul>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Service Availability</h2>
            <p style={{ marginBottom: 16 }}>
              We strive to provide reliable service, but we do not guarantee uninterrupted access. We may:
            </p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Perform scheduled maintenance with notice</li>
              <li style={{ marginBottom: 8 }}>Make emergency updates without notice</li>
              <li style={{ marginBottom: 8 }}>Experience downtime due to factors beyond our control</li>
            </ul>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Limitation of Liability</h2>
            <p style={{ marginBottom: 16 }}>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RIFT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p>
              OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM YOUR USE OF THE SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRIOR TO THE EVENT GIVING RISE TO THE LIABILITY.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Disclaimer of Warranties</h2>
            <p>
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Rift and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Services or violation of these Terms.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Termination</h2>
            <p style={{ marginBottom: 16 }}>
              We may terminate or suspend your account and access to the Services immediately, without prior notice, for any reason, including if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use the Services will immediately cease. We may delete your data after 30 days of account termination.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms or your use of the Services will be resolved through binding arbitration, except that either party may seek injunctive relief in court to protect intellectual property rights.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of material changes by email or through the Services. Your continued use of the Services after such notification constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Contact Us</h2>
            <p style={{ marginBottom: 8 }}>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              <li style={{ marginBottom: 8 }}>Email: legal@rift.example.com</li>
              <li style={{ marginBottom: 8 }}>Address: [Your Business Address]</li>
            </ul>
          </section>
        </div>
      </article>
    </main>
  );
}
