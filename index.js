'use strict';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
};

document.addEventListener('DOMContentLoaded', () => {
    const chart = new Chart(600, 400, document.querySelector('#chart'));

    const uiParamsStream = (new UI())
	      .chartParamsStream()
              .debounce(200),

          paramsPersistence = Persistent('chart-params', uiParamsStream),
	
	  persistentParamsStream = Observable.composeObjects([
              uiParamsStream,
              paramsPersistence
	  ]);

     persistentParamsStream
        .effect(chart.drawLoading)
        .async(params => fetchData(
            params.type,
            `${params.fromYear}-01-01`,
            `${params.toYear}-01-01`
        ))
        .map(flatten)
        .subscribe(chart)
});
