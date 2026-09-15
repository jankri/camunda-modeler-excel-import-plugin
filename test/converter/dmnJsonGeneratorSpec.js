const chai = require('chai');

const expect = chai.expect;
chai.should();

const fs = require('fs');

const buildJsonFromXML = require('../../converter/dmnJsonGenerator').buildJsonFromXML;

const buffer = fs.readFileSync(__dirname + '/../fixtures/diagram.dmn', 'utf8');


describe('dmnJsonGenerator', () => {

  describe('#buildJsonFromXML(xml)', () => {

    it('should return decision tables', async () => {

      // when
      const decisionTables = await buildJsonFromXML({ xml: buffer });

      // then
      expect(decisionTables).to.exist;
      expect(decisionTables.length).to.equal(3);
      expect(decisionTables).to.deep.equal([
        {
          id: 'dish-decision',
          hitPolicy: 'UNIQUE',
          aggregation: undefined,
          bounds: [ 301, 48, 180, 80 ],
          links: [
            {
              edges: [
                { x: 480, y: 210 },
                { x: 421, y: 148 },
                { x: 421, y: 128 }
              ],
              href: '#guestCount',
              id: 'InformationRequirement_1d56kg6',
            },
            {
              edges: [
                { x: 251, y: 210 },
                { x: 361, y: 148 },
                { x: 361, y: 128 }
              ],
              href: '#season',
              id: 'InformationRequirement_11onl5b',
            }
          ],
          inputTypes: [ 'string', 'integer' ],
          inputs: [ 'Season', 'How many guests' ],
          outputTypes: [ 'string' ],
          outputs: [ 'Dish' ],
          rules: [
            [ '"Winter"', '<= 8', '"Spareribs"' ],
            [ '"Winter"', '> 8', '"Pasta"' ],
            [ '"Summer"', '> 10', '"Light salad"' ],
            [ '"Summer"', '<= 10', '"Beans salad"' ],
            [ '"Spring"', '< 10', '"Stew"' ],
            [ '"Spring"', '>= 10', '"Steak"' ]
          ],
          name: 'Dish Decision'
        },
        {
          id: 'season',
          hitPolicy: 'UNIQUE',
          aggregation: undefined,
          bounds: [ 161, 210, 180, 80 ],
          links: [],
          inputTypes: [ 'integer' ],
          inputs: [ 'Weather in Celsius' ],
          outputTypes: [ 'string' ],
          outputs: [ 'season' ],
          rules: [
            [ '>30', '"Summer"' ],
            [ '<10', '"Winter"' ],
            [ '[10..30]', '"Spring"' ]
          ],
          name: 'Season decision'
        },
        {
          id: 'guestCount',
          hitPolicy: 'UNIQUE',
          aggregation: undefined,
          bounds: [ 390, 210, 180, 80 ],
          links: [],
          inputTypes: [ 'string' ],
          inputs: [ 'Type of day' ],
          outputTypes: [ 'integer' ],
          outputs: [ 'Guest count' ],
          rules: [
            [ '"Weekday"', '4' ],
            [ '"Holiday"', '10' ],
            [ '"Weekend"', '15' ]
          ],
          name: 'Guest Count'
        }
      ]);

    });

  });

});

