import Moddle from 'dmn-moddle';

const dmnModdle = new Moddle();

export const buildJsonFromXML = async ({ xml }) => {

  const { rootElement: definitions } = await dmnModdle.fromXML(xml);

  const decisionTables = getAllDecisionTables(definitions);

  const dmnDI = definitions.get('dmnDI');
  const diagrams = dmnDI.get('diagrams');
  const diagramElements = diagrams.map((d) => d.get('diagramElements')).flat();

  return decisionTables.map(d => {
    const decisionLogic = d.get('decisionLogic');

    const infoRequirements = d.get('informationRequirement');
    let links = [];
    if (infoRequirements) {
      for (const infoRequirement of infoRequirements) {
        if (!infoRequirement.requiredDecision) continue;

        const diagramElement = diagramElements.filter((de) => de.get('dmnElementRef').get('id') === infoRequirement.id)[0];

        const link = {
          id: infoRequirement.id,
          href: infoRequirement.requiredDecision.href,
          edges: diagramElement.get('waypoint').map((wp) => { return { x: wp.x, y: wp.y }; }),
        };
        links.push(link);
      }
    }

    const diagramElement = diagramElements.filter((de) => de.get('dmnElementRef').get('id') === d.id)[0];
    const bounds = diagramElement.get('bounds');

    return {
      id: d.id,
      hitPolicy: decisionLogic.hitPolicy,
      aggregation: decisionLogic.aggregation,
      links: links,
      bounds: [ bounds.x, bounds.y, bounds.width, bounds.height ],
      inputTypes: decisionLogic.get('input').map(buildInputTypes),
      inputs: decisionLogic.get('input').map(buildParseableInput),
      outputTypes: decisionLogic.get('output').map(buildOutputTypes),
      outputs: decisionLogic.get('output').map(buildParseableOutput),
      rules: decisionLogic.get('rule').map(buildParseableRule),
      name: d.get('name')
    };
  });
};


// helpers ////////////////////

const getAllDecisionTables = (definitions) => {
  const drgElement = definitions.get('drgElement');

  if (!drgElement || !drgElement.length) {
    return [];
  }

  const decisions = drgElement.filter((d) => d.$type === 'dmn:Decision');

  return decisions.filter((dt) => dt.get('decisionLogic').$type === 'dmn:DecisionTable');
};

const buildInputTypes = (input) => {
  const expression = input.get('inputExpression');
  return expression ? expression.get('typeRef') : '';
};

const buildParseableInput = (input) => {
  const expression = input.get('inputExpression');

  if (expression && expression.get('text')) {
    return expression.get('text');
  }

  return input.get('label');
};

const buildOutputTypes = (output) => {
  return output.get('typeRef');
};

const buildParseableOutput = (output) => {
  return output.get('name') || output.get('label');
};

const buildParseableRule = (rule) => {
  const inputEntries = rule.get('inputEntry');

  const outputEntries = rule.get('outputEntry');

  const annotation = rule.get('description');

  let parseableRule = [];

  if (inputEntries && inputEntries.length) {
    inputEntries.forEach(i => parseableRule.push(i.get('text')));
  }

  if (outputEntries && outputEntries.length) {
    outputEntries.forEach(o => parseableRule.push(o.get('text')));
  }

  if (annotation) {
    parseableRule.push(annotation);
  }

  return parseableRule;
};
