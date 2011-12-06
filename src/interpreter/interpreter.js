/**
 * Интерпретатор эмулирует синхронное выполнение кода оправляя команды обработчику
 * и дожидаясь выполнения каждой команды.
 *
 * @var code массив действий для выполнения
 *
 * Система команд:
 *  <move> <distance>
 *  <turn> <direction>
 */


Interpreter = function Interpreter(codeStr)
{
    this.data = [];
    this.code = new PascalParser(codeStr).parse();
    this.pointer = 0;
};

Eventable(Interpreter.prototype);

Interpreter.prototype.step = function()
{
    var command = this.code[this.pointer];
    if (command) {
        this.pointer++;
        this[command]();
    } else {
        this.emit('terminate');
    }
};

Interpreter.prototype.move = function()
{
    this.emit('action', {
        'move': this.code[this.pointer++]
    });
};

Interpreter.prototype.turn = function()
{
    this.emit('action', {
        'turn': this.code[this.pointer++]
    });
};