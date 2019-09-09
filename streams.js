function Observable (producer) {
    return {
        subscribe: function (observer) {
            return producer(observer)
        }
    }
}