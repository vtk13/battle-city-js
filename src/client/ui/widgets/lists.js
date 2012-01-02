
function UiList(list, container, itemClass)
{
    if (arguments.length) {
        this.container = container;
        this.itemClass = itemClass;
        list.on('add', this.onAdd.bind(this));
        list.on('change', this.onChange.bind(this));
        list.on('remove', this.onRemove.bind(this));
    }
};

UiList.prototype.itemDomElement = function(item)
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
};

UiUserList.prototype = new UiList();
UiUserList.prototype.constructor = UiUserList;

UiUserList.prototype.itemDomElement = function(user)
{
  return $('<div class="' + this.itemClass + ' ' +
      (window.bcClient.user.id === user.id ? 'current ' : '') +
      this.itemClass + user.id + '"></div>').text(user.nick);
};

//====== UiCousesList ============================================================

function UiCousesList(list, container, itemClass)
{
  UiList.apply(this, arguments);
};

UiCousesList.prototype = new UiList();
UiCousesList.prototype.constructor = UiCousesList;

UiCousesList.prototype.itemDomElement = function(course)
{
    var res = $('<div class="lang ' + this.itemClass + ' ' +
            this.itemClass + course.id + '" key="' + course.name + '"></div>');
    applyLang(null, res);
    return res;
};

//====== UiPremadeUserList =====================================================

function UiPremadeUserList(list, container, itemClass, currentPremade)
{
    UiUserList.apply(this, arguments);
    this.currentPremade = currentPremade;
};

UiPremadeUserList.prototype = new UiUserList();
UiPremadeUserList.prototype.constructor = UiPremadeUserList;

UiPremadeUserList.prototype.itemDomElement = function(user)
{
    var text = user.nick;
    if (this.currentPremade.type == 'teamvsteam') {
        text = user.nick + (user.clan == 1 ? ' (внизу)' : ' (вверху)');
    }
    return $('<div class="' + this.itemClass + ' ' +
        (window.bcClient.user.id == user.id ? 'current ' : '') +
        this.itemClass + user.id + '"></div>').text(text);
};

//====== UiPremadeList =====================================================

function UiPremadeList(list, container, itemClass)
{
  UiList.apply(this, arguments);
};

UiPremadeList.prototype = new UiList();
UiPremadeList.prototype.constructor = UiPremadeList;


UiPremadeList.prototype.onAdd = function(premade)
{
    if (premade.type != 'createbot') {
        this.container.append(this.itemDomElement(premade));
    }
};

UiPremadeList.prototype.itemDomElement = function(premade)
{
    var res = $('<div class="' + this.itemClass + ' ' +
        (premade.locked ? 'locked ' : '') +
        this.itemClass + premade.id + '"><span class="name"/><span class="stat"/></div>');
    var stat = ' (' + premade.userCount + '/' + (premade.type == 'classic' ? 2 : 4) + ')';
    $('.name', res).text(premade.name);
    $('.stat', res).text(stat);
    return res;
};

//====== UiMessageList =====================================================

function UiMessageList(list, container, itemClass)
{
UiList.apply(this, arguments);
};

UiMessageList.prototype = new UiList();
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

UiMessageList.prototype.onAdd = function(item)
{
    this.container.append(this.itemDomElement(item));
    var wrapper1 = this.container.parent().get(0);
    var wrapper2 = this.container.parent().parent();
    if ((wrapper1.scrollHeight - wrapper1.scrollTop) < (wrapper2.height() + 100)) {
        wrapper1.scrollTop = wrapper1.scrollHeight;
    }
};

//====== UiTankStack ===========================================================

function UiTankStack(list, container, itemClass)
{
    UiList.apply(this, arguments);
};

UiTankStack.prototype = new UiList();
UiTankStack.prototype.constructor = UiTankStack;

UiTankStack.prototype.itemDomElement = function(item)
{
    return $('<div class="' + this.itemClass + ' ' +
        this.itemClass + item.id + '"><img src="img/bot.png"></div>');
};
