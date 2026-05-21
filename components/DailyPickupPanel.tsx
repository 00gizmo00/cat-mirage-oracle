import type { GachaCategory } from "@/lib/gachaData";

type DailyPickupPanelProps = {
  category: GachaCategory;
  disabled: boolean;
  isSelected: boolean;
  onSelect: () => void;
};

export function DailyPickupPanel({ category, disabled, isSelected, onSelect }: DailyPickupPanelProps) {
  return (
    <section className="px-4">
      <div className="relative overflow-hidden rounded-3xl border border-amber-100/18 bg-amber-100/[0.07] p-3">
        <div className={`absolute -right-10 -top-12 h-28 w-28 rounded-full bg-gradient-to-br ${category.tone} opacity-25 blur-2xl`} />
        <div className="relative flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black tracking-[0.28em] text-amber-100/65">TODAY&apos;S PICKUP</p>
            <h2 className="mt-1 truncate text-base font-black text-white">{category.name}</h2>
            <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-white/50">{category.description}</p>
          </div>
          <button
            className={`shrink-0 rounded-2xl border px-3 py-2 text-[11px] font-black active:scale-95 disabled:opacity-50 ${
              isSelected
                ? "border-fuchsia-100/35 bg-fuchsia-200/14 text-fuchsia-50"
                : "border-amber-100/35 bg-amber-200/14 text-amber-50"
            }`}
            disabled={disabled}
            onClick={onSelect}
            type="button"
          >
            {isSelected ? "選択中" : "切替"}
          </button>
        </div>
      </div>
    </section>
  );
}
