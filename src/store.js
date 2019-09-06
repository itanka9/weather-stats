const INVALID_DATATYPE_ERROR = 1
const NO_DATA_ERROR = 2

const DATATYPES = ['temperature', 'precipitation']

const getDataPath = dataType => `/data/${dataType}.json`

const initSchema = db => {
    DATATYPES.forEach(dataType => {
        db.createObjectStore(dataType, { keyPath: "t" });
    })
}

const openDb = () => new Promise((resolve, reject) => {
    const request = indexedDB.open("WeatherStats", 1);

    request.onerror = event => reject("Why didn't you allow my web app to use IndexedDB?!")
    request.onsuccess = event => resolve(event.target.result)
    request.onupgradeneeded = event => initSchema(event.target.result)
})

const fillDb = dataType => new Promise(async (resolve, reject) => {
    if (!DATATYPES.includes(dataType)) {
        reject(INVALID_DATATYPE_ERROR)
    }

    const rawData = await fetch(getDataPath(dataType))
        .then(r => r.json())

    const db = await openDb(),
          transaction = db.transaction([dataType], 'readwrite'),
          store = transaction.objectStore(dataType);
    
    transaction.oncomplete = resolve
    transaction.onerror = reject

    rawData.forEach(entry => store.add(entry))
})

const fetchFromDb = (dataType, fromYear, toYear) => new Promise(async (resolve, reject) => {
    const db = await openDb(),
          store = db.transaction(dataType).objectStore(dataType),
          range = IDBKeyRange.bound(fromYear, toYear, true, true),  
          cursor = store.openCursor(range),
          result = [];
    
    cursor.onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
            result.push(cursor.value.v)
            cursor.continue()
        } else {
            resolve(result)
        }
    }    
    
    cursor.onerror = () => reject(NO_DATA_ERROR)
})

export const fetchData = async (dataType, fromYear, toYear) => {
    let result = await fetchFromDb(dataType, fromYear, toYear)
    if (result.length === 0) {
        await fillDb(dataType)
        result = await fetchFromDb(dataType, fromYear, toYear)
    }
    return result
}
