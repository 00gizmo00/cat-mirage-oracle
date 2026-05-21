import type { GachaCategory, GachaCategoryId } from "@/lib/gachaData";

type GachaSelectorProps = {
  categories: GachaCategory[];
  disabled: boolean;
  selectedCategory: GachaCategoryId;
  onSelect: (category: GachaCategoryId) => void;
};

export function GachaSelector({ categories, disabled, selectedCategory, onSelect }: GachaSelectorProps) {
  return (
    <section className="px-4">
      <div className="mb-2 flex items-end justify-between">
        <h2 className="text-xs font-bold tracking-[0.24em] text-violet-100/70">GACHA CATEGORY</h2>
        <span className="text-[10px] text-white/40">5神託</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {categories.map((category) => {
          const selected = category.id === selectedCategory;

          return (
            <button
              className={`relative min-h-[78px] overflow-hidden rounded-2xl border px-1.5 py-2 transition ${
                selected
                  ? "border-white/55 bg-white/[0.13] shadow-[0_0_26px_rgba(168,85,247,0.38)]"
                  : "border-white/10 bg-white/[0.055] active:scale-95"
              } ${disabled ? "cursor-not-allowed opacity-55" : ""}`}
              disabled={disabled}
              key={category.id}
              onClick={() => onSelect(category.id)}
              type="button"
            >
              <span className={`mx-auto grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br ${category.tone} text-xs font-black text-black shadow-[0_0_16px_rgba(255,255,255,0.18)]`}>
                {category.shortName.slice(0, 1)}
              </span>
              <span className="mt-1 block text-[10px] font-bold leading-tight text-white">{category.shortName}</span>
              <span className="mt-0.5 block text-[8px] leading-tight text-white/45">{category.name.replace("ガチャ", "")}</span>
              {selected ? <span className="absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-fuchsia-200" /> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
