'use strict';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
};

const defaultChartParams = {
    type: 'temperature',
    fromYear: 1881,
    toYear: 2006
}

document.addEventListener('DOMContentLoaded', () => {
    const chart = new Chart(600, 400, document.querySelector('#chart')),
          ui = initUI();

    const uiChannel = ui.subscribe({
        async next (chartParams) {
            chart.drawLoading();
            const data = await fetchData(
                chartParams.type,
                `${chartParams.fromYear}-01-01`,
                `${chartParams.toYear}-01-01`
            );

            saveToLs('chart-params', chartParams);
            chart.draw(flatten(data));
        },
        error () {
            chart.drawError();
        }
    })

    uiChannel.setChartParams(getFromLs('chart-params') || defaultChartParams);
});