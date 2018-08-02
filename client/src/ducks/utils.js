/**
 * Create object with normilized data
 * @param {Array} arr - Array of objects
 * @param {String} id - Name of property that will be used as item's ID
 * @returns {Object}
 */
export const arrayToObj = (arr, id) => arr.reduce((acc, item) => {
    acc[item[id]] = item;
    return acc;
}, {});
