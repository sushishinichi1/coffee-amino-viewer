import { PageNav, type PageNavKey } from '@/components/PageNav';

type AppHeaderProps = {
  current: PageNavKey;
};

export function AppHeader({ current }: AppHeaderProps) {
  return (
    <header className="relative z-10 mx-auto mb-4 flex max-w-[1220px] items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-300/90">
          COFFEE LABO
        </div>
        <div className="mt-1 text-xs text-stone-400">bean / roast / amino acid</div>
      </div>
      <PageNav current={current} />
    </header>
  );
}
