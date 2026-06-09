import CjProductCard from "./CjProductCard";

const CjResults = () => {
  return (
    <div className="grid grid-cols-8 gap-2">
      {Array.from({ length: 20 }).map((_, i) => (
        <CjProductCard key={i} />
      ))}
    </div>
  );
};

export default CjResults;
