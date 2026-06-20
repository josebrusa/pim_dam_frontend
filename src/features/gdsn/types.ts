export type GdsnForm = {
  gtin: string;
  productName: string;
  dataPool: string;
  recipient: string;
};

export type GdsnUpdateForm = GdsnForm & {
  status: string;
};

export type GdsnItem = {
  id: string;
  gtin: string;
  productName: string;
  dataPool: string;
  recipient: string;
  status: string;
};

export type GdsnStats = {
  registered: number;
  sentToday: number;
  pending: number;
  rejected: number;
};

export type GdsnResponse = {
  stats: GdsnStats;
  data: GdsnItem[];
};
