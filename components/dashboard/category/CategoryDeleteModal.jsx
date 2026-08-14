import { deleteCategory } from "@/api/categoryApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const CategoryDeleteModal = ({ ref, id }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category Deleted");
      ref.current.close();
    },
    onError: () => {
      toast.error("Category Cannot be Deleted");
    },
  });

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Category?</h3>
        <p className="py-4">This will permanently delete this Category.</p>
        <div className="modal-action">
          <form method="dialog" className="w-full gap-3 flex">
            {/* if there is a button in form, it will close the modal */}
            <button
              type="button"
              className="btn btn-error flex-1"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate(id)}
            >
              {mutation.isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Delete"
              )}
            </button>
            <button className="btn flex-1">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default CategoryDeleteModal;
