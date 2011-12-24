
function SymbolTable(parent)
{
    this.parent = parent;
    this.identifiers = {};

};

SymbolTable.id = 1;

SymbolTable.prototype._index = function(name, sig)
{
    return name + (sig ? ':' + sig.join(',') : '');
};

SymbolTable.prototype.addVar = function(name, type)
{
    var index = this._index(name);
    if (this.identifiers[index] === undefined) {
        this.identifiers[index] = {name: name, type: type};
        return SymbolTable.id++;
    } else {
        throw new Error('Identifier "' + name + '" already defined');
    }
};

SymbolTable.prototype.addFunc = function(name, sig, inline)
{
    var index = this._index(name, sig);
    this.identifiers[index] = {name: name, type: 'func', sig: sig, inline: inline};
};

SymbolTable.prototype.look = function(name, sig)
{
    var index = this._index(name, sig);
    return this.identifiers[index];
};
