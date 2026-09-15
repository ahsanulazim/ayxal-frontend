import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

const StatCard = ({ title, count, subtitle, icon: Icon, href, color = "main" }) => {
  return (
    <Link
      href={href}
      className="group bg-base-100 p-5 rounded-2xl border border-base-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-base-content/60 uppercase tracking-wider">
            {title}
          </p>
          <h4 className="text-2xl font-bold text-base-content group-hover:text-main transition-colors">
            {count}
          </h4>
        </div>
        <div className="w-11 h-11 rounded-xl bg-main/10 text-main flex items-center justify-center group-hover:bg-main group-hover:text-white transition-all duration-200">
          <Icon className="size-5" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-base-200/60 flex items-center justify-between text-xs text-base-content/70">
        <span>{subtitle}</span>
        <LuChevronRight className="size-4 group-hover:translate-x-1 transition-transform text-main" />
      </div>
    </Link>
  );
};

export default StatCard;
