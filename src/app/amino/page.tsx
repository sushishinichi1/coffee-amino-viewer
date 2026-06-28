import { AminoAcidViewer } from '@/components/AminoAcidViewer';
import { DEFAULT_AMINO_ACID_ID, findAminoAcidByName } from '@/data/aminoAcids';

type AminoPageProps = {
  searchParams?: {
    name?: string;
  };
};

export default function AminoPage({ searchParams }: AminoPageProps) {
  const initialAmino = findAminoAcidByName(searchParams?.name) ?? findAminoAcidByName(DEFAULT_AMINO_ACID_ID);

  return <AminoAcidViewer initialAminoId={initialAmino?.id ?? DEFAULT_AMINO_ACID_ID} />;
}
