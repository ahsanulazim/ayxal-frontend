import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <>
      <footer className="bg-neutral text-neutral-content px-5">
        <footer className="footer sm:footer-horizontal py-10 max-w-360 mx-auto">
          <aside>
            <Image
              src="/assets/pretypet-logo.svg"
              alt="Oiki Logo"
              width={150}
              height={70}
            />
            <p className="max-w-sm text-balance">
              PrettyPet is your trusted destination for practical, stylish, and
              pet-friendly essentials. We carefully select products that make
              everyday life easier, healthier, and more enjoyable for both pets
              and their people.
            </p>
            <nav>
              <h6 className="footer-title">Follow Us</h6>
              <div className="grid grid-flow-col gap-4">
                <a>
                  <FaFacebook size={18} />
                </a>
                <a>
                  <FaInstagram size={18} />
                </a>
                <a>
                  <FaXTwitter size={18} />
                </a>
              </div>
            </nav>
          </aside>
          <nav>
            <h6 className="footer-title">Help</h6>
            <Link href="/login" className="link link-hover">
              Account
            </Link>
            <a className="link link-hover">Contact Us</a>
            <a className="link link-hover">Track Your Order</a>
            <a className="link link-hover">FAQ</a>
          </nav>
          <nav>
            <h6 className="footer-title">Info</h6>
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Return & Refund Policy</a>
            <a className="link link-hover">Terms & Conditions</a>
            <a className="link link-hover">Privacy Policy</a>
          </nav>
          <form>
            <h6 className="footer-title">Newsletter</h6>
            <fieldset className="w-80">
              <label>Enter your email address</label>
              <div className="join mt-3">
                <input
                  type="text"
                  placeholder="username@site.com"
                  className="input join-item"
                />
                <button className="btn btn-main join-item">Subscribe</button>
              </div>
            </fieldset>
          </form>
        </footer>
      </footer>
      <footer className="footer sm:footer-horizontal footer-center bg-main text-neutral-content p-2">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by{" "}
            <a className="link" href="https://ayxal.com">
              Ayxal LLC
            </a>
          </p>
        </aside>
      </footer>
    </>
  );
};

export default Footer;
