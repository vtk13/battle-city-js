
function SymbolTable()
{
    this.identifiers = [];
};

SymbolTable.prototype._index = function(name, sig)
{
    return name + (sig ? ':' + sig.join(',') : '');
};

SymbolTable.prototype.addVar = function(name, type)
{
    if (this.look(name) == null) {
        var v = {name: name, type: type};
        v.offset = this.identifiers.push(v) - 1;
    } else {
        throw new Error('Identifier "' + name + '" already defined');
    }
};

/**
 *
 * @param name
 * @return index of found var or -1
 */
SymbolTable.prototype.look = function(name)
{
    for (var i = 0, l = this.identifiers.length ; i < l ; i++) {
        if (this.identifiers[i].name == name) {
            return this.identifiers[i];
        }
    }
    return null;
};

SymbolTable.prototype.length = function()
{
    return this.identifiers.length;
};
