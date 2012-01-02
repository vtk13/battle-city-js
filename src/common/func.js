vector = function vector(x)
{
    if (x) {
        return x/Math.abs(x);
    } else {
        return 0;
    }
};

serializeTypeMatches = {
    'Bullet'            : 1,
    'Tank'              : 2,
    'TankBot'           : 3,
    'HeavyTankBot'      : 4,
    'FastBulletTankBot' : 5,
    'FastTankBot'       : 6,
    'Wall'              : 7,
    'SteelWall'         : 8,
    'BonusTimer'        : 9,
    'BonusShovel'       : 10,
    'BonusStar'         : 11,
    'BonusHelmet'       : 12,
    'BonusLive'         : 13,
    'BonusGrenade'      : 14,
    'Water'             : 15,
    'Trees'             : 16,
    'Ice'               : 17,
    'Delimiter'         : 18,
    'Base'              : 19,
    'ServerUser'        : 20,
    'Premade'           : 21,
    'Message'           : 22,
    'Checkpoint'        : 23,
    'GoalCheckPoint'    : 24,
    'Course'            : 25
};

unserializeTypeMatches = {
    1: 'Bullet',
    2: 'Tank',
    3: 'TankBot',
    4: 'HeavyTankBot',
    5: 'FastBulletTankBot',
    6: 'FastTankBot',
    7: 'Wall',
    8: 'SteelWall',
    9: 'BonusTimer',
    10: 'BonusShovel',
    11: 'BonusStar',
    12: 'BonusHelmet',
    13: 'BonusLive',
    14: 'BonusGrenade',
    15: 'Water',
    16: 'Trees',
    17: 'Ice',
    18: 'Delimiter',
    19: 'Base',
    20: 'User',
    21: 'Premade',
    22: 'Message',
    23: 'Checkpoint',
    24: 'GoalCheckPoint',
    25: 'Course'
};
