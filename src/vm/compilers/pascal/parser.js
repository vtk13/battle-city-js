
PascalCompiler = function PascalCompiler(code)
{
    this.code = code;
    this.cur = 0;

    this.line = 1;
    this.char = 1;
    this.posStack = []; // stack to save cursor positions to properly show error place
    this.buildInFunc = {
        'write': {
            'signature': 'var', // var args
            'inline': 'write'
        },
        'writeln': {
            'signature': 'var', // var args
            'inline': 'writeln'
        },
        'move': {
            'signature': ['integer'],
            'inline': 'tank-move'
        },
        'turn': {
            'signature': ['string'],
            'inline': 'tank-turn'
        }
    };
};

PascalCompiler.prototype.isSpace = /\s/;
PascalCompiler.prototype.isNum = /[0-9]/;
PascalCompiler.prototype.isChar = /[a-z]/i;
PascalCompiler.prototype.isSymbol = /\w/i;
PascalCompiler.prototype.isKeyword = /program|var|begin|end/i;

PascalCompiler.prototype.parse = function()
{
    return this.parseProgram();
};

PascalCompiler.prototype.parseProgram = function()
{
    this.symbolTable = new SymbolTable();
    this.varOffset = 2;
    var code = ['jmp', 0];
    this.eatIdentifier('program');
    var name = this.parseIdentifier();
    this.token(';');
    this.parseBlock(code);
    this.token('.');
    // allocate space for global vars
    for (var i in this.symbolTable.identifiers) {
        this.code.splise(2, 0, this.symbolTable.identifiers[i]);
    }
    // jump over vars space
    code[1] = this.symbolTable.length();
    return {
        code: code
    };
};

PascalCompiler.prototype.parseBlock = function(code)
{
    if (this.lookIdentifier() == 'var') {
        this.parseVariableDeclaration();
    }
    this.parseBlock5(code);
};

PascalCompiler.prototype.parseVariableDeclaration = function()
{
    var vars, type, v;
    this.eatIdentifier('var');
    while (true) {
        if (this.isKeyword.test(this.lookIdentifier())) {
            break;
        }
        vars = [];
        do {
            vars.push(this.parseIdentifier());
        } while (this.look() == ',' && this.token(','));
        this.token(':');
        type = this.parseIdentifier();

        try {
            while (v = vars.pop()) {
                this.symbolTable.addVar(v, type);
            }
        } catch (ex) {
            throw new Error(ex.message + ' at ' + this.formatPos());
        }

        if (this.look() == ';') {
            this.token(';');
        } else {
            break;
        }
    }
};

PascalCompiler.prototype.parseBlock5 = function(code)
{
    this.eatIdentifier('begin');
    this.parseStatementList(code);
    this.eatIdentifier('end');
};

PascalCompiler.prototype.parseStatementList = function(code)
{
    while (true) {
        var look = this.lookIdentifier();
        if (look.length > 0 && !this.isKeyword.test(look)) {
            var name = this.parseIdentifier();
            if (this.look() == ':') {
                this.token(':=');
                var ex = this.parseExpression();
                var v;
                if ((v = this.symbolTable.look(name))) {
                    if (v.type == ex.type) {
                        if (ex.value) {
                            code.push('move-mem-val', v.offset + this.varOffset, ex.value);
                        } else {
                            code.push('move-mem-mem', v.offset + this.varOffset, ex.offset + this.varOffset);
                        }
                    } else {
                        throw new Error('Mistmatch types "' + v.type + '" and "'
                                + ex.type + '" at ' + this.formatPos());
                    }
                } else {
                    throw new Error('Undefined variable "' + name + '" at ' + this.formatPos());
                }
            } else if (this.look() == '(' || this.look() == ';' || this.test(this.isChar)) {
                if ((func = this.buildInFunc[name])) {
                    code.push(func.inline);
                    if (func.signature) {
                        this.token('(');
                        var param = [];
                        do {
                            param.push(this.parseExpression());
                        } while (this.look() == ',' && this.token(','));
                        this.token(')');
                        if (func.signature == 'var') {
                            code.push(param.length);
                            for (var i = 0 ; i < param.length ; i++) {
                                code.push(param[i].value);
                            }
                        } else {
                            if (func.signature.length == param.length) {
                                for (var i = 0 ; i < param.length ; i++) {
                                    if (param[i].type == func.signature[i]) {
                                        code.push(param[i].value);
                                    } else {
                                        throw new Error('Mismatch argument type in function "'
                                                + name + '" call, argument ' + i
                                                + ', at ' + this.formatPos());
                                    }
                                }
                            } else {
                                throw new Error('Mismatch parameters count for function "'
                                        + name + '" at ' + this.formatPos());
                            }
                        }
                    }
                } else {
                    throw new Error('Undefined function or procedure "' + name
                            + '" at ' + this.formatPos());
                }
            }
        }
        if (this.lookIdentifier() == 'end') {
            break;
        }
        this.token(';');
    }
};

