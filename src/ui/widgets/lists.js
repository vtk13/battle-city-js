var $ = require('jquery');
var lang = require('src/lang/lang.js');

function UiList(list, container, itemClass)
{
    if (arguments.length) {
        this.container = container;
        this.itemClass = itemClass;
        list.on('add', this.onAdd.bind(this));
        list.on('change', this.onChange.bind(this));
        list.on('remove', this.onRemove.bind(this));
    }
}

UiList.prototype.itemDomElement = function(/*item*/)
{
    throw new Error('subclass responsibility');
};

UiList.prototype.onAdd = function(item)
{
    this.container.append(this.itemDomElement(item));
};

UiList.prototype.onChange = function(item)
{
    $('.' + this.itemClass + item.id, this.container).replaceWith(this.itemDomElement(item));
};

UiList.prototype.onRemove = function(item)
{
    $('.' + this.itemClass + item.id, this.container).remove();
};

//====== UiUserList ============================================================

function UiUserList(list, container, itemClass)
{
    UiList.apply(this, arguments);
}

UiUserList.prototype = Object.create(UiList.prototype);
UiUserList.prototype.constructor = UiUserList;

UiUserList.prototype.itemDomElement = function(user)
{
  return $('<div class="' + this.itemClass + ' ' +
      (window.bcClient.currentUserId === user.id ? 'current ' : '') +
      this.itemClass + user.id + '"></div>').text(user.nick);
};

//====== UiPremadeUserList =====================================================

function UiPremadeUserList(list, container, itemClass, client)
{
    UiUserList.apply(this, arguments);
    this.client = client;
}

UiPremadeUserList.prototype = Object.create(UiUserList.prototype);
UiPremadeUserList.prototype.constructor = UiPremadeUserList;

UiPremadeUserList.prototype.itemDomElement = function(user)
{
    return $('<div class="' + this.itemClass + ' ' +
        (window.bcClient.currentUserId == user.id ? 'current ' : '') +
        this.itemClass + user.id + '"></div>').text(user.nick);
};

//====== UiPremadeList =========================================================

function UiPremadeList(list, container, itemClass)
{
  UiList.apply(this, arguments);
}

UiPremadeList.prototype = Object.create(UiList.prototype);
UiPremadeList.prototype.constructor = UiPremadeList;

UiPremadeList.prototype.itemDomElement = function(premade)
{
    var res = $('<div class="' + this.itemClass + ' ' +
        (premade.isLocked() ? 'locked ' : '') +
        this.itemClass + premade.id + '"><span class="name"/><span class="stat"/></div>');
    var stat = ' (' + premade.users.length + ')';
    $('.name', res).text(premade.name);
    $('.stat', res).text(stat);
    return res;
};

//====== UiMessageList =========================================================

function UiMessageList(list, container, itemClass)
{
    UiList.apply(this, arguments);
}

UiMessageList.prototype = Object.create(UiList.prototype);
UiMessageList.prototype.constructor = UiMessageList;

UiMessageList.prototype.itemDomElement = function(message)
{
    var date = new Date(message.time);
    var time = date.getHours() + ':' + (date.getMinutes() < 10 ? 0 : '') + date.getMinutes();
    var res = $('<div class="' + this.itemClass + ' ' +
            this.itemClass + message.id + '"><span class="time">' +
            time + '</span> <span class="nick"></span> <span class="text"></span></div>');
    $('.nick', res).text('<' + message.nick + '>');
    $('.text', res).text(message.text);
    return res;
};

//====== UiTankStack ===========================================================

function UiTankStack(list, container, itemClass)
{
    // todo bot stack is no longer a collection
    //UiList.apply(this, arguments);
}

UiTankStack.prototype = Object.create(UiList.prototype);
UiTankStack.prototype.constructor = UiTankStack;

UiTankStack.prototype.itemDomElement = function(item)
{
    return $('<div class="' + this.itemClass + ' ' +
        this.itemClass + item.id + '"><img src="img/bot.png"></div>');
};

module.exports = {
    UiList: UiList,
    UiUserList: UiUserList,
    UiPremadeUserList: UiPremadeUserList,
    UiPremadeList: UiPremadeList,
    UiMessageList: UiMessageList,
    UiTankStack: UiTankStack
};
