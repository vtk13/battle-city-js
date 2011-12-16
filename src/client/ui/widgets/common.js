function WidgetLevelSelector(context, client)
{
    client.currentPremade.on('change', function() {
        // "this" is client.currentPremade
        var levelSelect = $('select', context);
        levelSelect.empty();
        for (var i = 1; i <= Premade.types[this.type].levels; i++) {
            levelSelect.append($('<option value="' + i + '">' + i + '</option>'));
        }
        levelSelect.val(this.level);
    });
};
