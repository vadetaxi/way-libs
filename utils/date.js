function date(pattern) {
    const year = (new Date().getUTCFullYear()).toString().padStart(4, '0');
    const month = (new Date().getUTCMonth() + 1).toString().padStart(2, '0');
    const day = (new Date().getUTCDate()).toString().padStart(2, '0');

    const hour = (new Date().getHours()).toString().padStart(2, '0');
    const minute = (new Date().getMinutes()).toString().padStart(2, '0');
    const second = (new Date().getSeconds()).toString().padStart(2, '0');

    return pattern
        .replace('Y', year)
        .replace('m', month)
        .replace('d', day)
        .replace('H', hour)
        .replace('i', minute)
        .replace('s', second);
}

module.exports = date;