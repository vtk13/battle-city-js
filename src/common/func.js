function vector(x)
{
    if (x) {
        return x/Math.abs(x);
    } else {
        return 0;
    }
}

function isClient()
{
    return !(typeof window == 'undefined' && typeof global == 'object');
}

// ES6 Number.isInteger
function isInteger(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
}

function createLoggedPropertyDescriptor(defaultValue)
{
    var value = defaultValue;
    return {
        enumerable: true,
        get: function() {
            return value;
        },
        set: function(newValue) {
            console.log('Write property', newValue, value);
            console.trace();
            value = newValue;
        }
    };
}

module.exports = {
    vector: vector,
    isClient: isClient,
    isInteger: isInteger,
    createLoggedPropertyDescriptor: createLoggedPropertyDescriptor
};
