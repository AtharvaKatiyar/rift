"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does Rift differ from other link shorteners?",
    answer: "Rift is built specifically for developers and teams, offering advanced analytics, API access, custom domains, and powerful integrations. Unlike basic shorteners, we provide real-time click tracking, geographic data, device information, and seamless team collaboration features."
  },
  {
    question: "Can I use my own custom domain?",
    answer: "Yes! Pro and Enterprise plans support custom domains. You can use your own branded domain for all your shortened links, maintaining your brand identity while leveraging Rift's powerful infrastructure."
  },
  {
    question: "Is there an API available?",
    answer: "Absolutely. Rift provides a comprehensive REST API with full documentation. You can programmatically create, manage, and track links, integrate with your existing tools, and automate your workflows. API access is available on all paid plans."
  },
  {
    question: "How secure are my links and data?",
    answer: "Security is our top priority. All data is encrypted in transit and at rest. We use industry-standard security practices including bcrypt password hashing, token-based authentication, and parameterized SQL queries to prevent injection attacks. We're also GDPR compliant."
  },
  {
    question: "What analytics do you provide?",
    answer: "Rift provides comprehensive analytics including total clicks, unique visitors, geographic location data, device and browser information, referrer sources, and time-series data. You can track campaign performance, understand your audience, and make data-driven decisions."
  },
  {
    question: "Can I manage links as a team?",
    answer: "Yes! Our Pro and Enterprise plans include team collaboration features. You can invite team members, manage permissions, share link collections, and collaborate on campaigns together."
  },
  {
    question: "What happens if I reach my link limit?",
    answer: "On the Free plan, you're limited to 100 links. Once you reach this limit, you'll need to upgrade to create more links. Pro plan offers 10,000 links and Enterprise offers unlimited links. All existing links continue to work regardless of your plan."
  },
  {
    question: "Can I export my data?",
    answer: "Yes, you can export all your link data and analytics at any time in CSV or JSON format. We believe your data belongs to you, and we make it easy to take it with you if needed."
  },
  {
    question: "Do shortened links expire?",
    answer: "Links don't expire by default, but you have the option to set expiration dates on individual links if needed. You can also pause/unpause links at any time without deleting them."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor Stripe. Enterprise plans can also be invoiced annually."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period. After cancellation, you'll be downgraded to the Free plan."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied for any reason, contact us within 14 days of your purchase for a full refund."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" style={{ 
      padding: "96px 48px",
      background: "var(--bg)",
      borderTop: "1px solid var(--border)"
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 className="font-serif" style={{ 
            fontSize: 42,
            fontWeight: 300,
            color: "var(--text)",
            marginBottom: 16,
            lineHeight: 1.2
          }}>
            Frequently Asked <em style={{ fontStyle: "italic" }}>Questions</em>
          </h2>
          <p className="font-sans" style={{ 
            fontSize: 16,
            color: "var(--muted)",
            maxWidth: 600,
            margin: "0 auto",
            lineHeight: 1.6
          }}>
            Everything you need to know about Rift. Can't find what you're looking for?{" "}
            <a href="/contact" style={{ color: "var(--accent)", textDecoration: "none" }}>Contact us</a>.
          </p>
        </div>

        {/* FAQ Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 8,
                background: openIndex === index ? "rgba(166, 80, 59, 0.03)" : "transparent",
                transition: "background 0.2s ease"
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left"
                }}
                aria-expanded={openIndex === index}
              >
                <span className="font-sans" style={{ 
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--text)",
                  flex: 1,
                  paddingRight: 16
                }}>
                  {faq.question}
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transform: openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    flexShrink: 0
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {openIndex === index && (
                <div
                  style={{
                    padding: "0 24px 20px 24px",
                    animation: "fadeIn 0.2s ease"
                  }}
                >
                  <p className="font-sans" style={{ 
                    fontSize: 15,
                    color: "var(--muted)",
                    lineHeight: 1.7,
                    margin: 0
                  }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
