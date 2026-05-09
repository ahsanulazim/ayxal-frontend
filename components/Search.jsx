import { LuSearch } from "react-icons/lu";

const Search = () => {
  return (
    <label className="custom-search">
      <input type="search" required placeholder="Looking for something?" />
      <button className="btn btn-main rounded-full">
        <LuSearch className="h-[1em]" /> Search
      </button>
    </label>
  );
};

export default Search;
