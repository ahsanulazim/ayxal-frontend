import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import LocationData from "@/components/dashboard/location/LocationData";
import { LuPlus } from "react-icons/lu";

const page = () => {
  return (
    <>
      <Breadcrumbs title="Location" />
      <section className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Location</h2>
          <button className="btn btn-main">
            <LuPlus /> Add Location
          </button>
        </div>
      </section>
      <section>
        <LocationData />
      </section>
    </>
  );
};

export default page;
