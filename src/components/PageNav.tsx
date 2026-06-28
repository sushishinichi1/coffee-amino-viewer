import Link from 'next/link';

export type PageNavKey = 'viewer' | 'vocab' | 'amino';

type PageNavProps = {
  current: PageNavKey;
};

const navItems: Array<{
  key: PageNavKey;
  label: string;
  href: string;
  disabled?: boolean;
}> = [
  { key: 'viewer', label: 'メイン', href: '/' },
  { key: 'vocab', label: '単語帳', href: '/vocab' },
  { key: 'amino', label: 'アミノ酸', href: '/amino' },
];

export function PageNav({ current }: PageNavProps) {
  return (
    <nav aria-label="ページ移動" className="flex shrink-0 items-center gap-1">
      {navItems.map((item) => {
        const selected = current === item.key;
        const className = `rounded-full border px-2.5 py-1 text-[11px] font-medium shadow-[0_10px_26px_rgba(0,0,0,0.26)] backdrop-blur transition ${
          selected
            ? 'border-amber-200/55 bg-amber-400/25 text-amber-50'
            : 'border-amber-300/25 bg-[#120d0a]/85 text-amber-100 hover:border-amber-200/50 hover:bg-amber-300/15'
        }`;

        if (item.disabled) {
          return (
            <span
              key={item.key}
              aria-disabled="true"
              className="cursor-not-allowed rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[11px] font-medium text-stone-500 shadow-[0_10px_26px_rgba(0,0,0,0.22)] backdrop-blur"
            >
              {item.label}
            </span>
          );
        }

        return (
          <Link key={item.key} href={item.href} aria-current={selected ? 'page' : undefined} className={className}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
