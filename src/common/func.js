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

module.exports = {
    vector: vector,
    isClient: isClient,
    isInteger: isInteger
};
