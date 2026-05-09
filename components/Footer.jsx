import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer className="bg-neutral text-neutral-content px-5">
        <footer className="footer sm:footer-horizontal py-10 max-w-360 mx-auto">
          <aside>
            <Image
              src="/assets/oiki-logo-tag.svg"
              alt="Oiki Logo"
              width={120}
              height={60}
            />
            <p className="max-w-sm text-balance">
              Oiki is dedicated to preserving Bengali craftsmanship. We bring
              you ethically made, handcrafted apparel from elegant sarees to
              trendy Kurtis, designed for the woman who celebrates her roots.
            </p>
          </aside>
          <nav>
            <h6 className="footer-title">Services</h6>
            <a className="link link-hover">Branding</a>
            <a className="link link-hover">Design</a>
            <a className="link link-hover">Marketing</a>
            <a className="link link-hover">Advertisement</a>
          </nav>
          <nav>
            <h6 className="footer-title">Company</h6>
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Jobs</a>
            <a className="link link-hover">Press kit</a>
          </nav>
        </footer>
      </footer>
      <footer className="footer sm:footer-horizontal footer-center bg-main text-neutral-content p-2">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by{" "}
            <a className="link" href="https://nexorosolution.com">
              Nexoro Solutions
            </a>
          </p>
        </aside>
      </footer>
    </>
  );
};

export default Footer;
