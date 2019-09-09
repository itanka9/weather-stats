import 'babel-polyfill'
import { fetchData } from './store'
import { createChart, drawData } from './chart'

const flatten = arr => arr.reduce((result, x) => result.concat(Object.values(x)), [])

const main = async () => {
    const data = await fetchData('temperature', '1881-01-01', '1882-01-01');
    const chart = createChart(400, 600);
    drawData(Object.values(flatten(data)), chart)
}


main()
