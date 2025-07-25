/**
* Create an object composed of the picked object properties
* @param {Object} object
* @param {String[]} keys
* @returns {Object}
*/

const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {});
}

module.exports = pick;