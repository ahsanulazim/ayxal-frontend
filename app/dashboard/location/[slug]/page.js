import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import StatesData from "@/components/dashboard/location/StatesData";

const page = async ({ params }) => {
  const { slug } = await params;

  return (
    <>
      <Breadcrumbs title="Location" subtitle="View Location" />
      <section>
        <h2 className="font-bold text-2xl">Location Details</h2>
      </section>
      <section>
        <StatesData slug={slug} />
      </section>
    </>
  );
};

export default page;
