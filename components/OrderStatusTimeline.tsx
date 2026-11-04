import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/lib/company";

export function OrderStatusTimeline({
  current,
  events,
}: {
  current: OrderStatus;
  events?: { status: string; at: string }[];
}) {
  const steps = ORDER_STATUSES.filter((status) => status !== "CANCELLED");
  const currentIndex = current === "CANCELLED" ? -1 : steps.indexOf(current);
  return (
    <ol className="space-y-3">
      {current === "CANCELLED" ? <li className="rounded-xl bg-[#f8ece4] px-4 py-3 font-semibold">Cancelled</li> : null}
      {steps.map((status, index) => {
        const reached = current !== "CANCELLED" && index <= currentIndex;
        const event = events?.find((item) => item.status === status);
        return (
          <li key={status} className="flex gap-3">
            <span className={`mt-1 h-4 w-4 shrink-0 rounded-full ${reached ? "bg-forest" : "bg-sand"}`} />
            <span>
              <span className={`block text-base font-semibold ${reached ? "text-forest" : "text-muted"}`}>{STATUS_LABELS[status]}</span>
              {event?.at ? <span className="text-sm text-muted">{event.at}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
