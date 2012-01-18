
function WidgetCreateBot(context, client)
{
    var forced = false;
    context.tabs({
        show: function(event, ui) {
            if (ui.index == 1 && !forced) {
                // hack to force codeMirror to show code
                window.codeMirror.setValue(window.codeMirror.getValue());
                window.codeMirror.focus();
                window.codeMirror.setCursor({line: 2, ch: 2});
                forced = true;
            }
        }
    });
};

WidgetCreateBot.prototype.reset = function()
{
    if (window.codeMirror === null) {
        window.codeMirror = CodeMirror(document.getElementById('editor'), {
            value: "Program Program1;\n" +
                   "begin\n" +
                   "  \n" +
                   "end.",
            lineNumbers: true,
            mode:  "pascal",
            theme: "night"
        });
    }
};
