var $ = require('jquery');
var lang = require('src/lang/lang.js');
var React = require('react');

var List = {
    componentWillMount: function() {
        this.collectionListener = this.forceUpdate.bind(this, undefined);
        this.props.items.on('add', this.collectionListener);
        this.props.items.on('change', this.collectionListener);
        this.props.items.on('remove', this.collectionListener);
    },
    componentWillUnmount: function() {
        this.props.items.off('add', this.collectionListener);
        this.props.items.off('change', this.collectionListener);
        this.props.items.off('remove', this.collectionListener);
    },
    render: function() {
        return <ul>{this.props.items.map(this.renderElement.bind(this))}</ul>;
    }
};

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
    List: List,
    UiTankStack: UiTankStack
};
