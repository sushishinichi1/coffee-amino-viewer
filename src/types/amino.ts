export type AminoAcidApiItem = {
  cid: number | null;
  molecularFormula: string | null;
  molecularWeight: string | null;
  canonicalSmiles: string | null;
  isomericSmiles: string | null;
  inchiKey: string | null;
  iupacName: string | null;
  imageUrl: string | null;
};

export type AminoAcidLocalInfo = {
  id: string;
  queryName: string;
  nameEn: string;
  nameJa: string;
  category: string;
  roastRole: string;
  flavorHint: string;
  maillardNote: string;
};

export type AminoAcidResponse = {
  item: AminoAcidApiItem | null;
  cached: boolean;
  error?: string;
};
