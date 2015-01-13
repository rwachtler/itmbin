/**
 * Created by R.Wachtler on 13.01.15.
 */
$(document).ready(function(){
    var result = $("#result");
    var js = $("#js").val();
    var iframe = $("#result_frame");

    $("#run").click(function(){
        iframe.contents().find("head").empty();
        iframe.contents().find("head").append("<script src='/public/js/jquery/jquery.min.js'></script>");
        var htmlInput = $("#html").val();
        var css = $("#css").val();
        var js = $("#js").val();
        if(css !== undefined){

            var data=[css];


            var $style=$('<style>');

            $.each( data, function(i, item){
                console.log(item);
                $style.append(item + ';');
            })
                iframe.contents().find("head").append($style)


        }
        iframe.contents().find("body").html(htmlInput);

        if(js !== undefined){

            var script = "<script type='text/javascript'> function iFrameLoad() { var iframe = document.getElementById('result_frame'); var innerDoc = iframe.contentDocument || iframe.contentWindow.document; "+js.replace(/document\./g, "innerDoc.")+"}</script><script type='text/javascript'>$(document).ready(function () {iFrameLoad();});</script>";

            iframe.contents().find("head").append(script);
        }
    });

});
