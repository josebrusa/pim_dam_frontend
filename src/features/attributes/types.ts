export type AttributeForm = {
  code: string;
  name: string;
  type: string;
};

export type AttributeItem = {
  id: string;
  code: string;
  name: string;
  type: string;
  group?: { name?: string };
  channels?: string[];
  status: string;
};

export type AttributesResponse = {
  data: AttributeItem[];
};
