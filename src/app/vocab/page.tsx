'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';
import {
  coffeeVocabItems,
  type CoffeeVocabCategory,
  type CoffeeVocabItem,
  type CoffeeVocabMajorCategory,
} from '@/data/coffeeVocab';

const ALL_TABS = 'すべて';

type VocabTab = {
  id: string;
  label: string;
  category?: CoffeeVocabCategory;
  itemIds?: string[];
};

type MajorCategoryOption = {
  id: CoffeeVocabMajorCategory;
  categories: CoffeeVocabCategory[];
  tabs: VocabTab[];
};

const majorCategoryOptions: MajorCategoryOption[] = [
  {
    id: 'コーヒー用語',
    categories: ['品種', '精製方法', '焙煎度', '味・香り'],
    tabs: [
      { id: ALL_TABS, label: ALL_TABS },
      { id: 'variety', label: '品種', category: '品種' },
      { id: 'process', label: '精製方法', category: '精製方法' },
      { id: 'roast-level', label: '焙煎度', category: '焙煎度' },
      { id: 'flavor', label: '味・香り', category: '味・香り' },
    ],
  },
  {
    id: '焙煎反応',
    categories: ['焙煎反応'],
    tabs: [
      { id: ALL_TABS, label: ALL_TABS },
      { id: 'maillard', label: 'メイラード反応', itemIds: ['maillard-reaction'] },
      { id: 'caramelization', label: 'カラメル化', itemIds: ['caramelization'] },
      { id: 'strecker', label: 'ストレッカー分解', itemIds: ['strecker-degradation'] },
      { id: 'aroma-compounds', label: '香気成分', itemIds: ['volatile-aroma-compounds'] },
    ],
  },
  {
    id: 'アミノ酸',
    categories: ['アミノ酸'],
    tabs: [
      { id: ALL_TABS, label: ALL_TABS },
      { id: 'alanine', label: 'アラニン', itemIds: ['alanine'] },
      { id: 'glutamic-acid', label: 'グルタミン酸', itemIds: ['glutamic-acid'] },
      { id: 'phenylalanine', label: 'フェニルアラニン', itemIds: ['phenylalanine'] },
      { id: 'proline', label: 'プロリン', itemIds: ['proline'] },
      { id: 'leucine', label: 'ロイシン', itemIds: ['leucine'] },
    ],
  },
  {
    id: '品種・栽培',
    categories: ['品種', '生産・栽培'],
    tabs: [
      { id: ALL_TABS, label: ALL_TABS },
      { id: 'variety', label: '品種', category: '品種' },
      { id: 'production', label: '生産・栽培', category: '生産・栽培' },
    ],
  },
];

const detailLabels: Array<{
  key: keyof Pick<
    CoffeeVocabItem,
    | 'family'
    | 'lineage'
    | 'cupProfile'
    | 'roastBehavior'
    | 'processEffect'
    | 'moleculeRelation'
    | 'aminoAcidRelation'
    | 'aminoAcidRole'
    | 'sourceNote'
  >;
  label: string;
}> = [
  { key: 'family', label: '系統' },
  { key: 'lineage', label: '系譜' },
  { key: 'cupProfile', label: 'カップ傾向' },
  { key: 'roastBehavior', label: '焙煎での出方' },
  { key: 'processEffect', label: '精製による影響' },
  { key: 'moleculeRelation', label: 'アミノ酸との関係' },
  { key: 'aminoAcidRelation', label: 'アミノ酸との関係' },
  { key: 'aminoAcidRole', label: 'アミノ酸の役割' },
  { key: 'sourceNote', label: '補足' },
];

const aminoAcidQueryNames: Record<string, string> = {
  アラニン: 'alanine',
  Alanine: 'alanine',
  グルタミン酸: 'glutamic acid',
  'Glutamic acid': 'glutamic acid',
  フェニルアラニン: 'phenylalanine',
  Phenylalanine: 'phenylalanine',
  プロリン: 'proline',
  Proline: 'proline',
  ロイシン: 'leucine',
  Leucine: 'leucine',
};

