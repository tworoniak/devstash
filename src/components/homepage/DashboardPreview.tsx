const NAV_ITEMS = [
  { label: 'Snippets', dot: '#3b82f6', active: true },
  { label: 'Prompts', dot: '#f59e0b', active: false },
  { label: 'Commands', dot: '#06b6d4', active: false },
  { label: 'Notes', dot: '#22c55e', active: false },
  { label: 'Links', dot: '#6366f1', active: false },
];

const CARDS = [
  { accent: '#3b82f6', long: true },
  { accent: '#f59e0b', long: false },
  { accent: '#06b6d4', long: true },
  { accent: '#22c55e', long: false },
  { accent: '#ec4899', long: true },
  { accent: '#6366f1', long: false },
];

export default function DashboardPreview() {
  return (
    <div className="flex gap-2 h-[214px]">
      {/* Sidebar */}
      <div className="w-[72px] shrink-0 flex flex-col gap-1.5">
        <div
          className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center mb-1"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-1 text-[0.6rem] px-1 py-0.5 rounded overflow-hidden whitespace-nowrap ${
                item.active ? 'text-white/60' : 'text-white/25'
              }`}
              style={item.active ? { background: 'rgba(59,130,246,0.12)' } : {}}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: item.dot }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div className="flex-1 grid grid-cols-2 grid-rows-3 gap-1 overflow-hidden">
        {CARDS.map((card, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-[5px] border border-white/[0.07]"
            style={{ background: '#111114' }}
          >
            <div className="h-[3px] shrink-0" style={{ background: card.accent }} />
            <div className="p-1.5 flex flex-col gap-1">
              <div
                className="h-[3px] rounded-sm"
                style={{ width: card.long ? '90%' : '70%', background: 'rgba(255,255,255,0.12)' }}
              />
              <div
                className="h-[3px] rounded-sm"
                style={{ width: '45%', background: 'rgba(255,255,255,0.12)' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
