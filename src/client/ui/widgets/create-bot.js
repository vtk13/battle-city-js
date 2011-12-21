
function WidgetCreateBot(context, client)
{
};

WidgetCreateBot.prototype.reset = function()
{
    if (window.codeMirror === null) {
        window.codeMirror = CodeMirror(document.getElementById('editor'), {
            value: "Program Program1;\n" +
                   "begin\n" +
                   "  \n" +
                   "end.",
            mode:  "pascal",
            theme: "night"
        });
    }
};
