"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Rift?",
    answer: "Rift is a Central Link Infrastructure Platform. Instead of sharing destination URLs directly, Rift gives every important task its own permanent public link that serves as a stable entry point while destinations behind it can be updated anytime. Think of it as permanent addresses for your ever-changing content."
  },
  {
    question: "What are 'permanent links' and how do they work?",
    answer: "A permanent link is a stable public URL that never changes, even when you update where it points. For example, your portfolio link stays the same even if you redesign your portfolio five times at different URLs. Everyone who has your Rift link automatically reaches your latest destination."
  },
  {
    question: "Do my links expire?",
    answer: "Never. Once you create a Rift link, it's yours permanently. You can update where it points as many times as you want, forever. This is a one-time payment model—no renewals, no expiration."
  },
  {
    question: "What happens if I reach my link limit?",
    answer: "On the Free plan, you get 30 permanent links. If you need more, you can upgrade to Starter (1,500 links) or Pro (10,000 links) with our early bird pricing. All existing links continue working regardless of your plan."
  },
  {
    question: "Can features or pricing change in the future?",
    answer: "Your purchased link capacity and access is locked in forever—you'll always have lifetime access to create that many redirecting links at no extra charge. However, advanced features we introduce in the future may require additional purchase. Early bird customers will receive discounted pricing on future premium features."
  },
  {
    question: "What's included in early bird pricing?",
    answer: "Early bird pricing is our lowest price ever. When you purchase during launch, you lock in that price forever with lifetime access to your links. Future customers may pay more, but your price never increases."
  },
  {
    question: "Can I use my own custom domain?",
    answer: "Custom domains are on our roadmap for future release. Currently, all links use the rift.dpdns.org domain with readable slugs like /portfolio/ or /resume/."
  },
  {
    question: "Is there an API available?",
    answer: "API access is planned for a future release. You'll be able to programmatically create and manage your links, integrate with your tools, and automate your workflows."
  },
  {
    question: "Can I export my data?",
    answer: "Data export functionality will be available in the next feature rollout. You'll be able to export all your link data and analytics."
  },
  {
    question: "Do you offer refunds?",
    answer: "Due to the nature of lifetime access, all sales are final. We recommend starting with the Free plan (30 links) to try Rift before upgrading."
  },
  {
    question: "Can I manage links as a team?",
    answer: "Team collaboration features are on our roadmap. Currently, Rift is designed for individual use with personal link management."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards and debit cards through our secure payment processor. Payments are processed in USD or INR depending on your location."
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
                    padding: "0 24px 20px 24px"
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
    </section>
  );
}
