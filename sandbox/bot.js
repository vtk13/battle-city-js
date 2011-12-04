
//interface:

var self = this;
var store = {};
this.botCodeInterval = setInterval(function() {
    var tank = {
        getX        : function()
            {
                return self.field.get(self.user.tankId).x;
            },
        getY        : function()
            {
                return self.field.get(self.user.tankId).y;
            },
        startMove   : self.startMove.bind(self),
        stopMove    : self.stopMove.bind(self),
        fire        : self.fire.bind(self)
    };
    var field = {
        intersect: function(x, y, hw, hh, types)
        {
            var res = [];
            switch (true) {
                case types === undefined:
                    var tmp = self.field.intersect.call(self.field, {}, x, y, hw, hh);
                    for (var i in tmp) {
                        res.push(tmp[i]);
                    }
                break;
                case Array.isArray(types):
                    var tmp = self.field.intersect.call(self.field, {}, x, y, hw, hh);
                    for (var i in tmp) {
                        for (var t in types) {
                            if (tmp[i] instanceof types[t]) {
                                res.push(tmp[i]);
                                break;
                            }
                        }
                    }
                break;
                case types instanceof Function:
                    var tmp = self.field.intersect.call(self.field, {}, x, y, hw, hh);
                    for (var i in tmp) {
                        if (tmp[i] instanceof types) {
                            res.push(tmp[i]);
                        }
                    }
                break;
            }
            return res;
        }
    };
    eval(self.botSource);
}, 50);