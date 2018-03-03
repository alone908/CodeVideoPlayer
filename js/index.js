var CodeVideoPlayer = new CodeVideoPlayer();
var JsonFileList = [];
$(document).ready(function () {

    resizeControls();

    $.ajax({
        type: 'POST',
        url: "appphp/get_json_filelist.php",
        dataType: 'JSON',
        success: function (data) {
            JsonFileList = data.filelist;
            $('#page-combo').html(JsonFileList[0]);
            JsonFileList.forEach(function (file, number) {
                $("#page-select-text").append('<a href="#" onclick="return false" style="font-size:14px;display:block; margin-left: 10px !important;" class="page-select-text-line-style">' + file + '</a>');
            })

            $.ajax({
                type: 'POST',
                url: "appphp/get_json.php",
                data: {filename:JsonFileList[0]},
                dataType: 'JSON',
                success: function (data) {
                    if(data.result === 'good'){

                        CodeVideoPlayer.CreateVideo(data.json,'template-place');
                        console.log(CodeVideoPlayer);

                    }
                }
            })

        }
    })

})

function resizeControls() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();


    var NewTop = (windowHeight / 2) - ($("#skin-container").height() / 2);
    if (NewTop < 5) { NewTop = 5;}

    $("#page").css({"margin-top": NewTop + "px"});

    var NewLeft = (windowWidth / 2) - ($("#skin-container").width() / 2);
    if (NewLeft < 5) {NewLeft = 5;}

    $("#page").css({"margin-left": NewLeft + "px"});
    $("#page").show();
}
