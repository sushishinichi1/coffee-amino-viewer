import { roastLabel } from '@/lib/roast';
import type { CoffeeSample } from '@/types/coffee';

type CoffeeControlPanelProps = {
  samples: CoffeeSample[];
  selectedSample: CoffeeSample;
  selectedSampleId: string;
  onSelectSample: (sampleId: string) => void;
  roastLevel: number;
  onChangeRoastLevel: (roastLevel: number) => void;
};

const roastPresets = [
  { label: '浅煎り', value: 30 },
  { label: '中煎り', value: 60 },
  { label: '深煎り', value: 85 },
];

export function CoffeeControlPanel({
  samples,
  selectedSample,
  selectedSampleId,
  onSelectSample,
  roastLevel,
  onChangeRoastLevel,
}: CoffeeControlPanelProps) {
  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.42)] backdrop-blur">
      <div className="grid gap-3">
        <label className="block">
          <span className="mb-1.5 block text-sm text-stone-300">コーヒーサンプル</span>
          <select
            value={selectedSampleId}
            onChange={(event) => onSelectSample(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#120d0a] px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-amber-400/50"
          >
            {samples.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.name}
              </option>
            ))}
          </select>
        </label>

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
          <h2 className="mb-3 text-lg font-semibold text-stone-50">コーヒーサンプル</h2>
          <div className="grid gap-2 text-sm text-stone-300">
            {[
              ['産地', selectedSample.origin],
              ['焙煎', selectedSample.roast],
              ['精製方法', selectedSample.processing],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/25 px-3 py-2">
                <span className="text-stone-400">{label}</span>
                <span className="font-medium text-stone-100">{value}</span>
              </div>
            ))}
            <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2">
              <div className="mb-2 text-stone-400">味のキーワード</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedSample.flavorKeywords.map((keyword) => (
                  <span key={keyword} className="rounded-full border border-amber-300/25 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-100">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
