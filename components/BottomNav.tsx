export type BottomNavTab = "summon" | "history" | "missions" | "settings";

type BottomNavProps = {
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
};

const items: { id: BottomNavTab; label: string; mark: string }[] = [
  { id: "summon", label: "召喚", mark: "✦" },
  { id: "history", label: "図鑑", mark: "◇" },
  { id: "missions", label: "任務", mark: "▣" },
  { id: "settings", label: "調整", mark: "☾" },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="grid grid-cols-4 gap-2 border-t border-white/10 bg-black/25 px-4 pb-4 pt-3 backdrop-blur-xl">
      {items.map((item) => {
        const active = item.id === activeTab;

        return (
          <button
            className={`flex flex-col items-center gap-1 rounded-2xl border py-2 text-[10px] font-semibold transition active:scale-95 ${
              active
                ? "border-fuchsia-300/45 bg-fuchsia-300/15 text-fuchsia-50 shadow-[0_0_20px_rgba(217,70,239,0.25)]"
                : "border-white/10 bg-white/[0.04] text-white/50"
            }`}
            key={item.id}
            onClick={() => onTabChange(item.id)}
            type="button"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-sm">{item.mark}</span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
