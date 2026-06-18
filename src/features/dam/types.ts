export type AssetForm = {
  name: string;
  type: string;
  sizeBytes: number;
  channel: string;
};

export type AssetItem = {
  id: string;
  name: string;
  type: string;
  sizeBytes: number;
  product?: { code?: string };
  channel: string;
};

export type DamStats = {
  total: number;
  storageGb: number;
  linked: number;
  unassigned: number;
};

export type DamResponse = {
  stats: DamStats;
  data: AssetItem[];
};
