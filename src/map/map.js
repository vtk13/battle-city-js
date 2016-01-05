define(function() {
    /**
     * public interface:
     * void add(item)
     * bool remove(item)
     * bool move(item, newX, newY)
     * object[] intersects(item)
     */
    function AbstractMap()
    {
        this.all = [];
    }

    return AbstractMap;
});
