export type MappingRuleForm = {
  name: string;
  sourceField: string;
  targetField: string;
  transform: string;
};

export type MappingRule = {
  id: string;
  name: string;
  sourceField: string;
  targetField: string;
  transform: string;
};

export type MappingProfile = {
  id?: string;
  rules?: MappingRule[];
};
