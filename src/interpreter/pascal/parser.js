/**
 * v1:
 *
 * pascal-program:
 *  block5
 *
 * block5:
 *  begin statement-list end
 *
 * statement-list:
 *  statement
 *  statement-list ; statement
 *
 *  statement:
 *     procid ( expression-list )
 *
 * @param code
 * @return
 */

PascalParser = function PascalParser(code)
{
    this.code = code;
    this.cur = 0;
};

PascalParser.prototype.isSpace = /\s/;
PascalParser.prototype.isNum = /[0-9]/;
PascalParser.prototype.isChar = /[a-z]/i;
PascalParser.prototype.isSymbol = /\w/i;

PascalParser.prototype.parse = function()
{
    return this.parseProgram();
};

PascalParser.prototype.parseProgram = function()
{
    var res = [];
    this.eatIdentifier('Program');
    var name = this.parseIdentifier();
    this.token(';');
    this.eatIdentifier('begin');
    while (true) {
        if (!this.testIdentifier('end')) {
            res.push(this.parseStatement());
        } else {
            break;
        }
    }
    this.eatIdentifier('end');
    this.token('.');
    return res;
};

PascalParser.prototype.parseStatement = function()
{
    var name = this.parseIdentifier();
    this.token('(');
    var param = this.parseExpression();
    this.token(')');
    if (this.test(';')) {
        this.token(';');
    }
    switch (name) {
    case 'move':
        return new ActionMove(param);
    case 'turn':
        return new ActionTurn(param);
    default:
        throw 'Undefined name "' + name + '" at ' + this.cur;
    }
};

PascalParser.prototype.parseExpression = function()
{
    if (this.test(this.isNum)) {
        return this.parseNumber();
    } else if (this.test('"')) {
        return this.parseString();
    } else {
        throw 'Unexpected "' + this.look() + '". Expression expected at ' + this.cur;
    }
};

PascalParser.prototype.parseNumber = function()
{
    var next;
    if (next = this.test(this.isNum)) {
        var res = 0;
        while (next = this.test(this.isNum)) {
            res = res * 10 + parseInt(next);
            this.eat(next);
        }
        this.eatWs();
        return res;
    } else {
        throw 'Unexpected "' + this.look() + '". Num expected at ' + this.cur;
    }
};

PascalParser.prototype.parseString = function()
{
    this.eat('"');
    var next;
    var res = '';
    while (!this.test('"')) {
        next = this.look();
        res += next;
        this.eat(next);
    }
    this.eat('"');
    this.eatWs();
    return res;
};

PascalParser.prototype.testIdentifier = function(identifier)
{
    var cur = this.cur;
    var res = this.parseIdentifier();
    this.cur = cur;
    return res == identifier;
};

PascalParser.prototype.eatIdentifier = function(identifier)
{
    if (this.parseIdentifier() != identifier) {
        throw identifier + ' expected at ' + this.cur;
    }
};

PascalParser.prototype.parseIdentifier = function()
{
    var next;
    if (next = this.test(this.isChar)) {
        var res = '';
        while (next = this.test(this.isSymbol)) {
            res += next;
            this.eat(next);
        }
        this.eatWs();
        return res;
    } else {
        throw 'Unexpected "' + this.look() + '". Identifier expected at ' + this.cur;
    }
};

PascalParser.prototype.look = function()
{
    return this.code.charAt(this.cur);
};

/**
 * @param char char || RegExp
 * @return
 */
PascalParser.prototype.test = function(check)
{
    var res = this.look();
    if (check) {
        if ((typeof check == 'string') && res != check ||
            (typeof check == 'object') && !check.test(res)) {
            return false;
        }
    }
    return res;
};

PascalParser.prototype.eat = function(char)
{
    if (this.look() == char) {
        this.cur++;
    } else {
        throw '"' + char + '" expected at ' + this.cur + ', but "' + this.look() + '" given';
    }
};

PascalParser.prototype.token = function(char)
{
    this.eat(char);
    this.eatWs();
};

PascalParser.prototype.eatWs = function()
{
    while (this.isSpace.test(this.code.charAt(this.cur))) {
        this.cur++;
    }
};
