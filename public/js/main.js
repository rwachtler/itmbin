/**
 * Created by R.Wachtler on 13.01.15.
 */
$(document).ready(function(){
    var result = $("#result");
    var js = $("#js").val();
    var iframe = $("#result_frame");
    var htmlTextArea = document.getElementById("html");
    var cssTextArea = document.getElementById("css");
    var jsTextArea = document.getElementById("js");
    var htmlCodeMirror = CodeMirror(function(elt) {
        htmlTextArea.parentNode.replaceChild(elt, htmlTextArea);
    },
        {
            value: htmlTextArea.value,
            lineNumbers: true
        });
    var cssCodeMirror = CodeMirror(function(elt) {
            cssTextArea.parentNode.replaceChild(elt, cssTextArea);
        },
        {
            value: cssTextArea.value,
            lineNumbers: true,
            mode:  "css"
        });
    var jsCodeMirror = CodeMirror(function(elt) {
            jsTextArea.parentNode.replaceChild(elt, jsTextArea);
        },
        {
            value: jsTextArea.value,
            lineNumbers: true,
            mode:  "javascript"
        });
    $("#run").click(function(){
        iframe.contents().find("head").empty();
        iframe.contents().find("head").append("<script src='/public/js/jquery/jquery.min.js'></script>");
        var htmlInput = htmlCodeMirror.getValue();
        //var css = $("#css").val();
        //var js = $("#js").val();
        if(cssCodeMirror.getValue() !== undefined){

            var data=[cssCodeMirror.getValue()];


            var $style=$('<style>');

            $.each( data, function(i, item){
                $style.append(item + ';');
            })
                iframe.contents().find("head").append($style)


        }
        iframe.contents().find("body").html(htmlInput);

        if(jsCodeMirror.getValue() !== undefined){

            var script = "<script type='text/javascript'> " +
                "function iFrameLoad() { " +
                    "var iframe = document.getElementById('result_frame');" +
                    " var innerDoc = iframe.contentDocument || iframe.contentWindow.document; " +
                    jsCodeMirror.getValue().replace(/document\./g, "innerDoc.")+"" +
                "}" +
                "</script>" +
                "<script type='text/javascript'>" +
                    "$(document).ready(function () {iFrameLoad();});" +
                "</script>";

            iframe.contents().find("head").append(script);
        }
    });

});
