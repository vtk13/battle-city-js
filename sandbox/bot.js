
function moveToPosition()
{
  if (tank.getY() > 13*16) {
    tank.startMove('up');
  } else {
    tank.startMove('left');
    tank.stopMove();
    store.step = clearLeftLine;
  }
}

function clearLeftLine()
{
  var inters = field.intersect(tank.getX()/2, tank.getY(),
                               tank.getX()/2, 8);
  var foundWall = false;
  for (var i in inters) {
    if (inters[i] instanceof Wall) {
      foundWall = true;
      break;
    }
  }
  if (foundWall) {
    tank.fire();
  } else {
    tank.startMove('right');
    tank.stopMove();
    store.step = clearRightLine;
  }
}

function clearRightLine()
{
  var inters = field.intersect((416+tank.getX())/2, tank.getY(),
                               (416-tank.getX())/2, 8);
  var foundWall = false;
  for (var i in inters) {
    if (inters[i] instanceof Wall) {
      foundWall = true;
      break;
    }
  }
  if (foundWall) tank.fire();
  else store.step = end;
}

function end()
{

}

if (!store.step) store.step = moveToPosition;

store.step();