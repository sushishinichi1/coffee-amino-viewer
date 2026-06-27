import { flavorOutput } from '@/lib/roast';
import type { CoffeeBeanApiItem, RoastReaction } from '@/types/coffee';

type CoffeeAnalysisPanelProps = {
  bean: CoffeeBeanApiItem | null;
  roastLevel: number;
  reaction: RoastReaction;
};

const reactionLabels: Record<keyof RoastReaction, string> = {
  aminoAcidsRemaining: '残存アミノ酸',
  maillardProducts: 'メイラード生成物',
  acidity: '酸味',
  bitterness: '苦味',
  aromaIntensity: '香りの強さ',
  body: 'コク・厚み',
};

const reactionFlow = ['アミノ酸 + 糖', '熱', 'メイラード反応', '香り / 苦味 / コク'];

const moleculeNotes = [
  'アミノ酸と糖は、熱によってメイラード反応を起こします。',
  'Loffee API の degree は補助情報として扱い、焙煎度スライダーの値で反応を計算します。',
  'API データが欠けていても、焙煎反応ビューは現在の焙煎度で動作します。',
];

const displayValue = (value: string | number | null) => {
  if (value === null || value === '') return 'No data';
  return String(value);
};

const elevationValue = (bean: CoffeeBeanApiItem | null) => {
  if (!bean) return 'No data';
  if (bean.elevation) return bean.elevation;
  if (bean.minElev !== null && bean.maxElev !== null) return `${bean.minElev} - ${bean.maxElev} m`;
  if (bean.minElev !== null) return `${bean.minElev} m`;
  if (bean.maxElev !== null) return `${bean.maxElev} m`;
  return 'No data';
};

export function CoffeeAnalysisPanel({ bean, roastLevel, reaction }: CoffeeAnalysisPanelProps) {
  const beanDetails = [
    ['Roaster', bean?.roaster ?? null],
    ['Name', bean?.name ?? null],
    ['Origin', bean?.origin ?? null],
    ['Region', bean?.region ?? null],
    ['Producer', bean?.producer ?? null],
    ['Variety', bean?.variety ?? null],
    ['Process', bean?.process ?? null],
    ['Degree', bean?.degree ?? null],
    ['Elevation', elevationValue(bean)],
  ];

  return (
    <section className="grid min-w-0 gap-4">
      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-stone-50">選択中の豆データ</h2>
          <span className="text-xs text-amber-200/75">Loffee Labs Bean Base</span>
        </div>
        {bean ? (
          <div className="grid min-w-0 gap-2.5 md:grid-cols-2">
            {beanDetails.map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-xl border border-white/10 bg-[#0d0a08]/80 p-3">
                <div className="text-xs text-stone-500">{label}</div>
                <div className="mt-1 truncate text-sm font-medium text-stone-100">{displayValue(value)}</div>
              </div>
            ))}
            <div className="min-w-0 rounded-xl border border-white/10 bg-[#0d0a08]/80 p-3 md:col-span-2">
              <div className="mb-2 text-xs text-stone-500">Tasting</div>
              <div className="flex flex-wrap gap-1.5">
                {(bean.tasting.length > 0 ? bean.tasting : ['No data']).map((note) => (
                  <span key={note} className="rounded-full border border-amber-300/25 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-100">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-xl border border-white/10 bg-[#0d0a08]/80 p-3 text-sm text-stone-400">no selected bean</p>
        )}
      </div>

      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
        <h2 className="mb-3 text-xl font-semibold text-stone-50">焙煎反応ビュー</h2>
        <div className="grid min-w-0 gap-2.5 md:grid-cols-2">
          {Object.entries(reactionLabels).map(([key, label]) => {
            const value = reaction[key as keyof RoastReaction];
            return (
              <div key={key}>
                <div className="mb-1 flex items-center justify-between text-xs text-stone-300">
                  <span>{label}</span>
                  <span className="text-amber-100/80">{value}/100</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full border border-white/10 bg-black/45">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-500 to-[#8b4a1b]"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
          <h2 className="mb-3 text-xl font-semibold text-stone-50">反応の流れ</h2>
          <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm leading-6 text-stone-300">
            <div className="flex flex-wrap items-center gap-2">
              {reactionFlow.map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1 text-amber-100">
                    {item}
                  </span>
                  {index < 3 && <span className="text-orange-300/80">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
          <h2 className="mb-3 text-xl font-semibold text-stone-50">味の出力</h2>
          <p className="text-sm leading-6 text-stone-300">{flavorOutput(roastLevel)}</p>
          <p className="mt-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs leading-5 text-stone-400">
            API degree: <span className="text-amber-100/80">{displayValue(bean?.degree ?? null)}</span>
          </p>
        </div>
      </div>

      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
        <h2 className="mb-3 text-xl font-semibold text-stone-50">分子メモ</h2>
        <div className="grid min-w-0 gap-2.5 md:grid-cols-3">
          {moleculeNotes.map((note) => (
            <div key={note} className="rounded-xl border border-white/10 bg-[#0d0a08]/80 p-3 text-xs leading-6 text-stone-300">
              {note}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
