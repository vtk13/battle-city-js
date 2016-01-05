define([
    'assert',
    'src/store/collection.js',
    'src/common/event.js'
], function(
    assert,
    Collection,
    Eventable
) {
    describe('Collection', function () {
        var collection;

        beforeEach(function() {
            collection = new Collection();
        });

        it('Adding item should emit add event', function(done) {
            collection.once('add', function(item) {
                assert.equal(item.id, 1);
                done();
            });
            collection.add({id: 1});
        });

        it('Removing item should emit remove event', function(done) {
            collection.once('remove', function(item) {
                assert.equal(item.id, 1);
                done();
            });
            collection.add({id: 1});
            collection.remove({id: 1});
        });

        it('Changing item in collection should emit change event', function(done) {
            var item = {id: 1};
            Eventable(item);
            collection.once('change', function(item) {
                assert.equal(item.id, 1);
                done();
            });
            collection.add(item);
            item.emit('change');
        });

        it('Pop should behaves correctly on sparse collection', function() {
            var item1 = {id: 5};
            var item2 = {id: 10};
            var item;

            collection.add(item1);
            collection.add(item2);

            item = collection.pop();
            assert.equal(item.id, 10);

            item = collection.pop();
            assert.equal(item.id, 5);

            item = collection.pop();
            assert.equal(item, null);
        });

        it('Count should behaves correctly on sparse collection', function() {
            var item1 = {id: 5};
            var item2 = {id: 10};

            collection.add(item1);
            collection.add(item2);

            assert.equal(collection.count(), 2);
        });
    });
});