PascalCompiler.prototype.parseExpression = function()
{
    if (this.test(this.isChar)) {
        var name = this.parseIdentifier();
        var v;
        if (v = this.symbolTable.look(name)) {
            return v;
        } else {
            throw new Error('Undefined variable "' + name + '" at ' + this.formatPos());
        }
    } else if (this.test(this.isNum)) {
        return {
            type: 'integer',
            value: this.parseNumber()
        };
    } else if (this.test("'")) {
        return {
            type: 'string',
            value: this.parseString()
        };
    } else {
        throw new Error('Unexpected "' + this.look() + '". Expression expected at ' + this.formatPos());
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
        throw new Error('Unexpected "' + this.look() + '". Num expected at ' + this.formatPos());
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
    this.pushCur();
    var res = this.parseIdentifier();
    this.popCur();
    return res == identifier;
};

PascalCompiler.prototype.eatIdentifier = function(identifier)
{
    this.pushPos();
    if (this.parseIdentifier() != identifier) {
        throw new Error(identifier + ' expected at ' + this.formatPos());
    }
    this.popPos();
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
        return res.toLowerCase();
    } else {
        throw new Error('Unexpected "' + this.look() + '". Identifier expected at ' + this.formatPos());
    }
};

PascalCompiler.prototype.look = function()
{
    return this.code.charAt(this.cur);
};

PascalCompiler.prototype.lookIdentifier = function()
{
    this.pushCur();
    var next, res = false;
    if (next = this.test(this.isChar)) {
        res = '';
        while (next = this.test(this.isSymbol)) {
            res += next;
            this.eat(next);
        }
    }
    this.popCur();
    return res;
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

/**
 * @param char should not be '\n'
 */
PascalCompiler.prototype.eat = function(str)
{
    var look = this.code.substr(this.cur, str.length);
    if (look == str) {
        this.cur += str.length;
        this.char += str.length;
    } else {
        throw new Error('"' + str + '" expected at ' + this.formatPos() + ', but "' + look + '" given');
    }
};

PascalCompiler.prototype.token = function(token)
{
    this.eat(token);
    this.eatWs();
    return true;
};

PascalCompiler.prototype.eatWs = function()
{
    while (this.isSpace.test(this.look())) {
        if (this.look() == '\n') {
            this.line++;
            this.char = 1;
        } else {
            this.char++;
        }
        this.cur++;
    }
};

PascalCompiler.prototype.formatPos = function()
{
    if (this.posStack.length > 0) {
        var pos = this.popPos();
        return 'line: ' + pos.line + ', char: ' + pos.char;
    } else {
        return 'line: ' + this.line + ', char: ' + this.char;
    }
};

PascalCompiler.prototype.pushPos = function()
{
    this.posStack.push({line: this.line, char: this.char});
};

PascalCompiler.prototype.popPos = function()
{
    return this.posStack.pop();
};

PascalCompiler.prototype.pushCur = function()
{

    this.posStack.push({line: this.line, char: this.char, cur: this.cur});
};

PascalCompiler.prototype.popCur = function()
{
    var pos   = this.posStack.pop();
    this.line = pos.line;
    this.char = pos.char;
    this.cur  = pos.cur;
};
