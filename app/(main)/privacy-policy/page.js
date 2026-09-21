import Link from "next/link";
import {
  LuHouse,
  LuShieldCheck,
  LuLock,
  LuUserCheck,
  LuDatabase,
  LuCookie,
  LuMail,
  LuFileText,
  LuRefreshCw,
  LuInfo,
} from "react-icons/lu";

export const metadata = {
  title: "Privacy Policy | PrettyPet",
  description:
    "Learn how PrettyPet collects, uses, protects, and handles your personal information and pet data with transparency and high-grade security.",
};

const sections = [
  {
    id: "overview",
    title: "1. Overview & Who We Are",
    icon: LuInfo,
    content: (
      <>
        <p className="text-base-content/80 leading-relaxed">
          Welcome to <strong>PrettyPet</strong> (operated by <strong>Ayxal LLC</strong>, &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).
          We value your trust and are committed to protecting your privacy. This Privacy Policy outlines how we collect, store, utilize, and protect your personal information when you visit or make a purchase from our website and services.
        </p>
        <p className="mt-3 text-base-content/80 leading-relaxed">
          By accessing or using our platform, you agree to the collection and use of information in accordance with this policy. If you disagree with any part of this policy, please refrain from using our services.
        </p>
      </>
    ),
  },
  {
    id: "information-collected",
    title: "2. Information We Collect",
    icon: LuDatabase,
    content: (
      <>
        <p className="text-base-content/80 leading-relaxed">
          To provide you with a smooth and personalized pet shopping experience, we collect several types of information:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-base-100 p-4 rounded-xl border border-base-300">
            <h4 className="font-semibold text-base-content mb-1">Personal &amp; Contact Details</h4>
            <p className="text-xs text-base-content/70">
              Your name, email address, phone number, shipping address, and billing address provided during registration or checkout.
            </p>
          </div>
          <div className="bg-base-100 p-4 rounded-xl border border-base-300">
            <h4 className="font-semibold text-base-content mb-1">Payment &amp; Transaction Details</h4>
            <p className="text-xs text-base-content/70">
              Payment card tokens, transaction histories, and invoice data. We do <strong>not</strong> store your full credit card or CVV details on our servers; payments are processed securely via PCI-compliant payment gateways.
            </p>
          </div>
          <div className="bg-base-100 p-4 rounded-xl border border-base-300">
            <h4 className="font-semibold text-base-content mb-1">Pet Profile Information</h4>
            <p className="text-xs text-base-content/70">
              Optional details you provide regarding your pets (breed, age, dietary restrictions, size) to customize product recommendations and sizing tips.
            </p>
          </div>
          <div className="bg-base-100 p-4 rounded-xl border border-base-300">
            <h4 className="font-semibold text-base-content mb-1">Device &amp; Usage Data</h4>
            <p className="text-xs text-base-content/70">
              IP address, browser type, operating system, pages visited, time spent, referring URLs, and interaction patterns gathered via analytics tools and cookies.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    icon: LuUserCheck,
    content: (
      <>
        <p className="text-base-content/80 leading-relaxed mb-3">
          We use the information we collect for authentic business purposes to deliver quality pet products and seamless customer experiences:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-base-content/80 pl-2">
          <li><strong>Order Processing &amp; Delivery:</strong> Fulfilling purchases, managing payments, sending invoices, and arranging shipment with courier partners.</li>
          <li><strong>Customer Support:</strong> Responding to inquiries, resolving product issues, handling returns, refunds, or warranty requests.</li>
          <li><strong>Personalization:</strong> Recommending tailored pet food, toys, and accessories based on your shopping behavior and pet preferences.</li>
          <li><strong>Promotions &amp; Updates:</strong> Sending promotional emails, flash sale alerts, and coupon codes (which you can unsubscribe from at any time).</li>
          <li><strong>Security &amp; Fraud Prevention:</strong> Detecting anomalous activity, verifying authenticity, and protecting our platform from fraudulent orders.</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    title: "4. Information Sharing & Third Parties",
    icon: LuShieldCheck,
    content: (
      <>
        <p className="text-base-content/80 leading-relaxed">
          <strong>We never sell, rent, or trade your personal information to third parties for marketing purposes.</strong> We only share information with trusted third-party providers under strict confidentiality agreements:
        </p>
        <div className="space-y-3 mt-4 text-sm text-base-content/80">
          <div className="flex items-start gap-3">
            <span className="badge badge-sm badge-neutral mt-0.5">Logistics</span>
            <span>Reputable courier and fulfillment partners for packing, dispatching, and delivering your orders.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="badge badge-sm badge-neutral mt-0.5">Payments</span>
            <span>Authorized payment processors (e.g., Stripe, SSLCommerz, PayPal) adhering to industry PCI-DSS standards.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="badge badge-sm badge-neutral mt-0.5">Technology</span>
            <span>Cloud hosting, database maintenance, email delivery services, and analytical metrics services.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="badge badge-sm badge-neutral mt-0.5">Legal</span>
            <span>Law enforcement agencies or regulators only when legally mandated by court order or applicable law.</span>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "cookies",
    title: "5. Cookies & Tracking Technologies",
    icon: LuCookie,
    content: (
      <>
        <p className="text-base-content/80 leading-relaxed">
          Cookies are small data files placed on your browser when you access PrettyPet. They allow us to remember your session, keep your shopping cart active, and analyze site performance.
        </p>
        <p className="mt-2 text-base-content/80 leading-relaxed">
          You can configure your browser to block or alert you about cookies; however, disabling certain cookies may impact core functionalities such as signing in or adding items to your cart.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "6. Data Security & Retention",
    icon: LuLock,
    content: (
      <>
        <p className="text-base-content/80 leading-relaxed">
          We implement industry-standard administrative, technical, and physical safeguards designed to protect personal information from unauthorized access, alteration, disclosure, or destruction. All data communications utilize Secure Sockets Layer (SSL/TLS) 256-bit encryption.
        </p>
        <p className="mt-2 text-base-content/80 leading-relaxed">
          We retain your personal data only as long as necessary to fulfill orders, provide services, resolve disputes, and comply with legal requirements.
        </p>
      </>
    ),
  },
  {
    id: "user-rights",
    title: "7. Your Rights & Choices",
    icon: LuFileText,
    content: (
      <>
        <p className="text-base-content/80 leading-relaxed mb-3">
          Depending on your jurisdiction, you possess specific rights regarding your personal information:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-base-100 rounded-lg border border-base-200">
            <strong>Access &amp; Review:</strong> Request a copy of the personal information we hold about you.
          </div>
          <div className="p-3 bg-base-100 rounded-lg border border-base-200">
            <strong>Correction:</strong> Update or correct inaccuracies in your account details via your profile.
          </div>
          <div className="p-3 bg-base-100 rounded-lg border border-base-200">
            <strong>Erasure (Deletion):</strong> Request deletion of your account and related personal records.
          </div>
          <div className="p-3 bg-base-100 rounded-lg border border-base-200">
            <strong>Marketing Opt-out:</strong> Unsubscribe from marketing communications anytime using the footer link in emails.
          </div>
        </div>
      </>
    ),
  },
  {
    id: "updates",
    title: "8. Changes to This Privacy Policy",
    icon: LuRefreshCw,
    content: (
      <p className="text-base-content/80 leading-relaxed">
        We may update our Privacy Policy periodically to reflect changes in our operational procedures or applicable laws. Any modifications will be posted here with an updated &quot;Last Revised&quot; date. We encourage you to review this page periodically to stay informed about how we safeguard your data.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = "March 15, 2026";

  return (
    <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs text-xs text-base-content/60">
        <ul>
          <li>
            <Link href="/" className="hover:text-main flex items-center gap-1">
              <LuHouse className="size-3.5" />
              <span>Home</span>
            </Link>
          </li>
          <li className="font-semibold text-base-content">Privacy Policy</li>
        </ul>
      </nav>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-900 via-teal-900 to-main text-white p-8 sm:p-12 shadow-sm">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-medium backdrop-blur-xs mb-4">
            <LuShieldCheck className="size-4" />
            <span>Privacy &amp; Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-white/80 text-sm sm:text-base leading-relaxed">
            Your trust is our top priority. We are committed to safeguarding the personal information you share with PrettyPet while giving your pets the care they deserve.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/70">
            <span>Last Updated: <strong className="text-white">{lastUpdated}</strong></span>
            <span>•</span>
            <span>Effective Date: <strong className="text-white">January 1, 2026</strong></span>
          </div>
        </div>
      </div>

      {/* Trust Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-base-100 rounded-xl p-5 border border-base-300 flex items-start gap-4 shadow-xs">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <LuLock className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-base-content">SSL Encrypted</h3>
            <p className="text-xs text-base-content/70 mt-1">
              Bank-grade 256-bit encryption protects all your transactions and account data.
            </p>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-5 border border-base-300 flex items-start gap-4 shadow-xs">
          <div className="p-2.5 rounded-lg bg-teal-50 text-teal-600">
            <LuShieldCheck className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-base-content">Zero Data Selling</h3>
            <p className="text-xs text-base-content/70 mt-1">
              We never sell or monetize your personal details or browsing records.
            </p>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-5 border border-base-300 flex items-start gap-4 shadow-xs">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <LuUserCheck className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-base-content">Full Data Control</h3>
            <p className="text-xs text-base-content/70 mt-1">
              Easily update preferences or request complete account data deletion anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Navigation Sidebar */}
        <aside className="lg:col-span-4 sticky top-24">
          <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-xs space-y-4">
            <h2 className="font-bold text-base text-base-content flex items-center gap-2">
              <LuFileText className="size-4 text-main" />
              Table of Contents
            </h2>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block px-3 py-2 text-xs font-medium text-base-content/70 rounded-lg hover:text-main hover:bg-base-200 transition-colors"
                >
                  {sec.title}
                </a>
              ))}
              <a
                href="#contact-us"
                className="block px-3 py-2 text-xs font-medium text-base-content/70 rounded-lg hover:text-main hover:bg-base-200 transition-colors"
              >
                9. Contact Information
              </a>
            </nav>

            <div className="pt-4 border-t border-base-200">
              <p className="text-xs text-base-content/60">
                Have questions about your data rights? Reach out directly to our privacy officer at{" "}
                <a href="mailto:privacy@prettypet.com" className="text-main font-semibold underline">
                  privacy@prettypet.com
                </a>
              </p>
            </div>
          </div>
        </aside>

        {/* Detailed Sections */}
        <main className="lg:col-span-8 space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 bg-base-100 rounded-2xl p-6 sm:p-8 border border-base-300 shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-main/10 text-main">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-base-content">
                    {section.title}
                  </h2>
                </div>
                <div className="text-sm leading-relaxed">{section.content}</div>
              </section>
            );
          })}

          {/* Contact Information Section */}
          <section
            id="contact-us"
            className="scroll-mt-24 bg-base-100 rounded-2xl p-6 sm:p-8 border border-base-300 shadow-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-main/10 text-main">
                <LuMail className="size-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-base-content">
                9. Contact Information
              </h2>
            </div>
            <p className="text-sm text-base-content/80 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our handling of your personal information, please contact us at:
            </p>
            <div className="bg-base-200 p-5 rounded-xl border border-base-300 space-y-2 text-sm text-base-content">
              <p><strong>Company:</strong> PrettyPet (Operated by Ayxal LLC)</p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@prettypet.com" className="text-main hover:underline">
                  privacy@prettypet.com
                </a>{" "}
                /{" "}
                <a href="mailto:support@prettypet.com" className="text-main hover:underline">
                  support@prettypet.com
                </a>
              </p>
              <p><strong>Hours of Operation:</strong> Sunday – Thursday, 9:00 AM – 6:00 PM</p>
              <p><strong>Website:</strong> <a href="https://ayxal.com" target="_blank" rel="noreferrer" className="text-main hover:underline">https://ayxal.com</a></p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
