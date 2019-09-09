'use strict';

const flatten = arr => arr.reduce((result, x) => result.concat(Object.values(x)), []);

const YEAR_MIN = 1881,
      YEAR_MAX = 2006;

let dataType = 'temperature',
    range = { min: YEAR_MIN, max: YEAR_MAX },
    
    chart = null;

const initUI = () => {
    chart = createChart(400, 600);

    let selects = document.querySelectorAll('.range-select')
    for (let year = YEAR_MIN; year <= YEAR_MAX; year++) {
        for (let select of selects) {
            const option = document.createElement('option')
            option.innerText = year
            option.value = year
            select.appendChild(option)
        }
    }

    updateChart()
}

const onRangeSelect = () => {
    range = getRange();
    updateChart();
}

const getRange = () => {
    const fromSelect = document.querySelector('select[name=from]'),
          toSelect = document.querySelector('select[name=to]');

    return { min: fromSelect.value, max: toSelect.value }
}

const setRange = range => {
    const fromSelect = document.querySelector('select[name=from]'),
          toSelect = document.querySelector('select[name=to]');

    fromSelect.value = range.min;
    toSelect.value = range.max;      
}

const updateChart = async () => {
    const data = await fetchData(dataType, `${range.min}-01-01`, `${range.max}-01-01`);
    drawData(Object.values(flatten(data)), chart);
    setRange(range)
}

const switchDataType = async type => {
    dataType = type;
    await updateChart();
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
};

document.addEventListener('DOMContentLoaded', initUI);