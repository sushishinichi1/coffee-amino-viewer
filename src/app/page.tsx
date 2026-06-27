'use client';

import { useMemo, useState } from 'react';
import { CoffeeAnalysisPanel } from '@/components/CoffeeAnalysisPanel';
import { CoffeeControlPanel } from '@/components/CoffeeControlPanel';
import { coffeeSamples } from '@/data/coffeeSamples';
import { calculateRoastReaction } from '@/lib/roast';

export default function HomePage() {
  const [selectedSampleId, setSelectedSampleId] = useState(coffeeSamples[0].id);
  const [roastLevel, setRoastLevel] = useState(35);

  const selectedSample = useMemo(
    () => coffeeSamples.find((sample) => sample.id === selectedSampleId) ?? coffeeSamples[0],
    [selectedSampleId],
  );

  const reaction = useMemo(() => calculateRoastReaction(roastLevel), [roastLevel]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070504] px-4 py-4 text-[#f7efe1] sm:px-5 lg:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(245,158,11,0.16),transparent_28%),radial-gradient(circle_at_78%_0%,rgba(120,53,15,0.22),transparent_30%),linear-gradient(135deg,#070504_0%,#10100f_42%,#1a0f08_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative mx-auto grid max-w-[1180px] gap-4 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
        <CoffeeControlPanel
          samples={coffeeSamples}
          selectedSample={selectedSample}
          selectedSampleId={selectedSampleId}
          onSelectSample={setSelectedSampleId}
          roastLevel={roastLevel}
          onChangeRoastLevel={setRoastLevel}
        />
        <CoffeeAnalysisPanel sample={selectedSample} roastLevel={roastLevel} reaction={reaction} />
      </div>
    </main>
  );
}
