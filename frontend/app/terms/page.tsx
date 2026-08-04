"use client";

import Link from "next/link";
import Navbar from "@/components/common/Navbar";

export default function TermsOfService() {
  const lastUpdated = "August 2026";

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    {
      id: "agreement",
      title: "Agreement to Terms",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            By accessing or using Rift's permanent link management services (the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
          </p>
          <p style={{ marginBottom: 16 }}>
            These Terms constitute a legally binding agreement between you and Rift. By creating an account or using our Services, you represent that you have read, understood, and agree to be bound by these Terms.
          </p>
          <p>
            If you are using the Services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
          </p>
        </>
      )
    },
    {
      id: "services",
      title: "Description of Services",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            Rift provides permanent link management services that allow you to create, manage, and redirect links that never expire. Our Services include:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Permanent Link Creation:</strong> Create links that redirect to destination URLs indefinitely
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Link Management:</strong> Update destination URLs, manage custom slugs, and control link status
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Analytics:</strong> Track clicks, visitor information, and traffic sources for your links
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Custom Slugs:</strong> Create memorable, branded short links
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Dashboard:</strong> Web interface for managing your links and viewing analytics
            </li>
          </ul>
          <p style={{
            padding: 16,
            background: "rgba(199,154,62,0.08)",
            border: "1px solid #C79A3E",
            borderRadius: 8,
            fontSize: 14,
            lineHeight: 1.6
          }}>
            <strong>Note:</strong> Rift is a permanent link management service, not a link shortener. Links you create remain active indefinitely and can be updated at any time.
          </p>
        </>
      )
    },
    {
      id: "registration",
      title: "Account Registration",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            To use our Services, you must create an account. When you register, you agree to:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>Provide accurate, current, and complete information during registration</li>
            <li style={{ marginBottom: 8 }}>Maintain and promptly update your account information to keep it accurate</li>
            <li style={{ marginBottom: 8 }}>Maintain the security and confidentiality of your password</li>
            <li style={{ marginBottom: 8 }}>Accept responsibility for all activities that occur under your account</li>
            <li style={{ marginBottom: 8 }}>Notify us immediately at support@rift.dpdns.org of any unauthorized access or security breach</li>
          </ul>
          <p style={{ marginBottom: 16 }}>
            <strong>Age Requirement:</strong> You must be at least 13 years old (or 16 in the European Union) to use our Services.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. We are not liable for any loss or damage arising from your failure to protect your account information.
          </p>
        </>
      )
    },    {
   
   id: "founder-pricing",
      title: "Founder Pricing and Early Access",
      content: (
        <>
          <div style={{
            background: "linear-gradient(135deg, rgba(199,154,62,0.15) 0%, rgba(199,154,62,0.08) 100%)",
            border: "2px solid #C79A3E",
            borderRadius: 12,
            padding: 32,
            marginBottom: 24
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#8B6914", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24 }}>⚡</span> Early Access Founder Pricing
            </h3>
            <p style={{ marginBottom: 16, fontSize: 15, lineHeight: 1.7 }}>
              During our early access period, we offer special Founder Pricing to early adopters. This section explains what you receive and what remains subject to future pricing.
            </p>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            What Is Included in Founder Pricing
          </h3>
          <p style={{ marginBottom: 16 }}>
            When you purchase a Founder plan (Founder Starter or Founder Pro) during the early access period, you receive:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 24, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 12 }}>
              <strong>Permanent Link Capacity:</strong> The number of permanent links specified in your plan (1,500 for Founder Starter, 10,000 for Founder Pro) is yours forever. This capacity will never expire or require additional payment.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong>Unlimited Redirects:</strong> Your links can be accessed an unlimited number of times. There are no restrictions on click volume or bandwidth.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong>Core Platform Features:</strong> Access to essential features including link management, custom slugs, basic analytics, and link status control.
            </li>
            <li style={{ marginBottom: 12 }}>
              <strong>Price Lock:</strong> Your one-time payment price is locked. You will never be charged again for the link capacity you purchased.
            </li>
          </ul>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 32, color: "var(--text)" }}>
            Future Advanced Features
          </h3>
          <p style={{ marginBottom: 16 }}>
            As Rift evolves, we may introduce advanced features beyond the core platform. These future features may include (but are not limited to):
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 24, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>API access for programmatic link management</li>
            <li style={{ marginBottom: 8 }}>Advanced analytics and reporting tools</li>
            <li style={{ marginBottom: 8 }}>Team collaboration and workspace features</li>
            <li style={{ marginBottom: 8 }}>Custom domain integration</li>
            <li style={{ marginBottom: 8 }}>Priority support channels</li>
            <li style={{ marginBottom: 8 }}>Enhanced security features</li>
            <li style={{ marginBottom: 8 }}>Integration with third-party services</li>
          </ul>
          <p style={{ marginBottom: 16 }}>
            <strong>Important:</strong> Access to these future advanced features may require additional payment. Founder members will receive exclusive discounted pricing on any future premium features we introduce.
          </p>

          <div style={{
            background: "rgba(199,154,62,0.08)",
            border: "1px solid rgba(199,154,62,0.4)",
            borderRadius: 8,
            padding: 20,
            marginTop: 24,
            marginBottom: 24
          }}>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--text)" }}>
              <strong>Summary:</strong> Your Founder plan guarantees lifetime access to your purchased link capacity and unlimited redirects. Core platform features are included. Future advanced features may be offered at additional cost, with Founder members receiving preferential pricing.
            </p>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 32, color: "var(--text)" }}>
            No Recurring Charges
          </h3>
          <p>
            Founder pricing is a one-time payment. You will never be charged subscription fees for your link capacity. We will never reduce your link limit or restrict your access to the links you've already created.
          </p>
        </>
      )
    },    {

      id: "acceptable-use",
      title: "Acceptable Use Policy",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            You agree to use our Services responsibly and in compliance with all applicable laws. You may not use Rift to:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Illegal Activities:</strong> Violate any local, national, or international laws or regulations
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Malicious Content:</strong> Distribute malware, viruses, ransomware, or other harmful code
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Phishing and Fraud:</strong> Engage in phishing, scamming, or fraudulent activities
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Harassment:</strong> Harass, abuse, threaten, or harm others
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Spam:</strong> Distribute unsolicited bulk communications or spam
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Intellectual Property Infringement:</strong> Infringe on copyrights, trademarks, or other intellectual property rights
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Deceptive Links:</strong> Create links that mislead users about their destination
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Illegal Content:</strong> Link to content that is illegal, promotes violence, or violates others' rights
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>System Abuse:</strong> Attempt to gain unauthorized access to our systems or interfere with our Services
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>API Abuse:</strong> Abuse our API or attempt to circumvent rate limits or usage restrictions
            </li>
          </ul>
          <p style={{
            padding: 16,
            background: "rgba(166,80,59,0.08)",
            border: "1px solid rgba(166,80,59,0.3)",
            borderRadius: 8,
            fontSize: 14,
            lineHeight: 1.6
          }}>
            <strong>Enforcement:</strong> We reserve the right to investigate violations, remove offending links, suspend or terminate accounts, and report illegal activity to law enforcement authorities.
          </p>
        </>
      )
    },
    {
      id: "content-ownership",
      title: "Content and Ownership",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            <strong>Your Content:</strong> You retain all ownership rights to the URLs and content you submit to our Services. You are solely responsible for the content of the destination URLs your links point to.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>License to Us:</strong> By using our Services, you grant us a limited, worldwide, non-exclusive, royalty-free license to store, process, and display your links for the purpose of providing and improving the Services. This license ends when you delete your links or terminate your account.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>Our Rights:</strong> We reserve the right to review and remove links that violate these Terms, pose security risks, or generate excessive complaints. We may suspend or terminate accounts that repeatedly violate our policies.
          </p>
        </>
      )
    },
    {
      id: "payments",
      title: "Payments and Billing",
      content: (
        <>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            One-Time Payments
          </h3>
          <p style={{ marginBottom: 16 }}>
            Founder plans (Founder Starter and Founder Pro) are one-time purchases. Once paid, you have lifetime access to your purchased link capacity with no recurring charges.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Payment Processing
          </h3>
          <p style={{ marginBottom: 16 }}>
            Payments are processed securely through Dodo Payments, our payment processor. We do not store your full payment card details. All transactions are encrypted and secure.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Refund Policy
          </h3>
          <p style={{ marginBottom: 16 }}>
            Due to the nature of lifetime access and immediate activation of services, <strong>all sales are final</strong>. We do not offer refunds for Founder plan purchases.
          </p>
          <p style={{ marginBottom: 16 }}>
            We strongly encourage you to start with our Free plan (30 permanent links) to evaluate the service before upgrading to a paid plan.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Taxes
          </h3>
          <p>
            Prices do not include applicable taxes. You are responsible for paying any sales tax, VAT, GST, or other taxes that may apply based on your location.
          </p>
        </>
      )
    },    {

      id: "data-privacy",
      title: "Data and Privacy",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our{" "}
            <Link href="/privacy" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500, borderBottom: "1px solid #8B6914" }}>
              Privacy Policy
            </Link>, which is incorporated into these Terms by reference.
          </p>
          <p style={{ marginBottom: 16 }}>
            By using our Services, you consent to our collection and use of your data as described in our Privacy Policy. We implement industry-standard security measures to protect your data, but no system is completely secure.
          </p>
          <p>
            You can request deletion of your data at any time by contacting us at support@rift.dpdns.org. Upon account deletion, we will delete your personal data within 30 days, except where legally required to retain it.
          </p>
        </>
      )
    },
    {
      id: "service-availability",
      title: "Service Availability and Changes",
      content: (
        <>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Service Uptime
          </h3>
          <p style={{ marginBottom: 16 }}>
            We strive to provide reliable service with high availability. However, we do not guarantee uninterrupted or error-free operation. The Services may be unavailable due to:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>Scheduled maintenance (we'll provide advance notice when possible)</li>
            <li style={{ marginBottom: 8 }}>Emergency maintenance or security updates</li>
            <li style={{ marginBottom: 8 }}>Technical issues or infrastructure problems</li>
            <li style={{ marginBottom: 8 }}>Factors beyond our reasonable control (e.g., natural disasters, internet outages)</li>
          </ul>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Service Modifications
          </h3>
          <p style={{ marginBottom: 16 }}>
            We reserve the right to modify, suspend, or discontinue any aspect of the Services at any time. We will provide reasonable notice for significant changes that materially affect your use of the Services.
          </p>
          <p>
            Your purchased link capacity will not be reduced or removed without your consent. If we discontinue the Services entirely, we will provide at least 90 days' notice.
          </p>
        </>
      )
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            The Services, including all software, designs, text, graphics, logos, and other content, are owned by Rift and protected by copyright, trademark, patent, and other intellectual property laws.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>Restrictions:</strong> You may not copy, modify, distribute, sell, lease, reverse engineer, or create derivative works based on the Services or any part thereof without our express written permission.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>Trademarks:</strong> "Rift" and our logo are trademarks owned by us. You may not use our trademarks without our prior written consent.
          </p>
          <p>
            <strong>Feedback:</strong> If you provide feedback, suggestions, or ideas about our Services, you grant us a perpetual, worldwide, royalty-free license to use and incorporate such feedback without compensation or attribution.
          </p>
        </>
      )
    },
    {
      id: "termination",
      title: "Account Termination",
      content: (
        <>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Termination by You
          </h3>
          <p style={{ marginBottom: 16 }}>
            You may terminate your account at any time by contacting us at support@rift.dpdns.org. Upon termination, your access to the Services will cease, and your data will be deleted within 30 days.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Termination by Us
          </h3>
          <p style={{ marginBottom: 16 }}>
            We may suspend or terminate your account immediately if you:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>Violate these Terms or our Acceptable Use Policy</li>
            <li style={{ marginBottom: 8 }}>Engage in fraudulent or illegal activities</li>
            <li style={{ marginBottom: 8 }}>Create security risks or abuse our systems</li>
            <li style={{ marginBottom: 8 }}>Generate excessive complaints from other users</li>
          </ul>
          <p style={{ marginBottom: 16 }}>
            We will make reasonable efforts to notify you before termination, except in cases of severe violations or legal requirements.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Effect of Termination
          </h3>
          <p>
            Upon termination, your right to access and use the Services immediately ceases. All links associated with your account will stop functioning. We may delete your data after 30 days, and deleted data cannot be recovered.
          </p>
        </>
      )
    },  
  {
      id: "warranties",
      title: "Disclaimers and Warranties",
      content: (
        <>
          <p style={{ marginBottom: 16, textTransform: "uppercase", fontSize: 14, fontWeight: 600 }}>
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
          </p>
          <p style={{ marginBottom: 16 }}>
            To the maximum extent permitted by law, we disclaim all warranties, express or implied, including but not limited to:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
            <li style={{ marginBottom: 8 }}>Warranties regarding the accuracy, reliability, or completeness of the Services</li>
            <li style={{ marginBottom: 8 }}>Warranties that the Services will be uninterrupted, secure, or error-free</li>
            <li style={{ marginBottom: 8 }}>Warranties regarding the results obtained from using the Services</li>
          </ul>
          <p>
            We do not warrant that our Services will meet your requirements or that any defects will be corrected. You use the Services at your own risk.
          </p>
        </>
      )
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      content: (
        <>
          <p style={{ marginBottom: 16, textTransform: "uppercase", fontSize: 14, fontWeight: 600 }}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>Exclusion of Damages:</strong> Rift and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>Loss of profits, revenue, or business opportunities</li>
            <li style={{ marginBottom: 8 }}>Loss of data or loss of use</li>
            <li style={{ marginBottom: 8 }}>Cost of substitute services</li>
            <li style={{ marginBottom: 8 }}>Business interruption</li>
            <li style={{ marginBottom: 8 }}>Loss of goodwill or reputation</li>
          </ul>
          <p style={{ marginBottom: 16 }}>
            <strong>Liability Cap:</strong> Our total liability to you for any claims arising from your use of the Services shall not exceed the amount you paid us in the 12 months preceding the event giving rise to the liability. For free plan users, our liability shall not exceed $100 USD.
          </p>
          <p style={{
            padding: 16,
            background: "rgba(199,154,62,0.08)",
            border: "1px solid rgba(199,154,62,0.3)",
            borderRadius: 8,
            fontSize: 14,
            lineHeight: 1.6
          }}>
            Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities. In such jurisdictions, our liability will be limited to the maximum extent permitted by law.
          </p>
        </>
      )
    },
    {
      id: "indemnification",
      title: "Indemnification",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            You agree to indemnify, defend, and hold harmless Rift and its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from or related to:
          </p>
          <ul style={{ paddingLeft: 24, marginBottom: 16, lineHeight: 1.8 }}>
            <li style={{ marginBottom: 8 }}>Your use or misuse of the Services</li>
            <li style={{ marginBottom: 8 }}>Your violation of these Terms</li>
            <li style={{ marginBottom: 8 }}>Your violation of any law or regulation</li>
            <li style={{ marginBottom: 8 }}>Your violation of any third-party rights</li>
            <li style={{ marginBottom: 8 }}>Content or destination URLs associated with your links</li>
            <li style={{ marginBottom: 8 }}>Any claims by third parties related to your use of the Services</li>
          </ul>
          <p>
            We reserve the right to assume exclusive defense and control of any matter subject to indemnification by you, and you will cooperate with us in asserting any available defenses.
          </p>
        </>
      )
    },
    {
      id: "dispute-resolution",
      title: "Dispute Resolution and Governing Law",
      content: (
        <>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Governing Law
          </h3>
          <p style={{ marginBottom: 16 }}>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Informal Resolution
          </h3>
          <p style={{ marginBottom: 16 }}>
            Before filing any formal dispute, you agree to first contact us at support@rift.dpdns.org to attempt to resolve the issue informally. We will work in good faith to resolve disputes amicably.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Arbitration
          </h3>
          <p style={{ marginBottom: 16 }}>
            If we cannot resolve a dispute informally, any disputes arising from these Terms or your use of the Services will be resolved through binding arbitration, except that either party may seek injunctive or equitable relief in court to protect intellectual property rights or prevent unauthorized use of the Services.
          </p>
          <p>
            Arbitration shall be conducted by a single arbitrator in accordance with applicable arbitration rules. The arbitrator's decision shall be final and binding.
          </p>
        </>
      )
    },    
{
      id: "general-provisions",
      title: "General Provisions",
      content: (
        <>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Changes to Terms
          </h3>
          <p style={{ marginBottom: 16 }}>
            We reserve the right to modify these Terms at any time. We will notify you of material changes by email or through a notice on our Services at least 30 days before the changes take effect.
          </p>
          <p style={{ marginBottom: 16 }}>
            Your continued use of the Services after the changes take effect constitutes acceptance of the modified Terms. If you do not agree to the changes, you must stop using the Services.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Severability
          </h3>
          <p style={{ marginBottom: 16 }}>
            If any provision of these Terms is found to be unenforceable or invalid by a court of competent jurisdiction, that provision will be limited or eliminated to the minimum extent necessary so that these Terms remain in full force and effect.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Entire Agreement
          </h3>
          <p style={{ marginBottom: 16 }}>
            These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and Rift regarding the Services and supersede all prior agreements and understandings.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Assignment
          </h3>
          <p style={{ marginBottom: 16 }}>
            You may not assign or transfer these Terms or your account without our prior written consent. We may assign these Terms without restriction. Any attempted assignment in violation of this section is void.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            No Waiver
          </h3>
          <p style={{ marginBottom: 16 }}>
            Our failure to enforce any provision of these Terms does not constitute a waiver of that provision or any other provision. No waiver shall be effective unless in writing and signed by us.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 24, color: "var(--text)" }}>
            Survival
          </h3>
          <p>
            Provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnification, and limitations of liability.
          </p>
        </>
      )
    },
    {
      id: "contact",
      title: "Contact Information",
      content: (
        <>
          <p style={{ marginBottom: 16 }}>
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div style={{
            background: "var(--bg-alt)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
            marginTop: 16
          }}>
            <p style={{ marginBottom: 12, fontSize: 15 }}>
              <strong>Support Email:</strong>{" "}
              <a href="mailto:support@rift.dpdns.org" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500 }}>
                support@rift.dpdns.org
              </a>
            </p>
            <p style={{ marginBottom: 12, fontSize: 15 }}>
              <strong>Response Time:</strong> We aim to respond within 72 hours
            </p>
            <p style={{ marginBottom: 0, fontSize: 15 }}>
              For privacy-related inquiries, see our{" "}
              <Link href="/privacy" style={{ color: "#8B6914", textDecoration: "none", fontWeight: 500, borderBottom: "1px solid #8B6914" }}>
                Privacy Policy
              </Link>
            </p>
          </div>
        </>
      )
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Navbar />

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "120px 48px 96px", position: "relative" }}>
        <div style={{ display: "flex", gap: 64 }}>
          {/* Sidebar Navigation */}
          <aside style={{ 
            position: "fixed", 
            top: 120, 
            left: "calc(50% - 590px)",
            width: 280,
            height: "calc(100vh - 140px)",
            overflowY: "auto"
          }}>
            <nav>
              <p style={{
                fontFamily: "monospace",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                marginBottom: 16,
                fontWeight: 600
              }}>
                Contents
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {sections.map((section) => (
                  <li key={section.id} style={{ marginBottom: 8 }}>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => handleSectionClick(e, section.id)}
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontFamily: "Inter, system-ui, sans-serif",
                        color: "var(--muted)",
                        textDecoration: "none",
                        padding: "6px 0",
                        transition: "color 0.2s",
                        borderLeft: "2px solid transparent",
                        paddingLeft: 12,
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--text)";
                        e.currentTarget.style.borderLeftColor = "#C79A3E";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--muted)";
                        e.currentTarget.style.borderLeftColor = "transparent";
                      }}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <article style={{ marginLeft: 344, flex: 1 }}>
            <header style={{ marginBottom: 56 }}>
              <h1 style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontSize: 48,
                fontWeight: 300,
                marginBottom: 16,
                lineHeight: 1.2,
                color: "var(--text)"
              }}>
                Terms of Service
              </h1>
              <p style={{
                fontSize: 15,
                color: "var(--muted)",
                marginBottom: 24,
                fontFamily: "Inter, system-ui, sans-serif"
              }}>
                Last updated: {lastUpdated}
              </p>
              <div style={{
                background: "rgba(199,154,62,0.08)",
                border: "1px solid #C79A3E",
                borderRadius: 8,
                padding: 20,
                fontSize: 14,
                lineHeight: 1.6,
                fontFamily: "Inter, system-ui, sans-serif"
              }}>
                <strong style={{ color: "var(--text)" }}>TL;DR:</strong> Use Rift responsibly. Founder plans give you lifetime access to your purchased link capacity (no recurring charges). Future advanced features may cost extra, but Founders get discounted pricing. All sales are final. Don't use the service for illegal activities.
              </div>
            </header>

            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                style={{
                  marginBottom: 64,
                  scrollMarginTop: 120
                }}
              >
                <h2 style={{
                  fontSize: 28,
                  fontWeight: 400,
                  marginBottom: 20,
                  color: "var(--text)",
                  fontFamily: "Fraunces, Georgia, serif",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: 12
                }}>
                  {section.title}
                </h2>
                <div style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "var(--text)",
                  fontFamily: "Inter, system-ui, sans-serif"
                }}>
                  {section.content}
                </div>
              </section>
            ))}

            {/* Footer Note */}
            <div style={{
              marginTop: 64,
              paddingTop: 32,
              borderTop: "1px solid var(--border)",
              fontSize: 14,
              color: "var(--muted)",
              fontFamily: "Inter, system-ui, sans-serif",
              textAlign: "center"
            }}>
              <p>
                These Terms are effective as of {lastUpdated}. By using Rift, you agree to be bound by these Terms of Service.
              </p>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
