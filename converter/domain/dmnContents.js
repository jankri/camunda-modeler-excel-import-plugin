export default (rawContent) => {
  return {
    id: rawContent.id,
    name: rawContent.name,
    hasMetadata: rawContent.hasMetadata,
    hasTypeInfo: rawContent.hasTypeInfo,
    links: rawContent.links,
    bounds: rawContent.bounds,
    hitPolicy: rawContent.hitPolicy,
    aggregation: rawContent.aggregation,
    inputs: rawContent.inputs,
    outputs: rawContent.outputs,
    rules: rawContent.rules
  };
};
