function TItemList(container, filter, itemClass)
{
    this.items = [];
    this.itemClass = itemClass;
    this.container = container;
    if (typeof filter == 'function') {
        this.filter = filter;
    }
};

/**
 * Test item to accept in 'add' and 'change' methods.
 *
 * @param item
 * @return bool
 */
TItemList.prototype.filter = function(item)
{
    return true;
};

TItemList.prototype.import = function(items)
{
    this.clear();
    items.forEach(this.add, this);
};

TItemList.prototype.itemDomElement = function(item)
{
    throw 'Subclass responsibily';
};

TItemList.prototype.clear = function()
{
    $('.' + this.itemClass, this.container).remove();
    this.items.splice(0, this.items.length);
};

TItemList.prototype.updateWith = function(items)
{
    items.forEach(function(item) {
        if (['add', 'change', 'remove'].indexOf(item.type) >= 0) {
            this[item.type](item.data);
        } else {
            throw {message: 'Undefined type ' + item.type};
        }
    }, this);
};

TItemList.prototype.add = function(item)
{
    if (this.filter(item)) {
        this.items[item.id] = item;
        var div = $('.' + this.itemClass + item.id, this.container);
        if (div.size() > 0) {
            div.replaceWith(this.itemDomElement(item));
        } else {
            this.container.append(this.itemDomElement(item));
        }
    }
};

TItemList.prototype.change = TItemList.prototype.add;

TItemList.prototype.remove = function(item)
{
    $('.' + this.itemClass + item.id, this.container).remove();
    delete this.items[item.id];
};

/*----------------------------------------------------------------------------*/

function TUserList(container, filter, itemClass)
{
    TItemList.apply(this, arguments);
    this.currentId = 0;
};

TUserList.prototype = new TItemList();

TUserList.prototype.itemDomElement = function(item)
{
    return $('<div class="' + this.itemClass + ' ' +
        (this.currentId == item.id ? 'current ' : '') +
        this.itemClass + item.id + '">' +
        item.nick + '</div>');
};

TUserList.prototype.setCurrent = function(id)
{
    this.currentId = id;
    $('div.' + this.itemClass + this.currentId, this.container).addClass('current');
};

/*----------------------------------------------------------------------------*/

function TTankStack(container, filter, itemClass)
{
    TItemList.apply(this, arguments);
};

TTankStack.prototype = new TItemList();
TTankStack.prototype._super = TItemList.prototype;

TTankStack.prototype.itemDomElement = function(item)
{
    return $('<div class="' + this.itemClass + ' ' +
        this.itemClass + item.id + '"><img src="' +
        item.img.src + '"></div>');
};

TTankStack.prototype.add = function(item)
{
    var bot = new TankBot();
    bot.unserialize(item);
    this._super.add.call(this, bot);
};
