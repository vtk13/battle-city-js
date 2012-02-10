define(function() {
    var store = [];
    var autoincrement = 1;

    function create(constructor, args)
    {
        // stackoverflow:/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;

        var object = new F();
        object.id = autoincrement++;
        store[object.id] = object;
        return object;
    };

    function add(object)
    {
        if (object.id === undefined) {
            object.id = autoincrement++;
        }
        store[object.id] = object;
        return object;
    };

    function fetch(id)
    {
        return store[id];
    };

    function free(object)
    {
        if (store[object.id]) {
            delete store[object.id];
        } else {
            throw new Error("Object with id " + object.id + " doesn't exist");
        }
    };

    return {
        create: create,
        add: add,
        fetch: fetch,
        free: free
    };
});