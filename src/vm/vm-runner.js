define(['src/common/event.js',
        'src/vm/vm.js',
        'src/vm/compilers/pascal/parser.js'], function(Eventable, Vm, PascalCompiler) {
    function VmRunner(client, socket)
    {
        this.client = client;
        this.vm = new Vm(client);
        this.codeInterval = null;

        var self = this;
        socket.on('disconnect', function(){
            clearInterval(self.codeInterval);
        });
        socket.on('unjoined', function(){
            clearInterval(self.codeInterval);
        });
        socket.on('gameover', function(){
            clearInterval(self.codeInterval);
        });
        socket.on('task-done', function(message){
            if (message) {
                self.emit('write', message + '\n');
            }
            clearInterval(self.codeInterval);
            self.codeInterval = setInterval(function(){
                self.vm.step();
            }, 1);
        });

        this.vm.on('action', function(action){
            clearInterval(self.codeInterval);
            if (action.move) {
                self.client.move(action.move);
            }
            if (action.turn) {
                self.client.turn(action.turn);
            }
            if (action.fire) {
                self.client.fire();
            }
        });
        this.vm.on('write', function(data){
            self.client.emit('write', data);
        });
        this.vm.on('terminate', function(action){
            clearInterval(self.codeInterval);
        });
    };

    VmRunner.prototype.executeCode = function(code)
    {
        clearInterval(this.codeInterval);
        try {
            var res = new PascalCompiler(code).parse();
            console.log(res.code);
            this.vm.code = res.code;
            this.vm.reset();
        } catch (ex) {
            this.client.emit('compile-error', ex);
        }

        var self = this;
        this.codeInterval = setInterval(function(){
            self.vm.step();
        }, 1);
    };

    Eventable(VmRunner.prototype);

    return VmRunner;
});