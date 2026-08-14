import { useRef } from "react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import AddAttributeModal from "./AddAttributeModal";

const AttributeCard = ({ attribute, setAttributeSlug, ref }) => {
  const attributeEditRef = useRef(null);

  return (
    <div className="card bg-base-200">
      <AddAttributeModal
        isEditing={true}
        ref={attributeEditRef}
        attribute={attribute}
      />
      <div className="card-body justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="card-title">{attribute.name}</h2>
            <span className="badge badge-primary badge-soft badge-sm">
              {attribute.slug}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {attribute.options.length > 5
              ? attribute.options.slice(0, 4).map((option) => (
                  <span key={option.value} className="badge badge-soft">
                    {option.label}
                  </span>
                ))
              : attribute.options.map((option) => (
                  <span key={option.value} className="badge badge-soft">
                    {option.label}
                  </span>
                ))}
            {attribute.options.length > 4 && (
              <span className="badge badge-soft">
                +{attribute.options.length - 4} more
              </span>
            )}
          </div>
        </div>
        <div className="card-actions justify-end mt-3">
          <button
            className="btn btn-info btn-sm"
            onClick={() => attributeEditRef.current.showModal()}
          >
            <LuSquarePen /> Edit
          </button>
          <button
            className="btn btn-error btn-sm"
            onClick={() => {
              setAttributeSlug(attribute.slug);
              ref.current.showModal();
            }}
          >
            <LuTrash2 /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttributeCard;
