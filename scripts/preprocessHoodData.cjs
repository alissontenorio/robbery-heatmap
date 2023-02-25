const hoodRobberyHistory = require('../static/assaltos_maceio_roubo_transeunte.cjs')
const hoodHistoryPopulation = require('../static/hoodHistoryPopulation.cjs')
const nj = require('../vendor/numjs.min.cjs')
const path = require('path')

let preprocessedData = Object.keys(hoodRobberyHistory).reduce((objYear, year) => {
    let valuesByYear = {'robbery': [], 'population': [], 'robberyPopulationRatio': []};

    // denormalize data
    objYear[year] = Object.keys(hoodRobberyHistory[year]).reduce((objHood, hoodName) => {
        let robberyValue = hoodRobberyHistory[year][hoodName];
        let populationValue = hoodHistoryPopulation['2010'][hoodName];
        let robberyPopulationValue = populationValue != 0 ? robberyValue / populationValue : 0;

        if (!populationValue) {
            console.warn(`The population value couldn't be found for '${hoodName}' hood.`);
        }

        populationValue ||= 0;

        valuesByYear['robbery'].push(robberyValue)
        valuesByYear['population'].push(populationValue)
        valuesByYear['robberyPopulationRatio'].push(robberyPopulationValue)
        objHood[hoodName] = {
            'robbery': robberyValue,
            'population': populationValue,
            'robberyPopulationRatio': robberyPopulationValue
        };
        return objHood;
    }, {})

    // calculate stats
    objYear[year]['metrics'] = {}
    for (let attribute of Object.keys(valuesByYear)) {
        valuesByYear[attribute] = nj.array(valuesByYear[attribute])
        objYear[year]['metrics'][attribute] = {
            total: valuesByYear[attribute].sum(),
            mean: valuesByYear[attribute].mean(),
            std: valuesByYear[attribute].std(),
            min: valuesByYear[attribute].min(),
            max: valuesByYear[attribute].max(),
        }
    }

    // augment data
    for (let hoodName in objYear[year]) {
        if (hoodName != 'metrics') {
            let objHood = objYear[year][hoodName];
            objHood['populationNormalized'] = (objHood['population'] - objYear[year]['metrics']['population']['mean']) / objYear[year]['metrics']['population']['std'];
            objHood['robberyNormalized'] = (objHood['robbery'] - objYear[year]['metrics']['robbery']['mean']) / objYear[year]['metrics']['robbery']['std'];
            objHood['robberyPopulationRatioNormalized'] = (objHood['robberyPopulationRatio'] - objYear[year]['metrics']['robberyPopulationRatio']['mean']) / objYear[year]['metrics']['robberyPopulationRatio']['std'];
        }
    }

    return objYear;
}, {})

// save file
require('fs').writeFileSync(path.join(__dirname, '../static/hoodHistoryData.js'), `export default ${JSON.stringify(preprocessedData, null, 2)}`);
