import Link from "next/link";

const NotFound = () => {
  return (
    <div>
      <h1>Page not found</h1>
      <Link href="/dashboard">
        <button className="btn btn-main">Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default NotFound;