function stringifyVocabValue(value: CoffeeVocabItem[keyof CoffeeVocabItem]) {
  if (Array.isArray(value)) return value.join(' ');
  return typeof value === 'string' ? value : '';
}

function getSearchableText(item: CoffeeVocabItem) {
  const optionalValues = detailLabels.map(({ key }) => stringifyVocabValue(item[key]));
  return [
    item.termEn,
    item.termJa,
    item.shortDescription,
    item.example,
    ...item.relatedTerms,
    item.queryName,
    item.aminoId,
    item.relatedReaction,
    ...(item.relatedAminoAcids ?? []),
    ...(item.relatedAminoAcids ?? []).map((aminoAcid) => aminoAcidQueryNames[aminoAcid]),
    ...optionalValues,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function getDetailValue(item: CoffeeVocabItem, key: (typeof detailLabels)[number]['key']) {
  const value = item[key];
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return Array.isArray(value) ? value.join(' / ') : value;
}

export default function VocabPage() {
  const [selectedMajorCategory, setSelectedMajorCategory] = useState<CoffeeVocabMajorCategory>('コーヒー用語');
  const [selectedTab, setSelectedTab] = useState(ALL_TABS);
  const [query, setQuery] = useState('');

  const selectedMajorOption = useMemo(
    () => majorCategoryOptions.find((option) => option.id === selectedMajorCategory) ?? majorCategoryOptions[0],
    [selectedMajorCategory],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const activeTab = selectedMajorOption.tabs.find((tab) => tab.id === selectedTab) ?? selectedMajorOption.tabs[0];

    return coffeeVocabItems.filter((item) => {
      const matchesMajorCategory = selectedMajorOption.categories.includes(item.category);
      const matchesTab =
        activeTab.id === ALL_TABS ||
        (activeTab.category ? item.category === activeTab.category : false) ||
        (activeTab.itemIds ? activeTab.itemIds.includes(item.id) : false);

      return matchesMajorCategory && matchesTab && (!normalizedQuery || getSearchableText(item).includes(normalizedQuery));
    });
  }, [query, selectedMajorOption, selectedTab]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070504] px-4 py-4 text-[#f7efe1] sm:px-5 lg:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(245,158,11,0.16),transparent_28%),radial-gradient(circle_at_78%_0%,rgba(120,53,15,0.22),transparent_30%),linear-gradient(135deg,#070504_0%,#10100f_42%,#1a0f08_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <AppHeader current="vocab" />

      <div className="relative mx-auto grid max-w-[1220px] gap-4 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.42)] backdrop-blur">
          <div className="mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Coffee Vocabulary</p>
              <h1 className="mt-2 text-2xl font-semibold text-stone-50">コーヒー単語帳</h1>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
            <label htmlFor="vocab-search" className="mb-1.5 block text-sm text-stone-300">
              単語を検索
            </label>
            <div className="relative">
              <input
                id="vocab-search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="geisha / 発酵 / アミノ酸..."
                className="w-full rounded-xl border border-white/10 bg-[#120d0a] py-2.5 pl-3 pr-12 text-sm text-stone-100 outline-none placeholder:text-stone-600 focus:border-amber-400/50"
              />
              {query.trim().length > 0 && (
                <button
                  type="button"
                  aria-label="検索語をクリア"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 z-10 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-white/[0.08] text-base leading-none text-stone-300 shadow-sm transition hover:border-amber-300/35 hover:bg-amber-400/15 hover:text-amber-100"
                >
                  {'\u00d7'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-black/25 p-3">
            <div className="mb-2 text-sm text-stone-300">学習カテゴリ</div>
            <div className="grid gap-2">
              {majorCategoryOptions.map((category) => {
                const selected = selectedMajorCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setSelectedMajorCategory(category.id);
                      setSelectedTab(ALL_TABS);
                    }}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                      selected
                        ? 'border-amber-300/50 bg-amber-400/15 text-amber-50'
                        : 'border-white/10 bg-black/25 text-stone-300 hover:border-amber-300/30 hover:bg-amber-400/10'
                      }`}
                  >
                    {category.id}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(90,45,12,0.12))] p-3 text-sm text-stone-300">
            表示中: <span className="font-medium text-amber-100">{filteredItems.length}件</span>
          </div>
        </aside>

        <section className="grid min-w-0 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-stone-50">単語カード</h2>
              <span className="text-xs text-amber-200/75">{selectedMajorCategory}</span>
            </div>

            <div className="mb-4 overflow-x-auto pb-1">
              <div className="flex w-max min-w-full gap-2">
                {selectedMajorOption.tabs.map((tab) => {
                  const selected = selectedTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedTab(tab.id)}
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        selected
                          ? 'border-amber-200/55 bg-amber-400/20 text-amber-50'
                          : 'border-white/10 bg-black/30 text-stone-300 hover:border-amber-300/35 hover:bg-amber-400/10 hover:text-amber-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid min-w-0 gap-3 md:grid-cols-2">
                {filteredItems.map((item) => {
                  const details = detailLabels
                    .map(({ key, label }) => ({ key, label, value: getDetailValue(item, key) }))
                    .filter((detail) => detail.value);

                  return (
                    <article key={item.id} className="min-w-0 rounded-xl border border-white/10 bg-[#0d0a08]/80 p-4">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-xs text-stone-500">{item.category}</div>
                          <h3 className="mt-1 break-words text-lg font-semibold text-stone-50">{item.termEn}</h3>
                          <p className="mt-1 text-sm font-medium text-amber-100">{item.termJa}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-6 text-stone-300">{item.shortDescription}</p>
                      {(item.relatedAminoAcids?.length || item.relatedReaction) && (
                        <div className="mt-3 grid gap-2 rounded-lg border border-amber-300/15 bg-amber-400/[0.055] p-3">
                          {item.relatedAminoAcids && item.relatedAminoAcids.length > 0 && (
                            <div>
                              <div className="text-[11px] font-medium text-amber-200/75">関連アミノ酸</div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {item.relatedAminoAcids.map((aminoAcid) => {
                                  const queryName = aminoAcidQueryNames[aminoAcid] ?? aminoAcid;
                                  return (
                                    <Link
                                      key={aminoAcid}
                                      href={`/amino?name=${encodeURIComponent(queryName)}`}
                                      className="rounded-full border border-amber-300/30 bg-black/25 px-2.5 py-1 text-xs text-amber-100 transition hover:border-amber-200/55 hover:bg-amber-300/15"
                                    >
                                      {aminoAcid}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {item.relatedReaction && (
                            <div>
                              <div className="text-[11px] font-medium text-amber-200/75">関連反応</div>
                              <p className="mt-1 text-xs leading-5 text-stone-300">{item.relatedReaction}</p>
                            </div>
                          )}
                        </div>
                      )}
                      {details.length > 0 && (
                        <div className="mt-3 grid gap-2">
                          {details.map((detail) => (
                            <div key={detail.key} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                              <div className="text-[11px] font-medium text-amber-200/75">{detail.label}</div>
                              <div className="mt-1 text-xs leading-5 text-stone-300">{detail.value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {item.example && (
                        <p className="mt-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs leading-5 text-stone-400">
                          {item.example}
                        </p>
                      )}
                      {item.category === 'アミノ酸' && item.queryName && (
                        <Link
                          href={`/amino?name=${encodeURIComponent(item.queryName)}`}
                          className="mt-3 inline-flex rounded-full border border-amber-300/25 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-100 transition hover:border-amber-200/50 hover:bg-amber-300/15"
                        >
                          構造を見る
                        </Link>
                      )}
                      {item.relatedTerms.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.relatedTerms.map((term) => (
                            <span key={term} className="rounded-full border border-amber-300/25 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-100">
                              {term}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-white/10 bg-[#0d0a08]/80 p-4 text-sm text-stone-400">該当する単語がありません</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
