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

PascalCompiler = function PascalCompiler(code)
{
    this.code = code;
    this.cur = 0;
};

PascalCompiler.prototype.isSpace = /\s/;
PascalCompiler.prototype.isNum = /[0-9]/;
PascalCompiler.prototype.isChar = /[a-z]/i;
PascalCompiler.prototype.isSymbol = /\w/i;

PascalCompiler.prototype.parse = function()
{
    return this.parseProgram();
};

PascalCompiler.prototype.parseProgram = function()
{
    var code = [];
    this.eatIdentifier('Program');
    var name = this.parseIdentifier();
    this.token(';');
    this.eatIdentifier('begin');
    while (true) {
        if (!this.testIdentifier('end')) {
            this.parseStatement(code);
        } else {
            break;
        }
    }
    this.eatIdentifier('end');
    this.token('.');
    return code;
};

PascalCompiler.prototype.parseStatement = function(code)
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
    case 'turn':
        code.push(name);
        code.push(param);
        break;
    default:
        throw 'Undefined name "' + name + '" at ' + this.cur;
    }
};

PascalCompiler.prototype.parseExpression = function()
{
    if (this.test(this.isNum)) {
        return this.parseNumber();
    } else if (this.test("'")) {
        return this.parseString();
    } else {
        throw 'Unexpected "' + this.look() + '". Expression expected at ' + this.cur;
    }
};

PascalCompiler.prototype.parseNumber = function()
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

PascalCompiler.prototype.parseString = function()
{
    this.eat("'");
    var next;
    var res = '';
    while (!this.test("'")) {
        next = this.look();
        res += next;
        this.eat(next);
    }
    this.eat("'");
    this.eatWs();
    return res;
};

PascalCompiler.prototype.testIdentifier = function(identifier)
{
    var cur = this.cur;
    var res = this.parseIdentifier();
    this.cur = cur;
    return res == identifier;
};

PascalCompiler.prototype.eatIdentifier = function(identifier)
{
    if (this.parseIdentifier() != identifier) {
        throw identifier + ' expected at ' + this.cur;
    }
};

PascalCompiler.prototype.parseIdentifier = function()
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

PascalCompiler.prototype.look = function()
{
    return this.code.charAt(this.cur);
};

/**
 * @param char char || RegExp
 * @return
 */
PascalCompiler.prototype.test = function(check)
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

PascalCompiler.prototype.eat = function(char)
{
    if (this.look() == char) {
        this.cur++;
    } else {
        throw '"' + char + '" expected at ' + this.cur + ', but "' + this.look() + '" given';
    }
};

PascalCompiler.prototype.token = function(char)
{
    this.eat(char);
    this.eatWs();
};

PascalCompiler.prototype.eatWs = function()
{
    while (this.isSpace.test(this.code.charAt(this.cur))) {
        this.cur++;
    }
};
