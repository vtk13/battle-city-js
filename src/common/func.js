define(function() {
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

    return {
        vector: vector,
        isClient: isClient
    };
});
