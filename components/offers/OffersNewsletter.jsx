"use client";

import { useState } from "react";
import { LuCheck, LuCopy, LuMail, LuSparkles } from "react-icons/lu";
import { toast } from "react-toastify";

const OffersNewsletter = () => {
  const [email, setEmail] = useState("");
  const [unlockedCode, setUnlockedCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setUnlockedCode(true);
    toast.success("Congratulations! Your 10% Welcome Voucher has been unlocked!");
  };

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText("WELCOME10");
      setCopied(true);
      toast.success("Voucher code 'WELCOME10' copied!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="bg-linear-to-r from-emerald-900 to-main text-white rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden">
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-amber-300">
          <LuSparkles className="size-3.5" /> Secret Pet Parent Savings Club
        </div>

        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-balance">
          Unlock An Extra 10% Off Your Next Order
        </h3>

        <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto text-balance">
          Subscribe to our pet community newsletter for secret weekend coupons, seasonal giveaways, and pet care tips.
        </p>

        {!unlockedCode ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-2">
            <div className="flex flex-col sm:flex-row gap-2 bg-white/10 p-1.5 rounded-2xl sm:rounded-full backdrop-blur-md border border-white/20">
              <div className="flex items-center gap-2 px-3 flex-1">
                <LuMail className="size-4 text-white/60 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email (e.g. petlover@gmail.com)"
                  required
                  className="w-full text-xs sm:text-sm bg-transparent outline-hidden text-white placeholder:text-white/50"
                />
              </div>
              <button
                type="submit"
                className="btn btn-sm bg-amber-400 hover:bg-amber-300 text-neutral-900 font-extrabold rounded-xl sm:rounded-full px-6 border-0 shrink-0 shadow-xs"
              >
                Claim 10% Off
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-amber-300/40 max-w-md mx-auto space-y-2 mt-2">
            <p className="text-xs font-semibold text-amber-300">
              🎉 Your 10% Discount Code is Unlocked:
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono font-black text-lg bg-black/30 px-4 py-1.5 rounded-xl border border-dashed border-amber-400">
                WELCOME10
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="btn btn-sm bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold rounded-xl gap-1 text-xs"
              >
                {copied ? <LuCheck className="size-3.5" /> : <LuCopy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-[11px] text-white/70">
              Use code WELCOME10 at checkout to save 10% immediately!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OffersNewsletter;
