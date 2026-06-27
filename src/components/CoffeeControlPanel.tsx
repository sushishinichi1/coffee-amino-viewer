import { roastLabel } from '@/lib/roast';
import type { CoffeeBeanApiItem } from '@/types/coffee';

type CoffeeControlPanelProps = {
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  onSearch: () => void;
  searchResults: CoffeeBeanApiItem[];
  selectedBean: CoffeeBeanApiItem | null;
  onSelectBean: (bean: CoffeeBeanApiItem) => void;
  loading: boolean;
  error: string | null;
  roastLevel: number;
  onChangeRoastLevel: (roastLevel: number) => void;
};

const roastPresets = [
  { label: '浅煎り', value: 30 },
  { label: '中煎り', value: 60 },
  { label: '深煎り', value: 85 },
];

const displayValue = (value: string | null) => value ?? 'No data';

export function CoffeeControlPanel({
  searchQuery,
  onChangeSearchQuery,
  onSearch,
  searchResults,
  selectedBean,
  onSelectBean,
  loading,
  error,
  roastLevel,
  onChangeRoastLevel,
}: CoffeeControlPanelProps) {
  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.42)] backdrop-blur">
      <div className="grid gap-3">
        <div className="rounded-xl border border-white/10 bg-black/25 p-3">
          <label className="block">
            <span className="mb-1.5 block text-sm text-stone-300">豆を検索</span>
            <div className="flex gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => onChangeSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') onSearch();
                }}
                placeholder="origin, roaster, variety..."
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#120d0a] px-3 py-2.5 text-sm text-stone-100 outline-none placeholder:text-stone-600 focus:border-amber-400/50"
              />
              <button
                type="button"
                onClick={onSearch}
                disabled={loading}
                className="shrink-0 rounded-xl border border-amber-300/25 bg-amber-400/10 px-3 py-2 text-sm font-medium text-amber-100 transition hover:border-amber-200/50 hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Search
              </button>
            </div>
          </label>

          <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-2">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-stone-400">検索結果</span>
              <span className="text-amber-100/70">{loading ? 'loading...' : `${searchResults.length} beans`}</span>
            </div>

            {error && <p className="rounded-lg border border-red-300/20 bg-red-500/10 px-2.5 py-2 text-xs leading-5 text-red-100">{error}</p>}
            {!loading && !error && searchResults.length === 0 && (
              <p className="rounded-lg border border-white/10 bg-black/25 px-2.5 py-2 text-xs leading-5 text-stone-400">no results</p>
            )}
            {loading && <p className="rounded-lg border border-white/10 bg-black/25 px-2.5 py-2 text-xs leading-5 text-stone-400">loading</p>}

            <div className="mt-2 grid max-h-[310px] gap-2 overflow-y-auto pr-1">
              {searchResults.map((bean) => {
                const selected = selectedBean?.id === bean.id;
                return (
                  <button
                    key={bean.id}
                    type="button"
                    onClick={() => onSelectBean(bean)}
                    className={`min-w-0 rounded-lg border px-3 py-2 text-left transition ${
                      selected
                        ? 'border-amber-300/50 bg-amber-400/15 text-amber-50'
                        : 'border-white/10 bg-black/25 text-stone-200 hover:border-amber-300/30 hover:bg-amber-400/10'
                    }`}
                  >
                    <span className="block truncate text-sm font-medium">{bean.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-stone-400">
                      {displayValue(bean.roaster)} / {displayValue(bean.origin)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <label className="block rounded-xl border border-white/10 bg-black/25 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-stone-300">焙煎度</span>
            <span className="text-sm font-medium text-amber-200">
              {roastLevel} / {roastLabel(roastLevel)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={roastLevel}
            onChange={(event) => onChangeRoastLevel(Number(event.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="mt-1.5 flex justify-between text-[11px] text-stone-500">
            <span>0 生豆</span>
            <span>30 浅煎り</span>
            <span>60 中煎り</span>
            <span>85 深煎り</span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {roastPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => onChangeRoastLevel(preset.value)}
                className="rounded-full border border-amber-300/25 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-100 transition hover:border-amber-200/50 hover:bg-amber-300/15"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </label>

        <div className="rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(90,45,12,0.12))] p-3">
          <h2 className="mb-3 text-lg font-semibold text-stone-50">選択中の豆</h2>
          {selectedBean ? (
            <div className="grid gap-2 text-sm text-stone-300">
              {[
                ['Roaster', selectedBean.roaster],
                ['Name', selectedBean.name],
                ['Origin', selectedBean.origin],
                ['Process', selectedBean.process],
                ['API degree', selectedBean.degree],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2">
                  <span className="shrink-0 text-stone-400">{label}</span>
                  <span className="min-w-0 truncate font-medium text-stone-100">{displayValue(value)}</span>
                </div>
              ))}
              <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2">
                <div className="mb-2 text-stone-400">Tasting</div>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedBean.tasting.length > 0 ? selectedBean.tasting : ['No data']).map((keyword) => (
                    <span key={keyword} className="rounded-full border border-amber-300/25 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-100">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-stone-400">no selected bean</p>
          )}
        </div>
      </div>
    </section>
  );
}
