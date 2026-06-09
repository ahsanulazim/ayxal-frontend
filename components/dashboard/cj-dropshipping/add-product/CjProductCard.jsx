import { LuPlus } from "react-icons/lu";

const CjProductCard = () => {
  return (
    <div className="card bg-base-100">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
          className="aspect-square object-cover"
        />
      </figure>
      <div className="card-body p-2">
        <h2 className="card-title text-base">Card Title</h2>
        <p>$35</p>
        <div className="card-actions">
          <button className="btn btn-main w-full">
            <LuPlus /> Add to Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default CjProductCard;
