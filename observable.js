function Observable (producer) {
    this.subscribe = function (observer) {
        return producer(observer)
    }
    return this
}

Observable.prototype.map = function (f) {
    const self = this
    return new Observable(observer => {
        self.subscribe({
            next () { observer.next(f.apply(null, arguments)) },
            error () { observer.error.apply(null, arguments) },
            complete () { observer.complete.apply(null, arguments) }
        })
    })
}

Observable.prototype.async = function (f) {
    const self = this
    return new Observable(observer => {
        self.subscribe({
            next () { f.apply(null, arguments)
                .then(function () { observer.next.apply(null, arguments) })
                .catch(function () { observer.error.apply(null, arguments) })
            },
            error () { observer.error.apply(null, arguments) },
            complete () { observer.complete.apply(null, arguments) }
        })
    })
}

Observable.prototype.effect = function (eff) {
    const self = this
    return new Observable(observer => {
        self.subscribe({
            next () { eff.apply(null, arguments); observer.next.apply(null, arguments) },
            error () { observer.error.apply(null, arguments) },
            complete () { observer.complete.apply(null, arguments) }
        })
    })
}


Observable.prototype.filter = function (f) {
    const self = this
    return new Observable(observer => {
        self.subscribe({
            next () {
                if (f.apply(null, arguments)) {
                    observer.next.apply(null, arguments);
                }
            },
            error () { observer.error.apply(null, arguments) },
            complete () { observer.complete.apply(null, arguments) }
        })
    })
}

Observable.prototype.reduce = function (f) {
    const self = this
    return new Observable(observer => {
        self.subscribe({
            next () { observer.next(f.apply(null, arguments)) },
            error () { observer.error.apply(null, arguments) },
            complete () { observer.complete.apply(null, arguments) }
        })
    })
}

Observable.prototype.debounce = function (wait, immediate) {
    const self = this
	
    return new Observable(observer => {
        let timeout, immediate_ = immediate;
        self.subscribe({
            next () { 
                const args = arguments,
                      later = () => {
                        timeout = null;
                        if (!immediate_) observer.next.apply(null, args)
                      },
                      callNow = immediate_ && !timeout;

                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    observer.next.apply(null, args);
                    immediate_ = false
                }
            },
            error () { observer.error.apply(null, arguments) },
            complete () { observer.complete.apply(null, arguments) }
        })
    })
}


Observable.composeObjects = (producers, start = {}) => {
    return new Observable(observer => {
        let acc = JSON.parse(JSON.stringify(start))
        producers.forEach(producer => producer.subscribe({
            next (obj) {
                acc = { ...acc, ...obj }
                observer.next(acc)
            },
            error () { observer.error.apply(null, arguments) },
            complete () { observer.complete.apply(null, arguments) }
        }))
    })
}

Observable.fromDOMEvent = (el, eventName) => {
    return new Observable(observer => {
        const f = ev => observer.next(ev)
        el.addEventListener(eventName, f);

        return {
            unsubscribe () {
                el.removeEventListener(eventName, f);
            }
        }
    })
    
}

Observable.const = constValue => new Observable(observer => observer.next(constValue))
