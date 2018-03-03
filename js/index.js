var CodeVideoPlayer = new CodeVideoPlayer();
var JsonFileList = [];
$(document).ready(function () {

    resizeControls();
    get_json_list(true);

    if(CodeVideoPlayer.AutoStart){
        $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
    }else {
        $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
    }

    CodeVideoPlayer.VideoEnded = function(){
        $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
    }

    $('#play-button').bind('click',playClick);
    $('#forward-button').bind('click',forwardClick);
    $('#backward-button').bind('click',backwardClick);
    $('#replay-button').bind('click',replayClick);
    $("#mode-button").bind('click', toggleModeBox);
    $('.mode-select').bind('click', modeSelect);
    $('#page-combo').bind('click', togoPageCombo);

    var url = 'appphp/upload_json.php';

	$('#fileupload').fileupload({
		url: url,
		dataType: 'json',
		autoUpload: true,
		acceptFileTypes: /(\.|\/)(json)$/i,
		disableImageResize: false,
		previewMaxWidth: 100,
		previewMaxHeight: 100,
		previewCrop: true
	}).on('fileuploadadd', function (e, data) {

	}).on('fileuploaddone', function (e, data) {
        get_json_list(false);
	})

});



window.onresize = function(event) {
    resizeControls();
};

function jsonFileClick(){
    togoPageCombo();
    $('#page-combo').html($(this).text());
    load_json_file($(this).text());
}

function togoPageCombo(){
    if($('#page-select').css('height') === '260px'){
        $('#page-select').animate({
            height:'0px'
        },500)
    }else {
        $('#page-select').animate({
            height:'260px'
        },500)
    }
}

function playClick(){
    if($("#play-button").hasClass("play-button-style")){
        $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
        CodeVideoPlayer.Play();
    }else {
        $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
        CodeVideoPlayer.Pause();
    }
}

function forwardClick(){
    $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
    CodeVideoPlayer.GoToNextFrame();
}

function backwardClick(){
    $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
    CodeVideoPlayer.BackToLastFrame();
}

function replayClick(){
    $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
    CodeVideoPlayer.Replay();
}

var isModeVisible = false;
function toggleModeBox() {
    if ($("#mode-button").hasClass("mode-button-style-offline")) {
        return false;
    }
    if (isModeVisible == false) {
        isModeVisible = true;
        $("#mode-box").css('visibility', 'visible').show('slide', {direction: 'down'}, 250);
        $("#mode-button").addClass("mode-button-style-active");
    }
    else {
        isModeVisible = false;
        $("#mode-box").hide('slide', {direction: 'down'}, 150);
        $("#mode-button").removeClass("mode-button-style-active");
    }
}

function modeSelect(){
    $('.mode-select').removeClass('mode-settings-style-active');
    $(this).addClass('mode-settings-style-active');
    toggleModeBox();
    CodeVideoPlayer.ChangeSpeed(Number($(this).text()));
}

function get_json_list(loadFirstFile){
    $("#page-select-text").html('');
    $.ajax({
        type: 'POST',
        url: "appphp/get_json_filelist.php",
        dataType: 'JSON',
        success: function (data) {
            JsonFileList = data.filelist;
            $('#page-combo').html(JsonFileList[0]);
            JsonFileList.forEach(function (file, number) {
                $("#page-select-text").append('<a style="font-size:14px;display:block;" class="jsonFile page-select-text-line-style">' + file + '</a>');
            })
            $('.jsonFile').bind('click', jsonFileClick);
            if(loadFirstFile){
                load_json_file(JsonFileList[0])
            }
        }
    })
}

function load_json_file(file){
    $.ajax({
        type: 'POST',
        url: "appphp/get_json.php",
        data: {filename:file},
        dataType: 'JSON',
        success: function (data) {
            if(data.result === 'good'){
                CodeVideoPlayer.CreateVideo(data.json,'template-place');
                console.log(CodeVideoPlayer);
            }
        }
    })
}

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
