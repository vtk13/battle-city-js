
/**
 * @param context a DOM Element, Document, or jQuery
 * @return
 */
function Widget(context)
{
    this.context = context;
};

Widget.prototype.setState = function()
{
    throw "Subclass responsibility";
};

Widget.prototype.resetState = function()
{
    throw "Subclass responsibility";
};
