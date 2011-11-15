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

TItemList.prototype.importItems = function(items)
{
    this.clear();
    for (var i in items) {
        this.add(items[i]);
    }
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

TItemList.prototype._methodMap = {
    'a': 'add',
    'c': 'change',
    'r': 'remove'
};

TItemList.prototype._updateItem = function(event)
{
    if (['a'/*add*/, 'c'/*change*/, 'r'/*remove*/].indexOf(event[0/*type*/]) >= 0) {
        var method = this._methodMap[event[0/*type*/]];
        this[method](event[1/*data*/]);
    } else {
        throw {message: 'Undefined message type "' + event[0/*type*/] + '"'};
    }
};

TItemList.prototype.updateWith = function(events)
{
    for (var i in events) {
        this._updateItem(events[i]);
    }
};

TItemList.prototype.add = function(item)
{
    if (this.filter(item)) {
        var id = item.id || item[1];
        this.items[id] = item;
        var div = $('.' + this.itemClass + id, this.container);
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
TUserList.prototype.constructor = TUserList;

TUserList.prototype.itemDomElement = function(item)
{
    return $('<div class="' + this.itemClass + ' ' +
        (this.currentId == item.id ? 'current ' : '') +
        this.itemClass + item.id + '"></div>').text(item.nick);
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
TTankStack.prototype.constructor = TTankStack;

TTankStack.prototype.itemDomElement = function(item)
{
    return $('<div class="' + this.itemClass + ' ' +
        this.itemClass + item[1/*id*/] + '"><img src="img/bot.png"></div>');
};

TTankStack.prototype.add = function(item)
{
    var bot = new TankBot();
    bot.unserialize(item);
    TItemList.prototype.add.call(this, bot);
};
