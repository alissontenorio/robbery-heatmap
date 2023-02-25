const robberyData = require('../static/assaltos_maceio_roubo_transeunte')
const nj = require('../vendor/numjs.min')
const path = require('path')

let preprocessedData = Object.keys(robberyData).reduce((objYear, year) => {
    let valuesByYear = {'robbery': []};

    // denormalize data
    objYear[year] = Object.keys(robberyData[year]).reduce((objHood, hoodName) => {
        valuesByYear['robbery'].push(robberyData[year][hoodName])
        objHood[hoodName] = {robbery: robberyData[year][hoodName]};
        return objHood;
    }, {})

    // calculate stats
    valuesByYear['robbery'] = nj.array(valuesByYear['robbery'])
    objYear[year]['metrics'] = {
        'robbery': {
            total: valuesByYear['robbery'].sum(),
            mean: valuesByYear['robbery'].mean(),
            std: valuesByYear['robbery'].std(),
            min: valuesByYear['robbery'].min(),
            max: valuesByYear['robbery'].max(),
        }
    }

    // augment data
    for (let hoodName in objYear[year]) {
        let objHood = objYear[year][hoodName];
        objHood['robberyNormalized'] = (objHood['robbery'] - objYear[year]['metrics']['robbery']['mean']) / objYear[year]['metrics']['robbery']['std'];
    }

    return objYear;
}, {})

// save file
require('fs').writeFileSync(path.join(__dirname, '../static/hoodHistoryData.js'), `module.exports = ${JSON.stringify(preprocessedData, null, 2)}`);
