
AbstractGameObject = function AbstractGameObject()
{

};

AbstractGameObject.prototype.setImage = function(img)
{
    try {
        this.img = window.images[img];
    } catch (e) {}
};