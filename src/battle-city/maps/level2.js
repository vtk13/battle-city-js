
function Level2(game)
{
    for (var i = 0 ; i < 10; i++) {
        game.botStack.add(new TankBot());
    }

    var f = game.field;
    f.addObject(new Delimiter(        - 20, f.height /  2,          20, f.height / 2));
    f.addObject(new Delimiter(f.width + 20, f.height /  2,          20, f.height / 2));
    f.addObject(new Delimiter(f.width /  2,          - 20, f.width / 2,           20));
    f.addObject(new Delimiter(f.width /  2, f.height + 20, f.width / 2,           20));
    f.addObject(new Base(f.width / 2, f.height - 16));
    this.terrain(f);
};

Level2.prototype.terrain = function(field)
{
    var i, a, x, y;

    a = [4,5,6,7, 28,29,30,31, 36,37,38,39, 44,45,46,47];
    for (i in a) {
        x = a[i];
        for (y = 4 ; y < 12 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }
    a = [12,13,14,15];
    for (i in a) {
        x = a[i];
        for (y = 12 ; y < 20 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    a = [36,37,38,39, 44,45,46,47];
    for (i in a) {
        x = a[i];
        for (y = 16 ; y < 20 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    a = [20,21,22,23];
    for (i in a) {
        x = a[i];
        for (y = 20 ; y < 24 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    a = [4,5,6,7, 8,9,10,11, 12,13,14,15, 44,45,46,47];
    for (i in a) {
        x = a[i];
        for (y = 24 ; y < 28 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    a = [20,21,22,23, 28,29,30,31, 36,37,38,39, 44,45,46,47];
    for (i in a) {
        x = a[i];
        for (y = 28 ; y < 32 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    a = [4,5,6,7, 20,21,22,23, 28,29,30,31, 44,45,46,47];
    for (i in a) {
        x = a[i];
        for (y = 32 ; y < 36 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    a = [4,5,6,7, 12,13,14,15, 20,21,22,23, 24,25,26,27, 28,29,30,31, 36,37,38,39, 44,45,46,47];
    for (i in a) {
        x = a[i];
        for (y = 36 ; y < 40 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    a = [4,5,6,7, 12,13,14,15, 20,21,22,23, 24,25,26,27, 28,29,30,31];
    for (i in a) {
        x = a[i];
        for (y = 40 ; y < 44 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    a = [4,5,6,7, 36,37,38,39, 44,45,46,47];
    for (i in a) {
        x = a[i];
        for (y = 44 ; y < 48 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    a = [4,5,6,7, 12,13,14,15, 36,37,38,39, 40,41,42,43, 44,45,46,47];
    for (i in a) {
        x = a[i];
        for (y = 48 ; y < 52 ; y++) {
            field.addObject(new Wall(x*8+4, y*8+4));
        }
    }

    a = {
             0: [32,34],
             2: [32,34],
            12: [0,2,4,6, 28,30,32,34],
            14: [0,2,4,6, 28,30,32,34],
            24: [16,18],
            26: [16,18],
            28: [0,2,24,26],
            30: [0,2,24,26],
            32: [20,22],
            34: [20,22],
            36: [12,14],
            38: [12,14],
            40: [8,10,36,38],
            42: [8,10,36,38],
            48: [16,18],
            50: [16,18]
    };
    for (x in a) {
        for (i in a[x]) {
            y = a[x][i];
            field.addObject(new SteelWall(x*8+8, y*8+8));
        }
    }

    for (x = 0 ; x < 8 ; x++) {
        for (y = 0 ; y < 6 ; y++) {
            // skip base
            if (y >= 2 && x >=2 && x < 6) continue;
            field.addObject(new Wall(
                    (field.width/2+(x-4)*8)+4,
                    (field.height+(y-6)*8)+4));
        }
    }

    // trees
    var trees = [[0, 4], [0, 5], [1, 5], [4, 6], [5, 6], [6, 6], [4, 7],
                 [10, 4], [10, 5], [10, 6]];
    for (i in trees) {
        x = trees[i][0];
        y = trees[i][1];
        field.addObject(new Trees(x*32+16, y*32+16));
    }
};

module.exports.map = Level2;
