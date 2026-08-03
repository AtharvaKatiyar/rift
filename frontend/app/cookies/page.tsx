import Link from "next/link";

export default function CookiePolicy() {
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
          Cookie <em>Policy</em>
        </h1>
        <p className="font-sans" style={{ fontSize: 15, color: "var(--muted)", marginBottom: 48 }}>
          Last updated: {lastUpdated}
        </p>

        <div className="font-sans" style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text)" }}>
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16, marginTop: 0 }}>What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>How We Use Cookies</h2>
            <p style={{ marginBottom: 16 }}>
              Rift uses cookies to enhance your experience, provide our services, and understand how our services are used. We use cookies for:
            </p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>Authentication and security</li>
              <li style={{ marginBottom: 8 }}>Remembering your preferences</li>
              <li style={{ marginBottom: 8 }}>Analytics and performance monitoring</li>
              <li style={{ marginBottom: 8 }}>Understanding user behavior</li>
            </ul>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Types of Cookies We Use</h2>
            
            <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 24 }}>1. Essential Cookies</h3>
            <p style={{ marginBottom: 16 }}>
              These cookies are necessary for the website to function and cannot be disabled. They are usually set in response to actions you take, such as logging in or filling out forms.
            </p>
            <div style={{ background: "rgba(166, 80, 59, 0.05)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <table style={{ width: "100%", fontSize: 14 }}>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0", fontWeight: 500 }}>Cookie Name</td>
                    <td style={{ padding: "8px 0", fontWeight: 500 }}>Purpose</td>
                    <td style={{ padding: "8px 0", fontWeight: 500 }}>Duration</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0" }}>access_token</td>
                    <td style={{ padding: "8px 0" }}>User authentication</td>
                    <td style={{ padding: "8px 0" }}>15 minutes</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}>refresh_token</td>
                    <td style={{ padding: "8px 0" }}>Session renewal</td>
                    <td style={{ padding: "8px 0" }}>7 days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 24 }}>2. Functional Cookies</h3>
            <p style={{ marginBottom: 16 }}>
              These cookies enable enhanced functionality and personalization. They may be set by us or third-party providers whose services we use.
            </p>
            <div style={{ background: "rgba(166, 80, 59, 0.05)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <table style={{ width: "100%", fontSize: 14 }}>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0", fontWeight: 500 }}>Cookie Name</td>
                    <td style={{ padding: "8px 0", fontWeight: 500 }}>Purpose</td>
                    <td style={{ padding: "8px 0", fontWeight: 500 }}>Duration</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0" }}>theme</td>
                    <td style={{ padding: "8px 0" }}>Remember theme preference</td>
                    <td style={{ padding: "8px 0" }}>1 year</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}>language</td>
                    <td style={{ padding: "8px 0" }}>Remember language preference</td>
                    <td style={{ padding: "8px 0" }}>1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 24 }}>3. Analytics Cookies</h3>
            <p style={{ marginBottom: 16 }}>
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </p>
            <div style={{ background: "rgba(166, 80, 59, 0.05)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <table style={{ width: "100%", fontSize: 14 }}>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 0", fontWeight: 500 }}>Service</td>
                    <td style={{ padding: "8px 0", fontWeight: 500 }}>Purpose</td>
                    <td style={{ padding: "8px 0", fontWeight: 500 }}>Duration</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px 0" }}>Analytics</td>
                    <td style={{ padding: "8px 0" }}>Track page views and user behavior</td>
                    <td style={{ padding: "8px 0" }}>2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 24 }}>4. Marketing Cookies</h3>
            <p>
              These cookies track your online activity to help advertisers deliver more relevant advertising or limit how many times you see an ad. We do not currently use marketing cookies.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Third-Party Cookies</h2>
            <p style={{ marginBottom: 16 }}>
              We use services from third parties that may set their own cookies. These include:
            </p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}><strong>Stripe:</strong> Payment processing (essential for billing)</li>
              <li style={{ marginBottom: 8 }}><strong>Analytics Providers:</strong> Usage statistics and performance monitoring</li>
            </ul>
            <p>
              These third parties have their own privacy policies. We recommend reviewing their policies to understand how they use cookies.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Managing Cookies</h2>
            
            <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 24 }}>Browser Settings</h3>
            <p style={{ marginBottom: 16 }}>
              Most web browsers allow you to control cookies through their settings. You can typically:
            </p>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>View cookies stored on your device</li>
              <li style={{ marginBottom: 8 }}>Delete cookies</li>
              <li style={{ marginBottom: 8 }}>Block cookies from specific sites</li>
              <li style={{ marginBottom: 8 }}>Block all third-party cookies</li>
              <li style={{ marginBottom: 8 }}>Delete all cookies when you close your browser</li>
            </ul>

            <h3 style={{ fontSize: 20, fontWeight: 500, marginBottom: 12, marginTop: 24 }}>Browser-Specific Instructions</h3>
            <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
              <li style={{ marginBottom: 8 }}>
                <strong>Chrome:</strong>{" "}
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
                  Cookie settings
                </a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Firefox:</strong>{" "}
                <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
                  Cookie settings
                </a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Safari:</strong>{" "}
                <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
                  Cookie settings
                </a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Edge:</strong>{" "}
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>
                  Cookie settings
                </a>
              </li>
            </ul>

            <div style={{ background: "rgba(166, 80, 59, 0.1)", border: "1px solid var(--accent)", borderRadius: 8, padding: 20, marginTop: 24 }}>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
                ⚠️ <strong>Note:</strong> Blocking or deleting cookies may impact your experience on our website. Some features may not work properly without cookies enabled.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Do Not Track</h2>
            <p>
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want your online activity tracked. Currently, there is no industry standard for how to respond to DNT signals. We do not currently respond to DNT browser signals.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 500, marginBottom: 16 }}>More Information</h2>
            <p style={{ marginBottom: 16 }}>
              For more information about how we handle your personal data, please see our{" "}
              <Link href="/privacy" style={{ color: "var(--accent)", textDecoration: "none" }}>
                Privacy Policy
              </Link>.
            </p>
            <p>
              If you have questions about our use of cookies, please contact us at cookies@rift.example.com
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
