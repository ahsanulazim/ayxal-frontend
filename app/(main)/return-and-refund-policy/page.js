import Link from "next/link";
import {
  LuHouse,
  LuRotateCcw,
  LuCircleCheck,
  LuCircleAlert,
  LuCoins,
  LuPackage,
  LuTruck,
  LuClock,
  LuMail,
  LuFileText,
  LuShieldCheck,
  LuCircleHelp,
} from "react-icons/lu";

export const metadata = {
  title: "Return & Refund Policy | PrettyPet",
  description:
    "Learn about PrettyPet's 14-day hassle-free return and refund policy. Easy returns, damaged item replacement, and quick refund processing.",
};

const returnSteps = [
  {
    step: "01",
    title: "Initiate Return Request",
    desc: "Reach out to our support team at support@prettypet.com or via our Contact Us page within 14 days of delivery with your order ID and reason.",
  },
  {
    step: "02",
    title: "Pack the Pet Items",
    desc: "Ensure items are unused, clean, with original tags and packaging intact. Include your packing slip or order confirmation inside.",
  },
  {
    step: "03",
    title: "Ship to Return Center",
    desc: "Affix the prepaid return shipping label (for damaged/defective items) or dispatch via your preferred tracked carrier to our fulfillment center.",
  },
  {
    step: "04",
    title: "Inspection & Quick Refund",
    desc: "Once received and inspected by our warehouse team (1–2 days), your refund is immediately initiated back to your original payment method.",
  },
];

