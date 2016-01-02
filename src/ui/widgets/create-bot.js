define(function(){
    function WidgetCreateBot(context, client)
    {
        this.context = context;
        context.tabs({
            show: function(event, ui) {
                if (ui.index == 1) {
                    // hack to force codeMirror to show code
                    window.codeMirror.setValue(window.codeMirror.getValue());
                    window.codeMirror.focus();
                }
            }
        });
    };

    WidgetCreateBot.prototype.reset = function()
    {
        if (window.codeMirror === null) {
            window.codeMirror = CodeMirror(document.getElementById('editor'), {
                lineNumbers: true,
                mode:  "pascal",
                theme: "night"
            });
        }
        window.codeMirror.setValue("Program Program1;\n" +
                "begin\n" +
                "  \n" +
                "end.");
        this.context.tabs('option', 'active', 0);
    };

    return WidgetCreateBot;
});