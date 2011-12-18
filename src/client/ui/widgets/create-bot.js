
function WidgetCreateBot(context, client)
{
};

WidgetCreateBot.prototype.reset = function()
{
    if (window.codeMirror === null) {
        window.codeMirror = CodeMirror(document.getElementById('editor'), {
            value: "Program Level1;\n" +
                   "begin\n" +
                   "  move(11);\n" +
                   "  turn(\'right\');\n" +
                   "  move(10);\n" +
                   "end.",
            mode:  "pascal",
            theme: "night"
        });
    }
};
