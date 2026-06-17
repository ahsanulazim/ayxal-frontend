import api from "@/axios/axiosInstance";
import Action from "@/components/dashboard/attribute/type/Action";
import TypesTable from "@/components/dashboard/attribute/type/TypesTable";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import { notFound } from "next/navigation";

const page = async ({ params }) => {
  const { attributeSlug } = await params;

  let attributeData;
  try {
    const attrRes = await api.get("/attributes/getAttribute", {
      params: { slug: attributeSlug },
    });
    attributeData = attrRes.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return notFound();
    }
  }

  const res = await api.get("/variants/getAllVariants", {
    params: { attributeSlug },
  });

  const variants = res.data;

  if (!attributeData) {
    return notFound();
  }

  return (
    <>
      <Breadcrumbs
        title="Attributes"
        subtitle={
          attributeSlug.slice(0, 1).toUpperCase() +
          attributeSlug.slice(1, attributeSlug.length)
        }
      />
      <Action attributeSlug={attributeSlug} attribute={variants} attributeData={attributeData} />
      <section>
        <TypesTable attributeSlug={attributeSlug} attribute={variants} />
      </section>
    </>
  );
};

export default page;
