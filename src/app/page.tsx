'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CoffeeAnalysisPanel } from '@/components/CoffeeAnalysisPanel';
import { CoffeeControlPanel } from '@/components/CoffeeControlPanel';
import { fetchLoffeeBeans } from '@/lib/loffee';
import { isVarietyLikeSearchQuery, normalizeCoffeeSearchQuery } from '@/lib/coffeeSearch';
import { calculateRoastReaction } from '@/lib/roast';
import type { CoffeeBeanApiItem } from '@/types/coffee';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CoffeeBeanApiItem[]>([]);
  const [selectedBean, setSelectedBean] = useState<CoffeeBeanApiItem | null>(null);
  const [showBeanDetail, setShowBeanDetail] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roastLevel, setRoastLevel] = useState(35);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const nextSearchAllowedAtRef = useRef(0);

  const searchDisabled = loading || cooldownRemaining > 0;

  const loadBeans = useCallback(async () => {
    if (loading || Date.now() < nextSearchAllowedAtRef.current) return;

    const nextSearchAllowedAt = Date.now() + 3000;
    nextSearchAllowedAtRef.current = nextSearchAllowedAt;
    setCooldownUntil(nextSearchAllowedAt);
    setCooldownRemaining(3);
    setShowResults(true);
    setLoading(true);
    setError(null);

    try {
      const normalizedQuery = normalizeCoffeeSearchQuery(searchQuery);
      let beans = await fetchLoffeeBeans({ search: normalizedQuery, limit: 50 });

      if (beans.length === 0 && isVarietyLikeSearchQuery(searchQuery)) {
        beans = await fetchLoffeeBeans({ variety: normalizedQuery, limit: 50 });
      }

      setSearchResults(beans);
      setSelectedBean(beans[0] ?? null);
      setShowBeanDetail(true);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Failed to fetch coffee beans.';
      setSearchResults([]);
      setSelectedBean(null);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [loading, searchQuery]);

  useEffect(() => {
    if (cooldownUntil <= Date.now()) {
      setCooldownRemaining(0);
      return;
    }

    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCooldownRemaining(remaining);

      if (remaining === 0) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => window.clearInterval(timer);
  }, [cooldownUntil]);

  const selectBean = useCallback((bean: CoffeeBeanApiItem) => {
    setSelectedBean(bean);
    setShowBeanDetail(true);
  }, []);

  const reaction = useMemo(() => calculateRoastReaction(roastLevel, selectedBean), [roastLevel, selectedBean]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070504] px-4 py-4 text-[#f7efe1] sm:px-5 lg:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(245,158,11,0.16),transparent_28%),radial-gradient(circle_at_78%_0%,rgba(120,53,15,0.22),transparent_30%),linear-gradient(135deg,#070504_0%,#10100f_42%,#1a0f08_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative mx-auto grid max-w-[1220px] gap-4 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
        <CoffeeControlPanel
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          onSearch={() => {
            void loadBeans();
          }}
          searchDisabled={searchDisabled}
          cooldownRemaining={cooldownRemaining}
          showResults={showResults}
          onCloseResults={() => setShowResults(false)}
          searchResults={searchResults}
          selectedBean={selectedBean}
          onSelectBean={selectBean}
          loading={loading}
          error={error}
          roastLevel={roastLevel}
          onChangeRoastLevel={setRoastLevel}
        />
        <CoffeeAnalysisPanel
          bean={selectedBean}
          showBeanDetail={showBeanDetail}
          roastLevel={roastLevel}
          reaction={reaction}
          onCloseBeanDetail={() => setShowBeanDetail(false)}
          onShowBeanDetail={() => setShowBeanDetail(true)}
        />
      </div>
    </main>
  );
}
