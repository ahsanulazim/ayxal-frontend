import { deleteAttribute } from "@/api/attributeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const AttributeDeleteModal = ({ ref, slug }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteAttribute,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success(data?.message);
      ref.current.close();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Attribute Cannot be Deleted",
      );
    },
  });

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Attribute?</h3>
        <p className="py-4">This will permanently delete this attribute.</p>
        <div className="modal-action">
          <div className="w-full gap-3 flex">
            {/* if there is a button in form, it will close the modal */}
            <button
              type="button"
              className="btn btn-error flex-1"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate(slug)}
            >
              {mutation.isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Delete"
              )}
            </button>
            <button
              type="button"
              className="btn flex-1"
              onClick={() => ref.current.close()}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default AttributeDeleteModal;
