function deepFreeze(object) {
    Object.freeze(object);

    for( let key of Object.getOwnPropertyNames(object) ) {
        if (
            object.hasOwnProperty(key) && 
            (typeof object[key] == 'object' || typeof object[key] == 'function') &&
            !Object.isFrozen(object[key])
        ) {
            deepFreeze(object[key]);
        }
    }

    return object;
}

module.exports = deepFreeze;