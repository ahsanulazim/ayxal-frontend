"use client";

import { formatPaymentMethod } from "@/utils/paymentUtils";
import { LuCreditCard, LuReceipt } from "react-icons/lu";

export const PaymentMethodBadge = ({ order, showReceipt = false, className = "" }) => {
  const payment = formatPaymentMethod(order);

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
        <LuCreditCard className="w-3.5 h-3.5 text-zinc-500" />
        <span>{payment.badgeText}</span>
      </span>

      {showReceipt && payment.receiptUrl && (
        <a
          href={payment.receiptUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-main hover:underline flex items-center gap-1"
        >
          <LuReceipt className="w-3 h-3" />
          <span>Receipt</span>
        </a>
      )}
    </div>
  );
};

export default PaymentMethodBadge;
