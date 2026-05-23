import PaymentCard from "@/components/cart/checkout/payment/PaymentCard";
import Link from "next/link";
import { LuCheck, LuHouse } from "react-icons/lu";

const page = () => {
  return (
    <>
      <section className="px-5">
        <div className="max-w-360 mx-auto">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link href="/">
                  <LuHouse />
                </Link>
              </li>
              <li>
                <Link href="/cart">Cart</Link>
              </li>
              <li>
                <Link href="/cart/checkout">Checkout</Link>
              </li>
              <li>Payment Success</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <PaymentCard>
          <div className="bg-success text-success-content rounded-full p-2 w-fit">
            <LuCheck className="text-2xl" />
          </div>
          <h2 className="text-xl text-success font-semibold">
            Payment Successfull
          </h2>
          <p className="text-center text-sm">
            Your payment has been processed successfully. You will receive a
            confirmation email shortly.
          </p>
          <Link href="/">
            <button className="btn btn-main btn-wide">Back to Home</button>
          </Link>
          <p className="text-center text-xs">
            Need help? Contact our support team at{" "}
            <a
              className="link text-main link-hover"
              href="mailto:support@oiki.store"
            >
              support@oiki.store
            </a>
          </p>
        </PaymentCard>
      </section>
    </>
  );
};

export default page;
