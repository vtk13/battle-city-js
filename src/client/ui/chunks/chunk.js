
/**
 * @param context a DOM Element, Document, or jQuery
 * @return
 */
function UiChunk(context)
{
    this.context = context;
};

UiChunk.prototype.setState = function()
{
    throw "Subclass responsibility";
};

UiChunk.prototype.resetState = function()
{
    throw "Subclass responsibility";
};
