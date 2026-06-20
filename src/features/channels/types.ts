export type ChannelForm = {
  name: string;
  connector: string;
};

export type ChannelUpdateForm = {
  name: string;
  connector: string;
  status: string;
};

export type ChannelItem = {
  id: string;
  name: string;
  connector: string;
  productCount: number;
  lastSyncAt?: string | null;
  status: string;
};

export type ChannelsResponse = {
  data: ChannelItem[];
};
