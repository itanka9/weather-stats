'use strict';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
};

document.addEventListener('DOMContentLoaded', () => {
    const chart = new Chart(600, 400, document.querySelector('#chart'));

    (new UI())
        .debounce(200)
        .effect(chart.drawLoading)
        .effect(params => { saveToLs('chart-params', params) })
        .async(params => fetchData(
            params.type,
            `${params.fromYear}-01-01`,
            `${params.toYear}-01-01`
        ))
        .map(flatten)
        .subscribe(chart)
});