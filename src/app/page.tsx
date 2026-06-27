'use client';

import { useMemo, useState } from 'react';

type AminoAcidLevel = 'low' | 'medium' | 'high';

type AminoAcid = {
  name: string;
  role: string;
  level: AminoAcidLevel;
  flavorHint: string;
};

type CoffeeSample = {
  id: string;
  name: string;
  origin: string;
  roast: string;
  processing: string;
  flavorKeywords: string[];
  aminoAcids: AminoAcid[];
};

const coffeeSamples: CoffeeSample[] = [
  {
    id: 'ethiopia-light',
    name: 'エチオピア浅煎り',
    origin: 'エチオピア',
    roast: '浅煎り',
    processing: 'ウォッシュト',
    flavorKeywords: ['花のような香り', '柑橘感', '紅茶のような軽さ', '明るい酸味'],
    aminoAcids: [
      { name: 'アラニン', role: '甘さと丸みの前駆体', level: 'medium', flavorHint: 'やわらかな甘さ' },
      { name: 'グルタミン酸', role: '旨味とコクに関係', level: 'medium', flavorHint: '奥行き' },
      { name: 'フェニルアラニン', role: '香気成分の前駆体', level: 'high', flavorHint: '花のような香り' },
      { name: 'プロリン', role: 'メイラード反応に寄与', level: 'medium', flavorHint: '焙煎由来の甘さ' },
    ],
  },
  {
    id: 'mandheling-dark',
    name: 'マンデリン深煎り',
    origin: 'インドネシア / スマトラ',
    roast: '深煎り',
    processing: 'スマトラ式',
    flavorKeywords: ['土っぽさ', '重いコク', 'ビターチョコ', '酸味控えめ'],
    aminoAcids: [
      { name: 'アラニン', role: '甘さと丸みの前駆体', level: 'low', flavorHint: '控えめな甘さ' },
      { name: 'グルタミン酸', role: '旨味とコクに関係', level: 'high', flavorHint: '重いコク' },
      { name: 'ロイシン', role: 'ロースト香の前駆体', level: 'medium', flavorHint: '焙煎香' },
      { name: 'プロリン', role: 'メイラード反応に寄与', level: 'high', flavorHint: '深い甘さ' },
    ],
  },
  {
    id: 'brazil-medium',
    name: 'ブラジル中煎り',
    origin: 'ブラジル',
    roast: '中煎り',
    processing: 'ナチュラル',
    flavorKeywords: ['ナッツ感', 'チョコ感', 'カラメル感', 'バランス型'],
    aminoAcids: [
      { name: 'アラニン', role: '甘さと丸みの前駆体', level: 'high', flavorHint: 'カラメルのような甘さ' },
      { name: 'グルタミン酸', role: '旨味とコクに関係', level: 'medium', flavorHint: 'なめらかな厚み' },
      { name: 'フェニルアラニン', role: '香気成分の前駆体', level: 'medium', flavorHint: '蜂蜜のような香り' },
      { name: 'プロリン', role: 'メイラード反応に寄与', level: 'high', flavorHint: 'ナッツのような焙煎感' },
    ],
  },
];

