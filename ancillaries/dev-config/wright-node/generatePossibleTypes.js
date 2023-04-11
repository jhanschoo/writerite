//See: https://www.apollographql.com/docs/react/data/fragments/#generating-possibletypes-automatically
const fs = require("fs");

const { __schema } = JSON.parse(fs.readFileSync("./schema.json").toString());

const possibleTypes = {};

__schema.types.forEach((supertype) => {
  if (supertype.possibleTypes) {
    possibleTypes[supertype.name] =
      supertype.possibleTypes.map(subtype => subtype.name);
  }
});

fs.writeFile('./src/possibleTypes.json', JSON.stringify(possibleTypes), (err) => {
  if (err) {
    console.error('Error writing possibleTypes.json', err);
  } else {
    console.log('Fragment types successfully extracted!');
  }
});
