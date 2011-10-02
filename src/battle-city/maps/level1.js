
function Level1(game)
{
    for (var i = 0 ; i < 10; i++) {
        game.botStack.add(new TankBot(0, 0, true));
    }

    var f = game.field;
    f.addObject(new Delimiter(        - 20, f.height /  2,          20, f.height / 2));
    f.addObject(new Delimiter(f.width + 20, f.height /  2,          20, f.height / 2));
    f.addObject(new Delimiter(f.width /  2,          - 20, f.width / 2,           20));
    f.addObject(new Delimiter(f.width /  2, f.height + 20, f.width / 2,           20));
    f.addObject(new Base(f.width / 2, f.height - 16));
    this.terrain(f);
};

Level1.prototype.terrain = function(field)
{
    var i, a, x, y;

    a = [4,5,6,7, 12,13,14,15, 36,37,38,39, 44,45,46,47];
    for (i in a) {
        x = a[i];
        for (y = 4 ; y < 22 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
        for (y = 34 ; y < 48 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    a = [20,21,22,23, 28,29,30,31];
    for (i in a) {
        x = a[i];
        for (y = 4 ; y < 18 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
        for (y = 22 ; y < 26 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
        for (y = 30 ; y < 42 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    a = [26,27,28,29];
    for (i in a) {
        y = a[i];
        for (x = 8 ; x < 16 ; x++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
        for (x = 36 ; x < 44 ; x++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    for (y = 26 ; y < 28 ; y++) {
        for (x = 0 ; x < 4 ; x++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
        for (x = 48 ; x < 52 ; x++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    for (x = 24 ; x < 28 ; x++) {
        for (y = 32 ; y < 36 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    field.addObject(new SteelWall( 0*8+8, 28*8+8));
    field.addObject(new SteelWall( 2*8+8, 28*8+8));
    field.addObject(new SteelWall(48*8+8, 28*8+8));
    field.addObject(new SteelWall(50*8+8, 28*8+8));

    field.addObject(new SteelWall(24*8+8, 12*8+8));
    field.addObject(new SteelWall(26*8+8, 12*8+8));
    field.addObject(new SteelWall(24*8+8, 14*8+8));
    field.addObject(new SteelWall(26*8+8, 14*8+8));

    for (x = 0 ; x < 8 ; x++) {
        for (y = 0 ; y < 6 ; y++) {
            // skip base
            if (y >= 2 && x >=2 && x < 6) continue;
            field.addObject(new Wall(
                    (field.width/2+(x-4)*8)+4,
                    (field.height+(y-6)*8)+4));
        }
    }
};

module.exports.map = Level1;
