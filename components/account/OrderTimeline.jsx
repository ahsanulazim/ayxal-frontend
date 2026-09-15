import {
  LuBox,
  LuCircleCheck,
  LuCircleX,
  LuClock,
  LuTruck,
} from "react-icons/lu";

const steps = [
  { key: "pending", label: "Order Placed", icon: LuClock },
  { key: "processing", label: "Processing", icon: LuBox },
  { key: "shipped", label: "Shipped", icon: LuTruck },
  { key: "delivered", label: "Delivered", icon: LuCircleCheck },
];

const getStepIndex = (status) => {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return 0;
    case "processing":
    case "paid":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    case "cancelled":
      return -1;
    default:
      return 0;
  }
};

const OrderTimeline = ({ orderStatus, trackingNumber, carrier, createdAt }) => {
  const isCancelled = (orderStatus || "").toLowerCase() === "cancelled";
  const currentIndex = getStepIndex(orderStatus);

  if (isCancelled) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-2xl p-4 flex items-center gap-3 text-error">
        <LuCircleX className="size-6 shrink-0" />
        <div>
          <h4 className="font-bold text-sm">Order Cancelled</h4>
          <p className="text-xs text-error/80">
            This order has been cancelled and is no longer being processed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      {/* Visual Stepper */}
      <div className="relative flex items-center justify-between">
        {/* Connector line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-base-200 z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-main z-0 transition-all duration-500"
          style={{
            width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? "bg-main text-white ring-4 ring-main/20"
                    : "bg-base-200 text-base-content/40"
                } ${isCurrent ? "scale-110 shadow-md" : ""}`}
              >
                <Icon className="size-4" />
              </div>
              <span
                className={`mt-2 text-xs font-medium whitespace-nowrap ${
                  isDone ? "text-main font-semibold" : "text-base-content/50"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tracking info badge if shipped */}
      {trackingNumber && (
        <div className="mt-5 p-3 rounded-xl bg-main/5 border border-main/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <LuTruck className="size-4 text-main" />
            <span>
              Carrier: <strong>{carrier || "CJ Courier / Standard"}</strong>
            </span>
          </div>
          <div>
            <span>Tracking Number: </span>
            <span className="font-mono font-semibold text-main select-all bg-base-100 px-2 py-0.5 rounded border border-main/20">
              {trackingNumber}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