const policySections = [
  {
    id: "return-window",
    title: "1. 14-Day Return Window",
    icon: LuClock,
    content: (
      <>
        <p className="text-base-content/80 leading-relaxed">
          At <strong>PrettyPet</strong>, we want both you and your furry companion to be 100% happy with every purchase. If a product does not meet your expectations, you may return it within <strong>14 calendar days</strong> from the date of delivery for a refund or product exchange.
        </p>
        <p className="mt-2 text-base-content/80 leading-relaxed">
          To be eligible for a return, your item must be in the same condition that you received it — unused, unwashed, free of pet hair, odor, or dirt, and in its original packaging with all labels and tags attached.
        </p>
      </>
    ),
  },
  {
    id: "eligible-items",
    title: "2. Eligible & Non-Returnable Items",
    icon: LuPackage,
    content: (
      <>
        <p className="text-base-content/80 leading-relaxed mb-4">
          For pet safety, hygiene standards, and regulatory reasons, certain categories of products have specific eligibility criteria:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
            <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5 mb-2">
              <LuCircleCheck className="size-4 text-emerald-600" />
              Eligible for Return
            </h4>
            <ul className="text-xs text-emerald-950/80 space-y-1.5 list-disc list-inside">
              <li>Unused pet toys, scratchers, and cat trees</li>
              <li>Clean pet apparel, coats, and boots (free of fur)</li>
              <li>Collars, harnesses, and leashes in original box</li>
              <li>Unopened grooming brushes, clippers, and gadgets</li>
              <li>Unused pet travel carriers, crates, and strollers</li>
            </ul>
          </div>

          <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4">
            <h4 className="font-bold text-rose-900 text-sm flex items-center gap-1.5 mb-2">
              <LuCircleAlert className="size-4 text-rose-600" />
              Non-Returnable Items
            </h4>
            <ul className="text-xs text-rose-950/80 space-y-1.5 list-disc list-inside">
              <li>Opened or unsealed pet food, snacks, and treats</li>
              <li>Pet vitamins, supplements, and dental hygiene chews</li>
              <li>Customized or personalized pet ID tags and collars</li>
              <li>Used litter boxes, pee pads, or opened grooming liquids</li>
              <li>Clearance or final-sale promotional items</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "damaged-defective",
    title: "3. Damaged, Defective or Incorrect Items",
    icon: LuShieldCheck,
    content: (
      <>
        <p className="text-base-content/80 leading-relaxed">
          We inspect every pet supply carefully before shipping, but if you receive an item that arrived damaged in transit, defective, or different from what you ordered:
        </p>
        <div className="bg-base-200 p-4 rounded-xl mt-3 text-sm text-base-content/80 space-y-2">
          <p>
            • <strong>Notify Us Promptly:</strong> Contact us within <strong>48 hours</strong> of package arrival at <a href="mailto:support@prettypet.com" className="text-main font-semibold underline">support@prettypet.com</a>.
          </p>
          <p>
            • <strong>Provide Evidence:</strong> Include your Order ID, a brief description, and clear photos showing the damaged product and outer packaging.
          </p>
          <p>
            • <strong>Zero Cost Replacement:</strong> We will dispatch a brand-new replacement immediately at <strong>no additional shipping charge</strong>, or issue a 100% full refund including original shipping fees.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "exchanges",
    title: "4. Sizing Exchanges (Pet Harnesses & Apparel)",
    icon: LuRotateCcw,
    content: (
      <p className="text-base-content/80 leading-relaxed">
        We understand pets come in all shapes and sizes! If a harness, sweater, or coat doesn&apos;t fit your pet comfortably, we are pleased to facilitate an exchange for the correct size within 14 days, provided the garment is clean, unused, and free from pet hair. Simply contact our support team to confirm size availability.
      </p>
    ),
  },
  {
    id: "refund-process",
    title: "5. Refund Timeline & Payment Methods",
    icon: LuCoins,
    content: (
      <>
        <p className="text-base-content/80 leading-relaxed">
          Once your returned package arrives at our warehouse and passes quality verification, we will immediately initiate your refund:
        </p>
        <div className="space-y-3 mt-4 text-sm text-base-content/80">
          <div className="flex items-start gap-3 p-3 bg-base-100 rounded-xl border border-base-200">
            <span className="badge badge-sm badge-neutral mt-0.5">Credit / Debit Cards</span>
            <span>Refunds typically reflect on your bank or credit card statement within <strong>3 to 7 business days</strong> depending on your bank&apos;s processing timeline.</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-base-100 rounded-xl border border-base-200">
            <span className="badge badge-sm badge-neutral mt-0.5">Digital Wallets &amp; PayPal</span>
            <span>Processed immediately and normally visible within <strong>24 hours</strong>.</span>
          </div>
          <div className="flex items-start gap-3 p-3 bg-base-100 rounded-xl border border-base-200">
            <span className="badge badge-sm badge-neutral mt-0.5">Store Credit / Voucher</span>
            <span>Issued instantly to your PrettyPet account balance or promo wallet if you prefer store credit.</span>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "shipping-costs",
    title: "6. Return Shipping Costs",
    icon: LuTruck,
    content: (
      <div className="text-base-content/80 leading-relaxed text-sm space-y-2">
        <p>
          • <strong>Fault of PrettyPet (Damaged/Defective/Wrong item):</strong> We cover 100% of return shipping expenses and will provide a prepaid digital shipping label.
        </p>
        <p>
          • <strong>Change of Mind or Accidental Order:</strong> The customer is responsible for the actual return shipping cost. Original shipping charges (if any) are non-refundable.
        </p>
        <p>
          • <strong>Restocking Fees:</strong> We do <strong>not</strong> charge any restocking fees on standard eligible returns.
        </p>
      </div>
    ),
  },
];

const policyFaqs = [
  {
    q: "Can I return opened pet food if my pet didn't like the taste?",
    a: "Due to safety, contamination, and pet food health regulations, we cannot accept returns on opened food or treats. However, if there was a manufacturer defect or expiration issue, please contact our support team for resolution.",
  },
  {
    q: "How do I receive my return shipping label?",
    a: "Once our support team approves your return request, a prepaid or printable return label with instructions will be emailed directly to your registered email address.",
  },
  {
    q: "Can I cancel my order before it ships for an immediate refund?",
    a: "Yes! If your order is in 'Pending' or 'Processing' status and has not yet been packed or dispatched by our warehouse, you can cancel it for a 100% immediate refund via your Account Dashboard or by contacting support.",
  },
  {
    q: "What if my return package is lost during transit?",
    a: "We strongly recommend using a trackable shipping service when mailing returns. PrettyPet cannot be held liable for packages lost in transit without proof of tracking delivery to our return center.",
  },
];

export default function ReturnAndRefundPolicyPage() {
  const lastUpdated = "March 15, 2026";

  return (
    <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs text-xs text-base-content/60">
        <ul>
          <li>
            <Link href="/" className="hover:text-main flex items-center gap-1">
              <LuHouse className="size-3.5" />
              <span>Home</span>
            </Link>
          </li>
          <li className="font-semibold text-base-content">Return &amp; Refund Policy</li>
        </ul>
      </nav>

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-900 via-teal-900 to-main text-white p-8 sm:p-12 shadow-sm">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-medium backdrop-blur-xs mb-4">
            <LuRotateCcw className="size-3.5" />
            <span>Customer Satisfaction &amp; Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Return &amp; Refund Policy
          </h1>
          <p className="mt-3 text-white/80 text-sm sm:text-base leading-relaxed">
            We stand behind every toy, harness, and treat we offer. If something isn&apos;t quite right for your pet, we&apos;re here to make the return or exchange process simple, fair, and fast.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/70">
            <span>Last Updated: <strong className="text-white">{lastUpdated}</strong></span>
            <span>•</span>
            <span>Standard Return Window: <strong className="text-white">14 Days</strong></span>
          </div>
        </div>
      </div>

      {/* Trust Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-base-100 rounded-xl p-5 border border-base-300 flex items-start gap-4 shadow-xs">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <LuClock className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-base-content">14-Day Returns</h3>
            <p className="text-xs text-base-content/70 mt-1">
              Hassle-free return window on unused pet toys, apparel, and accessories.
            </p>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-5 border border-base-300 flex items-start gap-4 shadow-xs">
          <div className="p-2.5 rounded-lg bg-teal-50 text-teal-600">
            <LuCoins className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-base-content">Fast Refund Payouts</h3>
            <p className="text-xs text-base-content/70 mt-1">
              Refunds initiated within 24-48 hours after our warehouse quality check.
            </p>
          </div>
        </div>

        <div className="bg-base-100 rounded-xl p-5 border border-base-300 flex items-start gap-4 shadow-xs">
          <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600">
            <LuShieldCheck className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-base-content">Defect Protection</h3>
            <p className="text-xs text-base-content/70 mt-1">
              Immediate replacement or 100% refund for damaged or transit-affected items.
            </p>
          </div>
        </div>
      </div>

      {/* Return Process Steps */}
      <div className="bg-base-100 rounded-2xl p-6 sm:p-8 border border-base-300 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-base-content">How Our Return Process Works</h2>
          <p className="text-xs text-base-content/60 mt-1">
            Follow these 4 simple steps to return or exchange an item with PrettyPet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {returnSteps.map((stepItem, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-base-200/50 border border-base-300/80 relative flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-extrabold text-main/30 font-mono">
                  {stepItem.step}
                </span>
                <h3 className="font-bold text-sm text-base-content mt-2">
                  {stepItem.title}
                </h3>
                <p className="text-xs text-base-content/70 leading-relaxed mt-1.5">
                  {stepItem.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Navigation Sidebar */}
        <aside className="lg:col-span-4 sticky top-24">
          <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-xs space-y-4">
            <h2 className="font-bold text-base text-base-content flex items-center gap-2">
              <LuFileText className="size-4 text-main" />
              Policy Sections
            </h2>
            <nav className="space-y-1">
              {policySections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block px-3 py-2 text-xs font-medium text-base-content/70 rounded-lg hover:text-main hover:bg-base-200 transition-colors"
                >
                  {sec.title}
                </a>
              ))}
              <a
                href="#policy-faqs"
                className="block px-3 py-2 text-xs font-medium text-base-content/70 rounded-lg hover:text-main hover:bg-base-200 transition-colors"
              >
                Frequently Asked Questions
              </a>
              <a
                href="#start-return"
                className="block px-3 py-2 text-xs font-medium text-base-content/70 rounded-lg hover:text-main hover:bg-base-200 transition-colors"
              >
                Contact &amp; Start a Return
              </a>
            </nav>

            <div className="pt-4 border-t border-base-200 space-y-3">
              <p className="text-xs text-base-content/60 leading-relaxed">
                Need quick assistance with a recent order? Visit our contact page or email us.
              </p>
              <Link
                href="/contact"
                className="btn btn-main btn-sm w-full rounded-xl flex items-center justify-center gap-1.5 text-xs"
              >
                <LuMail className="size-3.5" />
                <span>Contact Support</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Detailed Policy Sections */}
        <main className="lg:col-span-8 space-y-6">
          {policySections.map((section) => {
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

          {/* Policy FAQs */}
          <section
            id="policy-faqs"
            className="scroll-mt-24 bg-base-100 rounded-2xl p-6 sm:p-8 border border-base-300 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-main/10 text-main">
                <LuCircleHelp className="size-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-base-content">
                Return &amp; Refund FAQs
              </h2>
            </div>
            <div className="space-y-3">
              {policyFaqs.map((faq, index) => (
                <details
                  key={index}
                  className="collapse collapse-plus bg-base-100 border border-base-300"
                  name="return-faq"
                >
                  <summary className="collapse-title text-sm font-semibold">
                    {faq.q}
                  </summary>
                  <div className="collapse-content text-xs opacity-80 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Start Return CTA */}
          <section
            id="start-return"
            className="scroll-mt-24 bg-base-100 rounded-2xl p-6 sm:p-8 border border-base-300 shadow-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-main/10 text-main">
                <LuMail className="size-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-base-content">
                Ready to Start a Return or Exchange?
              </h2>
            </div>
            <p className="text-sm text-base-content/80 leading-relaxed mb-4">
              Our pet care specialists are ready to guide you through every step. Contact us with your Order ID and we will respond with return details right away:
            </p>
            <div className="bg-base-200 p-5 rounded-xl border border-base-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-sm text-base-content">PrettyPet Customer Care</p>
                <p className="text-xs text-base-content/70 mt-0.5">
                  Email: <a href="mailto:support@prettypet.com" className="text-main hover:underline font-medium">support@prettypet.com</a>
                </p>
                <p className="text-xs text-base-content/70">Phone: +1 (800) 555-7387 (Sun–Thu, 9 AM – 6 PM EST)</p>
              </div>
              <Link
                href="/contact"
                className="btn btn-main btn-sm rounded-xl shrink-0"
              >
                Submit Return Inquiry
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