const roastLabel = (value: number) => {
  if (value < 30) return '生豆に近い';
  if (value < 60) return '浅煎り';
  if (value < 85) return '中煎り';
  return '深煎り';
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

const reactionLabels = {
  aminoAcidsRemaining: '残存アミノ酸',
  maillardProducts: 'メイラード生成物',
  acidity: '酸味',
  bitterness: '苦味',
  aromaIntensity: '香りの強さ',
  body: 'コク・厚み',
};

const flavorOutput = (roastLevel: number) => {
  if (roastLevel < 35) {
    return '浅い焙煎では、酸味や産地由来の香りが残りやすく、アミノ酸や糖の反応はまだ控えめです。明るい酸味、花のような香り、軽い質感が出やすくなります。';
  }

  if (roastLevel < 70) {
    return '中程度の焙煎では、酸味と甘さ、香ばしさのバランスが取れます。アミノ酸と糖の反応が進み、ナッツ感、カラメル感、丸みのあるコクが出やすくなります。';
  }

  return '深い焙煎では、アミノ酸や糖の反応が大きく進み、メイラード生成物や苦味、重いコクが強くなります。酸味は下がり、ビターチョコ、スモーキー、ロースト感が前面に出ます。';
};

export default function HomePage() {
  const [selectedSampleId, setSelectedSampleId] = useState(coffeeSamples[0].id);
  const [roastLevel, setRoastLevel] = useState(35);

  const selectedSample = useMemo(
    () => coffeeSamples.find((sample) => sample.id === selectedSampleId) ?? coffeeSamples[0],
    [selectedSampleId],
  );

  const reaction = useMemo(() => {
    const aminoAcidsRemaining = 100 - roastLevel * 0.65;
    const maillardProducts = roastLevel;
    const acidity = 100 - roastLevel * 0.75;
    const bitterness = roastLevel * 0.9;
    const aromaIntensity = Math.min(100, 30 + roastLevel * 0.75);
    const body = Math.min(100, 40 + roastLevel * 0.5);

    return {
      aminoAcidsRemaining: Math.round(aminoAcidsRemaining),
      maillardProducts: Math.round(maillardProducts),
      acidity: Math.round(acidity),
      bitterness: Math.round(bitterness),
      aromaIntensity: Math.round(aromaIntensity),
      body: Math.round(body),
    };
  }, [roastLevel]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070504] px-4 py-4 text-[#f7efe1] sm:px-5 lg:px-7">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(245,158,11,0.16),transparent_28%),radial-gradient(circle_at_78%_0%,rgba(120,53,15,0.22),transparent_30%),linear-gradient(135deg,#070504_0%,#10100f_42%,#1a0f08_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative mx-auto grid max-w-7xl gap-4 xl:grid-cols-[0.88fr_1.12fr]">
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.42)] backdrop-blur">
          <div className="mb-4 border-b border-white/10 pb-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-300">
              Coffee × Amino Acid × Maillard Reaction
            </p>
            <h1 className="text-3xl font-semibold text-stone-50 lg:text-4xl">コーヒー・アミノ酸ビューア</h1>
            <p className="mt-2 text-base text-amber-100/85">コーヒーを「味」ではなく、分子として見る。</p>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              コーヒー豆に含まれるアミノ酸や糖は、焙煎によってメイラード反応を起こし、香ばしさ・苦味・コク・褐色の色合いへと変化していきます。このページでは、コーヒーを味覚ではなく、分子の変化として簡易的に可視化します。
            </p>
          </div>

          <div className="grid gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm text-stone-300">コーヒーサンプル</span>
              <select
                value={selectedSampleId}
                onChange={(event) => setSelectedSampleId(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#120d0a] px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-amber-400/50"
              >
                {coffeeSamples.map((sample) => (
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
                onChange={(event) => setRoastLevel(Number(event.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-stone-500">
                <span>0 生豆</span>
                <span>30 浅煎り</span>
                <span>60 中煎り</span>
                <span>85 深煎り</span>
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

        <section className="grid gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-stone-50">アミノ酸プロファイル</h2>
              <span className="text-xs text-amber-200/75">分子カード表示</span>
            </div>
            <div className="grid gap-2.5 md:grid-cols-2">
              {selectedSample.aminoAcids.map((aminoAcid) => (
                <article key={aminoAcid.name} className="rounded-xl border border-white/10 bg-[#0d0a08]/80 p-3">
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

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
            <h2 className="mb-3 text-xl font-semibold text-stone-50">焙煎反応ビュー</h2>
            <div className="grid gap-2.5 md:grid-cols-2">
              {Object.entries(reactionLabels).map(([key, label]) => {
                const value = reaction[key as keyof typeof reaction];
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

          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
              <h2 className="mb-3 text-xl font-semibold text-stone-50">反応の流れ</h2>
              <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm leading-6 text-stone-300">
                <div className="flex flex-wrap items-center gap-2">
                  {['アミノ酸 + 糖', '熱', 'メイラード反応', '香り / 苦味 / コク'].map((item, index) => (
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

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
              <h2 className="mb-3 text-xl font-semibold text-stone-50">味の出力</h2>
              <p className="text-sm leading-6 text-stone-300">{flavorOutput(roastLevel)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
            <h2 className="mb-3 text-xl font-semibold text-stone-50">分子メモ</h2>
            <div className="grid gap-2.5 md:grid-cols-3">
              {[
                'アミノ酸と糖は、熱によってメイラード反応を起こします。',
                '浅煎りでは酸味や産地由来の香りが残りやすくなります。',
                '深煎りでは苦味、コク、ロースト香が増え、酸味は下がります。',
              ].map((note) => (
                <div key={note} className="rounded-xl border border-white/10 bg-[#0d0a08]/80 p-3 text-xs leading-6 text-stone-300">
                  {note}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
