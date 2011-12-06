/**
 * Интерпретатор эмулирует синхронное выполнение кода оправляя команды обработчику
 * и дожидаясь выполнения каждой команды.
 *
 * @var code массив действий для выполнения
 */


Interpreter = function Interpreter(codeStr)
{
    this.code = new PascalParser(codeStr).parse();
    this.pointer = 0;
};

Eventable(Interpreter.prototype);

Interpreter.prototype.step = function()
{
    while (this.code[this.pointer]) {
        var res = this.code[this.pointer++].step();
        if (res && res.action) {
            this.emit('action', res.action);
            return;
        }
    }
    this.emit('terminate');
};
