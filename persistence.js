function Persistent (persistentKey, inStream) {
    const saveToLs = (key, something) => {
    	localStorage.setItem(key, JSON.stringify(something))
    }

    const getFromLs = key => JSON.parse(localStorage.getItem(key))

    inStream.effect(data => saveToLs(persistentKey, data))

    return Observable.const(getFromLs(persistentKey))
}
