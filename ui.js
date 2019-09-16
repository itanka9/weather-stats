function UI () {
    const YEAR_MIN = 1881,
          YEAR_MAX = 2006;

    const $ = x => document.querySelector(x)

    const defaultChartParams = {
        type: 'temperature',
        fromYear: YEAR_MIN,
        toYear: YEAR_MAX
    }
   
    fillSelects();

    const bindControl = (selector, event, param, value = (x => x)) => 
            Observable.fromDOMEvent($(selector), event)
                .map(ev => ({ [param]: value(ev) })),
                getYear = ev => Number(ev.target.value)
    
    this.chartParamsStream = () => Observable
        .composeObjects([
            bindControl('#from', 'change', 'fromYear', getYear),
            bindControl('#to', 'change', 'toYear', getYear),
            bindControl('#temp', 'click', 'type', () => 'temperature'),
            bindControl('#prec', 'click', 'type', () => 'precipitation'),
	    Observable.const(defaultChartParams)
        ])

    function fillSelects () {
        let selects = document.querySelectorAll('.range-select')
        for (let year = YEAR_MIN; year <= YEAR_MAX; year++) {
            for (let select of selects) {
                const option = document.createElement('option')
                option.innerText = year
                option.value = year
                select.appendChild(option)
            }
        }
    }
}
