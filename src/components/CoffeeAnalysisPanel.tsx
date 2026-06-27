import { flavorOutput } from '@/lib/roast';
import type { AminoAcidLevel, CoffeeSample, RoastReaction } from '@/types/coffee';

type CoffeeAnalysisPanelProps = {
  sample: CoffeeSample;
  roastLevel: number;
  reaction: RoastReaction;
};

const aminoAcidLevelLabel: Record<AminoAcidLevel, string> = {
  low: '少ない',
  medium: '中程度',
  high: '多い',
};

const aminoAcidLevelStyle: Record<AminoAcidLevel, string> = {
  low: 'border-stone-500/40 bg-stone-500/15 text-stone-200',
  medium: 'border-amber-300/35 bg-amber-400/15 text-amber-100',
  high: 'border-orange-300/40 bg-orange-500/20 text-orange-100',
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
  '浅煎りでは酸味や産地由来の香りが残りやすくなります。',
  '深煎りでは苦味、コク、ロースト香が増え、酸味は下がります。',
];

export function CoffeeAnalysisPanel({ sample, roastLevel, reaction }: CoffeeAnalysisPanelProps) {
  return (
    <section className="grid min-w-0 gap-4">
      <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-stone-50">アミノ酸プロファイル</h2>
          <span className="text-xs text-amber-200/75">分子カード表示</span>
        </div>
        <div className="grid min-w-0 gap-2.5 md:grid-cols-2">
          {sample.aminoAcids.map((aminoAcid) => (
            <article key={aminoAcid.name} className="min-w-0 rounded-xl border border-white/10 bg-[#0d0a08]/80 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-stone-100">{aminoAcid.name}</h3>
                  <p className="mt-0.5 text-xs leading-5 text-stone-400">{aminoAcid.role}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${aminoAcidLevelStyle[aminoAcid.level]}`}>
                  {aminoAcidLevelLabel[aminoAcid.level]}
                </span>
              </div>
              <p className="text-xs leading-5 text-stone-300">味の手がかり: {aminoAcid.flavorHint}</p>
            </article>
          ))}
        </div>
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
