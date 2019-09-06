import 'babel-polyfill'
import { fetchData } from './store'

const main = async () => {
    const data = await fetchData('temperature', '1881-01-01', '1882-01-01');
    console.log(data);
}

main()
