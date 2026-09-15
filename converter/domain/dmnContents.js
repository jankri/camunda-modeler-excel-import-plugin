export default (rawContent) => {
  return {
    name: rawContent.name,
    hasMetadata: rawContent.hasMetadata,
    hasTypeInfo: rawContent.hasTypeInfo,
    hitPolicy: rawContent.hitPolicy,
    aggregation: rawContent.aggregation,
    inputs: rawContent.inputs,
    outputs: rawContent.outputs,
    rules: rawContent.rules
  };
};
