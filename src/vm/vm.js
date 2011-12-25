/**
 * Интерпритатор эмулирует синхронное выполнение кода оправляя команды обработчику
 * и дожидаясь выполнения каждой команды.
 *
 * @var code массив действий для выполнения
 *
 * Система команд:
 *  <tank-move> <distance>
 *  <tank-turn> <direction>
 */


Vm = function Vm(codeStr)
{
    this.data = [];
    var res = new PascalCompiler(codeStr).parse();
    this.code = res.code;
    this.symbolTable = res.symbolTable;
    this.pointer = 0;
};

Eventable(Vm.prototype);

Vm.prototype.step = function()
{
    var command = this.code[this.pointer];
    if (command) {
        this.pointer++;
        this[command]();
    } else {
        console.log(this.symbolTable);
        this.emit('terminate');
    }
};

Vm.prototype['tank-move'] = function()
{
    this.emit('action', {
        'move': this.code[this.pointer++] * 16
    });
};

Vm.prototype['tank-turn'] = function()
{
    this.emit('action', {
        'turn': this.code[this.pointer++]
    });
};

Vm.prototype['move-var-ex'] = function()
{
    this.symbolTable.look(this.code[this.pointer]).value = this.code[this.pointer+1];
    this.pointer += 2;
};

Vm.prototype['move-var-var'] = function()
{
    this.symbolTable.look(this.code[this.pointer]).value =
        this.symbolTable.look(this.code[this.pointer+1]).value;
    this.pointer += 2;
};
