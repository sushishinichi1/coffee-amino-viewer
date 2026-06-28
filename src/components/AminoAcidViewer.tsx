'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { aminoAcids, findAminoAcidByName } from '@/data/aminoAcids';
import type { AminoAcidApiItem, AminoAcidLocalInfo, AminoAcidResponse } from '@/types/amino';

type AminoAcidViewerProps = {
  initialAminoId: string;
};

const NO_DATA_LABEL = 'データなし';

const displayValue = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') return NO_DATA_LABEL;
  return String(value);
};

const detailRows: Array<{ label: string; key: keyof AminoAcidApiItem }> = [
  { label: 'CID', key: 'cid' },
  { label: '分子式', key: 'molecularFormula' },
  { label: '分子量', key: 'molecularWeight' },
  { label: 'Canonical SMILES', key: 'canonicalSmiles' },
  { label: 'Isomeric SMILES', key: 'isomericSmiles' },
  { label: 'InChIKey', key: 'inchiKey' },
  { label: 'IUPAC Name', key: 'iupacName' },
];

export function AminoAcidViewer({ initialAminoId }: AminoAcidViewerProps) {
  const initialAmino = useMemo(() => findAminoAcidByName(initialAminoId) ?? aminoAcids[0], [initialAminoId]);
  const [selectedAmino, setSelectedAmino] = useState<AminoAcidLocalInfo>(initialAmino);
  const [apiItem, setApiItem] = useState<AminoAcidApiItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadAminoAcid() {
      setLoading(true);
      setError(null);
      setApiItem(null);

      try {
        const response = await fetch(`/api/amino-acids?name=${encodeURIComponent(selectedAmino.queryName)}`, {
          cache: 'no-store',
        });
        const payload = (await response.json()) as AminoAcidResponse;

        if (!response.ok || payload.error) {
          throw new Error(payload.error ?? `Failed with status ${response.status}`);
        }

        if (!ignore) setApiItem(payload.item);
      } catch (fetchError) {
        if (!ignore) {
          setError(fetchError instanceof Error ? fetchError.message : 'PubChem データの取得に失敗しました。');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void loadAminoAcid();

    return () => {
      ignore = true;
    };
  }, [selectedAmino]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#070504] px-4 py-4 text-[#f7efe1] sm:px-5 lg:px-6">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(245,158,11,0.16),transparent_28%),radial-gradient(circle_at_78%_0%,rgba(120,53,15,0.22),transparent_30%),linear-gradient(135deg,#070504_0%,#10100f_42%,#1a0f08_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />

      <AppHeader current="amino" />

      <div className="relative mx-auto grid max-w-[1220px] gap-4 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_70px_rgba(0,0,0,0.42)] backdrop-blur">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Amino Acid</p>
            <h1 className="mt-2 text-2xl font-semibold text-stone-50">アミノ酸構造</h1>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/25 p-3">
            <div className="mb-2 text-sm text-stone-300">アミノ酸選択</div>
            <div className="grid gap-2">
              {aminoAcids.map((amino) => {
                const selected = selectedAmino.id === amino.id;
                return (
                  <button
                    key={amino.id}
                    type="button"
                    onClick={() => setSelectedAmino(amino)}
                    className={`rounded-lg border px-3 py-2 text-left transition ${
                      selected
                        ? 'border-amber-300/50 bg-amber-400/15 text-amber-50'
                        : 'border-white/10 bg-black/25 text-stone-300 hover:border-amber-300/30 hover:bg-amber-400/10'
                    }`}
                  >
                    <span className="block text-sm font-medium">{amino.nameJa}</span>
                    <span className="mt-0.5 block text-xs text-stone-500">{amino.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="grid min-w-0 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="mb-3">
              <h2 className="text-xl font-semibold text-stone-50">構造カード</h2>
            </div>

            <div className="mb-4 rounded-xl border border-white/10 bg-[#0d0a08]/80 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs text-stone-500">{selectedAmino.category}</div>
                  <h3 className="mt-1 break-words text-2xl font-semibold text-stone-50">{selectedAmino.nameEn}</h3>
                  <p className="mt-1 text-sm font-medium text-amber-100">{selectedAmino.nameJa}</p>
                </div>
                <div className="w-[220px] shrink-0 rounded-xl border border-white/10 bg-white p-3">
                  {loading ? (
                    <div className="grid h-[190px] place-items-center text-sm text-stone-500">読み込み中</div>
                  ) : apiItem?.imageUrl ? (
                    <img src={apiItem.imageUrl} alt={`${selectedAmino.nameJa}の2D構造`} className="h-[190px] w-full object-contain" />
                  ) : (
                    <div className="grid h-[190px] place-items-center text-sm text-stone-500">{NO_DATA_LABEL}</div>
                  )}
                </div>
              </div>

              {error && <p className="mt-3 rounded-lg border border-red-300/20 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-100">{error}</p>}
            </div>

            <div className="grid min-w-0 gap-3 md:grid-cols-2">
              {detailRows.map((row) => (
                <div key={row.key} className="min-w-0 rounded-xl border border-white/10 bg-[#0d0a08]/80 p-3">
                  <div className="text-xs text-stone-500">{row.label}</div>
                  <div className="mt-1 whitespace-normal break-words text-sm font-medium text-stone-100">
                    {displayValue(apiItem?.[row.key])}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid min-w-0 gap-3 md:grid-cols-3">
              {[
                ['焙煎での役割', selectedAmino.roastRole],
                ['味の手がかり', selectedAmino.flavorHint],
                ['メイラード反応との関係', selectedAmino.maillardNote],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-black/25 p-3">
                  <div className="text-xs font-medium text-amber-200/75">{label}</div>
                  <p className="mt-1 text-xs leading-6 text-stone-300">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
