import { LuLink, LuTrash2 } from "react-icons/lu";

const CarouselCard = ({ carousel }) => {
  return (
    <div className="card bg-base-100 shadow-md">
      <figure>
        <img src={carousel.image.url} alt={carousel.title} />
      </figure>
      <div className="card-body">
        <div>
          <h2 className="card-title line-clamp-1">{carousel.title}</h2>
          <span className="flex items-center gap-2">
            <LuLink className="text-sm" /> {carousel.link}
          </span>
        </div>
        <div className="card-actions">
          <button className="btn btn-error btn-md">
            <LuTrash2 /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;
