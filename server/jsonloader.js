const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const loadJSONFile = (filePath) => {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(jsonData);

    const dataWithIds = parsedData.map((item) => ({
      uuid: uuidv4(),
      ...item,
    }));

    return dataWithIds;
  } catch (error) {
    console.error(`Error loading JSON file: ${error}`);
    return null;
  }
};

module.exports = loadJSONFile;