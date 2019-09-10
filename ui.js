const YEAR_MIN = 1881,
      YEAR_MAX = 2006;

const initUI = () => Observable(observer => {
    fillSelects();

    const fromSelect = document.querySelector('#from'),
          toSelect = document.querySelector('#to'),
          tempButton = document.querySelector('#temp'),
          precButton = document.querySelector('#prec');

    let type = 'temperature'

    const getChartParams = () => ({
        type,
        fromYear: Number(fromSelect.value),
        toYear: Number(toSelect.value)
    });

    const sendChartParams = debounce(() => {
        const params = getChartParams()
        if (params.fromYear >= params.toYear) {
            return observer.error()
        }
        observer.next(params)
    }, 200)

    tempButton.addEventListener('click', () => {
        type = 'temperature';
        sendChartParams();
    })
    precButton.addEventListener('click', () => {
        type = 'precipitation';
        sendChartParams();
    })

    fromSelect.addEventListener('change', sendChartParams);
    toSelect.addEventListener('change', sendChartParams);

    return {
        setChartParams (params) {
            fromSelect.value = params.fromYear
            toSelect.value = params.toYear,
            type = params.type
            sendChartParams()
        }
    }
})

const fillSelects = () => {
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