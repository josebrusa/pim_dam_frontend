export type MappingRuleForm = {
  name: string;
  sourceField: string;
  targetField: string;
  transform: string;
};

export type MappingRule = {
  name: string;
  sourceField: string;
  targetField: string;
  transform: string;
};

export type MappingProfile = {
  rules?: MappingRule[];
};
