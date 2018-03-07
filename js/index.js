var CodeVideoPlayer = new CodeVideoPlayer();
var JsonFileList = [];
var ProgressShowTimer = null;
var ProgressTimer = null;
var isProgressVisisble = false;
var PageToolTip = '';
var admin_ProgressWidth = 926;
var isModeVisible = false;
var isPageComboVisible = false;

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

    CodeVideoPlayer.FrameChanged = function () {
        updateProgressBar();
    }

    $('#play-button').bind('click',playClick);
    $('#forward-button').bind('click',forwardClick);
    $('#backward-button').bind('click',backwardClick);
    $('#replay-button').bind('click',replayClick);
    $("#mode-button").bind('click', function(){
        if(isPageComboVisible){
            togoPageCombo();
        }
        toggleModeBox()
    });
    $('.mode-select').bind('click', modeSelect);
    $('#page-combo').bind('click', togoPageCombo);
    $("#progress-bar").bind('mouseover', function () {
        clearTimeout(ProgressTimer);
        ProgressShowTimer = setTimeout('ShowProgress()', 200);
    });
    $("#progress-bar").bind('mouseout', function () {
        clearTimeout(ProgressShowTimer);
        ProgressTimer = setTimeout('HideProgress()', 800);
    });

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

function updateProgressBar() {
    ProgressPrecentage = Math.round(((CodeVideoPlayer.CurrentFrame) / (CodeVideoPlayer.TotalFrame)) * 100);
    $("#progress-bar-circle").css({"left": Math.round((admin_ProgressWidth * ProgressPrecentage / 100) - 9) + "px"});
    $("#progress-bar-middle").width(Math.round(admin_ProgressWidth * ProgressPrecentage / 100) + "px");

    PageToolTip = 'Page '+CodeVideoPlayer.CurrentFrame+' out of '+CodeVideoPlayer.TotalFrame;
    $("#tooltip-text").html("<nobr>" + PageToolTip + "</nobr>");


    var tooltip_left = $("#progress-bar").position().left + Math.round((admin_ProgressWidth * ProgressPrecentage / 100) - 5);
    var tooltip_width = $("#tooltip").width();
    var tooltip_half_width = Math.round($("#tooltip").width() / 2);
    var bubble_width = Math.round($("#tooltip-bubble").width() / 2);

    var bubble_position = tooltip_half_width - bubble_width;

    var tooltip_left_pos = tooltip_left - tooltip_half_width + bubble_width - 4;

    if (tooltip_left_pos < 10) {
        $("#tooltip-bubble").show();
        bubble_position = bubble_position + tooltip_left_pos - 10;
        if (ProgressPrecentage < 4) {
            $("#tooltip-bubble").hide();
        }
        else {
            $("#tooltip-bubble").show();
        }
        tooltip_left_pos = 10;
    }
    else if ((tooltip_left_pos + tooltip_width) > (admin_ProgressWidth)) {
        bubble_position = bubble_position + (tooltip_left_pos + tooltip_width - (admin_ProgressWidth + 17));

        tooltip_left_pos = (admin_ProgressWidth + 17) - tooltip_width;

        if (ProgressPrecentage > 90) {
            $("#tooltip-bubble").hide();
        }
        else {
            $("#tooltip-bubble").show();
        }
    }
    else {
        $("#tooltip-bubble").show();
    }


    $("#tooltip").css({"left": (tooltip_left_pos) + "px"});
    $("#tooltip-bubble").css({"left": bubble_position + "px"});
    $("#tooltip").css({"top": ($("#progress-bar").position().top - 60) + "px"});
}

function ShowProgress() {
    if (isProgressVisisble == false) {
        isProgressVisisble = true;
        $("#progress-bar-circle").css('visibility', 'visible').fadeIn('fast');
        $("#tooltip").css('visibility', 'visible').fadeIn('fast');
    }
    clearTimeout(ProgressTimer);
}

function HideProgress() {
    isProgressVisisble = false;
    $("#tooltip").fadeOut('slow');
    $("#progress-bar-circle").fadeOut('slow');
}

function jsonFileClick(){
    togoPageCombo();
    if($("#play-button").hasClass("play-button-style")){
        $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
    }
    $('#page-combo').html($(this).text());
    load_json_file($(this).text());
}

function togoPageCombo(){
    if($('#page-select').css('height') === '260px'){
        $('#page-select').animate({
            height:'0px'
        },500)
        isPageComboVisible = false;
    }else {
        $('#page-select').animate({
            height:'260px'
        },500)
        isPageComboVisible = true;
    }
    if(isModeVisible){
        toggleModeBox()
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
    if(isModeVisible){
        toggleModeBox()
    }
    if(isPageComboVisible){
        togoPageCombo();
    }
}

function forwardClick(){
    $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
    CodeVideoPlayer.GoToNextFrame();
    if(isModeVisible){
        toggleModeBox()
    }
    if(isPageComboVisible){
        togoPageCombo();
    }
}

function backwardClick(){
    $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
    CodeVideoPlayer.BackToLastFrame();
    if(isModeVisible){
        toggleModeBox()
    }
    if(isPageComboVisible){
        togoPageCombo();
    }
}

function replayClick(){
    $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
    CodeVideoPlayer.Replay();
    if(isModeVisible){
        toggleModeBox()
    }
    if(isPageComboVisible){
        togoPageCombo();
    }
}

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
