
AbstractGameObject = function AbstractGameObject()
{
    this.z = 1;
};

AbstractGameObject.prototype.setImage = function(img1/*, img2, ...*/)
{
    this.img = arguments;
};
