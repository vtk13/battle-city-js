
function WidgetCreateBot(context, client)
{
    this.levelSelector = new WidgetLevelSelector($('.level', context), client);
    this.gameControls = new UiGameControls(context, client);
};

WidgetCreateBot.prototype.reset = function()
{
    if (window.codeMirror === null) {
        window.codeMirror = CodeMirror(document.getElementById('editor'), {
            value: "Program Level1;\n" +
                   "begin\n" +
                   "  move(176);\n" +
                   "  turn(\'right\');\n" +
                   "  move(160);\n" +
                   "end.",
            mode:  "pascal"
        });
    }
};
