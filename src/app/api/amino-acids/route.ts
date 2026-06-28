import { NextRequest, NextResponse } from 'next/server';
import type { AminoAcidApiItem, AminoAcidResponse } from '@/types/amino';

const CACHE_TTL_MS = 30_000;
const PUBCHEM_PROPERTIES = [
  'MolecularFormula',
  'MolecularWeight',
  'CanonicalSMILES',
  'ConnectivitySMILES',
  'IsomericSMILES',
  'SMILES',
  'InChIKey',
  'IUPACName',
].join(',');

type CacheEntry = {
  response: AminoAcidResponse;
  expiresAt: number;
};

type PubChemProperty = {
  CID?: number;
  MolecularFormula?: string;
  MolecularWeight?: number | string;
  CanonicalSMILES?: string;
  ConnectivitySMILES?: string;
  IsomericSMILES?: string;
  SMILES?: string;
  InChIKey?: string;
  IUPACName?: string;
};

type PubChemResponse = {
  PropertyTable?: {
    Properties?: PubChemProperty[];
  };
  Fault?: {
    Code?: string;
    Message?: string;
  };
};

const cache = new Map<string, CacheEntry>();

const normalizeName = (name: string) => name.trim().toLowerCase();

const buildPubChemUrl = (name: string) =>
  `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/${PUBCHEM_PROPERTIES}/JSON`;

const toAminoAcidApiItem = (property: PubChemProperty): AminoAcidApiItem => {
  const cid = typeof property.CID === 'number' ? property.CID : null;

  return {
    cid,
    molecularFormula: property.MolecularFormula ?? null,
    molecularWeight: property.MolecularWeight === undefined ? null : String(property.MolecularWeight),
    canonicalSmiles: property.CanonicalSMILES ?? property.ConnectivitySMILES ?? null,
    isomericSmiles: property.IsomericSMILES ?? property.SMILES ?? null,
    inchiKey: property.InChIKey ?? null,
    iupacName: property.IUPACName ?? null,
    imageUrl: cid ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG` : null,
  };
};

const responseBodySnippet = (body: string) => body.slice(0, 500);

const causeMessage = (error: unknown) => {
  if (!(error instanceof Error)) return 'Unknown error';
  const cause = error.cause instanceof Error ? `; cause: ${error.cause.message}` : '';
  return `${error.message}${cause}`;
};

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get('name');

  if (!name?.trim()) {
    return NextResponse.json({ item: null, cached: false, error: 'Query parameter "name" is required.' }, { status: 400 });
  }

  const cacheKey = normalizeName(name);
  const cachedEntry = cache.get(cacheKey);

  if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
    return NextResponse.json({ ...cachedEntry.response, cached: true });
  }

  const pubChemUrl = buildPubChemUrl(name.trim());

  try {
    const response = await fetch(pubChemUrl, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          item: null,
          cached: false,
          error: `PubChem request failed with status ${response.status}.`,
          details: {
            endpoint: pubChemUrl,
            status: response.status,
            statusText: response.statusText,
            responseBody: responseBodySnippet(responseText),
          },
        },
        { status: response.status },
      );
    }

    const payload = responseText ? (JSON.parse(responseText) as PubChemResponse) : {};
    const property = payload.PropertyTable?.Properties?.[0];

    if (!property) {
      return NextResponse.json({ item: null, cached: false, error: 'No PubChem compound data found.' }, { status: 404 });
    }

    const responseBody: AminoAcidResponse = { item: toAminoAcidApiItem(property), cached: false };
    cache.set(cacheKey, { response: responseBody, expiresAt: Date.now() + CACHE_TTL_MS });

    return NextResponse.json(responseBody);
  } catch (error) {
    return NextResponse.json(
      {
        item: null,
        cached: false,
        error: `Failed to fetch PubChem data: ${causeMessage(error)}`,
        details: {
          endpoint: pubChemUrl,
        },
      },
      { status: 502 },
    );
  }
}
