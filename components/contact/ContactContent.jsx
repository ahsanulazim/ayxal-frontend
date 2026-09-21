"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  LuHouse,
  LuMail,
  LuPhone,
  LuMapPin,
  LuClock,
  LuSend,
  LuMessageSquare,
  LuPackage,
  LuSparkles,
  LuHeartHandshake,
  LuCircleCheck,
  LuCircleHelp,
} from "react-icons/lu";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";

const contactCards = [
  {
    icon: LuMail,
    title: "Email Us",
    detail: "support@prettypet.com",
    subdetail: "Average response: under 12 hours",
    actionText: "Send an Email",
    href: "mailto:support@prettypet.com",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: LuPhone,
    title: "Call or WhatsApp",
    detail: "+1 (800) 555-7387",
    subdetail: "Sun – Thu: 9:00 AM – 6:00 PM EST",
    actionText: "Call Support",
    href: "tel:+18005557387",
    color: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    icon: LuMapPin,
    title: "Headquarters",
    detail: "Ayxal LLC, Delaware, USA",
    subdetail: "Global Pet Supplies Distribution",
    actionText: "View on Map",
    href: "https://maps.google.com/?q=Delaware+USA",
    color: "bg-sky-50 text-sky-600 border-sky-100",
    external: true,
  },
  {
    icon: LuClock,
    title: "Working Hours",
    detail: "Sunday – Thursday",
    subdetail: "9:00 AM – 6:00 PM EST (Friday Closed)",
    actionText: "Track Your Order",
    href: "/account",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

const faqs = [
  {
    q: "How can I track the status of my shipment?",
    a: "Once your order is dispatched, you will receive an email with a tracking number and link. You can also view real-time shipping updates in your Account Dashboard under 'Order History'.",
  },
  {
    q: "What is PrettyPet's return and refund policy?",
    a: "We offer a 14-day hassle-free return policy on unused, unopened pet accessories and toys. If your item arrived damaged or incorrect, contact us with a photo for an immediate replacement or full refund.",
  },
  {
    q: "How long does standard delivery take?",
    a: "Orders are processed within 24–48 hours. Standard domestic delivery typically takes 3–5 business days, while express options arrive in 1–2 business days.",
  },
  {
    q: "Can I make changes to my order after placing it?",
    a: "If your order has not been dispatched yet, our support team can help update your shipping address or items. Please contact us via email or phone as soon as possible.",
  },
  {
    q: "Are the pet food and toys safe and certified?",
    a: "Yes! Every single product at PrettyPet is screened for non-toxic materials, pet-safe dyes, and durability so your furry companions stay happy and healthy.",
  },
];

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Order Inquiry",
    orderNumber: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error(
        "Please fill in all required fields (Name, Email, and Message).",
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate sending message with friendly user confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success(
        "Thank you! Your message has been sent successfully. We'll reply shortly.",
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "Order Inquiry",
        orderNumber: "",
        subject: "",
        message: "",
      });
    }, 900);
  };

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
          <li className="font-semibold text-base-content">Contact Us</li>
        </ul>
      </nav>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-900 via-teal-900 to-main text-white p-8 sm:p-12 shadow-sm">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-medium backdrop-blur-xs mb-4">
            <LuSparkles className="size-3.5" />
            <span>Customer Support • Always Here For Your Pets</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Get in Touch With Us
          </h1>
          <p className="mt-3 text-white/80 text-sm sm:text-base leading-relaxed">
            Have a question about an order, sizing for your pet, or our delivery
            process? We are here to help ensure you and your furry companions
            get the best experience possible.
          </p>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div
                  className={`size-11 rounded-xl flex items-center justify-center mb-4 border ${card.color}`}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="font-bold text-base text-base-content">
                  {card.title}
                </h3>
                <p className="font-semibold text-sm text-base-content/90 mt-1">
                  {card.detail}
                </p>
                <p className="text-xs text-base-content/60 mt-1">
                  {card.subdetail}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-base-200">
                <a
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noreferrer" : undefined}
                  className="text-xs font-semibold text-main hover:underline inline-flex items-center gap-1"
                >
                  {card.actionText} →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Form & FAQ Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Contact Form */}
        <div className="lg:col-span-7 bg-base-100 rounded-2xl p-6 sm:p-8 border border-base-300 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-main/10 text-main">
              <LuMessageSquare className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-base-content">
                Send Us a Message
              </h2>
              <p className="text-xs text-base-content/60 mt-0.5">
                Fill out the form below and our pet care specialists will reach
                out to you.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600">
                <LuCircleCheck className="size-8" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900">
                Message Sent Successfully!
              </h3>
              <p className="text-sm text-emerald-800 max-w-md mx-auto">
                Thank you for contacting PrettyPet. One of our customer support
                representatives will review your inquiry and get back to you
                within 12 hours.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn btn-main btn-sm rounded-xl"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="form-control">
                  <label className="label text-xs font-semibold text-base-content/80">
                    Your Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Jenkins"
                    className="input input-bordered w-full rounded-xl focus:border-main focus:outline-0 text-sm"
                  />
                </div>

                {/* Email Address */}
                <div className="form-control">
                  <label className="label text-xs font-semibold text-base-content/80">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="input input-bordered w-full rounded-xl focus:border-main focus:outline-0 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div className="form-control">
                  <label className="label text-xs font-semibold text-base-content/80">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="input input-bordered w-full rounded-xl focus:border-main focus:outline-0 text-sm"
                  />
                </div>

                {/* Inquiry Category */}
                <div className="form-control">
                  <label className="label text-xs font-semibold text-base-content/80">
                    Inquiry Topic
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select select-bordered w-full rounded-xl focus:border-main focus:outline-0 text-sm"
                  >
                    <option value="Order Inquiry">
                      Order Status &amp; Tracking
                    </option>
                    <option value="Product Advice">
                      Product Advice &amp; Sizing
                    </option>
                    <option value="Returns & Exchanges">
                      Returns, Refunds &amp; Exchanges
                    </option>
                    <option value="Payment & Billing">
                      Payment &amp; Billing Questions
                    </option>
                    <option value="Wholesale / Partnership">
                      Wholesale &amp; Brand Partnership
                    </option>
                    <option value="Other">Other Inquiries</option>
                  </select>
                </div>
              </div>

              {/* Order Number */}
              <div className="form-control">
                <label className="label text-xs font-semibold text-base-content/80 flex items-center gap-1.5">
                  <LuPackage className="size-3.5 text-base-content/60" />
                  Order Number (If applicable)
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  placeholder="e.g. #ORD-84920"
                  className="input input-bordered w-full rounded-xl focus:border-main focus:outline-0 text-sm"
                />
              </div>

              {/* Subject */}
              <div className="form-control">
                <label className="label text-xs font-semibold text-base-content/80">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we assist you today?"
                  className="input input-bordered w-full rounded-xl focus:border-main focus:outline-0 text-sm"
                />
              </div>

              {/* Message */}
              <div className="form-control">
                <label className="label text-xs font-semibold text-base-content/80">
                  Your Message <span className="text-error">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe your question or issue in detail..."
                  className="textarea textarea-bordered w-full rounded-xl focus:border-main focus:outline-0 text-sm leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-main w-full sm:w-auto px-8 rounded-xl flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <LuSend className="size-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: FAQ & Direct Help */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick FAQ Card */}
          <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <LuCircleHelp className="size-5 text-main" />
              <h3 className="text-base font-bold text-base-content">
                Frequently Asked Questions
              </h3>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="collapse collapse-plus bg-base-100 border border-base-300"
                  name="faq"
                >
                  <summary className="collapse-title text-sm font-semibold">
                    {faq.q}
                  </summary>
                  <div className="collapse-content text-xs opacity-80">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Customer Satisfaction Card */}
          <div className="bg-base-100 rounded-2xl p-6 border border-base-300 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <LuHeartHandshake className="size-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-base-content">
                  PrettyPet Guarantee
                </h4>
                <p className="text-xs text-base-content/70">
                  100% Satisfaction or full refund
                </p>
              </div>
            </div>
            <p className="text-xs text-base-content/70 leading-relaxed">
              We stand firmly behind our pet gear, accessories, and grooming
              essentials. If you or your pet are not completely satisfied with a
              purchase, our dedicated team will make it right.
            </p>

            <div className="pt-3 border-t border-base-200 flex items-center justify-between">
              <span className="text-xs font-medium text-base-content/70">
                Join our pet community:
              </span>
              <div className="flex items-center gap-3 text-base-content/80">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-main"
                >
                  <FaFacebook size={16} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-main"
                >
                  <FaInstagram size={16} />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-main"
                >
                  <FaXTwitter size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
