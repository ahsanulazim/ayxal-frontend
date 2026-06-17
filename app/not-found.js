import Sidebar from "@/components/Sidebar";
import Link from "next/link";

const NotFound = () => {
  return (
    <Sidebar>
      <div className="min-h-[calc(100dvh-95px)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-bold text-2xl">404 - Page Not Found!</h1>
          <p className="opacity-70">
            Sorry, the page you are looking for does not exist.
          </p>
          <Link href="/">
            <button className="btn btn-main">Back to Home</button>
          </Link>
        </div>
      </div>
    </Sidebar>
  );
};

export default NotFound;
