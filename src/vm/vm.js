/**
 * Интерпритатор эмулирует синхронное выполнение кода оправляя команды обработчику
 * и дожидаясь выполнения каждой команды.
 *
 * @var code массив действий для выполнения
 */

/*
Регистры (любое значение):
  ax

Система команд:
  <tank-move> <distance>
  <tank-turn> <direction>
  <jz> <offset>
*/

Vm = function Vm(code)
{
    this.code = code;
    this.reset();
};

Eventable(Vm.prototype);

Vm.prototype.reset = function()
{
    this.registers = {
        'ax': null
    };
    this.stack = [];
    this.data = [];
    this.pointer = 0;
};

Vm.prototype.step = function()
{
    var command = this.code[this.pointer];
    if (command) {
        this.pointer++;
        if (typeof(this[command]) == 'function') {
            this[command]();
        } else {
            throw new Error('"' + command + '" is not a valid command');
        }
    } else {
        this.emit('terminate');
    }
};

Vm.prototype['write'] = function()
{
    var args = parseInt(this.code[this.pointer++]);
    for (var i = 0 ; i < args ; i++) {
        this.emit('write', this.code[this.pointer++]);
    }
};

Vm.prototype['writeln'] = function()
{
    this.write();
    this.emit('write', '\n');
};

Vm.prototype['jmp'] = function()
{
    var offset = parseInt(this.code[this.pointer++]);
    this.pointer  += offset;
};

Vm.prototype['push-val'] = function()
{
    var value = this.code[this.pointer++];
    this.stack.push(value);
};

Vm.prototype['pop-reg'] = function()
{
    var registerName = this.code[this.pointer++];
    this.registers[registerName] = this.stack.pop();
};

Vm.prototype['add'] = function()
{
    var arg2 = parseInt(this.stack.pop()); // second argument
    var arg1 = parseInt(this.stack.pop()); // first argument
    this.registers['ax'] = arg1 + arg2;
};

Vm.prototype['sub'] = function()
{
    var arg2 = parseInt(this.stack.pop()); // second argument
    var arg1 = parseInt(this.stack.pop()); // first argument
    this.registers['ax'] = arg1 - arg2;
};

Vm.prototype['move-reg-mem'] = function()
{
    var registerName = this.code[this.pointer++];
    var address = this.code[this.pointer++];
    this.registers[registerName] = this.code[address];
};

Vm.prototype['move-mem-reg'] = function()
{
    var address = this.code[this.pointer++];
    var registerName = this.code[this.pointer++];
    this.code[address] = this.registers[registerName];
};

Vm.prototype['move-mem-val'] = function()
{
    var address = this.code[this.pointer++];
    var value = this.code[this.pointer++];
    this.code[address] = value;
};

Vm.prototype['move-mem-mem'] = function()
{
    var address1 = this.code[this.pointer++];
    var address2 = this.code[this.pointer++];
    this.code[address1] = this.code[address2];
};

Vm.prototype['jz'] = function()
{
    var offset = parseInt(this.code[this.pointer++]);
    if (this.registers['ax'] == 0) {
        this.pointer += offset;
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
