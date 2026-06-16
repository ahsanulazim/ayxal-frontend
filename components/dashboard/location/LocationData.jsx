"use client";
import { getAllLocations } from "@/api/locationApi";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { LuEye, LuSquarePen, LuTrash2 } from "react-icons/lu";

const LocationData = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["locations"],
    queryFn: getAllLocations,
  });

  return (
    <div className="my-5">
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-base-200">
              <th>Country</th>
              <th>Short</th>
              <th>Slug</th>
              <th>States</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {isPending ? (
              <tr>
                <td colSpan={6} className="text-center">
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="text-center">
                  Error loading data
                </td>
              </tr>
            ) : data.locations?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No data found
                </td>
              </tr>
            ) : (
              data.locations?.map((location) => (
                <tr key={location.slug}>
                  <td>
                    <p>{location.countryName}</p>
                  </td>
                  <td>{location.countryShort}</td>
                  <td>
                    <p>{location.slug}</p>
                  </td>
                  <td>{location.states.length}</td>
                  <td>
                    <div
                      className={`badge badge-soft ${
                        location?.isActive
                          ? "border-success badge-success"
                          : "border-error badge-error"
                      }`}
                    >
                      <div className="inline-grid *:[grid-area:1/1]">
                        <div
                          className={`status animate-ping ${
                            location.isActive
                              ? "status-success"
                              : "status-error"
                          }`}
                        ></div>{" "}
                        <div
                          className={`status ${
                            location.isActive
                              ? "status-success"
                              : "status-error"
                          }`}
                        ></div>
                      </div>{" "}
                      {location?.isActive ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-5">
                      <Link href={`/dashboard/location/${location.slug}`}>
                        <button className="btn btn-circle btn-soft btn-info">
                          <LuEye />
                        </button>
                      </Link>
                      <button className="btn btn-circle btn-soft btn-info">
                        <LuSquarePen />
                      </button>
                      <button className="btn btn-circle btn-soft btn-error">
                        <LuTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationData;
