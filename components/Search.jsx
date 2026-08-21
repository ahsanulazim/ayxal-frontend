import { LuHistory, LuSearch, LuX } from "react-icons/lu";

const Search = () => {
  return (
    <div className="flex flex-col relative w-full">
      <label className="custom-search">
        <input type="search" required placeholder="Looking for something?" />
        <button className="btn btn-main rounded-full">
          <LuSearch className="h-[1em]" /> Search
        </button>
      </label>
      {/* <ul className="list absolute w-full top-14 bg-base-100 rounded-box shadow-xl [&>li:not(:first-child)]:hover:bg-base-300 [&>li:not(:first-child)]:transition-colors [&>li:not(:first-child)]:cursor-pointer">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          <LuHistory className="size-4 inline-block" /> Recent Searches
        </li>

        <li className="list-row">
          <div>
            <img
              className="size-10 rounded-box"
              alt="Tailwind CSS list item"
              src="https://img.daisyui.com/images/profile/demo/1@94.webp"
            />
          </div>
          <div>
            <div>Dio Lupa</div>
            <div className="text-xs uppercase font-semibold opacity-60">
              Remaining Reason
            </div>
          </div>
          <button className="btn btn-square btn-ghost">
            <svg
              className="size-[1.2em]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M6 3L20 12 6 21 6 3z"></path>
              </g>
            </svg>
          </button>
          <button className="btn btn-square btn-ghost">
            <LuX className="size-4 text-error" />
          </button>
        </li>

        <li className="list-row">
          <div>
            <img
              className="size-10 rounded-box"
              alt="Tailwind CSS list item"
              src="https://img.daisyui.com/images/profile/demo/4@94.webp"
            />
          </div>
          <div>
            <div>Ellie Beilish</div>
            <div className="text-xs uppercase font-semibold opacity-60">
              Bears of a fever
            </div>
          </div>
          <button className="btn btn-square btn-ghost">
            <svg
              className="size-[1.2em]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M6 3L20 12 6 21 6 3z"></path>
              </g>
            </svg>
          </button>
          <button className="btn btn-square btn-ghost">
            <LuX className="size-4 text-error" />
          </button>
        </li>

        <li className="list-row">
          <div>
            <img
              className="size-10 rounded-box"
              alt="Tailwind CSS list item"
              src="https://img.daisyui.com/images/profile/demo/3@94.webp"
            />
          </div>
          <div>
            <div>Sabrino Gardener</div>
            <div className="text-xs uppercase font-semibold opacity-60">
              Cappuccino
            </div>
          </div>
          <button className="btn btn-square btn-ghost">
            <svg
              className="size-[1.2em]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M6 3L20 12 6 21 6 3z"></path>
              </g>
            </svg>
          </button>
          <button className="btn btn-square btn-ghost">
            <LuX className="size-4 text-error" />
          </button>
        </li>
      </ul> */}
    </div>
  );
};

export default Search;
