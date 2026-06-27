'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CoffeeAnalysisPanel } from '@/components/CoffeeAnalysisPanel';
import { CoffeeControlPanel } from '@/components/CoffeeControlPanel';
import { fetchLoffeeBeans } from '@/lib/loffee';
import { calculateRoastReaction } from '@/lib/roast';
import type { CoffeeBeanApiItem } from '@/types/coffee';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('coffee');
  const [searchResults, setSearchResults] = useState<CoffeeBeanApiItem[]>([]);
  const [selectedBean, setSelectedBean] = useState<CoffeeBeanApiItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roastLevel, setRoastLevel] = useState(35);

  const loadBeans = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const beans = await fetchLoffeeBeans({ search: query || 'coffee', limit: 20 });
      setSearchResults(beans);
      setSelectedBean(beans[0] ?? null);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Failed to fetch coffee beans.';
      setSearchResults([]);
      setSelectedBean(null);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBeans('coffee');
  }, [loadBeans]);

  const reaction = useMemo(() => calculateRoastReaction(roastLevel), [roastLevel]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070504] px-4 py-4 text-[#f7efe1] sm:px-5 lg:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(245,158,11,0.16),transparent_28%),radial-gradient(circle_at_78%_0%,rgba(120,53,15,0.22),transparent_30%),linear-gradient(135deg,#070504_0%,#10100f_42%,#1a0f08_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative mx-auto grid max-w-[1180px] gap-4 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
        <CoffeeControlPanel
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          onSearch={() => {
            void loadBeans(searchQuery);
          }}
          searchResults={searchResults}
          selectedBean={selectedBean}
          onSelectBean={setSelectedBean}
          loading={loading}
          error={error}
          roastLevel={roastLevel}
          onChangeRoastLevel={setRoastLevel}
        />
        <CoffeeAnalysisPanel bean={selectedBean} roastLevel={roastLevel} reaction={reaction} />
      </div>
    </main>
  );
}
