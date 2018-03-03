/*
 * IEngine5
 * IEngine5 Video Engine
 *
 * Copyright (c) Inspired eLearning Inc. 2003-2017.  All Rights Reserved.
 * This source file is proprietary property of Inspired eLearning Inc.
 * http://http://www.inspiredelearning.com/inspired/License
 *
 * @version 5.0
todo.addClassChangers to all pages (Selector:Add/RemoveClass:ClassName) function will run whenever a dialog is shown or elements are loaded
todo.add operation for tabs
 */

//------------------------------------------------------------------------------------------------------------------
(function ($) {
    var cache = [];
    $.preLoadImages = function () {
        var args_len = arguments.length;
        for (var i = args_len; i--;) {
            var cacheImage = document.createElement('img');
            cacheImage.src = arguments[i];
            cache.push(cacheImage);
        }
    }
})(jQuery);


isThisChrome = function () {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
};

isThisSafari = function () {
    return /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
};

isThisFirefox = function () {
    return navigator.userAgent.toUpperCase().indexOf('FIREFOX') >= 0;
};

isThisMac = function () {
    return navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
};

//------------------------------------------------------------------------------------------------------------------
function loadCourseCssFile(pathToFile) {

    if (document.createStyleSheet) {
        try {
            document.createStyleSheet(pathToFile);
        } catch (e) {
        }
    }
    else {
        var css;
        css = document.createElement('link');
        css.rel = 'stylesheet';
        css.type = 'text/css';
        css.media = "all";
        css.href = pathToFile;
        document.getElementsByTagName("head")[0].appendChild(css);
    }
}


//------------------------------------------------------------------------------------------------------------------
function cleanURL(url) {
    return (url.replace(/\?.*$/, "")
        .replace(/\/[^\/]*\.[^\/]*$/, "")
        .replace(/\/$/, "") + "/");
}

//------------------------------------------------------------------------------------------------------------------
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}


//------------------------------------------------------------------------------------------------------------------
function SearchInArray(xarray, needle) {
    var i = -1, index = -1;

    for (i = 0; i < xarray.length; i++) {
        if (xarray[i] === needle) {
            index = i;
            break;
        }
    }
    return index;
}

//------------------------------------------------------------------------------------------------------------------
function fisherYates(myArray) {
    var i = myArray.length;
    if (i == 0)
        return false;
    while (--i) {
        var j = Math.floor(Math.random() * (i + 1));
        var tempi = myArray[i];
        var tempj = myArray[j];
        myArray[i] = tempj;
        myArray[j] = tempi;
    }
}


//------------------------------------------------------------------------------------------------------------------
var SettingsXML;

var isiPad = false;
var isiPadFirstTimeLoad = false;

var ua = navigator.userAgent.toLowerCase();
var isiPad_ = navigator.userAgent.match(/iPad/i) != null;
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

//treat ipad and andorid the same way
if (((isiPad_) || (isAndroid)) && (!isMobile)) {
    isiPad = true;
    isiPadFirstTimeLoad = true;
}


var CourseLanguage = getParameterByName("lang");
if (CourseLanguage == "") {
    CourseLanguage = "en";
}

var TimeSpentOnPage;
var PrevPageID = -1;
var UserHistory = [];

//var CourseMode = "Video";

var admin_CopyrightInfo = "";
var admin_Version = "";

var admin_Branding_ReqData = "";
var admin_LogoBranding = false;
var admin_PolicyBranding = false;
var admin_LogoBranding_url = "";
var admin_PolicyBranding_array = [];
var admin_PolicyBrandingBackup_url = "";

var admin_URLOnExit = "";

var admin_AutoForwardDefaultSetting = true;
var admin_AutoForwardEnabled = true;
var admin_ForwardBlink = true;

var admin_DisableVolume = false;

var admin_BottomLogo = "";
var admin_TopLogo = "";

var admin_HelpFile = "";
var admin_GlossaryFile = "";
var admin_CourseFile = "";

// var admin_ScormOrFinalQuiz = ""; -- no longer in use as of iEngine 5.0

var admin_Submit = "";
var admin_Finish = "";
var admin_Help = "";
var admin_Glossary = "";
var admin_SaveAndExit = "";
var admin_Review = "";
var admin_ReviewMode = false;

var admin_VideoProgress = true;
var admin_VideoProgressCanMove = true;

var admin_Volume = "";
var admin_Mute = "";
var admin_UnMute = "";

var admin_Mode = "";

var admin_AutoForwardText = "";
var admin_NoAutoForwardText = "";

var admin_Replay = "";

var admin_Prev = "";

var admin_Pause = "";
var admin_Play = "";

var admin_Next = "";

var admin_Progress = "";
var admin_ProgressWidth = 775;

var admin_MinTimeWaitAlert = "";
var admin_DropDownAlert = "";
var admin_FlatQuizAlert = "";

var admin_UseScorm = false;
var admin_HostedOniLMS = false;

var FirstLoad = true;
var SuspendData = "";

var admin_FinalPassingPercentage = 50;
var admin_FinalRetakeTillPass = true;
var admin_FinalRetakeMaxCount = 999;
var admin_FinalRetakeCounter = 0;

var CourseStartTime = new Date();
var CourseTotalSeconds = 0;

var admin_ShowTimer = false;
var admin_MinTime = 0;
var admin_MinTimeMessage = "";
var admin_TimerText = "Time: ";

var admin_ShowFinalScoreDialog = true;


//------------------------------------------------------------------------------------------------------------------
var isDown = false;   // Tracks status of mouse button
var isPlay = 0;

var isPageComboOpen = false;
var isGlossaryOpen = false;
var isHelpOpen = false;

var ProgressPrecentage = 0;
var isProgressVisisble = false;
var isVideoProgressVisisble = false;
var ProgressTimer = null;
var ProgressShowTimer = null;

var VideoProgressTimer = null;
var VideoProgressShowTimer = null;

var isVolumeVisible = false;
var VolumeTimer = null;
var VolumeMute = false;
var VolumeSliderMouseDown = false;
var VolumeMouseMin = 15;
var VolumeMouseMax = 140;
var VolumeYOffset = -10;
var VolumeValue = 75;
var VolumerelativePosition = {left: 0, top: VolumeMouseMin};

var CourseXML;
var selectedModuleID = 0;
var selectedPageID = 1;
var CurrentPageNumber = 1;

var CurrentTemplateID = 1;

var GlossaryXML;

var DialogIsVisible = false;

var CurrentMode = "QF" + getParameterByName("mode");
if (CurrentMode == "QF") {
    CurrentMode = "QF1";
}

var CurrentPosition = 0;

var TextGoBackwards = 0;


var isModeVisible = false;
var ModeSettingID = "mode-480p";
var PageRowDivID = "C1";
var GlossarySelectID = "Glossary_1";

var TemplateArray = [];
var TemplateArrayHasVideo = [];
var TemplateVideoWidth = [];
var TemplateVideoHeight = [];
var ModulePageArray = [];

var GlossaryTerms = [];
var CourseName = "";

var PageTextArray = [];
var CurrentTextFrame = 0;
var ShowOnVideoTimeIsZero = true;
var VideoWithSingleFrame = false;

var StartButton = "";
var ContinueButton = "";
var DialogFadeSpeed = 250;
var CourseFailureCloseCourse = false;


var CurrentPageMode = "";

var FlashModeAudioEndBlink = false;
var FlashModeAudioEndNext = false;
var FlashModeAudioEndGoTo = "";

var FirstTimeLoad = true;

var MouseOnProgressBar = false;
var MouseOnVideo = false;
var VideoLength = 0;

var ScormTotalTime = 0;
var ScormTotalHours = 0;
var ScormTotalMinutes = 0;
var ScormTotalSeconds = 0;
var startingTime = false;
var PlayButtonBlinkTimer = new Object();
var FwdButtonBlinkTimer = new Object();
var fwdtimerblink = new Object();

var InitAudio = "xmls/" + CourseLanguage + "/audio/click.mp3";
var xke = "";

//var FlashFrameInterval = 100;

var VideoPopopStyle = "quiz";

var admin_L_URL = "";
var KeyCode = "";
var XCode = "1111";
var XCode2 = "1111";
var XCode3 = "1111";

var admin_FinalExamFile = "";
var FinalXML = "";
var FinalExamCurrentActiveQuestion = 0;

var FinalExamQArray = [];
var FinalExamGroupMaxQuestions = 0;

var admin_FinalExamPostQuestionsScorm = true;

var FirstExamPage = true;

var admin_PreExamFile = "";
var PreExamXML = "";
var PreExamCurrentActiveQuestion = 0;
var PreExamMaxQuestions = 0;
var PreExamScorePercentage = 0;


var admin_SurveyFile = "";
var SurveyXML = "";
var SurveyCurrentActiveQuestion = 0;
var SurveyMaxQuestions = 0;


var SuspendDataArray = [];

// SCORM Version
var admin_UseScorm12 = false;
var admin_UseScorm2004 = false;
// END


var GamificationUserScore = 0;
var GamificationComputerScore = 0;
var GamificationScoreArray = [];
var GamificationQuestionUserScore = 0;
var GamificationQuestionComputerScore = 0;
var GamifcationContinueOnFirstChoice = false;
var GamificationShowInGameScore = false;
var GamificationLastQuestion = false;
var GamificationSuspendData = "";
var GamificationPassingPoints = 0;
var GamificationMaxPoints = 100;

var TextModeForwardNextSlide = false;

var admin_DisableExit = false;

var PreExamSkipModules = ",";
var PreExamAdaptiveTraining = false;
var PreExamEnabled = false;
var FinalExamEnabled = false;
var SurveyEnabled = false;

var EncryptTests = false;

var admin_preExamAndText = ", and";

var admin_Branding_URL = "";

var BranchingXML = "";
var BrancihngIgnoreList = ["empty"];
var BookmarkBoxAudio = "";
var BranchingBoxAudio = "";
var BranchingSkipModulesPages = "";
var admin_BranchingFile = "";

var CCEnabled = false;

var admin_CCText = "";
var admin_NoCCText = "";

var AnswerResultAudio = "";

var TextModeLinkClick = 0;

var admin_PostGamificationToScorm = true;
var CourseHasFinalExam = false;

//------------------------------------------------------------------------------------------------------------------

var PopupAnswersArray = [];
var PopupAnswersArrayOrdered = [];
var PopupMaxAnswers = -1;
var PopupRightAnswer = false;
var PopupRules;
var ContinueOnCorrect = false;

var PopupQuizAnswerCache = [];
var PopupQuizAnswerTextCache = [];
var QTargetDialogName = "";

var IntroAudio = "";
var IntroBoxAudio = "";
var CurrentPlayAudio = "";

var BumpyQuizIntroTimeout;
var BumpyQuizOptionsTimeout;
var ImageAnimationInterval;
var ImageAnimationTimeout;

var GamificationDialogTimeOut;
var GamificationIsLost = false;
var GamificationDialogVisible = false;
var admin_GamificationRetakeTillPass = true;

var iEngineScript1 = null;
var iEngineScript2 = null;
var iEngineScript3 = null;

var SequencerIsDragging = false;

var MaxVirtualPages = 0;

var MobileScaleRatio = 1;

//------------------------------------------------------------------------------------------------------------------
function UnlockNextPage(goNext, isFwdClick) {
    isFwdClick = typeof isFwdClick !== 'undefined' ? isFwdClick : false;

    if (selectedPageID < ModulePageArray.length - 1) {
        ModulePageArray[selectedPageID + 1].xViewable = 1;
        $("#C" + (selectedPageID + 1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

        if (ModulePageArray[selectedPageID + 1].xName.charAt(0) == "M") //if next row is module then activate the one bellow too
        {
            ModulePageArray[selectedPageID + 2].xViewable = 1;
            $("#C" + (selectedPageID + 2)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
        }
    }

    $("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");

    if (selectedPageID == ModulePageArray.length - 1) {
        $("#forward-button").addClass("forward-button-style-offline").removeClass("forward-button-style");
    }

    if (goNext) {
        if (( ((admin_AutoForwardDefaultSetting == true) && (!isFwdClick)) || (isFwdClick) ) && (selectedPageID < ModulePageArray.length - 1)) {
            selectedPageID++;
            LoadPage(selectedPageID, 0, 0, 1);
        }
        else {
            if (selectedPageID < ModulePageArray.length - 1) {
                FwdBlink(4000, 1000);
            }
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
function LoadAndPlayAudioOne(AudioSrc, UpdatePlayButton) {
    if (CourseMode == "Video") {
        if ((typeof AudioSrc !== "undefined")) {
            if (AudioSrc !== "") {
                $("#jplayer_audio").jPlayer("setMedia", {mp3: AudioSrc});
                $("#jplayer_audio").jPlayer("play");

                if (UpdatePlayButton) {
                    isPlay = 1;
                    $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
                    $("#play-button").attr('alt', admin_Pause);
                    $("#play-button").attr('title', admin_Pause);
                }
            }
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
function PauseAudioOne(UpdatePlayButton, StopPlayer) {
    if (CourseMode == "Video") {
        if (StopPlayer) {
            $("#jplayer_audio").jPlayer("stop");
        }
        else {
            $("#jplayer_audio").jPlayer("pause");
        }

        if (UpdatePlayButton) {
            isPlay = 0;
            $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
            $("#play-button").attr('alt', admin_Play);
            $("#play-button").attr('title', admin_Play);
        }

    }
}

//------------------------------------------------------------------------------------------------------------------
function PlayAudioOne(UpdatePlayButton) {
    if (CourseMode == "Video") {
        $("#jplayer_audio").jPlayer("play");

        if (UpdatePlayButton) {
            isPlay = 1;
            $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
            $("#play-button").attr('alt', admin_Pause);
            $("#play-button").attr('title', admin_Pause);
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
function LoadAndPlayAudioBackground(AudioSrc, UpdatePlayButton) {
    if (CourseMode == "Video") {
        if ((typeof AudioSrc !== "undefined")) {
            if (AudioSrc !== "") {
                $("#jplayer_background").jPlayer("setMedia", {mp3: AudioSrc});
                $("#jplayer_background").jPlayer("play");

                if (UpdatePlayButton) {
                    isPlay = 1;
                    $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
                    $("#play-button").attr('alt', admin_Pause);
                    $("#play-button").attr('title', admin_Pause);
                }
            }
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
function PauseBackgroundAudio(UpdatePlayButton, StopPlayer) {
    if (CourseMode == "Video") {
        if (StopPlayer) {
            $("#jplayer_background").jPlayer("stop");
        }
        else {
            $("#jplayer_background").jPlayer("pause");
        }

        if (UpdatePlayButton) {
            isPlay = 0;
            $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
            $("#play-button").attr('alt', admin_Play);
            $("#play-button").attr('title', admin_Play);
        }

    }
}

//------------------------------------------------------------------------------------------------------------------
function PlayBackground(UpdatePlayButton) {
    if (CourseMode == "Video") {
        $("#jplayer_background").jPlayer("play");

        if (UpdatePlayButton) {
            isPlay = 1;
            $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
            $("#play-button").attr('alt', admin_Pause);
            $("#play-button").attr('title', admin_Pause);
        }
    }
}

function LoadAndPlayEffectSound(AudioSrc, UpdatePlayButton) {
    if (CourseMode == "Video") {
        if ((typeof AudioSrc !== "undefined")) {
            if (AudioSrc !== "") {
                $("#jplayer_effectSound").jPlayer("setMedia", {mp3: AudioSrc});
                $("#jplayer_effectSound").jPlayer("play");

                if (UpdatePlayButton) {
                    isPlay = 1;
                    $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
                    $("#play-button").attr('alt', admin_Pause);
                    $("#play-button").attr('title', admin_Pause);
                }
            }
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
function PauseEffectSound(UpdatePlayButton, StopPlayer) {
    if (CourseMode == "Video") {
        if (StopPlayer) {
            $("#jplayer_effectSound").jPlayer("stop");
        }
        else {
            $("#jplayer_effectSound").jPlayer("pause");
        }

        if (UpdatePlayButton) {
            isPlay = 0;
            $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
            $("#play-button").attr('alt', admin_Play);
            $("#play-button").attr('title', admin_Play);
        }

    }
}

//------------------------------------------------------------------------------------------------------------------
function PlayEffectSound(UpdatePlayButton) {
    if (CourseMode == "Video") {
        $("#jplayer_effectSound").jPlayer("play");

        if (UpdatePlayButton) {
            isPlay = 1;
            $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
            $("#play-button").attr('alt', admin_Pause);
            $("#play-button").attr('title', admin_Pause);
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
function PlayVideo(UpdatePlayButton) {
    if (CourseMode == "Video") {
        if ((isThisSafari()) && (!isiPad)) {
            setTimeout(function () {
                $("#jplayer_video video").attr('playsinline', '');
                $("#jplayer_video video").attr('webkit-playsinline', '');
                $("#jplayer_video").jPlayer("play", 0);
            }, 1000);
        }

        $("#jplayer_video video").attr('playsinline', '');
        $("#jplayer_video video").attr('webkit-playsinline', '');
        $("#jplayer_video").jPlayer("play");
        if (UpdatePlayButton) {
            isPlay = 1;
            $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
            $("#play-button").attr('alt', admin_Pause);
            $("#play-button").attr('title', admin_Pause);
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
function PauseVideo(UpdatePlayButton, StopPlayer) {
    if (CourseMode == "Video") {
        if (StopPlayer) {
            $("#jplayer_video").jPlayer("stop");
        }
        else {
            $("#jplayer_video").jPlayer("pause");
        }

        if (UpdatePlayButton) {
            isPlay = 0;
            $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
            $("#play-button").attr('alt', admin_Play);
            $("#play-button").attr('title', admin_Play);
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
function ShowStandardDialog(TargetDialogName) {
    $(CourseXML).find("Dialogs").each(function () {
        $(CourseXML).find("StandardDialog").each(function () {
            if ($(this).attr("Name") == TargetDialogName) {
                DialogHeader = $(this).find("DialogHeader").text();
                DialogURL = $(this).attr("File");
                DialogAudio = $(this).attr("AudioFile");
                if (typeof DialogAudio == "undefined") {
                    DialogAudio = "";
                }

                //only dialogs that overlay video can have audio, the jplayer_audio is resevered for audio on flash so can't be used here
                if ((DialogAudio != "") && (CurrentPageMode != "flash")) {
                    if (CourseMode == "Video") {
                        if (!isiPad) //don't play audio on video popups
                        {
                            LoadAndPlayAudioOne(DialogAudio, true);
                        }
                    }
                }

                //pause playback for video
                if ((CourseMode == "Video") && (CurrentPageMode != "flash")) {
                    PauseVideo(true, false);
                }

                //pause flash
                if (CurrentPageMode == "flash") {
                    PauseAudioOne(false, false);
                    PauseBackgroundAudio(false, false);

                    if ($("#jplayer_video").is(":visible")) {
                        PauseVideo(true, false);
                    }
                    BreakSequenceLoop = true;
                    FlashAbortTimer();
                }

                NewDialog($(this).attr("Top"), $(this).attr("Left"), parseInt($(this).attr("Width"), 10), parseInt($(this).attr("Height"), 10) + 85, $(this).attr("BgAudio"), DialogHeader, "<div id=\"wrapper\" style=\"width:" + (parseInt($(this).attr("Width"), 10)) + "px; -webkit-overflow-scrolling:touch;overflow:auto;\"></div>" + VideoPopupContentButton, true);

                //load content with delay so box and dimensions have rendered
                setTimeout(function () {
                    $("#introclosebutton").css('bottom', '10px');
                    $("#wrapper").load(DialogURL, function () {
                        $("#wrapper").children(0).scrollTop(0);
                    });//
                }, 250);

            }
        });
    });
}

//------------------------------------------------------------------------------------------------------------------
function CloseStandardDialog() {
    NewDialogClose();

    PlayVideo(true);

    if (CourseMode == "Video") {
        if ((CurrentPageMode != "flash")) {
            if (!isiPad) //don't play audio on video popups
            {
                PauseAudioOne(false, true);
            }
        }

        //resume flash
        if ((CurrentPageMode == "flash") && (FlashTime != -1)) {
            if (!isiPad) //don't play audio on video popups
            {
                PlayAudioOne(false);
                PlayBackground(false);
            }

            if ($("#jplayer_video").is(":visible")) {
                PlayVideo(false);
            }
            if (tid == null) {
                tid = setInterval(FlashFrame, 100);
            }
        }
    }
    else if (CourseMode == "Fast") {
        if ((CurrentPageMode != "flash")) {
            if (TextModeLinkClick == 0) {
                if (TextGoBackwards == 1) {
                    BackwardsClick();
                }
                else {
                    ForwardClick();
                } //
            }

            TextModeLinkClick = 0;
        }
        else {
            if (tid == null) {
                tid = setInterval(FlashFrame, 1);
            }
        }
    }
}


//------------------------------------------------------------------------------------------------------------------
function ClosePopupQuestionAnswerDialog_v2(UserChoice) {
    $("#FadeOutBackgroundDiv2").fadeOut(250);
    $("#FreeFormDialogDiv").fadeOut(250);

    if (CourseMode == "Video") {
        if (!isiPad) //don't play audio on video popups
        {
            PauseAudioOne(false, true);
        }
    }


    //if user clicked without selecting just go back to the question
    if (UserChoice != "") {
        if ((ContinueOnCorrect) && (PopupRightAnswer)) {
            NewDialogClose();
            PauseAudioOne(false, true);
            PlayVideo(true);
            if (CourseMode !== "Video") {
                if (TextGoBackwards == 1) {
                    BackwardsClick();
                }
                else {
                    ForwardClick();
                } //
            }
        }
    }
}

// NEW QUIZ DIALOG WITH POPUP FEEDBACK

//------------------------------------------------------------------------------------------------------------------
function AnswerCheck_v2() {

    if ((PopupRightAnswer)) // || (admin_ReviewMode)) //if right answer is already choosen
    {
        NewDialogClose();

        if (CourseMode == "Video") {
            if (!isiPad) //don't play audio on video popups
            {
                PauseAudioOne(false, true);
            }

            //resume play
            PlayVideo(true);
        }
        else {
            if (TextGoBackwards == 1) {
                BackwardsClick();
            }
            else {
                ForwardClick();
            } //
        }
    }
    else {
        Results1 = "";
        //loop the answers build the string to compare with results
        if (PopupAnswerType == "checkbox") {
            for (xCounter = 0; xCounter <= PopupMaxAnswers; xCounter++) {
                if ($("#popupquiz_" + PopupAnswersArrayOrdered[xCounter]).is(':checked')) {
                    if (Results1 != "") {
                        Results1 += ",";
                    }
                    Results1 += PopupAnswersArrayOrdered[xCounter];
                }
            }
        }
        else if (PopupAnswerType == "radio") {
            if ($('input[name=popup_quiz_answer]:checked').val() != null) {
                Results1 = $('input[name=popup_quiz_answer]:checked').val();
            }
        }

        //search the rules for correct answer
        AnswerResult = "";
        var AnswerResultNode;
        PopupRules.find("Rule").each(function () {
            if ($(this).attr("AnswerID") + "," == Results1 + ",") {
                AnswerResult = $(this).text();
                AnswerResultNode = $(this);

                //if correct then set the button to close on next click
                if ($(this).attr("Correct") == "yes") {
                    PopupRightAnswer = true;
                    PopupQuizAnswerCache[QTargetDialogName] += $(this).attr("AnswerID") + ",";
                    PopupQuizAnswerTextCache[QTargetDialogName] = AnswerResult;
                }
            }
        });

        //find the * answer generic wrong result
        if (AnswerResult == "") {
            PopupRules.find("Rule").each(function () {
                if ($(this).attr("AnswerID") == "*") {
                    AnswerResult = $(this).text();
                    AnswerResultNode = $(this);
                }
            });
        }


        //show free form dialog (can also be targeted text, if DarkenBackground is not set to "yes" the next button will work
        $("#FadeOutBackgroundDiv2").removeClass().addClass("InteractiveFadeoutStyle");
        $("#FadeOutBackgroundDiv2").css({
            "top": (!isMobile) ? "5px" : "0px",
            "left": (!isMobile) ? "5px" : "0px",
            "width": (!isMobile) ? ($("#skin-container").width() - 10) + "px" : $("#skin-container").width() + "px",
            "height": (!isMobile) ? ($("#skin-container").height() - 15) + "px" : $("#skin-container").width() + "px",
            "border-radius": "5px"
        });

        $("#FreeFormDialogCloseButton").off('click');
        $("#FreeFormDialogDiv").css({
            "top": AnswerResultNode.attr("Top") + "px",
            "left": AnswerResultNode.attr("Left") + "px"
        });
        $("#FreeFormDialogDiv").html(AnswerResult);
        $("#FreeFormDialogCloseButton").attr('tabindex', "0");

        $("#FadeOutBackgroundDiv2").fadeIn(250);
        $("#FreeFormDialogDiv").fadeIn(250);

        setTimeout(function () {
            $("#FreeFormDialogCloseButton").on('click', function () {
                ClosePopupQuestionAnswerDialog_v2(AnswerResult);
                return false;
            });
        }, 500);

        if (AnswerResultNode.attr("AudioFile") != "") {
            if (CourseMode == "Video") {
                if (!isiPad) //don't play audio on video popups
                {
                    LoadAndPlayAudioOne(AnswerResultNode.attr("AudioFile"), true);
                }
            }
        }
    }
}


//------------------------------------------------------------------------------------------------------------------
function ShowQuizDialog_v2(TargetDialogName) {
    QTargetDialogName = TargetDialogName;
    if (typeof PopupQuizAnswerCache[QTargetDialogName] != 'undefined') {
    }
    else {
        PopupQuizAnswerCache[QTargetDialogName] = "";
        PopupQuizAnswerTextCache[QTargetDialogName] = "";
    }

    $(CourseXML).find("Dialogs").each(function () {

        $(CourseXML).find("QuizDialog").each(function () {
            if ($(this).attr("Name") == TargetDialogName) {
                DialogHeader = $(this).find("DialogHeader").text();
                DialogBody = $(this).find("DialogBody").text();
                DialogAudio = $(this).attr("AudioFile");

                ContinueOnCorrect = $(this).attr("ContinueOnCorrect").toLowerCase() === 'true';

                PopupAnswerType = $(this).find("Answers").attr("Type").toLowerCase();

                PopupAnswersArray = [];
                PopupAnswersArrayOrdered = [];
                PopupMaxAnswers = -1;
                PopupRightAnswer = false;
                PopupRules = $(this).find("Rules");

                $(this).find("Answers").find("Answer").each(function () {
                    PopupMaxAnswers++;
                    PopupAnswersArray[PopupMaxAnswers] = $(this).attr("AnswerID");
                    PopupAnswersArrayOrdered[PopupMaxAnswers] = $(this).attr("AnswerID");
                });

                //randomize questions if Randomize attribute is yes
                if ($(this).find("Answers").attr("Randomize") == "yes") {
                    fisherYates(PopupAnswersArray);
                }

                Answers = "<table border=0 cellspacing=0 cellpadding=2>";

                for (xCounter = 0; xCounter <= PopupMaxAnswers; xCounter++) {
                    $(this).find("Answers").find("Answer").each(function () {
                        if ($(this).attr("AnswerID") == PopupAnswersArray[xCounter]) {
                            var CheckCorrectAnswer = "";
                            if (PopupQuizAnswerCache[QTargetDialogName].indexOf($(this).attr("AnswerID")) !== -1) {
                                CheckCorrectAnswer = " checked ";
                                PopupRightAnswer = true;
                            }

                            if (PopupAnswerType == "radio") {
                                Answers += "<tr><td valign=top style='padding-top:6px'><input type='radio' name='popup_quiz_answer' value='" + $(this).attr("AnswerID") + "' class='graphically' id='popupquiz_" + $(this).attr("AnswerID") + "' " + CheckCorrectAnswer + "><label class='graphically' for='popupquiz_" + $(this).attr("AnswerID") + "'></label></td><td><label style='display:block; cursor:pointer;' for='popupquiz_" + $(this).attr("AnswerID") + "'>" + $(this).text() + "</label></td></tr>";
                            }
                            else if (PopupAnswerType == "checkbox") {
                                Answers += "<tr><td valign=top style='padding-top:6px'><input type='checkbox' class='graphically' id='popupquiz_" + $(this).attr("AnswerID") + "' " + CheckCorrectAnswer + "><label class='graphically' for='popupquiz_" + $(this).attr("AnswerID") + "'></label></td><td><label style='display:block; cursor:pointer;' for='popupquiz_" + $(this).attr("AnswerID") + "'>" + $(this).text() + "</label></td></tr>";
                            }
                        }
                    });
                }
                Answers += "</table>";


                if (DialogAudio != "") {
                    if (CourseMode == "Video") {
                        if (!isiPad) //don't play audio on video popups
                        {
                            LoadAndPlayAudioOne(DialogAudio, true);
                        }
                    }
                }


                //pause playback
                PauseVideo(true, false);

                //show dialog
                NewDialog($(this).attr("Top"), $(this).attr("Left"), parseInt($(this).attr("Width"), 10) + 25, parseInt($(this).attr("Height"), 10) + 90, $(this).attr("BgAudio"), DialogHeader, DialogBody + "<br>" + Answers + VideoPopupQuizButton_v2, false);

            }
        });
    });
}


//------------------------- OLD QUIZ DÄ°ALOG WITH INLINE FEEDBACK

//------------------------------------------------------------------------------------------------------------------
function AnswerCheck() {

    if ((PopupRightAnswer)) // || (admin_ReviewMode)) //if right answer is already choosen
    {
        NewDialogClose();

        if (CourseMode == "Video") {
            PauseAudioOne(false, true);
            //resume play
            PlayVideo(true);
        }
        else {
            if (TextGoBackwards == 1) {
                BackwardsClick();
            }
            else {
                ForwardClick();
            } //
        }
    }
    else {
        Results1 = "";
        //loop the answers build the string to compare with results
        if (PopupAnswerType == "checkbox") {
            for (xCounter = 0; xCounter <= PopupMaxAnswers; xCounter++) {
                if ($("#popupquiz_" + PopupAnswersArrayOrdered[xCounter]).is(':checked')) {
                    if (Results1 != "") {
                        Results1 += ",";
                    }
                    Results1 += PopupAnswersArrayOrdered[xCounter];
                }
            }
        }
        else if (PopupAnswerType == "radio") {
            if ($('input[name=popup_quiz_answer]:checked').val() != null) {
                Results1 = $('input[name=popup_quiz_answer]:checked').val();
            }
        }

        //search the rules for correct answer
        AnswerResult = "";
        AnswerResultAudio = "";
        PopupRules.find("Rule").each(function () {
            if ($(this).attr("AnswerID") + "," == Results1 + ",") {
                AnswerResult = $(this).text();
                AnswerResultAudio = $(this).attr("AudioFile");

                //if correct then set the button to close on next click
                if ($(this).attr("Correct") == "yes") {
                    PopupRightAnswer = true;
                    PopupQuizAnswerCache[QTargetDialogName] += $(this).attr("AnswerID") + ",";
                    PopupQuizAnswerTextCache[QTargetDialogName] = AnswerResult;
                }
            }
        });

        //find the * answer generic wrong result
        if (AnswerResult == "") {
            PopupRules.find("Rule").each(function () {
                if ($(this).attr("AnswerID") == "*") {
                    AnswerResult = $(this).text();
                    AnswerResultAudio = $(this).attr("AudioFile");
                }
            });
        }


        //if contineOnCorrect = true and rightanswer is true then close and resume
        if ((ContinueOnCorrect) && (PopupRightAnswer)) {
            NewDialogClose();

            if (CourseMode == "Video") {
                PauseAudioOne(false, true);
                //resume play
                PlayVideo(true);
            }
            else {
                if (TextGoBackwards == 1) {
                    BackwardsClick();
                }
                else {
                    ForwardClick();
                } //
            }
        }
        else {
            //if answer has audio play it
            if (AnswerResultAudio != "") {
                if (CourseMode == "Video") {
                    if (!isiPad) //don't play audio on video popups
                    {
                        LoadAndPlayAudioOne(AnswerResultAudio, true);
                    }
                }
            }

            $("#popupquiz_feedback").html(AnswerResult);
        }
    }
}


//------------------------------------------------------------------------------------------------------------------
function ShowQuizDialog(TargetDialogName) {
    QTargetDialogName = TargetDialogName;
    if (typeof PopupQuizAnswerCache[QTargetDialogName] != 'undefined') {
    }
    else {
        PopupQuizAnswerCache[QTargetDialogName] = "";
        PopupQuizAnswerTextCache[QTargetDialogName] = "";
    }

    $(CourseXML).find("Dialogs").each(function () {

        $(CourseXML).find("QuizDialog").each(function () {
            if ($(this).attr("Name") == TargetDialogName) {
                DialogHeader = $(this).find("DialogHeader").text();
                DialogBody = $(this).find("DialogBody").text();
                DialogAudio = $(this).attr("AudioFile");

                ContinueButton = $(this).attr("ContinueButton");
                StartButton = $(this).attr("StartButton");

                ContinueOnCorrect = $(this).attr("ContinueOnCorrect").toLowerCase() === 'true';

                PopupAnswerType = $(this).find("Answers").attr("Type").toLowerCase();

                PopupAnswersArray = [];
                PopupAnswersArrayOrdered = [];
                PopupMaxAnswers = -1;
                PopupRightAnswer = false;
                PopupRules = $(this).find("Rules");

                $(this).find("Answers").find("Answer").each(function () {
                    PopupMaxAnswers++;
                    PopupAnswersArray[PopupMaxAnswers] = $(this).attr("AnswerID");
                    PopupAnswersArrayOrdered[PopupMaxAnswers] = $(this).attr("AnswerID");
                });

                //randomize questions if Randomize attribute is yes
                if ($(this).find("Answers").attr("Randomize") == "yes") {
                    fisherYates(PopupAnswersArray);
                }

                Answers = "<table border=0 cellspacing=0 cellpadding=2>";

                for (xCounter = 0; xCounter <= PopupMaxAnswers; xCounter++) {
                    $(this).find("Answers").find("Answer").each(function () {
                        if ($(this).attr("AnswerID") == PopupAnswersArray[xCounter]) {
                            var CheckCorrectAnswer = "";
                            if (PopupQuizAnswerCache[QTargetDialogName].indexOf($(this).attr("AnswerID")) !== -1) {
                                CheckCorrectAnswer = " checked ";
                                PopupRightAnswer = true;
                            }

                            if (PopupAnswerType == "radio") {
                                Answers += "<tr><td valign=top style='padding-top:6px'><input type='radio' name='popup_quiz_answer' value='" + $(this).attr("AnswerID") + "' class='graphically' id='popupquiz_" + $(this).attr("AnswerID") + "' " + CheckCorrectAnswer + "><label class='graphically' for='popupquiz_" + $(this).attr("AnswerID") + "'></label></td><td><label style='display:block; cursor:pointer;' for='popupquiz_" + $(this).attr("AnswerID") + "'>" + $(this).text() + "</label></td></tr>";
                            }
                            else if (PopupAnswerType == "checkbox") {
                                Answers += "<tr><td valign=top style='padding-top:6px'><input type='checkbox' class='graphically' id='popupquiz_" + $(this).attr("AnswerID") + "' " + CheckCorrectAnswer + "><label class='graphically' for='popupquiz_" + $(this).attr("AnswerID") + "'></label></td><td><label style='display:block; cursor:pointer;' for='popupquiz_" + $(this).attr("AnswerID") + "'>" + $(this).text() + "</label></td></tr>";
                            }
                        }
                    });
                }
                Answers += "</table>";


                if (DialogAudio != "") {
                    if (CourseMode == "Video") {
                        if (!isiPad) //don't play audio on video popups
                        {
                            LoadAndPlayAudioOne(DialogAudio, true);
                        }
                    }
                }


                //pause playback
                PauseVideo(true, false);

                //show dialog
                NewDialog($(this).attr("Top"), $(this).attr("Left"), parseInt($(this).attr("Width"), 10) + 25, parseInt($(this).attr("Height"), 10) + 90, $(this).attr("BgAudio"), DialogHeader, DialogBody + "<br>" + Answers + "<br><div id='popupquiz_feedback'>" + PopupQuizAnswerTextCache[QTargetDialogName] + "</div>" + VideoPopupQuizButton, false);

            }
        });
    });
}


//------------------------------------------------------------------------------------------------------------------
function GamificationStringReplace(xString) {

    if (CourseMode == "Video") {
        xString = xString.replace(/VideoClass/g, "class");
    }
    if (CourseMode == "Fast") {
        xString = xString.replace(/FastClass/g, "class");
    }

    xString = xString.replace("%%GamificationUserScore", GamificationUserScore);
    xString = xString.replace("%%GamificationComputerScore", GamificationComputerScore);


    xStartPos = xString.indexOf("%%GamificationUserWinning");
    xString = xString.replace("%%GamificationUserWinning", "");

    xEndPos = xString.indexOf("%%GamificationUserLosing");
    xString = xString.replace("%%GamificationUserLosing", "");

    xEndPos2 = xString.indexOf("%%");
    xString = xString.replace("%%", "");

    if (xStartPos != -1) {
        if (GamificationUserScore >= GamificationComputerScore) {
            xString = xString.replace(xString.substring(xEndPos, xEndPos2), "");
        }
        else {
            xString = xString.replace(xString.substring(xStartPos, xEndPos), "");
        }
    }
    return xString;
}

//------------------------------------------------------------------------------------------------------------------
function CloseGamificationInGameDialog() {
    $("#FadeOutBackgroundDiv").fadeOut(250);
    $("#FreeFormDialogDiv").fadeOut(250);
    GamificationDialogVisible = false;

    PauseAudioOne(false, true);
    //go to next window
    UnlockNextPage(true);
}

//------------------------------------------------------------------------------------------------------------------
function CloseGamificationFinalDialog(LostGame) {
    $("#FadeOutBackgroundDiv").fadeOut(250);
    $("#FreeFormDialogDiv").fadeOut(250);

    GamificationDialogVisible = false;

    PauseAudioOne(false, true);

    if (LostGame) {
        if (!admin_GamificationRetakeTillPass) {
            //call exit function
            if (admin_PostGamificationToScorm) {
                if (admin_UseScorm12) CloseCourse(true);
                if (admin_UseScorm2004) CloseCourse_2004(true);
            }
            else {
                //go to next window? no post to scorm what should I do??
                UnlockNextPage(true);
            }
        }
        else {
            GamificationUserScore = 0;
            GamificationComputerScore = 0;
            GamificationScoreArray = [];
            GamificationQuestionUserScore = 0;
            GamificationQuestionComputerScore = 0;
            GamificationShowInGameScore = false;
            GamificationLastQuestion = false;

            PreExamAnswerCache = [];
            PreExamAnswerTextCache = [];
            PreExamAnswerRightCache = [];

            PreExamScormQuestionCache = [];
            PreExamScormAnswersCache = [];
            PreExamScormUserAnswerCache = [];
            PreExamScormCorrectAnswerCache = [];

            InteractiveQuizAnswerCache = [];

            selectedPageID = 0;
            LoadPage(selectedPageID, 0, 0, 1);
        }
    }
    else {
        if (admin_PostGamificationToScorm) {
            if (admin_UseScorm12) SetLessonPassed(Math.round((GamificationUserScore / GamificationMaxPoints) * 100), true);
            if (admin_UseScorm2004) SetLessonPassed_2004(Math.round((GamificationUserScore / GamificationMaxPoints) * 100), true);
        }

        //go to next window
        UnlockNextPage(true);
    }
}

//------------------------------------------------------------------------------------------------------------------
function GamificationDialog(LastQuestion) {

//	$("#FadeOutBackgroundDiv").fadeOut(250);

    var DialogThis = null;
    if (LastQuestion) {
        GamificationIsLost = false;

        if (((GamificationUserScore < GamificationComputerScore) && (GamificationPassingPoints == 0)) || (GamificationUserScore < GamificationPassingPoints)) {
            GamificationIsLost = true;

            if ($(CourseXML).find("GamificationLost").text() != "") {
                DialogThis = $(CourseXML).find("GamificationLost");
                $("#FreeFormDialogCloseButton").off('click');
                $("#FreeFormDialogDiv").css({
                    "top": $(CourseXML).find("GamificationLost").attr("Top") + "px",
                    "left": $(CourseXML).find("GamificationLost").attr("Left") + "px",
                    "z-index": "102"
                });
                $("#FreeFormDialogDiv").hide();

                $("#FreeFormDialogDiv").html(GamificationStringReplace($(CourseXML).find("GamificationLost").text())).promise().done(function () {
                    $("#FreeFormDialogCloseButton").on('click', function () {
                        CloseGamificationFinalDialog(GamificationIsLost);
                        return false;
                    });
                    $("#FreeFormDialogCloseButton").attr('tabindex', "10");
                    $("#FreeFormDialogDiv").fadeIn(250);
                });

                GamficationBoxAudio = $(CourseXML).find("GamificationLost").attr("AudioFile");
                LoadAndPlayAudioOne(GamficationBoxAudio, true);

                var DarkenBackground = DialogThis.attr("DarkenBackground");
                if (typeof DarkenBackground == "undefined") {
                    DarkenBackground = "yes"; //backwards compatible so no tag will darken it
                }

                if (DarkenBackground == "yes") {
                    $("#FadeOutBackgroundDiv").css({
                        "top": (!isMobile) ? "5px" : "0px",
                        "left": (!isMobile) ? "5px" : "0px",
                        "width": (!isMobile) ? ($("#skin-container").width() - 10) + "px" : $("#template-place").width() + "px",
                        "height": (!isMobile) ? ($("#skin-container").height() - 15) + "px" : $("#template-place").height() + "px",
                        "border-radius": "5px"
                    });

                    $("#FadeOutBackgroundDiv").fadeIn(250);
                }
            }
        }
        else {
            if ($(CourseXML).find("GamificationWon").text() != "") {
                DialogThis = $(CourseXML).find("GamificationWon");
                $("#FreeFormDialogCloseButton").off('click');
                $("#FreeFormDialogDiv").css({
                    "top": $(CourseXML).find("GamificationWon").attr("Top") + "px",
                    "left": $(CourseXML).find("GamificationWon").attr("Left") + "px",
                    "z-index": "102"
                });
                $("#FreeFormDialogDiv").hide();
                $("#FreeFormDialogDiv").html(GamificationStringReplace($(CourseXML).find("GamificationWon").text())).promise().done(function () {
                    $("#FreeFormDialogCloseButton").on('click', function () {
                        CloseGamificationFinalDialog(GamificationIsLost);
                        return false;
                    });
                    $("#FreeFormDialogCloseButton").attr('tabindex', "10");
                    $("#FreeFormDialogDiv").fadeIn(250);
                });

                GamficationBoxAudio = $(CourseXML).find("GamificationWon").attr("AudioFile");
                LoadAndPlayAudioOne(GamficationBoxAudio, true);

                var DarkenBackground = DialogThis.attr("DarkenBackground");
                if (typeof DarkenBackground == "undefined") {
                    DarkenBackground = "yes"; //backwards compatible so no tag will darken it
                }

                if (DarkenBackground == "yes") {
                    $("#FadeOutBackgroundDiv").css({
                        "top": (!isMobile) ? "5px" : "0px",
                        "left": (!isMobile) ? "5px" : "0px",
                        "width": (!isMobile) ? ($("#skin-container").width() - 10) + "px" : $("#template-place").width() + "px",
                        "height": (!isMobile) ? ($("#skin-container").height() - 15) + "px" : $("#template-place").height() + "px",
                        "border-radius": "5px"
                    });

                    $("#FadeOutBackgroundDiv").fadeIn(250);
                }
            }
        }
    }
    else {
        if (GamificationUserScore < GamificationComputerScore) {
            if ($(CourseXML).find("GamificationLoosing").text() != "") {
                DialogThis = $(CourseXML).find("GamificationLoosing");
                $("#FreeFormDialogCloseButton").off('click');
                $("#FreeFormDialogDiv").css({
                    "top": $(CourseXML).find("GamificationLoosing").attr("Top") + "px",
                    "left": $(CourseXML).find("GamificationLoosing").attr("Left") + "px",
                    "z-index": "102"
                });
                $("#FreeFormDialogDiv").hide();
                $("#FreeFormDialogDiv").html(GamificationStringReplace($(CourseXML).find("GamificationLoosing").text())).promise().done(function () {
                    $("#FreeFormDialogCloseButton").on('click', function () {
                        CloseGamificationInGameDialog();
                        return false;
                    });
                    $("#FreeFormDialogCloseButton").attr('tabindex', "10");
                    $("#FreeFormDialogDiv").fadeIn(250);
                });

                GamficationBoxAudio = $(CourseXML).find("GamificationLoosing").attr("AudioFile");
                LoadAndPlayAudioOne(GamficationBoxAudio, true);


                var DarkenBackground = DialogThis.attr("DarkenBackground");
                if (typeof DarkenBackground == "undefined") {
                    DarkenBackground = "yes"; //backwards compatible so no tag will darken it
                }

                if (DarkenBackground == "yes") {
                    $("#FadeOutBackgroundDiv").css({
                        "top": (!isMobile) ? "5px" : "0px",
                        "left": (!isMobile) ? "5px" : "0px",
                        "width": (!isMobile) ? ($("#skin-container").width() - 10) + "px" : $("#template-place").width() + "px",
                        "height": (!isMobile) ? ($("#skin-container").height() - 15) + "px" : $("#template-place").height() + "px",
                        "border-radius": "5px"
                    });

                    $("#FadeOutBackgroundDiv").fadeIn(250);
                }
            }
        }
        else {
            if ($(CourseXML).find("GamificationWinning").text() != "") {
                DialogThis = $(CourseXML).find("GamificationWinning");
                $("#FreeFormDialogCloseButton").off('click');
                $("#FreeFormDialogDiv").css({
                    "top": $(CourseXML).find("GamificationWinning").attr("Top") + "px",
                    "left": $(CourseXML).find("GamificationWinning").attr("Left") + "px",
                    "z-index": "102"
                });
                $("#FreeFormDialogDiv").hide();
                $("#FreeFormDialogDiv").html(GamificationStringReplace($(CourseXML).find("GamificationWinning").text())).promise().done(function () {
                    $("#FreeFormDialogCloseButton").on('click', function () {
                        CloseGamificationInGameDialog();
                        return false;
                    });
                    $("#FreeFormDialogCloseButton").attr('tabindex', "10");
                    $("#FreeFormDialogDiv").fadeIn(250);
                });

                GamficationBoxAudio = $(CourseXML).find("GamificationWinning").attr("AudioFile");
                LoadAndPlayAudioOne(GamficationBoxAudio, true);


                var DarkenBackground = DialogThis.attr("DarkenBackground");
                if (typeof DarkenBackground == "undefined") {
                    DarkenBackground = "yes"; //backwards compatible so no tag will darken it
                }

                if (DarkenBackground == "yes") {
                    $("#FadeOutBackgroundDiv").css({
                        "top": (!isMobile) ? "5px" : "0px",
                        "left": (!isMobile) ? "5px" : "0px",
                        "width": (!isMobile) ? ($("#skin-container").width() - 10) + "px" : $("#template-place").width() + "px",
                        "height": (!isMobile) ? ($("#skin-container").height() - 15) + "px" : $("#template-place").height() + "px",
                        "border-radius": "5px"
                    });

                    $("#FadeOutBackgroundDiv").fadeIn(250);
                }
            }
        }
    }

    if (DialogThis !== null) GamificationDialogVisible = true;


    if (CourseMode == "Fast") {
        var WaitInFastMode = DialogThis.attr("FastModeContinueAfter");
        if (typeof WaitInFastMode == "undefined") {
        }
        else {
//			FwdBlink(3000, 1000);
            GamificationDialogTimeOut = setTimeout(function () {
                if (GamificationLastQuestion) {
                    CloseGamificationFinalDialog(GamificationIsLost);
                }
                else {
                    CloseGamificationInGameDialog();
                }
            }, WaitInFastMode);
        }
    }

    if (DialogThis !== null && DialogThis.attr("ShowVideo") == "true") {
        console.log("show video");
        $("#video-progress-bar").hide();
        $("#jplayer_video").show();
        $("#jplayer_video").jPlayer("clearMedia");
        var VideoImageFile = DialogThis.attr("VideoImage");

        tempStrX = DialogThis.attr("File");
        tempStrX2 = tempStrX.split(",");

        var m4vFile = "";
        var WebmFile = "";

        //single file
        if (tempStrX2.length == 1) {
            if (tempStrX2[0].search(".mp4") !== -1) {
                m4vFile = tempStrX2[0];
                if (m4vFile.search("://") == -1) {
                    m4vFile = cleanURL(document.URL) + m4vFile + "";
                }
            }
            if (tempStrX2[0].search(".webm") !== -1) {
                WebmFile = tempStrX2[0];
                if (WebmFile.search("://") == -1) {
                    WebmFile = cleanURL(document.URL) + WebmFile + "";
                }
            }
        }

        //dual file
        if (tempStrX2.length == 2) {
            if (tempStrX2[0].search(".mp4") !== -1) {
                m4vFile = tempStrX2[0];
                if (m4vFile.search("://") == -1) {
                    m4vFile = cleanURL(document.URL) + m4vFile + "";
                }
            }
            if (tempStrX2[0].search(".webm") !== -1) {
                WebmFile = tempStrX2[0];
                if (WebmFile.search("://") == -1) {
                    WebmFile = cleanURL(document.URL) + WebmFile + "";
                }
            }

            if (tempStrX2[1].search(".mp4") !== -1) {
                m4vFile = tempStrX2[1];
                if (m4vFile.search("://") == -1) {
                    m4vFile = cleanURL(document.URL) + m4vFile + "";
                }
            }
            if (tempStrX2[1].search(".webm") !== -1) {
                WebmFile = tempStrX2[1];
                if (WebmFile.search("://") == -1) {
                    WebmFile = cleanURL(document.URL) + WebmFile + "";
                }
            }
        }

        if (VideoImageFile.search("://") == -1) {
            VideoImageFile = cleanURL(document.URL) + VideoImageFile + "";
        }
        InitMiniVideo(DialogThis.attr("VideoTop"), DialogThis.attr("VideoLeft"), DialogThis.attr("VideoWidth"), DialogThis.attr("VideoHeight"), m4vFile, WebmFile, VideoImageFile, 101);
    }
}


//------------------------------------------------------------------------------------------------------------------
function NewDialog(Top, Left, Width, Height, BgAudioFile, NewDialogTitle, NewDialogContent, ExternalContent) {

    var ContentMargin = 20;
    if (ExternalContent) {
        ContentMargin = 0;
    }
    if (CurrentPageMode == "survey") {
        $("#FadeOutBackgroundDiv").removeClass().addClass("CourseFinalFadeOutBackground");
        $("#CourseDialogContainerDiv").removeClass().addClass("CourseFinalDialogContainer");
        $("#CourseDialogHeaderDiv").removeClass().addClass("CourseFinalDialogHeader");
        $("#CourseDialogContentDiv").removeClass().addClass("CourseFinalDialogContent");
    }
    else if (CurrentPageMode == "preExam") {
        $("#FadeOutBackgroundDiv").removeClass().addClass("CourseFinalFadeOutBackground");
        $("#CourseDialogContainerDiv").removeClass().addClass("CourseFinalDialogContainer");
        $("#CourseDialogHeaderDiv").removeClass().addClass("CourseFinalDialogHeader");
        $("#CourseDialogContentDiv").removeClass().addClass("CourseFinalDialogContent");
    }
    else if (CurrentPageMode == "finalExam") {
        $("#FadeOutBackgroundDiv").removeClass().addClass("CourseFinalFadeOutBackground");
        $("#CourseDialogContainerDiv").removeClass().addClass("CourseFinalDialogContainer");
        $("#CourseDialogHeaderDiv").removeClass().addClass("CourseFinalDialogHeader");
        $("#CourseDialogContentDiv").removeClass().addClass("CourseFinalDialogContent");
    }
    else if (CurrentPageMode == "flash") {
        $("#FadeOutBackgroundDiv").removeClass().addClass("CourseFlashFadeOutBackground");
        $("#CourseDialogContainerDiv").removeClass().addClass("CourseFlashDialogContainer");
        $("#CourseDialogHeaderDiv").removeClass().addClass("CourseFlashDialogHeader");
        $("#CourseDialogContentDiv").removeClass().addClass("CourseFlashDialogContent");
    }
    else if (CurrentPageMode == "policy") {
        $("#FadeOutBackgroundDiv").removeClass().addClass("CoursePolicyFadeOutBackground");
        $("#CourseDialogContainerDiv").removeClass().addClass("CoursePolicyDialogContainer");
        $("#CourseDialogHeaderDiv").removeClass().addClass("CoursePolicyDialogHeader");
        $("#CourseDialogContentDiv").removeClass().addClass("CoursePolicyDialogContent");
    }
    else if ((CurrentPageMode == "inteactiveQuiz") || (CurrentPageMode == "flatQuiz"))  //also is for interactive quiz
    {
        $("#FadeOutBackgroundDiv").removeClass().addClass("CourseFlatFadeOutBackground");
        $("#CourseDialogContainerDiv").removeClass().addClass("CourseFlatDialogContainer");
        $("#CourseDialogHeaderDiv").removeClass().addClass("CourseFlatDialogHeader");
        $("#CourseDialogContentDiv").removeClass().addClass("CourseFlatDialogContent");
    }
    else if (CurrentPageMode == "quiz")  //also is for interactive quiz
    {
        $("#FadeOutBackgroundDiv").removeClass().addClass("CourseQuizFadeOutBackground");
        $("#CourseDialogContainerDiv").removeClass().addClass("CourseQuizDialogContainer");
        $("#CourseDialogHeaderDiv").removeClass().addClass("CourseQuizDialogHeader");
        $("#CourseDialogContentDiv").removeClass().addClass("CourseQuizDialogContent");
    }
    else if (CurrentPageMode == "slide") {
        $("#FadeOutBackgroundDiv").removeClass().addClass("CourseSlideFadeOutBackground");
        $("#CourseDialogContainerDiv").removeClass().addClass("CourseSlideDialogContainer");
        $("#CourseDialogHeaderDiv").removeClass().addClass("CourseSlideDialogHeader");
        $("#CourseDialogContentDiv").removeClass().addClass("CourseSlideDialogContent");
    }
    else if (CurrentPageMode == "video") //  ((!SlideMode) && (!PolicyMode) && (!InteactiveQuizMode) && (!FinalExamMode) && (!PreExamMode) && (!SurveyMode) && (!FlashMode)) //video mode
    {
        if (VideoPopopStyle == "quiz") {
            $("#FadeOutBackgroundDiv").removeClass().addClass("CourseVideoQuizFadeOutBackground");
            $("#CourseDialogContainerDiv").removeClass().addClass("CourseVideoQuizDialogContainer");
            $("#CourseDialogHeaderDiv").removeClass().addClass("CourseVideoQuizDialogHeader");
            $("#CourseDialogContentDiv").removeClass().addClass("CourseVideoQuizDialogContent");
        }
        else if (VideoPopopStyle == "content") {
            $("#FadeOutBackgroundDiv").removeClass().addClass("CourseVideoContentFadeOutBackground");
            $("#CourseDialogContainerDiv").removeClass().addClass("CourseVideoContentDialogContainer");
            $("#CourseDialogHeaderDiv").removeClass().addClass("CourseVideoContentDialogHeader");
            $("#CourseDialogContentDiv").removeClass().addClass("CourseVideoContentDialogContent");
        }
    }
    else { //default classes

        $("#FadeOutBackgroundDiv").removeClass().addClass("CourseDefaultFadeOutBackground");
        $("#CourseDialogContainerDiv").removeClass().addClass("CourseDefaultDialogContainer");
        $("#CourseDialogHeaderDiv").removeClass().addClass("CourseDefaultDialogHeader");
        $("#CourseDialogContentDiv").removeClass().addClass("CourseDefaultDialogContent");
    }

    $("#CourseDialogContentDiv").css({"padding": ""});
    if (ExternalContent) {
        $("#CourseDialogContentDiv").css({"padding": "0px"});
    }


    if (NewDialogTitle == "") {
        $("#CourseDialogHeaderDiv").hide();
        ContentMargin = 0;
    }
    else {
        $("#CourseDialogHeaderDiv").show();
    }

    if (!isiPad) {
        LoadAndPlayAudioBackground(BgAudioFile, false);
    }


    $("#CourseDialogContainerDiv").css({
        "top": Top + "px",
        "left": Left + "px",
        "width": Width + "px",
        "height": Height + "px",
        "position": "absolute"
    });
    $("#CourseDialogContentDiv").css({"width": ($("#CourseDialogContainerDiv").width() - ContentMargin)});

    $("#FadeOutBackgroundDiv").css({
        "top": (!isMobile) ? "5px" : "0px",
        "left": (!isMobile) ? "5px" : "0px",
        "width": (!isMobile) ? ($("#skin-container").width() - 10) + "px" : $("#template-place").width() + "px",
        "height": (!isMobile) ? ($("#skin-container").height() - 15) + "px" : $("#template-place").height() + "px",
        "border-radius": "5px"
    });

    $("#CourseDialogContentDiv").html("");
    $("#CourseDialogHeaderDiv").html(NewDialogTitle);

    $("#FadeOutBackgroundDiv").fadeIn(DialogFadeSpeed);
    $("#CourseDialogContainerDiv").fadeIn(DialogFadeSpeed);

    setTimeout(function () {
        $("#CourseDialogContentDiv").css({"height": ($("#CourseDialogContainerDiv").innerHeight() - $("#CourseDialogHeaderDiv").outerHeight() - ContentMargin)});
        $("#CourseDialogContentDiv").html(NewDialogContent);
    }, 50);
}

//------------------------------------------------------------------------------------------------------------------
function NewDialogClose() {
    PauseBackgroundAudio(false, true);
    $("#jplayer_background").jPlayer("clearMedia");
    $("#FadeOutBackgroundDiv").fadeOut(DialogFadeSpeed);
    $("#CourseDialogContainerDiv").fadeOut(DialogFadeSpeed);
}

//------------------------------------------------------------------------------------------------------------------
function NewDialogCloseOldQuiz() {
    $("#FadeOutBackgroundDiv").fadeOut(DialogFadeSpeed);
    $("#CourseDialogContainerDiv").fadeOut(DialogFadeSpeed);
}

//------------------------------------------------------------------------------------------------------------------
function parseVersionXml(xml) {
    admin_Version = $(xml).find("Version").text();
    xke = $(xml).find("VersionText").text();

    $("#version-text").html(admin_Version);

    KeyCode = $(xml).find("KeyCode").text();

    LoadSettingsXML();
}


//------------------------------------------------------------------------------------------------------------------
function BranchingGoToPageID(callback) {
    var GoToPageID = "";

//	console.log(UserHistory);

    $(BranchingXML).find("Branch").each(function () {

        var ruleIsTrue = true;
        var ruleIsOnPage = false;
        var GoToPage = false;

        var len = $(this).find("Condition").length;
        $(this).find("Condition").each(function (index, element) {
            var ruleID = $(this).attr("ID");
            var ruleVal = $(this).attr("Value");

            if ((index == len - 1) && (ruleID == ModulePageArray[selectedPageID].xID)) {
                ruleIsOnPage = true;
            }

            var correctmatchfound = false;
            for (var bdata in UserHistory) {

                if (UserHistory[bdata].id == ruleID) {
                    if ((UserHistory[bdata].ca && ruleVal == "true" ) ||
                        (!UserHistory[bdata].ca && ruleVal == "false" )) {
                        correctmatchfound = true;
                    }
                }
            }

            if (!correctmatchfound) {
                ruleIsTrue = false;
            }
        });

        if (BrancihngIgnoreList.indexOf(ModulePageArray[selectedPageID].xID) == -1 || BrancihngIgnoreList.indexOf(ModulePageArray[selectedPageID].xID) == undefined) {
            if (ruleIsTrue && ruleIsOnPage && $(this).attr("ReverseBranch") != "true") {

                $(this).find("HidePages").find("PageID").each(function (index, element) {
                    var StuffToHide = $(this).text();
                    StuffToHide = StuffToHide.replace(/^\s+|\s+$/g, '');
                    BranchingSkipModulesPages += "," + StuffToHide + ",";
                });

                $(this).find("ShowPages").find("PageID").each(function (index, element) {
                    var StuffToShow = $(this).text();
                    StuffToShow = StuffToShow.replace(/^\s+|\s+$/g, '');
                    BranchingSkipModulesPages = BranchingSkipModulesPages.replace("," + StuffToShow + ",", "");
                });

                //add this to ignore list so the rule wont apply again in this session.
                BrancihngIgnoreList.push(ModulePageArray[selectedPageID].xID);

                console.log('rule is valid! ');

                GoToPageID = $(this).attr("GoTo");
                if (GoToPageID !== "") GoToPage = true;
            }
            else if (!ruleIsTrue && ruleIsOnPage && $(this).attr("ReverseBranch") == "true") {

                $(this).find("HidePages").find("PageID").each(function (index, element) {
                    var StuffToHide = $(this).text();
                    StuffToHide = StuffToHide.replace(/^\s+|\s+$/g, '');
                    BranchingSkipModulesPages += "," + StuffToHide + ",";
                });

                $(this).find("ShowPages").find("PageID").each(function (index, element) {
                    var StuffToShow = $(this).text();
                    StuffToShow = StuffToShow.replace(/^\s+|\s+$/g, '');
                    BranchingSkipModulesPages = BranchingSkipModulesPages.replace("," + StuffToShow + ",", "");
                });

                //add this to ignore list so the rule wont apply again in this session.
                BrancihngIgnoreList.push(ModulePageArray[selectedPageID].xID);

                console.log('rule is invalid!');

                GoToPageID = $(this).attr("GoTo");
                if (GoToPageID !== "") GoToPage = true;
            }

            if (GoToPage) {
                //show branching dialog
                if ($(this).find("BranchDialog").text().length > 0 && 1 == 1) {

                    if (CourseMode == "Video") {
                        if (isPlay == 1) {
                            $("#play-button").trigger("click");
                        }
                    }

                    $("#FadeOutBackgroundDiv").css({
                        "background-color": "black",
                        "top": (!isMobile) ? "5px" : "0px",
                        "left": (!isMobile) ? "5px" : "0px",
                        "width": (!isMobile) ? ($("#skin-container").width() - 10) + "px" : $("#template-place").width() + "px",
                        "height": (!isMobile) ? ($("#skin-container").height() - 15) + "px" : $("#template-place").height() + "px",
                        "border-radius": "5px"
                    });

                    $("#FreeFormDialogCloseButton").off('click');
                    $("#FreeFormDialogDiv").css({
                        "top": $(this).find("BranchDialog").attr("Top") + "px",
                        "left": $(this).find("BranchDialog").attr("Left") + "px"
                    });

                    $("#FreeFormDialogDiv").hide();
                    $("#FreeFormDialogDiv").html($(this).find("BranchDialog").text()).promise().done(function () {
                        $("#FreeFormDialogCloseButton").on('click', function () {
                            LoadTOC(CourseXML);
                            BranchingGoTo(GoToPageID);
                        });
                        $("#FreeFormDialogCloseButton").attr('tabindex', "0");
                        $("#FreeFormDialogDiv").fadeIn(250);
                    });

                    $("#FadeOutBackgroundDiv").fadeIn(250);


                    BranchingBoxAudio = $(this).find("BranchDialog").attr("AudioFile");
                    LoadAndPlayAudioOne(BranchingBoxAudio, false);
                }
                else {
                    LoadTOC(CourseXML);
                    BranchingGoTo(GoToPageID);
                }
            }
        }
    }).promise().done(function () {
//		console.log("branching done");
        if (GoToPageID == "") {
            callback(false);
        }
        else {
            callback(true);
        }
    });
}

function BranchingGoTo(GoToPageID) {
    var FoundPagePos = -1;

    for (var i = 0; i < ModulePageArray.length; i++) {
        if ((typeof ModulePageArray[i].xID !== "undefined")) {
            if (ModulePageArray[i].xID == GoToPageID) {
                FoundPagePos = i;
            }
        }
    }

    if (FoundPagePos != -1) {
        if (FoundPagePos > selectedPageID) {
            for (var i = selectedPageID; i < FoundPagePos; i++) {
                ModulePageArray[i].xViewable = 1;
                $("#C" + (i)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");

                if (ModulePageArray[i].xName.charAt(0) == "M") //if next row is module then activate the one bellow too
                {
                    ModulePageArray[i + 1].xViewable = 1;
                    $("#C" + (i + 1)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
                }
            }
        }
        selectedPageID = FoundPagePos;

        PauseAudioOne(true, true);
        LoadPage(selectedPageID, 0, 0, 1);
    }
}


//------------------------------------------------------------------------------------------------------------------
function parseSettingsXml(xml) {
    loadCourseCssFile($(xml).find("CourseCSSFile").text());

    if (isMobile) {
//        var SkinCssFile = $(xml).find("SkinCSSFile").text() + '-mobile';
        var SkinCssFile = 'black-unique-mobile';
        var MobileTplWidth = ($(xml).find("MobileTplWidth").text() !== '') ? Number($(xml).find("MobileTplWidth").text()) : 926;
        var MobileTplHeight = ($(xml).find("MobileTplHeight").text() !== '') ? Number($(xml).find("MobileTplHeight").text()) : 466;
        var RegularTplTop = ($(SettingsXML).find("RegularTplTop").text() !== '') ? Number($(SettingsXML).find("RegularTplTop").text()) : 77;
        var RegularTplLeft = ($(SettingsXML).find("RegularTplLeft").text() !== '') ? Number($(SettingsXML).find("RegularTplLeft").text()) : 12;
        var VerticalRatio = (screenSize.landscape[1] <= MobileTplHeight) ? ( (screenSize.landscape[1] / MobileTplHeight ) ) : 1;
        var HorizontalRatio = (screenSize.landscape[0] <= MobileTplWidth) ? ( (screenSize.landscape[0] / MobileTplWidth) ) : 1;

        MobileScaleRatio = (HorizontalRatio <= VerticalRatio) ? HorizontalRatio : VerticalRatio;

        var MobileTplTop = (Math.abs(MobileTplHeight * MobileScaleRatio - screenSize.landscape[1])) / 2;
        var MobileTplLeft = (Math.abs(MobileTplWidth * MobileScaleRatio - screenSize.landscape[0])) / 2;

        MobilePositionRuleConfig(RegularTplTop, RegularTplLeft);

        $('#template-place').css('width', MobileTplWidth + 'px');
        $('#template-place').css('height', MobileTplHeight + 'px');

//		$('#skin-container').css('zoom', MobileScaleRatio);
        $('#skin-container').css({"transform": "scale(" + MobileScaleRatio + ")"});
//		$('#skin-container').css('width', MobileTplWidth + 'px');
//		$('#skin-container').css('height', MobileTplHeight + 'px');
        $('#skin-container').css('top', MobileTplTop + 'px');
        $('#skin-container').css('left', MobileTplLeft + 'px');
    }
    else {
        var SkinCssFile = $(xml).find("SkinCSSFile").text();
    }

    loadCourseCssFile("skins/" + SkinCssFile + "/" + SkinCssFile + ".css?q=470");

    if ((parseInt($.browser.version, 10) === 11) || ($.browser.msie && parseInt($.browser.version, 10) === 8)) {
        //ignore skinning if it is MSIEE 11
    }
    else {
        loadCourseCssFile("skins/" + SkinCssFile + "/_styles.css?q=470");
    }

    //load overriding css for msie 9,10 and 11
    if (navigator.userAgent.indexOf('Trident') !== -1 || ($.browser.msie && parseInt($.browser.version, 10) === 11) || ($.browser.msie && parseInt($.browser.version, 10) === 10) || ($.browser.msie && parseInt($.browser.version, 10) === 9)) {
        var flexcss = $(xml).find("CourseCSSFile").text();
        flexcss = flexcss.replace(".css", "_flex.css");
        loadCourseCssFile(flexcss);
    }


    if ($(xml).find("ExternalJS").text() != "") {
        var script = document.createElement('script');
        script.onload = function () {
            //only call update_buttons_SkinPath once
            update_buttons_SkinPath("skins/" + SkinCssFile + "/");
        };
        script.src = $(xml).find("ExternalJS").text();

        document.head.appendChild(script); //or something of the likes
    }
    else {
        //only call update_buttons_SkinPath once
        update_buttons_SkinPath("skins/" + SkinCssFile + "/");
    }


    $("input.graphically + label.graphically").css('background', 'url("../skins/' + SkinCssFile + '/gr_custom-inputs.png") 0 -1px no-repeat;');

    $("#ajax-loading-graph").attr("src", "skins/" + SkinCssFile + "/ajax-loader.gif");

    //load stars css
    if (($.browser.msie) && ((parseInt($.browser.version, 10) === 8) || (parseInt($.browser.version, 10) === 9))) {
        loadCourseCssFile($(xml).find("AdaptiveCSSMSIE").text());
    }
    else {
        loadCourseCssFile($(xml).find("AdaptiveCSS").text());
    }

    //read the progressbar width with delay to make sure css has loaded
    setTimeout(function () {
        var $tempwidth_p = $("<p id=\"tempwidth\" class=\"skin_progressbar_width\"></p>").hide().appendTo("body");
        if (parseInt($tempwidth_p.css("width"), 10) > 100) {
            admin_ProgressWidth = parseInt($tempwidth_p.css("width"), 10);
            $("#video-progress-bar").width(Math.round((admin_ProgressWidth + 5)) + "px");
        }
        $tempwidth_p.remove();
    }, 500);

    admin_preExamAndText = $(xml).find("preExamAndText").text();
    if ((admin_preExamAndText === undefined) || (admin_preExamAndText == null) || (admin_preExamAndText == "") || (admin_preExamAndText == "undefined")) {
        admin_preExamAndText = ", and";
    }

    $("#version-text").html(admin_Version);
    admin_CopyrightInfo = $(xml).find("CopyrightInfo").text();
    $("#copyright-text").html(admin_CopyrightInfo);

    admin_L_URL = $(xml).find("LicenseURL").text();


    admin_Branding_URL = getParameterByName('ApiPath');
    if (admin_Branding_URL == "") {
        admin_Branding_URL = "https://api.inspiredlms.com";
    }

    admin_Branding_ReqData = getParameterByName('ReqData');
    var LogoURL = admin_Branding_URL + "/Branding/logo?reqdata=" + admin_Branding_ReqData;
    var PolicyURL = admin_Branding_URL + "/Branding/policies?reqdata=" + admin_Branding_ReqData;

    admin_LogoBranding = $(xml).find("LogoBranding").text().toLowerCase() === 'true';
    if (admin_LogoBranding) {
        $.ajax({
            type: "GET",
            url: LogoURL,
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            dataType: 'json',
            success: function (response) {
                try {
                    if (response != "") {
                        admin_LogoBranding_url = response.FileURL;
                        if (admin_LogoBranding_url !== '') {
                            $("#custom-logo").css({
                                'background-image': 'url("' + admin_LogoBranding_url + '")',
                                'background-repeat': 'no-repeat'
                            });
                        }
                    }
                }
                catch (e) {
                }
            }
        });
    }

    admin_PolicyBranding = $(xml).find("PolicyBranding").text().toLowerCase() === 'true';
    admin_PolicyBrandingBackup_url = $(xml).find("PolicyBrandingURL").text();

    if (admin_PolicyBranding) {
        $.ajax({
            type: "GET",
            url: PolicyURL,
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            dataType: 'json',
            success: function (response) {
                try {
                    if (response != "") {
                        admin_PolicyBranding_array = response; //response[0].FileURL;
                    }
                }
                catch (e) {
                }
            }
        });
    }


    if ((KeyCode.indexOf(XCode) == -1) && (KeyCode.indexOf(XCode2) == -1) && (KeyCode.indexOf(XCode3) == -1)) {
        if (DialogIsVisible) {
            window.location.href = admin_L_URL;
            return false;
        }
    }

    admin_URLOnExit = $(xml).find("URLOnExit").text();

    admin_CopyrightInfo = $(xml).find("CopyrightInfo").text();

    admin_AutoForwardDefaultSetting = $(xml).find("AutoForwardDefaultSetting").text().toLowerCase() === 'true';

    admin_AutoForwardEnabled = $(xml).find("AutoForwardEnabled").text().toLowerCase() === 'true';
    admin_ForwardBlink = $(xml).find("ForwardBlink").text().toLowerCase() === 'true';

    admin_AutoForwardText = $(xml).find("AutoForwardText").text();
    admin_NoAutoForwardText = $(xml).find("NoAutoForwardText").text();

    //check if auto forward should be disabled
    $("#autoforward-button").attr('alt', admin_AutoForwardText);
    $("#autoforward-button").attr('title', admin_AutoForwardText);
    if (admin_AutoForwardEnabled == false) {
        $("#autoforward-button").removeClass("autoforward-button-style").addClass("autoforward-button-disabled-style");
    }
    else {
        if (admin_AutoForwardDefaultSetting == false) {
            $("#autoforward-button").removeClass("autoforward-button-style").addClass("noautoforward-button-style");
            $("#autoforward-button").attr('alt', admin_NoAutoForwardText);
            $("#autoforward-button").attr('title', admin_NoAutoForwardText);
        }

        $("#autoforward-button").bind('click', function () {
            AutoForwardClick();
        });
    }


    admin_UseScorm = $(xml).find("UseScorm").text().toLowerCase() === 'true';
    // Read SCORM Variables
    admin_UseScorm12 = $(xml).find("UseScormVersion12").text().toLowerCase() === 'true';
    admin_UseScorm2004 = $(xml).find("UseScormVersion2004").text().toLowerCase() === 'true';
    // End
    admin_HostedOniLMS = $(xml).find("HostedOniLMS").text().toLowerCase() === 'true';

    admin_DisableVolume = $(xml).find("DisableVolume").text().toLowerCase() === 'true';

    if (admin_DisableVolume) {
        $("#volume-button").removeClass("volume-button-style").addClass("volume-button-disabled-style");
    }


    admin_BottomLogo = $(xml).find("BottomLogo").text();
    admin_TopLogo = $(xml).find("TopLogo").text();

    admin_HelpFile = $(xml).find("HelpFile").text();
    admin_GlossaryFile = $(xml).find("GlossaryFile").text();
    admin_CourseFile = $(xml).find("CourseFile").text();

    admin_Submit = $(xml).find("Submit").text();
    admin_Finish = $(xml).find("Finish").text();
    admin_Help = $(xml).find("Help").text();
    admin_Glossary = $(xml).find("Glossary").text();
    admin_SaveAndExit = $(xml).find("SaveAndExit").text();
    admin_Review = $(xml).find("Review").text();

    //if review has not already been set by scorm get it from adminsettings.xml
    if (!admin_ReviewMode) {
        admin_ReviewMode = $(xml).find("ReviewMode").text().toLowerCase() === 'true';
    }

    if (getParameterByName("xmode") == "review" && (location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
        admin_ReviewMode = true;
    }

    admin_VideoProgress = $(xml).find("VideoProgress").text().toLowerCase() === 'true';
    admin_VideoProgressCanMove = $(xml).find("VideoProgressCanMove").text().toLowerCase() === 'true';

    admin_Volume = $(xml).find("Volume").text();
    admin_Mute = $(xml).find("Mute").text();
    admin_UnMute = $(xml).find("UnMute").text();

    admin_Mode = $(xml).find("Mode").text();

    admin_Replay = $(xml).find("Replay").text();

    admin_Prev = $(xml).find("Prev").text();

    admin_Pause = $(xml).find("Pause").text();
    admin_Play = $(xml).find("Play").text();

    admin_Next = $(xml).find("Next").text();

    admin_Progress = $(xml).find("Progress").text();

    admin_MinTimeWaitAlert = $(xml).find("MinTimeWaitAlert").text();
    admin_DropDownAlert = $(xml).find("DropDownAlert").text();
    admin_FlatQuizAlert = $(xml).find("FlatQuizAlert").text();

    admin_ShowTimer = $(xml).find("ShowTimer").text().toLowerCase() === 'true';
    admin_MinTime = $(xml).find("MinTime").text();
    admin_MinTime = parseInt(admin_MinTime, 10);
    admin_MinTimeMessage = $(xml).find("MinTimeMessage").text();
    admin_TimerText = $(xml).find("TimerText").text();

    admin_FinalExamPostQuestionsScorm = $(xml).find("FinalExamPostQuestionsScorm").text().toLowerCase() === 'true';

    if ($(xml).find("FinalExamShowScoreDialog").text().toLowerCase() != "") {
        admin_ShowFinalScoreDialog = $(xml).find("FinalExamShowScoreDialog").text().toLowerCase() === 'true';
    }

    admin_DisableExit = $(xml).find("DisableExit").text().toLowerCase() === 'true';
    if (isMobile) {
        admin_DisableExit = true;
    }

    EncryptTests = false;
    EncryptTestsNode = $(xml).find("EncryptTests").text();
    if (typeof EncryptTestsNode == "undefined") {
    }
    else {
        if (EncryptTestsNode.toLowerCase() === 'true') {
            EncryptTests = true;
        }
    }

    PreExamAdaptiveTraining = false;
    PreExamAdaptiveTrainingNode = $(xml).find("AdaptiveTraining").text();
    if (typeof PreExamAdaptiveTrainingNode == "undefined") {
    }
    else {
        if (PreExamAdaptiveTrainingNode.toLowerCase() === 'true') {
            PreExamAdaptiveTraining = true;
        }
    }

    PreExamEnabled = false;
    PreExamEnabledNode = $(xml).find("PreTest").text();
    if (typeof PreExamEnabledNode == "undefined") {
    }
    else {
        if (PreExamEnabledNode.toLowerCase() === 'true') {
            PreExamEnabled = true;
        }
    }

    FinalExamEnabled = false;
    FinalExamEnabledNode = $(xml).find("FinalTest").text();
    if (typeof FinalExamEnabledNode == "undefined") {
    }
    else {
        if (FinalExamEnabledNode.toLowerCase() === 'true') {
            FinalExamEnabled = true;
        }
    }

    SurveyEnabled = false;
    SurveyEnabledNode = $(xml).find("ShowSurvey").text();
    if (typeof SurveyEnabledNode == "undefined") {
    }
    else {
        if (SurveyEnabledNode.toLowerCase() === 'true') {
            SurveyEnabled = true;
        }
    }

    admin_CCText = $(xml).find("CCText").text();
    admin_NoCCText = $(xml).find("NoCCText").text();

    admin_FinalExamFile = $(xml).find("FinalFile").text();
    if (typeof admin_FinalExamFile == "undefined" || admin_FinalExamFile == "") {
    }
    else {
        LoadFinalXML(admin_FinalExamFile);
    }

    admin_PreExamFile = $(xml).find("PreExamFile").text();
    if (typeof admin_PreExamFile == "undefined" || admin_PreExamFile == "") {
    }
    else {
        LoadPreExamXML(admin_PreExamFile);
    }

    admin_SurveyFile = $(xml).find("SurveyFile").text();
    if (typeof admin_SurveyFile == "undefined" || admin_SurveyFile == "") {
    }
    else {
        LoadSurveyXML(admin_SurveyFile);
    }

    admin_BranchingFile = $(xml).find("BranchingFile").text();
    if (typeof admin_BranchingFile == "undefined" || admin_BranchingFile == "") {
    }
    else {
        LoadBranchingXML(admin_BranchingFile);
    }


    admin_FinalPassingPercentage = $(xml).find("FinalPassingPercentage").text();
    if (typeof admin_FinalPassingPercentage == "undefined") {
        admin_FinalPassingPercentage = 50;
    }
    else {
        admin_FinalPassingPercentage = parseInt(admin_FinalPassingPercentage, 10);
    }

    admin_FinalRetakeTillPass = $(xml).find("FinalRetakeTillPass").text();
    if (typeof admin_FinalRetakeTillPass == "undefined") {
        admin_FinalRetakeTillPass = true;
    }
    else {
        admin_FinalRetakeTillPass = admin_FinalRetakeTillPass.toLowerCase() === "true";
    }

    admin_FinalRetakeMaxCount = $(xml).find("FinalRetakeTries").text();
    if (typeof admin_FinalRetakeMaxCount == "undefined") {
        admin_FinalRetakeMaxCount = 99;
    }
    else {
        admin_FinalRetakeMaxCount = parseInt(admin_FinalRetakeMaxCount, 10);
    }


    admin_PostGamificationToScorm = $(xml).find("PostGamificationToScorm").text();
    if (typeof admin_PostGamificationToScorm == "undefined") {
        admin_PostGamificationToScorm = true;
    }
    else {
        admin_PostGamificationToScorm = admin_PostGamificationToScorm.toLowerCase() === 'true';
    }

    GamificationPassingPoints = $(xml).find("GamificationPassingPoints").text();
    if (typeof GamificationPassingPoints == "undefined") {
        GamificationPassingPoints = 0;
    }
    else {
        GamificationPassingPoints = parseInt(GamificationPassingPoints, 10);
    }

    GamificationMaxPoints = $(xml).find("GamificationMaxPoints").text();
    if (typeof GamificationMaxPoints == "undefined") {
        GamificationMaxPoints = 100;
    }
    else {
        GamificationMaxPoints = parseInt(GamificationMaxPoints, 10);
    }

    admin_GamificationRetakeTillPass = $(xml).find("GamificationRetakeTillPass").text();
    if (typeof admin_GamificationRetakeTillPass == "undefined") {
        admin_GamificationRetakeTillPass = true;
    }
    else {
        admin_GamificationRetakeTillPass = admin_GamificationRetakeTillPass.toLowerCase() === "true";
    }

    // admin_ScormOrFinalQuiz = $(xml).find("QuizSetup").attr("ScormPost"); -- no longer in use as of iEngine 5.0


    LoadCourseXML();
    LoadGlossary();

    if ((admin_LogoBranding) && (admin_LogoBranding_url !== '')) {
        setTimeout(function () {
            $("#custom-logo").css({
                'background-image': 'url("' + admin_LogoBranding_url + '")',
                'background-repeat': 'no-repeat'
            });
        }, 2000);
        setTimeout(function () {
            $("#custom-logo").css({
                'background-image': 'url("' + admin_LogoBranding_url + '")',
                'background-repeat': 'no-repeat'
            });
        }, 10000);
    }
    else {
        $("#custom-logo").css({'background-image': 'url(' + admin_TopLogo + ')', backgroundRepeat: 'no-repeat'});
    }

    $("#product-logo").css({'background-image': 'url(' + admin_BottomLogo + ')', backgroundRepeat: 'no-repeat'});

    $("#glossary-select-title-text").html(admin_Glossary);
    $("#help-window-title-text").html(admin_Help);
    $("#mode-box-text").html(admin_Mode);

    $("#help-button").attr('alt', admin_Help);
    $("#help-button").attr('title', admin_Help);
    $("#glossary-button").attr('alt', admin_Glossary);
    $("#glossary-button").attr('title', admin_Glossary);
    $("#exit-button").attr('alt', admin_SaveAndExit);
    $("#exit-button").attr('title', admin_SaveAndExit);

    if (admin_DisableExit) {
        if (!isMobile) {
            xwidth = $("#exit-button").width();
            $("#exit-button").hide();

            $("#help-button").css({'left': (parseInt($("#help-button").css("left"), 10) + xwidth) + "px"});
            $("#glossary-button").css({'left': (parseInt($("#glossary-button").css("left"), 10) + xwidth) + "px"});
        }
    }

    $("#volume-button").attr('alt', admin_Volume);
    $("#volume-button").attr('title', admin_Volume);
    $("#volume-popup-mute").attr('alt', admin_Mute);
    $("#volume-popup-mute").attr('title', admin_Mute);

    $("#mode-button").attr('alt', admin_Mode);
    $("#mode-button").attr('title', admin_Mode);
    $("#replay-button").attr('alt', admin_Replay);
    $("#replay-button").attr('title', admin_Replay);

    $("#play-button").attr('alt', admin_Play);
    $("#play-button").attr('title', admin_Play);
    $("#forward-button").attr('alt', admin_Next);
    $("#forward-button").attr('title', admin_Next);
    $("#backward-button").attr('alt', admin_Prev);
    $("#backward-button").attr('title', admin_Prev);

    if (CourseMode == "Text" || CourseMode == "Fast") {
        CCEnabled = true;
        $("#replay-button").removeClass("replay-button-style").addClass("replay-button-disabled-style");
        $("#play-button").removeClass("play-button-style").addClass("play-button-disabled-style");
        $("#mode-button").removeClass("mode-button-style").addClass("mode-button-style-offline");
        $("#volume-button").removeClass("volume-button-style").addClass("volume-button-disabled-style");
    }
    $.get(admin_HelpFile, function (data) {

        setTimeout(function () {
            //----------replace policy placeholders
            for (var jj = 0; jj < admin_PolicyBranding_array.length; jj++) {
                var SearchFor = '##branding_' + admin_PolicyBranding_array[jj].CategoryName.replace(new RegExp(' ', 'g'), '_') + '##';
                data = data.replace(new RegExp(SearchFor, 'g'), admin_PolicyBranding_array[jj].FileURL);

                SearchFor = '##name_' + admin_PolicyBranding_array[jj].CategoryName.replace(new RegExp(' ', 'g'), '_') + '##';
                data = data.replace(new RegExp(SearchFor, 'g'), admin_PolicyBranding_array[jj].Name);
            }

            var SearchFor = '\#\#branding_[^#]*\#\#';
            data = data.replace(new RegExp(SearchFor, 'g'), admin_PolicyBrandingBackup_url);
            var SearchFor = '\#\#name_[^#]*\#\#';
            data = data.replace(new RegExp(SearchFor, 'g'), 'Policy');
            //----------------------------------------

            $("#help-window-description").html(data);
        }, 5000);

        $("#help-window-description").html(data);
        /* Update help with policy link */
    });

    //disable volume if ipad
    if (isiPad) {
        admin_DisableVolume = true;
    }
    if (isAndroid) {
        admin_DisableVolume = true;
    }

    $("#ajax-loading-graph").css({"left": "390px"});
    $("#ajax-loading-graph").css({"top": "195px"});
    $("#ajax-loading-graph").hide();
}


//------------------------------------------------------------------------------------------------------------------
function LoadSettingsXML() {
    $.ajax({
        type: "GET",
        url: "xmls/" + CourseLanguage + "/adminsettings.xml?q=480&time=" + Math.round(+new Date() / 1000),
        dataType: "xml",
        success: function (result) {
            SettingsXML = result;
            parseSettingsXml(SettingsXML);
        }
    });
}

//------------------------------------------------------------------------------------------------------------------
function LoadVersionXML() {
    $.ajax({
        type: "GET",
        url: "js/data.xml?q=489&time=" + Math.round(+new Date() / 1000),
        dataType: "xml",
        success: function (result) {
            VersionXML = result;
            parseVersionXml(VersionXML);
        }
    });
}

//------------------------------------------------------------------------------------------------------------------
function LoadBranchingXML(BranchingFileName) {
    $.ajax({
        type: "GET",
        url: "xmls/" + CourseLanguage + "/" + BranchingFileName + "?q=480&time=" + Math.round(+new Date() / 1000),
        dataType: "xml",
        success: function (result) {
            BranchingXML = result;
            if (isMobile) {
                BranchingXML = AdjustPositionForMobile(BranchingXML, mobileBranchingXMLAdjustRule)
            }
        }
    });
}


//------------------------------------------------------------------------------------------------------------------
function resizeControls() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    UpdateProgressBar();

    var NewTop = (!isMobile) ? ((windowHeight / 2) - ($("#skin-container").height() / 2)) : 0;
    if (NewTop < 5 && !isMobile) {
        NewTop = 5;
    }

    $("#page").css({"margin-top": NewTop + "px"});

    var NewLeft = (!isMobile) ? ((windowWidth / 2) - ($("#skin-container").width() / 2)) : 0;
    if (NewLeft < 5 && !isMobile) {
        NewLeft = 5;
    }
    $("#page").css({"margin-left": NewLeft + "px"});
    $("#page").show();
}

//------------------------------------------------------------------------------------------------------------------
function UpdateProgressBar() {

    ProgressPrecentage = Math.round(((CurrentPageNumber) / (MaxVirtualPages)) * 100);
    if (typeof ModulePageArray[selectedPageID].xName !== 'undefined') {
        PageToolTip = admin_Progress;
        PageToolTip = PageToolTip.replace("%%PageNo", CurrentPageNumber);
        PageToolTip = PageToolTip.replace("%%TotalPages", MaxVirtualPages);
        PageToolTip = PageToolTip.replace("%%PageName", ModulePageArray[selectedPageID].xName.slice(1));

        $("#tooltip-text").html("<nobr>" + PageToolTip + "</nobr>");
    }
    else {
        $("#tooltip-text").html("IEngine");
    }


    $("#progress-bar-circle").css({"left": Math.round((admin_ProgressWidth * ProgressPrecentage / 100) - 9) + "px"});
    $("#progress-bar-middle").width(Math.round(admin_ProgressWidth * ProgressPrecentage / 100) + "px");

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


//------------------------------------------------------------------------------------------------------------------
function HideProgress() {
    isProgressVisisble = false;
    $("#tooltip").fadeOut('slow');
    $("#progress-bar-circle").fadeOut('slow');
}

//------------------------------------------------------------------------------------------------------------------
function ShowVideoProgress() {
    if ((isVideoProgressVisisble == false) && (admin_VideoProgress)) {
        isVideoProgressVisisble = true;
        $("#video-progress-bar").css('visibility', 'visible').fadeIn('fast');
    }
    clearTimeout(VideoProgressTimer);
}

//------------------------------------------------------------------------------------------------------------------
function HideVideoProgress() {
    if (admin_VideoProgress) {
        isVideoProgressVisisble = false;
        $("#video-progress-bar").fadeOut('slow');
    }
}

//------------------------------------------------------------------------------------------------------------------
function ShowProgress() {
    if (isProgressVisisble == false) {
        isProgressVisisble = true;
        $("#progress-bar-circle").css('visibility', 'visible').fadeIn('fast');
        $("#tooltip").css('visibility', 'visible').fadeIn('fast');
    }
    clearTimeout(ProgressTimer);
}

//------------------------------------------------------------------------------------------------------------------
function ShowVolume() {
    if (!admin_DisableVolume) {
        if ((isVolumeVisible == false)) // && (VolumeMute==0))
        {
            isVolumeVisible = true;
            $("#volume-box").css('visibility', 'visible').show('slide', {direction: 'down'}, 350); //.fadeIn('fast');
            $("#volume-button").addClass("volume-button-style-hover");
        }
        clearTimeout(VolumeTimer);
    }
}

//------------------------------------------------------------------------------------------------------------------
function HideVolume() {
    if (!admin_DisableVolume) {
        if (isVolumeVisible == true) {
            isVolumeVisible = false;
            $("#volume-box").hide('slide', {direction: 'down'}, 150); //.fadeOut('slow');
            $("#volume-button").removeClass("volume-button-style-hover");
            VolumeSliderMouseDown = false;
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
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

//------------------------------------------------------------------------------------------------------------------
function toggleVolumeMute() {
    if (CourseMode == "Video") {
        if (!admin_DisableVolume) {
            if (VolumeMute == false) {
                $("#volume-popup-mute").attr('alt', admin_UnMute);
                $("#volume-popup-mute").attr('title', admin_UnMute);

                $("#volume-button").removeClass("volume-button-style").addClass("volume-button-mute-style");
                $("#volume-popup-mute").removeClass("volume-popup-speaker-style").addClass("volume-popup-mute-style");
                VolumeMute = true;
                if (TemplateArrayHasVideo[CurrentTemplateID]) {
                    $("#jplayer_video").jPlayer("mute", true);
                }
                $("#jplayer_audio").jPlayer("mute", true);
                $("#jplayer_audio").jPlayer("volume", 0);
                $("#jplayer_background").jPlayer("mute", true);
                $("#jplayer_background").jPlayer("volume", 0);
                $("#jplayer_effectSound").jPlayer("mute", true);
                $("#jplayer_effectSound").jPlayer("volume", 0);
            }
            else {
                $("#volume-popup-mute").attr('alt', admin_Mute);
                $("#volume-popup-mute").attr('title', admin_Mute);

                $("#volume-button").removeClass("volume-button-mute-style").addClass("volume-button-style");

                $("#volume-popup-mute").removeClass("volume-popup-mute-style").addClass("volume-popup-speaker-style");
                VolumeMute = false;
                if (TemplateArrayHasVideo[CurrentTemplateID]) {
                    $("#jplayer_video").jPlayer("mute", false);
                }
                $("#jplayer_audio").jPlayer("mute", false);
                $("#jplayer_audio").jPlayer("volume", VolumeValue / 100);
                $("#jplayer_background").jPlayer("mute", false);
                $("#jplayer_background").jPlayer("volume", VolumeValue / 100);
                $("#jplayer_effectSound").jPlayer("mute", false);
                $("#jplayer_effectSound").jPlayer("volume", VolumeValue / 100);
            }
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
function ChangeVolume(y) {
    if (!admin_DisableVolume) {

        if (VolumeMute == true) {
            toggleVolumeMute();
        }
        if (y < VolumeMouseMin) {
            y = VolumeMouseMin;
        }
        if (y > VolumeMouseMax) {
            y = VolumeMouseMax;
        }

        VolumeValue = Math.round(((VolumeMouseMax - y) / (VolumeMouseMax - VolumeMouseMin)) * 100);
        $("#volume-slider-button").css({"top": (y + VolumeYOffset) + "px"});
    }
}

//------------------------------------------------------------------------------------------------------------------
function ChangeMode(e) {
    $("#" + ModeSettingID).removeClass("mode-settings-style-active");
    ModeSettingID = e;


    if (ModeSettingID.charAt(1) == "T") {
        VolumeMute = false;
    }
    else {
        VolumeMute = true;
    }
    toggleVolumeMute();

    CurrentMode = ModeSettingID.slice(2); //delete first two characters

    $("#" + ModeSettingID).addClass("mode-settings-style-active");
    if (isModeVisible == true) {
        toggleModeBox();
    }

    CurrentPositionX = CurrentPosition;

    FlashAbortTimer();
    FlashTime = -1;


    LoadPage(selectedPageID, CurrentPositionX, 0, true);
}

//------------------------------------------------------------------------------------------------------------------
function UpdateMouseVolume(e) {
    if (!admin_DisableVolume) {

        VolumerelativePosition = {
            left: e.pageX - $(document).scrollLeft() - $('#volume-slider').offset().left,
            top: e.pageY - $(document).scrollTop() - $('#volume-slider').offset().top
        };

        if (VolumeSliderMouseDown == true) {
            ChangeVolume(VolumerelativePosition.top);
            if (TemplateArrayHasVideo[CurrentTemplateID]) {
                $("#jplayer_video").jPlayer("volume", VolumeValue / 100);
            }
            $("#jplayer_audio").jPlayer("volume", VolumeValue / 100);
            $("#jplayer_background").jPlayer("volume", VolumeValue / 100);
            $("#jplayer_effectSound").jPlayer("volume", VolumeValue / 100);
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
function CloseQuizDialogs() {
    NewDialogClose();
}

//------------------------------------------------------------------------------------------------------------------
function ForwardClick() {
    $("#FadeOutBackgroundDiv").hide();
    $("#FreeFormDialogDiv").hide();

    window.clearInterval(FwdButtonBlinkTimer);
    window.clearTimeout(fwdtimerblink);

    if ($("#forward-button").hasClass("forward-button-style-offline")) {

        if ((CurrentPageMode == "inteactiveQuiz") || (CurrentPageMode == "flatQuiz") || (CurrentPageMode == "quiz") || (CurrentPageMode == "finalExam") || (CurrentPageMode == "preExam") || (CurrentPageMode == "survey")) {
            alert(admin_FlatQuizAlert);
        }
        else if (isMobile) {
            alert("Please wait for the audio to finish or complete interactivity before continuing on to the next page.");
        }


        return false;
    }

    if (CurrentPageMode == "finalExam") {
        if (FinalExamCurrentActiveQuestion < FinalExamGroupMaxQuestions - 1) {
            if (!admin_ReviewMode) {
                $("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
                $("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
            }

            FinalExamCurrentActiveQuestion++;
            DrawFinalExamQuiz(FinalExamCurrentActiveQuestion);
            return false;
        }
        else {
            //unlock next page if exam is over
            UnlockNextPage(false, true);
        }
    }

    if (CurrentPageMode == "preExam") {
        if (PreExamCurrentActiveQuestion < PreExamMaxQuestions) {
            if (!admin_ReviewMode) {
                $("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
                $("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
            }

            PreExamCurrentActiveQuestion++;
            DrawPreExamQuiz(PreExamCurrentActiveQuestion);
            return false;
        }
        else {
            //unlock next page if exam is over
            UnlockNextPage(false, true);
        }
    }

    if (CurrentPageMode == "survey") {
        if (SurveyCurrentActiveQuestion < SurveyMaxQuestions) {
            if (!admin_ReviewMode) {
                $("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
                $("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
            }

            SurveyCurrentActiveQuestion++;
            DrawSurveyQuiz(SurveyCurrentActiveQuestion);
            return false;
        }
        else {
            //unlock next page if exam is over
            UnlockNextPage(false, true);
        }
    }

    CloseQuizDialogs();

    var NextPageID = selectedPageID + 1;
    if (NextPageID >= ModulePageArray.length - 1) NextPageID = ModulePageArray.length - 1;

    if (CourseMode == "Video") {

        if ((ModulePageArray[NextPageID].xViewable == 0) && (CurrentPageMode != "slide") && (CurrentPageMode != "policy")) {
            if ((CurrentPageMode == "inteactiveQuiz") || (CurrentPageMode == "flatQuiz") || (CurrentPageMode == "quiz") || (CurrentPageMode == "bumpyQuiz")) {
                alert(admin_FlatQuizAlert);
            }
            else {
                alert(admin_MinTimeWaitAlert.replace("%%MinTime", ModulePageArray[selectedPageID].xMinTime));
            }
        }
        else {
            FlashAbortTimer();
            FlashTime = -1;
            UnlockNextPage(true, true);
        }
    }
    else {
        if ((ModulePageArray[NextPageID].xViewable == 0) && ((CurrentPageMode == "inteactiveQuiz") || (CurrentPageMode == "quiz") || (CurrentPageMode == "flatQuiz") || (CurrentPageMode == "bumpyQuiz"))) {
            alert(admin_FlatQuizAlert);
        }
        else {
            if ((CurrentTextFrame < PageTextArray.length - 1) && (CurrentPageMode == "video")) {
                CurrentTextFrame++;
                UpdateTextArea(1, 0);
                $("#backward-button").removeClass("backward-button-style-offline").addClass("backward-button-style");
            }
            else {
                FlashAbortTimer();
                FlashTime = -1;
                FlashFinished = true;

                TextGoBackwards = 0;
                UnlockNextPage(true, true);
            }
        }
    }
}


//------------------------------------------------------------------------------------------------------------------
function BackwardsClick() {
    $("#FadeOutBackgroundDiv").hide();
    $("#FreeFormDialogDiv").hide();

    if ($("#backward-button").hasClass("backward-button-style-offline")) {
        return false;
    }

    if ((CurrentPageMode == "finalExam") && (!admin_ReviewMode)) {
        return false;
    }
    if ((CurrentPageMode == "preExam") && (!admin_ReviewMode)) {
        return false;
    }
    if ((CurrentPageMode == "survey") && (!admin_ReviewMode)) {
        return false;
    }

    CloseQuizDialogs();

    selectedPageID--;
    if (ModulePageArray[selectedPageID].xName.charAt(0) == "M") {
        selectedPageID--;
    }

    FlashAbortTimer();
    FlashTime = -1;

    LoadPage(selectedPageID, 0, 0, true);
}

//------------------------------------------------------------------------------------------------------------------
function ReplayClick() {
    if ($("#replay-button").hasClass("replay-button-disabled-style")) {
        return false;
    }

    CloseQuizDialogs();

    FlashAbortTimer();
    FlashTime = -1;

    LoadPage(selectedPageID, 0, 0, true);
}

//------------------------------------------------------------------------------------------------------------------
function ChapterComboClick() {
    if (isPageComboOpen == false) {
        isPageComboOpen = true;
        $("#page-combo").removeClass("page-combo-style").addClass("page-combo-style-active");
        $("#page-select").css('visibility', 'visible').show('slide', {direction: 'up'}, 350, function () {

            $("#page-select-text").css('margin-bottom', '0px');

            $("#page-select-text").scrollTop($("#page-select-text").scrollTop() + $(".page-select-text-line-style-active").position().top - ($("#page-select-text").height() / 2 + $(".page-select-text-line-style-active").height() / 2));
        });

    }
    else {
        isPageComboOpen = false;
        $("#page-combo").addClass("page-combo-style").removeClass("page-combo-style-active");
        $("#page-select").hide('slide', {direction: 'up'}, 350);
        $("#page-select-text").css('margin-bottom', '1px');

    }
}

//------------------------------------------------------------------------------------------------------------------
function GlossaryClick() {
    if (isGlossaryOpen == false) {
        isGlossaryOpen = true;
        $("#glossary-button").removeClass("glossary-button-style").addClass("glossary-button-style-active");
        $("#glossary-select").css('visibility', 'visible').show('drop', {direction: 'up'}, 350, function () {
            $("#glossary-select-middle").css('margin', '0px');
        });
    }
    else {
        isGlossaryOpen = false;
        $("#glossary-button").addClass("glossary-button-style").removeClass("glossary-button-style-active");
        $("#glossary-select").hide('drop', {direction: 'up'}, 350);
        $("#glossary-select-middle").css('margin', '1px');
    }
}

//------------------------------------------------------------------------------------------------------------------
function HelpClick() {
    if (isHelpOpen == false) {
        isHelpOpen = true;
        $("#help-button").removeClass("help-button-style").addClass("help-button-style-active");
        $("#help-window").css('visibility', 'visible').show('drop', {direction: 'up'}, 350, function () {
            $("#wrap").css('margin', '0px');
        });
    }
    else {
        isHelpOpen = false;
        $("#help-button").addClass("help-button-style").removeClass("help-button-style-active");
        $("#help-window").hide('drop', {direction: 'up'}, 350);
        $("#wrap").css('margin', '1px');
    }
}

//------------------------------------------------------------------------------------------------------------------
function attachClickAction() {
    $(".textlink").off('click');
    $(".maillink").off('click');

    $(".textlink").on('click', function () {
        VideoPopopStyle = "content";
        ShowStandardDialog($(this).data('dialog'));
        return false;
    });

    $(".maillink").on('click', function () {
        if ((CourseMode == "Video") && (CurrentPageMode != "flash")) {
            PauseVideo(true, false);
        }

        var link = 'mailto.html#mailto:' + $(this).data('mailto');
        window.open(link, 'Mailer');
        return false;
    });

}

//------------------------------------------------------------------------------------------------------------------
function UpdateTextArea(ForceUpdate, GoBackwards) {

    if (CourseMode == "Video") {
        TextGoBackwards = GoBackwards;

        if ((isPlay == 1) || (ForceUpdate == 1)) {
            for (xCounter = 0; xCounter < PageTextArray.length; xCounter++) {
                //load text into target
                if (xCounter < PageTextArray.length - 1) {
                    if (((CurrentTextFrame !== xCounter) || (CurrentTextFrame == 0 && ShowOnVideoTimeIsZero)) && (CurrentPosition >= PageTextArray[xCounter].xTime) && (CurrentPosition < PageTextArray[xCounter + 1].xTime)) {
                        ShowOnVideoTimeIsZero = false;
                        CurrentTextFrame = xCounter;

                        if (PageTextArray[CurrentTextFrame].xInsert == "popupdialog") {
                            VideoPopopStyle = "content";
                            ShowStandardDialog(PageTextArray[CurrentTextFrame].xTarget);
                        }

                        if (PageTextArray[CurrentTextFrame].xInsert == "quizdialog") {
                            VideoPopopStyle = "quiz";
                            ShowQuizDialog(PageTextArray[CurrentTextFrame].xTarget);
                        }

                        if (PageTextArray[CurrentTextFrame].xInsert == "quizdialog_popupfeedback") {
                            VideoPopopStyle = "quiz";
                            ShowQuizDialog_v2(PageTextArray[CurrentTextFrame].xTarget);
                        }

                        if (PageTextArray[CurrentTextFrame].xCC == "true" && !CCEnabled) {
                            $("#" + PageTextArray[CurrentTextFrame].xTarget).hide();
                        }
                        else {

                            if (PageTextArray[CurrentTextFrame].xInsert == "insert") {
                                var TempFadeSpeed = parseInt(PageTextArray[CurrentTextFrame].FadeSpeed, 10);
                                if (TempFadeSpeed > 500) TempFadeSpeed = 500;
                                $("#" + PageTextArray[CurrentTextFrame].xTarget).append($(PageTextArray[CurrentTextFrame].xText + "<span></span>").hide().fadeIn(TempFadeSpeed, function () {
                                    attachClickAction();
                                }));
                            }
                            else if (PageTextArray[CurrentTextFrame].xInsert == "overwrite") {
                                var TempFadeSpeed = parseInt(PageTextArray[CurrentTextFrame].FadeSpeed, 10);
                                if (TempFadeSpeed > 500) TempFadeSpeed = 500;
                                $("#" + PageTextArray[CurrentTextFrame].xTarget).fadeOut(TempFadeSpeed, function () {
                                    $("#" + PageTextArray[CurrentTextFrame].xTarget).html(PageTextArray[CurrentTextFrame].xText).hide().fadeIn(TempFadeSpeed, function () {
                                        attachClickAction();
                                    });
                                });
                            }
                            else if (PageTextArray[CurrentTextFrame].xInsert == "hide") {
                                $("#" + PageTextArray[CurrentTextFrame].xTarget).hide();
                            }
                            else if (PageTextArray[CurrentTextFrame].xInsert == "show") {
                                $("#" + PageTextArray[CurrentTextFrame].xTarget).html(PageTextArray[CurrentTextFrame].xText).show(function () {
                                    attachClickAction();
                                });
                            }
                            else if (PageTextArray[CurrentTextFrame].xInsert == "fadeout") {
                                var TempFadeSpeed = parseInt(PageTextArray[CurrentTextFrame].FadeSpeed, 10);
                                if (TempFadeSpeed > 500) TempFadeSpeed = 500;
                                $("#" + PageTextArray[CurrentTextFrame].xTarget).fadeOut(TempFadeSpeed);
                            }

                        }
                    }
                }
                else if ((xCounter == PageTextArray.length - 1) && (CurrentTextFrame != xCounter || (CurrentTextFrame == 0 && VideoWithSingleFrame)) && (CurrentPosition >= PageTextArray[xCounter].xTime)) {
                    VideoWithSingleFrame = false;
                    CurrentTextFrame = xCounter;
                    console.log(CurrentTextFrame);
                    if (PageTextArray[CurrentTextFrame].xCC == "true" && !CCEnabled) {
                        $("#" + PageTextArray[CurrentTextFrame].xTarget).hide();
                    }
                    else {

                        $("#" + PageTextArray[CurrentTextFrame].xTarget).fadeOut('fast', function () {
                            var TempFadeSpeed = parseInt(PageTextArray[CurrentTextFrame].FadeSpeed, 10);
                            if (TempFadeSpeed > 500) TempFadeSpeed = 500;
                            $("#" + PageTextArray[CurrentTextFrame].xTarget).html(PageTextArray[CurrentTextFrame].xText).fadeIn(TempFadeSpeed, function () {
                                attachClickAction();
                            });
                        });
                    }
                }
            }
        }
    }
    else //coursemode not video
    {
        TextGoBackwards = GoBackwards;

        if ((ForceUpdate == 1) && (CurrentPageMode == "video")) {
            if ((CurrentTextFrame == 0) || ((GoBackwards == 1) && (CurrentTextFrame == PageTextArray.length - 1))) {
                $("#" + PageTextArray[CurrentTextFrame].xTarget).html(PageTextArray[CurrentTextFrame].xText);
                $("#jplayer_video").html('<IMG SRC="' + PageTextArray[CurrentTextFrame].xImage + '" width=' + TemplateVideoWidth[CurrentTemplateID] + ' height=' + TemplateVideoHeight[CurrentTemplateID] + '>');
                attachClickAction();
            }
            else {
                if (PageTextArray[CurrentTextFrame].xInsert == "popupdialog") {
                    VideoPopopStyle = "content";
                    ShowStandardDialog(PageTextArray[CurrentTextFrame].xTarget);
                }

                if (PageTextArray[CurrentTextFrame].xInsert == "quizdialog") {
                    VideoPopopStyle = "quiz";
                    ShowQuizDialog(PageTextArray[CurrentTextFrame].xTarget);
                }

                if (PageTextArray[CurrentTextFrame].xInsert == "quizdialog_popupfeedback") {
                    VideoPopopStyle = "quiz";
                    ShowQuizDialog_v2(PageTextArray[CurrentTextFrame].xTarget);
                }

                if ((PageTextArray[CurrentTextFrame].xInsert == "insert")) {
                    $("#jplayer_video").html('<IMG SRC="' + PageTextArray[CurrentTextFrame].xImage + '" width=' + TemplateVideoWidth[CurrentTemplateID] + ' height=' + TemplateVideoHeight[CurrentTemplateID] + '>');
                    if (GoBackwards == 1) {
                        i3 = CurrentTextFrame;
                        while ((i3 >= 1) && (!(PageTextArray[i3].xInsert == "overwrite"))) {
                            i3--;
                        }

                        textStr = "";
                        for (i4 = i3; i4 <= CurrentTextFrame; i4++) {
                            textStr += PageTextArray[i4].xText;
                        }

                        $("#" + PageTextArray[CurrentTextFrame].xTarget).html(textStr);
                        attachClickAction();
                    }
                    else {
                        $("#" + PageTextArray[CurrentTextFrame].xTarget).append($(PageTextArray[CurrentTextFrame].xText).hide().fadeIn('fast'));
                        if ((PageTextArray[CurrentTextFrame].xSkipClick == "yes") && (!GoBackwards)) {
                            ForwardClick();
                        }
                    }
                }
                else if (PageTextArray[CurrentTextFrame].xInsert == "overwrite") {
                    $("#jplayer_video").html('<IMG SRC="' + PageTextArray[CurrentTextFrame].xImage + '" width=' + TemplateVideoWidth[CurrentTemplateID] + ' height=' + TemplateVideoHeight[CurrentTemplateID] + '>');
                    $("#" + PageTextArray[CurrentTextFrame].xTarget).fadeOut('fast', function () {
                        $("#" + PageTextArray[CurrentTextFrame].xTarget).html(PageTextArray[CurrentTextFrame].xText).fadeIn('fast', function () {
                            attachClickAction();
                            if ((PageTextArray[CurrentTextFrame].xSkipClick == "yes") && (!GoBackwards)) {
                                ForwardClick();
                            }
                        });
                    });
                }
                else if (PageTextArray[CurrentTextFrame].xInsert == "fadeout") {
                    $("#" + PageTextArray[CurrentTextFrame].xTarget).fadeOut('fast');
                    if (!GoBackwards) {
                        ForwardClick();
                    }
                }
                else if (PageTextArray[CurrentTextFrame].xInsert == "hide") {
                    $("#" + PageTextArray[CurrentTextFrame].xTarget).hide();
                }
                else if (PageTextArray[CurrentTextFrame].xInsert == "show") {
                    $("#jplayer_video").html('<IMG SRC="' + PageTextArray[CurrentTextFrame].xImage + '" width=' + TemplateVideoWidth[CurrentTemplateID] + ' height=' + TemplateVideoHeight[CurrentTemplateID] + '>');
                    $("#" + PageTextArray[CurrentTextFrame].xTarget).html(PageTextArray[CurrentTextFrame].xText).show(function () {
                        attachClickAction();
                    });
                    if ((PageTextArray[CurrentTextFrame].xSkipClick == "yes") && (!GoBackwards)) {
                        ForwardClick();
                    }
                }
            }

            attachClickAction();

            if (admin_UseScorm12) {
                UpdateBookmark(selectedModuleID, selectedPageID + "-" + CurrentTextFrame, selectedPageID);
            }

            if (admin_UseScorm2004) {
                UpdateBookmark_2004(selectedModuleID, selectedPageID + "-" + CurrentTextFrame, selectedPageID);
            }

            if ((CurrentPageNumber <= 1) && (CurrentTextFrame == 0)) {
                $("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
            }

            if ((CurrentPageNumber >= ModulePageArray.length - 1) && (CurrentTextFrame == PageTextArray.length - 1)) {
                $("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
            }
        }
    }
}


//------------------------------------------------------------------------------------------------------------------
function updateButtonState(enableReply) {

    if (enableReply) {
        //enable buttons
        $("#replay-button").removeClass("replay-button-disabled-style").addClass("replay-button-style");
    }
    else {
        //disable buttons
        $("#replay-button").removeClass("replay-button-style").addClass("replay-button-disabled-style");
    }

    if (CourseMode == "Video") {
        //enable buttons
        $("#play-button").removeClass("play-button-disabled-style").addClass("play-button-style");
        $("#mode-button").removeClass("mode-button-style-offline").addClass("mode-button-style");
    }

    if (admin_AutoForwardEnabled) {
        $("#autoforward-button").removeClass("autoforward-button-disabled-style").addClass("autoforward-button-style");
    }
}


//------------------------------------------------------------------------------------------------------------------
//pages in combobox have divID starting with C then rownumber
//module names also have row number increased and start with C
//LoadPage takes the ID and checks that the ModulePageArray
//the ModulePageArray contains names of Pages and Modules
//if it is a module then it has a M insert in front of it if it
//is a Page it has a L inserted in front of the name.
//So if the selected ID row in the Array starts with "M" it will
//select the next row which has to be a Page. And also highlight this next row.
//If the selected ID Row in the Array start with "L" then it will
//look backwards to find the modules name for the page but will highlight the selected row.

//This way calling LoadPage with ActivePageID + 1 will autoadvance and
//even if it is a module it will skip it properly.

//------------------------------------------------------------------------------------------------------------------
function LoadPage(PageID, PositionX, VariableForTextMode, ForcePlay) {
    if (PrevPageID !== -1) {
        var CurrentTime = new Date();
        //UserHistory.push({LogType: 'TimeSpentPage', pID: PrevPageID, Interval: (CurrentTime - TimeSpentOnPage)});
    }

    //console.log(PageID+" - "+PositionX+" - "+VariableForTextMode+" - "+ForcePlay);

    clearTimeout(BumpyQuizIntroTimeout);
    clearTimeout(BumpyQuizOptionsTimeout);
    clearInterval(ImageAnimationInterval);
    clearTimeout(ImageAnimationTimeout);
    clearTimeout(GamificationDialogTimeOut);

    //clear background audio buffer
    if (CourseMode == "Video") {
        $("#jplayer_background").jPlayer("clearMedia");
    }

    SequencerIsDragging = false;

    if (iEngineScript1 !== null) clearTimeout(iEngineScript1);
    if (iEngineScript2 !== null) clearTimeout(iEngineScript2);
    if (iEngineScript3 !== null) clearTimeout(iEngineScript3);

    GamificationDialogVisible = false;

    isPlayX = isPlay;
    $("#video-progress-bar-time-done").html("&nbsp;0:00&nbsp;");
    $("#video-progress-bar-time-left").html("&nbsp;-0:00&nbsp;");
    $("#video-progress-bar-middle").width(+"1px");
    $("#video-progress-bar").hide();
    $("#jplayer_video").hide();

    if (CourseMode == "Video") {
        $("#jplayer_video").jPlayer("clearMedia");
    }

    $("#FadeOutBackgroundDiv").hide();
    $("#FreeFormDialogDiv").hide();

    $("#ajax-loading-graph").hide();
    $("#ajax-poster").hide();

    if (PageID < 0) PageID = 0;
    if (PageID > ModulePageArray.length - 1) PageID = ModulePageArray.length - 1;

    //check if there is a minimum time requirment, if so show message when user tries to enter last page
    if ((admin_MinTime > 0) && (admin_ShowTimer) && (CourseTotalSeconds < (admin_MinTime * 60)) && (PageID == ModulePageArray.length - 1)) {
        PageID = ModulePageArray.length - 2;
        alert(admin_MinTimeMessage.replace("%%MinTime", admin_MinTime));
    }


    if (ModulePageArray[PageID].xViewable == 0) PageID = PageID - 1;

    //remove previously selected row from combobox
    $("#" + PageRowDivID).removeClass("page-select-text-line-style-active");

    if (ModulePageArray[PageID].xName.charAt(0) == "M") //goto first page of module show page and module
    {
        selectedModuleID = parseInt(PageID, 10);
        selectedPageID = selectedModuleID + 1;
    }
    else if (ModulePageArray[PageID].xName.charAt(0) == "L") //find name of module and open page
    {
        selectedModuleID = 1;
        selectedPageID = parseInt(PageID, 10);
        j = selectedPageID;
        while ((ModulePageArray[j].xName.charAt(0) != "M") && (j > 0)) {
            j--;
        }
        selectedModuleID = j;
    }

    //skip the video intro page if it is second load
    if ((ModulePageArray[selectedPageID].xType == "iPadOnly") && (isiPad) && (!isiPadFirstTimeLoad)) {
        selectedPageID++;
    }

    TimeSpentOnPage = new Date();
    PrevPageID = selectedPageID;

    //use selectedPageID not pageID, as pageID might be on a module name in which case it is actually +1

    if ((ModulePageArray[selectedPageID].xType == "FinalExam") && (selectedPageID == ModulePageArray.length - 1)) {
        //if last page is final exam then do nothing as the final exam closing dialog will do the scorm postings and course complete posting
    }
    else {
        if ((selectedPageID == ModulePageArray.length - 1) && ((admin_PostGamificationToScorm && (GamificationUserScore > 0 || GamificationComputerScore > 0)) || (CourseHasFinalExam))) {
            //course has gamification, and user or computer score is greater than zero so we'll set passed to true, but lesson passed score is sent from the gamification last dialog
            //course has final exam, and you get to the last page then set passed to true, but lesson passed score is sent from final exam
            if (admin_UseScorm12) SetScormCoursePassed();
            if (admin_UseScorm2004) SetScormCoursePassed_2004();
        }
        else if ((selectedPageID == ModulePageArray.length - 1) && (!CourseHasFinalExam) && (!admin_PostGamificationToScorm)) {
            //if course has no final exam and no gamification set passed to 100
            if (admin_UseScorm12) {
                SetLessonPassed(100, true);
                SetScormCoursePassed();
            }

            if (admin_UseScorm2004) {
                SetLessonPassed_2004(100, true);
                SetScormCoursePassed_2004();
            }
        }
    }

    if (getParameterByName("bookmark") != "") {
        LastBookmark = getParameterByName("bookmark");
    }

    var ShowBookMarkDialog = false;
    if ((LastBookmark != "") && (FirstLoad)) {
        ShowBookMarkDialog = true;

        var LastBookmarks = LastBookmark.split("-");
        //console.log(LastBookmarks.length+" "+LastBookmarks[0]+" "+LastBookmarks[1]);

        if (admin_ReviewMode) {
            for (i = 0; i < ModulePageArray.length; i++) {
                ModulePageArray[i].xViewable = 1;
                $("#C" + (i)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
            }

        }

        if (LastBookmarks.length == 3) {
            for (i = 1; i <= LastBookmarks[1]; i++) {
                ModulePageArray[i].xViewable = 1;
                $("#C" + (i)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
            }

            selectedModuleID = parseInt(LastBookmarks[0], 10);
            selectedPageID = parseInt(LastBookmarks[1], 10);

            if ((typeof ModulePageArray[selectedPageID] === "undefined") || (typeof ModulePageArray[selectedModuleID] === "undefined")) {
                selectedModuleID = 0;
                selectedPageID = 1;
            }

        }
        FirstLoad = false;
    }

    $("#module-name").html(ModulePageArray[selectedModuleID].xName.slice(1));
    $("#page-combo").html(ModulePageArray[selectedPageID].xName.slice(1));

    //find the pages real position skipping counting for the rows with module names to update the progressbar
    j = 0;
    k = 0;
    while (j < selectedPageID) {
        j++;
        if (ModulePageArray[j].xName.charAt(0) == "L") {
            k++;
        }
    }
    CurrentPageNumber = k;

    //add style to new row and save its ID
    PageRowDivID = "C" + selectedPageID;
    $("#" + PageRowDivID).addClass("page-select-text-line-style-active");

    $("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
    $("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");

    if (selectedPageID < 2) {
        $("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
    }

    if (selectedPageID >= ModulePageArray.length - 1) {
        $("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
    }

    $(CourseXML).find("Modules").each(function () {

        $(CourseXML).find("Module").each(function () {

            if ('M' + $(this).attr("Name") == ModulePageArray[selectedModuleID].xName) {
                $(this).find("Page").each(function () {

                    if ('L' + $(this).attr("Name") == ModulePageArray[selectedPageID].xName) {
                        if (getParameterByName("bookmark") != "") {
                            console.log(selectedModuleID + "-" + selectedPageID + "-0");
                        }

                        if (admin_UseScorm12) UpdateBookmark(selectedModuleID, selectedPageID + "-0", selectedPageID);
                        if (admin_UseScorm2004) UpdateBookmark_2004(selectedModuleID, selectedPageID + "-0", selectedPageID);

                        PauseAudioOne(false, true);
                        PauseBackgroundAudio(false, true);
                        PauseEffectSound(false, true);

                        //load page template
                        CurrentTemplateID = $(this).attr("Template");
                        $("#template-place").html(TemplateArray[CurrentTemplateID]);

                        if (ModulePageArray[selectedPageID].xType == "FlatQuiz") {
                            CurrentPageMode = "flatQuiz";
                            updateButtonState(true);

                            $("#mode-button").removeClass("mode-button-style-offline").addClass("mode-button-style");

                            DrawFlatQuiz();
                        }
                        else if (ModulePageArray[selectedPageID].xType == "BumpyQuiz") {
                            CurrentPageMode = "bumpyQuiz";
                            updateButtonState(true);

                            $("#mode-button").removeClass("mode-button-style-offline").addClass("mode-button-style");

                            isPlay = 1;
                            if (CourseMode == "Video") {
                                $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
                                $("#play-button").attr('alt', admin_Pause);
                                $("#play-button").attr('title', admin_Pause);
                            }

                            DrawBumpyQuiz();
                        }
                        else if (ModulePageArray[selectedPageID].xType == "InteractiveQuiz") {
                            CurrentPageMode = "inteactiveQuiz";
                            updateButtonState(false);

                            DrawInteractiveQuiz();

                        }
                        else if (ModulePageArray[selectedPageID].xType == "Flash") {
                            CurrentPageMode = "flash";
                            updateButtonState(true);

                            GamificationShowInGameScore = $(this).attr("GamificationShowInGameScore");
                            if (typeof GamificationShowInGameScore == "undefined") {
                                GamificationShowInGameScore = false;
                            }
                            else {
                                GamificationShowInGameScore = true;
                            }

                            GamificationLastQuestion = $(this).attr("GamificationLastQuestion");
                            if (typeof GamificationLastQuestion == "undefined") {
                                GamificationLastQuestion = false;
                            }
                            else {
                                GamificationLastQuestion = true;
                            }

                            SetupFlash($(this).find("FlashForVideo"));

                        }
                        else if (ModulePageArray[selectedPageID].xType == "FinalExam") {
                            CurrentPageMode = "finalExam";

                            CourseHasFinalExam = true;

                            //increment the retry counter for current exam section
                            admin_FinalRetakeCounter++;
                            RebuildFinalExamArray($(this).attr("Group"), $(this).attr("RandomizeOrder") === 'yes');

                            updateButtonState(false);

                            if (!admin_ReviewMode) {
                                $("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
                                $("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
                            }


                            SetupFinalExam($(this).attr("Group"));
                        }
                        else if (ModulePageArray[selectedPageID].xType == "PreExam") {
                            CurrentPageMode = "preExam";

                            updateButtonState(false);

                            if (!admin_ReviewMode) {
                                $("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
                                $("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
                            }

                            SetupPreExam();
                        }
                        else if (ModulePageArray[selectedPageID].xType == "Survey") {
                            CurrentPageMode = "survey";

                            updateButtonState(false);
                            SetupSurvey();
                        }
                        else if (ModulePageArray[selectedPageID].xType == "Policy") {
                            CurrentPageMode = "policy";

                            if (selectedPageID + 1 < ModulePageArray.length) {
                                if (ModulePageArray[selectedPageID + 1].xViewable != 1) {
                                    $("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
                                }
                            }

                            updateButtonState(false);
                            DrawPolicy();

                        }
                        else if (ModulePageArray[selectedPageID].xType == "Slide") {
                            CurrentPageMode = "slide";

                            updateButtonState(false);

                            //open next chapter
                            UnlockNextPage(false);

                            DrawSlide();

                        }
                        else if (ModulePageArray[selectedPageID].xType == "Quiz") {
                            CurrentPageMode = "quiz";
                            updateButtonState(true);

                            CurrentTemplateID = $(this).attr("Template");
                            $("#template-place").html(TemplateArray[CurrentTemplateID]);

                            DrawModule(1);
                        }
                        else {
                            CurrentPageMode = "video";

                            //reset flash mode variables
                            FlashXMLCodePause = false;
                            FlashFinished = false;

                            updateButtonState(true);

                            PauseAudioOne(false, true);
                            PauseBackgroundAudio(false, true);
                            PauseEffectSound(false, true);

                            PageTextArray = []; //blank page text array first
                            //Load Page Text Fields into Arrays
                            $(this).find("Text").each(function () {

                                xTime = $(this).attr("TimeToShow");
                                xTimes = xTime.split(":");

                                var xFadeSpeed = parseInt($(this).attr("FadeSpeed"), 10);
                                if (typeof $(this).attr("FadeSpeed") == "undefined") {
                                    xFadeSpeed = 250;
                                }

                                var xCC = $(this).attr("CC");
                                if (typeof $(this).attr("CC") == "undefined") {
                                    xCC = "false";
                                }

                                var xSkipClick = $(this).attr("TextModeNoBreak");
                                if (typeof xSkipClick == "undefined") {
                                    xSkipClick = "";
                                }
                                xSkipClick = xSkipClick.toLowerCase();


                                PageTextArray.push({
                                    xText: $(this).text(),
                                    xTime: parseInt(xTimes[0] * 3600, 10) + parseInt(xTimes[1] * 60, 10) + parseInt(xTimes[2], 10),
                                    xTarget: $(this).attr("Target"),
                                    xCC: xCC,
                                    FadeSpeed: xFadeSpeed,
                                    xInsert: $(this).attr("Insert").toLowerCase(),
                                    xSkipClick: xSkipClick,
                                    xImage: $(this).attr("AltImage")
                                });
                                if (CourseMode !== "Video") {
                                    if ($(this).attr("AltImage") !== "" && typeof $(this).attr("AltImage") !== "undefined") {
                                        $.preLoadImages($(this).attr("AltImage"));
                                    }
                                }
                            });
                            VideoWithSingleFrame = true;
                            CurrentTextFrame = 0;
                            ShowOnVideoTimeIsZero = true;
                            PositionX = 0;
                            CurrentPosition = 0;


                            //load page template
                            if (CourseMode == "Video") {
                                CurrentTemplateID = $(this).attr("VideoTemplate");
                                $("#template-place").html(TemplateArray[CurrentTemplateID]);
                            }
                            else {
                                CurrentTemplateID = $(this).attr("TextTemplate");
                                $("#template-place").html(TemplateArray[CurrentTemplateID]);
                            }

                            //load first keyframe
                            UpdateTextArea(1, TextGoBackwards);
                            CurrentTextFrame = 0;
                            VideoWithSingleFrame = true;

                            PositionX = 0;
                            CurrentPosition = 0;

                            //setup video
                            if (CourseMode == "Video") {

                                if (TemplateArrayHasVideo[CurrentTemplateID]) {
                                    var VideoImageFile = $(this).attr("VideoImage");

                                    //init audio for tablets
                                    InitAudio = $(this).attr("TabletInitAudio");
                                    if (typeof InitAudio == "undefined") {
                                        InitAudio = "xmls/" + CourseLanguage + "/audio/click.mp3";
                                    }

                                    if ((isiPad) && ($(this).attr("IpadVideoImage") != null)) {
                                        var VideoImageFile = $(this).attr("IpadVideoImage");
                                    }
                                    var m4vFile = "";
                                    var WebmFile = "";
                                    $(this).find("Mode").each(function () {
                                        if (CurrentMode == $(this).attr("Level")) {

                                            tempStrX = $(this).attr("File");
                                            tempStrX2 = tempStrX.split(",");

                                            //single file
                                            if (tempStrX2.length == 1) {
                                                if (tempStrX2[0].search(".mp4") !== -1) {
                                                    m4vFile = tempStrX2[0];
                                                    if (m4vFile.search("://") == -1) {
                                                        m4vFile = cleanURL(document.URL) + m4vFile + "";
                                                    }
                                                }
                                                if (tempStrX2[0].search(".webm") !== -1) {
                                                    WebmFile = tempStrX2[0];
                                                    if (WebmFile.search("://") == -1) {
                                                        WebmFile = cleanURL(document.URL) + WebmFile + "";
                                                    }
                                                }
                                            }

                                            //dual file
                                            if (tempStrX2.length == 2) {
                                                if (tempStrX2[0].search(".mp4") !== -1) {
                                                    m4vFile = tempStrX2[0];
                                                    if (m4vFile.search("://") == -1) {
                                                        m4vFile = cleanURL(document.URL) + m4vFile + "";
                                                    }
                                                }
                                                if (tempStrX2[0].search(".webm") !== -1) {
                                                    WebmFile = tempStrX2[0];
                                                    if (WebmFile.search("://") == -1) {
                                                        WebmFile = cleanURL(document.URL) + WebmFile + "";
                                                    }
                                                }

                                                if (tempStrX2[1].search(".mp4") !== -1) {
                                                    m4vFile = tempStrX2[1];
                                                    if (m4vFile.search("://") == -1) {
                                                        m4vFile = cleanURL(document.URL) + m4vFile + "";
                                                    }
                                                }
                                                if (tempStrX2[1].search(".webm") !== -1) {
                                                    WebmFile = tempStrX2[1];
                                                    if (WebmFile.search("://") == -1) {
                                                        WebmFile = cleanURL(document.URL) + WebmFile + "";
                                                    }
                                                }
                                            }

                                            if (VideoImageFile.search("://") == -1) {
                                                VideoImageFile = cleanURL(document.URL) + VideoImageFile + "";
                                            }
                                        }
                                    });


                                    InitVideo(m4vFile, WebmFile + "", VideoImageFile + "", ForcePlay);

                                }
                            }
                        }
                    }
                });
            }
        });
    });

    attachClickAction();
    UpdateProgressBar();

    //show bookmark dialog
    if (ShowBookMarkDialog) {
        if ($(CourseXML).find("BookmarkDialog").text().length > 30 && 1 == 1) {
//			BookmarkBoxAudio = $(CourseXML).find("BookmarkDialog").attr("AudioFile");
//			LoadAndPlayAudioOne(BookmarkBoxAudio, false);

            if (CourseMode == "Video") {
                isPlay = 1;
                $("#play-button").trigger("click");
            }


            $("#FadeOutBackgroundDiv").css({
                "background-color": "black",
                "top": (!isMobile) ? "5px" : "0px",
                "left": (!isMobile) ? "5px" : "0px",
                "width": (!isMobile) ? ($("#skin-container").width() - 10) + "px" : $("#template-place").width() + "px",
                "height": (!isMobile) ? ($("#skin-container").height() - 15) + "px" : $("#template-place").height() + "px",
                "border-radius": "5px"
            });

            $("#FreeFormDialogCloseButton").off('click');
            $("#FreeFormDialogDiv").css({
                "top": $(CourseXML).find("BookmarkDialog").attr("Top") + "px",
                "left": $(CourseXML).find("BookmarkDialog").attr("Left") + "px"
            });

            $("#FreeFormDialogDiv").hide();
            $("#FreeFormDialogDiv").html($(CourseXML).find("BookmarkDialog").text()).promise().done(function () {
                $("#FreeFormDialogCloseButton").on('click', function () {
                    LoadPage(selectedPageID, 0, 0, 1);
                    return false;
                });

                $("#GoToFirstPageButton").on('click', function () {
                    LoadPage(1, 0, 0, 1);
                    return false;
                });

                $("#FreeFormDialogCloseButton").attr('tabindex', "0");
                $("#FreeFormDialogDiv").fadeIn(250);
            });

            $("#FadeOutBackgroundDiv").fadeIn(250);

        }
    }
}

//------------------------------------------------------------------------------------------------------------------
function PageClick(e) {
    CloseQuizDialogs();

    if (ModulePageArray[e.target.id.slice(1)].xViewable != 1) {
        alert(admin_DropDownAlert);
    }
    else if (isPageComboOpen == true) {
        isPageComboOpen = false;
        $("#page-combo").addClass("page-combo-style").removeClass("page-combo-style-active");
        $("#page-select").hide('slide', {direction: 'up'}, 350);
        $("#page-select-text").css('margin-bottom', '1px');

        FlashAbortTimer();
        FlashTime = -1;

        LoadPage(e.target.id.slice(1), 0, 0, true);
    }
}

//------------------------------------------------------------------------------------------------------------------
function AutoForwardClick() {
    if ($("#autoforward-button").hasClass("autoforward-button-disabled-style")) {
        return false;
    }

    if (admin_AutoForwardDefaultSetting == false) {
        admin_AutoForwardDefaultSetting = true;
        $("#autoforward-button").removeClass("noautoforward-button-style").addClass("autoforward-button-style");
        $("#autoforward-button").attr('alt', admin_AutoForwardText);
        $("#autoforward-button").attr('title', admin_AutoForwardText);
    }
    else if (admin_AutoForwardDefaultSetting == true) {
        admin_AutoForwardDefaultSetting = false;
        $("#autoforward-button").removeClass("autoforward-button-style").addClass("noautoforward-button-style");
        $("#autoforward-button").attr('alt', admin_NoAutoForwardText);
        $("#autoforward-button").attr('title', admin_NoAutoForwardText);
    }

}


//------------------------------------------------------------------------------------------------------------------
function GlossaryItemClick(e) {
    $("#" + GlossarySelectID).removeClass("glossary-select-text-line-style-active");
    GlossarySelectID = e.target.id;

    GlossaryTermID = GlossarySelectID.slice(9);
    $("#glossary-description").html(GlossaryTerms[GlossaryTermID]);

    $("#" + GlossarySelectID).addClass("glossary-select-text-line-style-active");
}


//------------------------------------------------------------------------------------------------------------------
function InitVideoPlayer() {
    $("#ajax-loading-graph").css({"top": ((parseInt(TemplateVideoHeight[CurrentTemplateID], 10) / 2) + 55) + "px"}); //140+55 = 195
    $("#ajax-loading-graph").css({"left": ((parseInt(TemplateVideoWidth[CurrentTemplateID], 10) / 2)) + "px"}); //390px before

    if ((KeyCode.indexOf(XCode) == -1) && (KeyCode.indexOf(XCode2) == -1) && (KeyCode.indexOf(XCode3) == -1)) {
        if (DialogIsVisible) {
            window.location.href = admin_L_URL;
            return false;
        }
    }

    if (CourseMode == "Video") {

        //initilaze with flash as default on MSIE 9
        if (($.browser.msie && parseInt($.browser.version, 10) === 9)) //|| ( (isThisFirefox()) && (isThisMac()) ) no longer needed as mac firefox supports mp4
        {

            $("#jplayer_video").jPlayer({
                swfPath: "jplayer",
                solution: "flash,html",
                supplied: "m4v,webmv",
                preload: "auto",
                size: {height: "280px", width: "780px"},
                volume: VolumeValue / 100,
                errorAlerts: false
            });
        }
        else {
            $("#jplayer_video").jPlayer({
                swfPath: "jplayer",
                solution: "html,flash",
                supplied: "m4v,webmv",
                preload: "auto",
                size: {height: "280px", width: "780px"},
                volume: VolumeValue / 100,
                errorAlerts: false
            });
        }

        $("#jplayer_video").bind($.jPlayer.event.waiting, function (event) {
            $("#ajax-loading-graph").show();
            $("#ajax-poster").show();
        });

        $("#jplayer_video").bind($.jPlayer.event.playing, function (event) {
            $("#ajax-loading-graph").fadeOut('slow');
            $("#ajax-poster").hide();
        });

        $("#jplayer_video").bind($.jPlayer.event.paused, function (event) {
            isPlay = 0;
            $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
            $("#play-button").attr('alt', admin_Play);
            $("#play-button").attr('title', admin_Play);
        });

        $("#jplayer_video").bind($.jPlayer.event.ended,
            function (event) {
                if (GamificationDialogVisible) {
                    console.log("Calling Next Page with Gamification Functions.");
                    if (GamificationLastQuestion) {
                        CloseGamificationFinalDialog(GamificationIsLost);
                    }
                    else {
                        CloseGamificationInGameDialog();
                    }
                }
                else

                //in flash mode loop video
                if (CurrentPageMode == "flash") {
                    if (SequencerVideoEndGoTo != 0) {
                        if (SequencerVideoEndBlank) {
                            $("#jplayer_video").hide(); //hide video player
                        }
                        SeqGoToAndPlay(SequencerVideoEndGoTo); //jump to timefreme
                    }
                    else {
                        if (SequencerVideoEndBlank) {
                            $("#jplayer_video").hide(); //hide video player
                        }
                        else {
                            $("#jplayer_video video").attr('playsinline', '');
                            $("#jplayer_video video").attr('webkit-playsinline', '');
                            $("#jplayer_video").jPlayer("play", 0); //loop in flash mode
                        }
                    }

                }
                else {
                    if ((admin_AutoForwardDefaultSetting == true) && (selectedPageID < ModulePageArray.length - 1)) {
                        ForwardClick();
                    }
                    else {
                        PauseVideo(true, false);
                        if (selectedPageID < ModulePageArray.length - 1) {
                            FwdBlink(4000, 1000);
                        }
                    }
                }
            });


        $("#jplayer_video").bind($.jPlayer.event.timeupdate,
            function (event) {

                VideoLength = event.jPlayer.status.duration;
                if (CurrentPageMode != "flash") {
                    if ((event.jPlayer.status.currentTime > event.jPlayer.status.duration - 1) && (!admin_AutoForwardDefaultSetting) && (event.jPlayer.status.currentTime > 5)) {
                        $(this).jPlayer("pause");
                        if (selectedPageID < ModulePageArray.length - 1) {
                            FwdBlink(4000, 1000);
                        }
                    }
                }

                if (event.jPlayer.status.waitForLoad) {
                    if ($("#jplayer_video").is(":visible")) {
                        $("#ajax-loading-graph").show();
                    }
                }
                else {
                    $("#ajax-loading-graph").fadeOut('slow');
                    if (!isiPadFirstTimeLoad) {
                        $("#ajax-poster").hide();
                    }
                }

                CurrentPosition = Math.floor(event.jPlayer.status.currentTime);
                if (CurrentPageMode != "flash") {
                    UpdateTextArea(0);
                    $("#video-progress-bar-middle").width(Math.round(((admin_ProgressWidth + 4 - 80) * (event.jPlayer.status.currentTime / event.jPlayer.status.duration))) + "px");

                    $("#video-progress-bar-time-done").html("&nbsp;" + $.jPlayer.convertTime(event.jPlayer.status.currentTime) + "&nbsp;");
                    $("#video-progress-bar-time-left").html("&nbsp;-" + $.jPlayer.convertTime(event.jPlayer.status.duration - event.jPlayer.status.currentTime) + "&nbsp;");

                    //if viewtime is more than MinTime from XML unlock next chapter
                    if (selectedPageID < ModulePageArray.length - 1) {
                        if (CurrentPosition > ModulePageArray[selectedPageID].xMinTime) {
                            UnlockNextPage(false);
                        }
                    }
                }
            });
    }
}

//------------------------------------------------------------------------------------------------------------------
function InitVideo(VideoFile, WebmFile, PosterFile, ForcePlay) {
    HideVideoProgress();
    var offsetPoster = $('#template-place').position();
    $("#ajax-poster").css({"top": offsetPoster.top + "px"}); //140+55 = 195
    $("#ajax-poster").css({"left": offsetPoster.left + "px"}); //140+55 = 195
    $("#ajax-poster").css({"height": TemplateVideoHeight[CurrentTemplateID] + "px"});
    $("#ajax-poster").css({"width": TemplateVideoWidth[CurrentTemplateID] + "px"});
    $("#ajax-poster").attr("src", PosterFile);
    $("#ajax-poster").css({"z-index": 4});

    $("#jplayer_video").css({"top": offsetPoster.top + "px"}); //140+55 = 195
    $("#jplayer_video").css({"left": offsetPoster.left + "px"}); //140+55 = 195
    $("#jplayer_video").css({"z-index": 3});

    if (CourseMode == "Video") {

        $("#jplayer_video").jPlayer("clearMedia");
        $("#jplayer_video").jPlayer("option", "size", {
            height: TemplateVideoHeight[CurrentTemplateID] + "px",
            width: TemplateVideoWidth[CurrentTemplateID] + "px"
        });


        if (isiPadFirstTimeLoad) {
            $("#ajax-loading-graph").show();
            $("#ajax-poster").show();

            //load dummy audio file so they will play later first time only on tablets with media problems, only jplayer_1 as background audio wont work on tablets
            $("#jplayer_audio").jPlayer("setMedia", {mp3: InitAudio});
        }

//	$("#ajax-poster").show();

        $("#jplayer_video").jPlayer("setMedia", {m4v: VideoFile, webmv: WebmFile}); //,poster:PosterFile
        $("#jplayer_video").show();

        if (!admin_DisableVolume) {
            if (VolumeMute) {
                $("#jplayer_video").jPlayer("mute", true);
            }
            else {
                $("#jplayer_video").jPlayer("mute", false);
            }
        }

        $("#video-progress-bar-middle").width("1px");
        VideoLength = 0;

        if (TemplateArrayHasVideo[CurrentTemplateID]) {
            if (((admin_AutoForwardDefaultSetting) || (ForcePlay) || (FirstTimeLoad)) && (!isiPadFirstTimeLoad)) {
                if (FirstTimeLoad) {
                    FirstTimeLoad = false;

                    //for IE some bug makes first video not play at all but releoad works so we will reload the page after 1 second only for MSIE version 8
                    //21.09.2013 -- added same code for MSIE 8 since it is forced to flash and same bug happens then
                    if ((($.browser.msie && parseInt($.browser.version, 10) === 8) || ($.browser.msie && parseInt($.browser.version, 10) === 10) || ($.browser.msie && parseInt($.browser.version, 10) === 9)) || ((isThisSafari()) && (!isiPad)) || ((isThisFirefox()) && (isThisMac()))) {
                        setTimeout(function () {
                            LoadPage(selectedPageID, 0, 0, true);
                        }, 1000);
                    }
                }

                PlayVideo(true);

                //alert(VideoFile+" "+WebmFile );

            }
            else {
                PauseVideo(true, false);
            }
        }


        $("#video-progress-bar").css('top', (parseInt(TemplateVideoHeight[CurrentTemplateID], 10) + 62) + "px");
        $("#video-progress-bar").width(Math.round((admin_ProgressWidth + 5)) + "px");
        $("#ajax-loading-graph").css({"top": ((parseInt(TemplateVideoHeight[CurrentTemplateID], 10) / 2) + 55) + "px"}); //140+55 = 195
        $("#ajax-loading-graph").css({"left": ((parseInt(TemplateVideoWidth[CurrentTemplateID], 10) / 2)) + "px"}); //390px before

        $("#video-progress-bar").unbind('mouseover');
        $("#video-progress-bar").unbind('mouseout');
        $("#video-progress-bar").unbind('click');

        $("#video-progress-bar").bind('mouseover', function () {
            MouseOnProgressBar = true;
            clearTimeout(VideoProgressTimer);
        });
        $("#video-progress-bar").bind('mouseout', function () {
            MouseOnProgressBar = false;
            clearTimeout(VideoProgressShowTimer);
            VideoProgressTimer = setTimeout('HideVideoProgress()', 800);
        });

        $("#video-progress-bar").bind('click', function (e) {
            if (admin_VideoProgressCanMove) {
                var offsetX = $(this).offset();
                var offsetY = $("#video-progress-bar-middle").position();
                var PositionX = (e.clientX - offsetX.left - offsetY.left);
                if (PositionX < 0) {
                    PositionX = 0;
                }
                if (PositionX > (admin_ProgressWidth + 4 - 80)) {
                    PositionX = (admin_ProgressWidth + 4 - 80);
                }

                var targetSecond = Math.round(PositionX / (admin_ProgressWidth + 4 - 80) * VideoLength);
                if (targetSecond >= VideoLength) {
                    targetSecond = VideoLength - 3;
                }
                $("#jplayer_video").jPlayer("play", targetSecond);

                isPlay = 1;
                $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
                $("#play-button").attr('alt', admin_Pause);
                $("#play-button").attr('title', admin_Pause);

                $("#ajax-loading-graph").show();
                CurrentTextFrame = 0;
                ShowOnVideoTimeIsZero = true;
                VideoWithSingleFrame = true;

            }
        });
    }
    else {
        $("#ajax-poster").show();
    }
}


//------------------------------------------------------------------------------------------------------------------
function InitCourseTimer() {
    if (ModulePageArray.length > 0) {
        ModulePageArray[0].xViewable = 1;
        $("#C0").removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
        ModulePageArray[1].xViewable = 1;
        $("#C1").removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
        ChangeMode(CurrentMode);

    }
    else {
        setTimeout('InitCourseTimer()', 250);
    }
}


//------------------------------------------------------------------------------------------------------------------
function LoadFinalXML(FinalFileName) {
    $.ajax({
        type: "GET",
        url: FinalFileName + '?q=489&time=' + Math.round(+new Date() / 1000),
        dataType: "text",
        success: function (result) {
            if (EncryptTests) {
                FinalXML = $.parseXML(GibberishAES.dec(result, "IEngine"));

                var SearchScriptFinalXMLRule = [
                    {
                        tag: ['SubFinalPass', 'SubFinalFail', 'SubFinalResetFail', 'FinalPass', 'FinalFullFail', 'Intro', 'Question']
                    }
                ];
                FinalXML = IEngineScriptHandler(FinalXML, {
                    File: 'exam.xml',
                    TagSearchRule: SearchScriptFinalXMLRule,
                    RemoveScript: true,
                    RunIEngScript: true,
                    Recursive: true,
                    PrintConsole: true,
                    ScriptNumberLimit: 3
                });

                if (isMobile) {
                    FinalXML = AdjustPositionForMobile(FinalXML, mobileFinalXMLAdjustRule)
                }
            }
            else {
                FinalXML = $.parseXML(result);

                var SearchScriptFinalXMLRule = [
                    {
                        tag: ['SubFinalPass', 'SubFinalFail', 'SubFinalResetFail', 'FinalPass', 'FinalFullFail', 'Intro', 'Question']
                    }
                ];
                FinalXML = IEngineScriptHandler(FinalXML, {
                    File: 'exam.xml',
                    TagSearchRule: SearchScriptFinalXMLRule,
                    RemoveScript: true,
                    RunIEngScript: true,
                    Recursive: true,
                    PrintConsole: true,
                    ScriptNumberLimit: 3
                });

                if (isMobile) {
                    FinalXML = AdjustPositionForMobile(FinalXML, mobileFinalXMLAdjustRule)
                }
            }
        }
    });
}


//------------------------------------------------------------------------------------------------------------------
function LoadPreExamXML(PreExamFileName) {
    $.ajax({
        type: "GET",
        url: PreExamFileName + '?q=489&time=' + Math.round(+new Date() / 1000),
        dataType: "text",
        success: function (result) {
            if (EncryptTests) {
                PreExamXML = $.parseXML(GibberishAES.dec(result, "IEngine"));

                var SearchScriptPreExamXMLRule = [
                    {
                        tag: ['PreEndDialog', 'AdaptiveTrainingDialog', 'Intro', 'AdaptiveIntro', 'Question']
                    }
                ];
                PreExamXML = IEngineScriptHandler(PreExamXML, {
                    File: 'preexam.xml',
                    TagSearchRule: SearchScriptPreExamXMLRule,
                    RemoveScript: true,
                    RunIEngScript: true,
                    Recursive: true,
                    PrintConsole: true,
                    ScriptNumberLimit: 3
                });

                if (isMobile) {
                    PreExamXML = AdjustPositionForMobile(PreExamXML, mobilePreExamXMLAdjustRule)
                }
            }
            else {
                PreExamXML = $.parseXML(result);

                var SearchScriptPreExamXMLRule = [
                    {
                        tag: ['PreEndDialog', 'AdaptiveTrainingDialog', 'Intro', 'AdaptiveIntro', 'Question']
                    }
                ];
                PreExamXML = IEngineScriptHandler(PreExamXML, {
                    File: 'preexam.xml',
                    TagSearchRule: SearchScriptPreExamXMLRule,
                    RemoveScript: true,
                    RunIEngScript: true,
                    Recursive: true,
                    PrintConsole: true,
                    ScriptNumberLimit: 3
                });

                if (isMobile) {
                    PreExamXML = AdjustPositionForMobile(PreExamXML, mobilePreExamXMLAdjustRule)
                }
            }
        }
    });
}

//------------------------------------------------------------------------------------------------------------------
function LoadSurveyXML(SurveyFileName) {

    $.ajax({
        type: "GET",
        url: SurveyFileName + '?q=489&time=' + Math.round(+new Date() / 1000),
        dataType: "xml",
        success: function (result) {
            SurveyXML = result;
        }
    });

}

function LoadTOC(xml) {

    $("#page-select-text").html('');

    json_file_list.forEach(function (file, number) {
        $("#page-select-text").append('<a href="#" onclick="return false" style="display:block; margin-left:' + LineIndent + 'px !important;" id="C' + (ModulePageArray.length - 1) + '" class="page-disabled-text-line-style">' + file + '</a>');

    })
    ModulePageArray.length = 0;
    $("#page-select-text").css({'overflow-x': 'hidden'});

    MaxVirtualPages = 0;

    $(xml).find("Modules").each(function () {
        $(xml).find("Module").each(function () {
            if (PreExamSkipModules.indexOf("," + $(this).attr("ID") + ",") == -1 && BranchingSkipModulesPages.indexOf("," + $(this).attr("ID") + ",") == -1) {

                var xName = 'M' + $(this).attr("Name");
                var xID = $(this).attr("ID");

                xMinTime = -99;
                xViewable = 0;
                if (admin_ReviewMode) xViewable = 1;

                ModulePageArray.push({
                    xName: xName,
                    xID: xID,
                    xMinTime: xMinTime,
                    xViewable: xViewable
                });

                var LineIndent = $(this).attr("Indent");
                if (typeof LineIndent == "undefined") {
                    LineIndent = 6;
                }
                else {
                    LineIndent = parseInt(LineIndent, 10);
                }


                // $("#page-select-text").append('<a href="#" onclick="return false" style="display:block; margin-left:' + LineIndent + 'px !important;" id="C' + (ModulePageArray.length - 1) + '" class="page-disabled-text-line-style">' + ModulePageArray[ModulePageArray.length - 1].xName.slice(1) + '</a>');

                var tempWidth = $("#C" + (ModulePageArray.length - 1)).outerWidth();
                var origStyleContent = $("#C" + (ModulePageArray.length - 1)).attr('style');
                $("#C" + (ModulePageArray.length - 1)).attr('style', origStyleContent + '; width:' + (tempWidth - LineIndent) + 'px !important');


                $(this).find("Page").each(function () {
                    if (($(this).attr("Type") == "iPadOnly") && (!isiPad)) {
                        //ignore ipad only pages
                    }
                    else if (($(this).attr("Type") == "PreExam") && (!PreExamEnabled)) {
                        //ignore preexam
                    }
                    else if (($(this).attr("Type") == "FinalExam") && (!FinalExamEnabled)) {
                        //ignore final
                    }
                    else if (($(this).attr("Type") == "Survey") && (!SurveyEnabled)) {
                        //ignore survey
                    }
                    else {
                        if (BranchingSkipModulesPages.indexOf("," + $(this).attr("ID") + ",") == -1) {

                            MaxVirtualPages++;

                            var xName = 'L' + $(this).attr("Name");
                            var xID = $(this).attr("ID");

                            var xMinTime = $(this).attr("MinTime");
                            if (xMinTime == "") xMinTime = 0;
                            if (xMinTime == null) xMinTime = 0;

                            var xType = $(this).attr("Type");
                            var xViewable = 0;

                            if (admin_ReviewMode) xViewable = 1;

                            ModulePageArray.push({
                                xName: xName,
                                xID: xID,
                                xMinTime: xMinTime,
                                xViewable: xViewable,
                                xType: xType
                            });

                            var LineIndent = $(this).attr("Indent");
                            if (typeof LineIndent == "undefined") {
                                LineIndent = 30;
                            }
                            else {
                                LineIndent = parseInt(LineIndent, 10);
                            }


                            // if (($(this).attr("Type") == "iPadOnly") && (isiPad)) {
                            //     $("#page-select-text").append('<a href="#"  onclick="return false" style="display:none; margin-left:' + LineIndent + 'px;" id="C' + (ModulePageArray.length - 1) + '" class="page-disabled-text-line-style">' + ModulePageArray[ModulePageArray.length - 1].xName.slice(1) + '</a>');
                            //
                            //     var tempWidth = $("#C" + (ModulePageArray.length - 1)).width();
                            //     $("#C" + (ModulePageArray.length - 1)).css({"width": (tempWidth - LineIndent) + "px"});
                            // }
                            // else {
                            //     $("#page-select-text").append('<a href="#"  onclick="return false" style="display:block; margin-left:' + LineIndent + 'px !important;" id="C' + (ModulePageArray.length - 1) + '" class="page-disabled-text-line-style">' + ModulePageArray[ModulePageArray.length - 1].xName.slice(1) + '</a>');
                            //
                            //     var tempWidth = $("#C" + (ModulePageArray.length - 1)).outerWidth();
                            //     var origStyleContent = $("#C" + (ModulePageArray.length - 1)).attr('style');
                            //     $("#C" + (ModulePageArray.length - 1)).attr('style', origStyleContent + '; width:' + (tempWidth - LineIndent) + 'px !important');
                            // }
                        }
                    }
                });
            }
        });
    });

    if (admin_ReviewMode) {
        for (i = 0; i < ModulePageArray.length; i++) {
            ModulePageArray[i].Viewable = 1;
            $("#C" + (i)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
        }

    }

    $(".page-select-text-line-style").bind('click', function (event) {
        PageClick(event);
    });
    $(".page-disabled-text-line-style").bind('click', function (event) {
        PageClick(event);
    });

}

//------------------------------------------------------------------------------------------------------------------
function parseCourseXml(xml) {

    //find every Tutorial and print the author

    $(xml).find("Template").each(function () {
        TemplateArray[$(this).attr("Name")] = $(this).text();
        TemplateArrayHasVideo[$(this).attr("Name")] = ($(this).attr("HasVideo") == "true");

        TemplateVideoWidth[$(this).attr("Name")] = $(this).attr("VideoWidth");
        TemplateVideoHeight[$(this).attr("Name")] = $(this).attr("VideoHeight");
    });


    $(xml).find("ModeValues").each(function () {
        $(this).find("Mode").each(function () {
            var StartMuteStr = "F";
            var StartMute = $(this).attr("StartMute");
            if (typeof StartMute == "undefined") {
                StartMuteStr = "F";
            }
            else {
                StartMuteStr = "T";
            }

            if ($(this).attr("Value") == getParameterByName("mode")) {
                CurrentMode = "Q" + StartMuteStr + $(this).attr("Value");
            }

            $("#mode-box").append('<a href="#"  onclick="return false;" style="display:block" id="Q' + StartMuteStr + $(this).attr("Value") + '" class="mode-settings-style">' + $(this).attr("Name") + '</a>');
        });
    });


    $(".mode-settings-style").bind('click', function (event) {
        if (CourseMode == "Video") {
            ChangeMode(event.target.id);
        }
    });

    CourseName = $(xml).find("course").attr("Name");

    if (admin_ReviewMode) {
        $("#course-header").html(CourseName + " (" + admin_Review + ")");
        document.title = CourseName + " (" + admin_Review + ")";
    }
    else {
        $("#course-header").html(CourseName);
        document.title = CourseName;
    }

    //unlock all pages
    if (admin_ReviewMode) {
        for (var i = 0; i < ModulePageArray.length; i++) {
            ModulePageArray[i].xViewable = 1;
            $("#C" + (i)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
        }
    }
    LoadTOC(CourseXML);

    PreloadImageAnimationInCache();
    // ****** START COURSE HERE *********
    setTimeout(function () {
        InitVideoPlayer();
        resizeControls();
        if (admin_UseScorm12) {
            StartCourse("course");
            LoadTOC(CourseXML);
        }
        else if (admin_UseScorm2004) {
            StartCourse_2004("course");
            LoadTOC(CourseXML);
        }
        else {
            LoadTOC(CourseXML);
        }
        InitCourseTimer();
    }, 1000);
    setTimeout('resizeControls()', 2000);
    setTimeout('resizeControls()', 3000);
}

//------------------------------------------------------------------------------------------------------------------
function LoadCourseXML() {
    $.ajax({
        type: "GET",
        url: admin_CourseFile + '?q=489&time=' + Math.round(+new Date() / 1000),
        dataType: "xml",
        success: function (result) {

            CourseXML = result;

            var SearchScriptCourseXMLRule = [
                {
                    tag: ['GamificationLoosing', 'GamificationWinning', 'GamificationLost', 'GamificationWon', 'BookmarkDialog', 'Templates', 'Page']
                }
            ];

            CourseXML = IEngineScriptHandler(CourseXML, {
                File: 'course.xml',
                TagSearchRule: SearchScriptCourseXMLRule,
                RemoveScript: true,
                RunIEngScript: true,
                Recursive: true,
                PrintConsole: true,
                ScriptNumberLimit: 3
            });

            if (isMobile) {
                CourseXML = AdjustPositionForMobile(CourseXML, mobileCourseXMLAdjustRule)
            }

            parseCourseXml(CourseXML);
        }
    });
}


//------------------------------------------------------------------------------------------------------------------
function parseGlossaryXml(xml) {
    j = 0;
    $(xml).find("Term").each(function () {
        j++;
        $("#glossary-select-text").append('<a href="#"  onclick="return false" style="display:block" id="Glossary_' + j + '" class="glossary-select-text-line-style">' + $(this).attr("Name") + '</a>');
        GlossaryTerms[j] = "<b>" + $(this).attr("Name") + "</b><p>" + $(this).text();
        if (j == 1) {
            $("#Glossary_1").addClass("glossary-select-text-line-style-active");
            $("#glossary-description").html(GlossaryTerms[j]);
        }
    });

    $(".glossary-select-text-line-style").bind('click', function (event) {
        GlossaryItemClick(event);
    });

}


//------------------------------------------------------------------------------------------------------------------
function LoadGlossary() {
    $.ajax({
        type: "GET",
        url: admin_GlossaryFile + '?q=489&time=' + Math.round(+new Date() / 1000),
        dataType: "xml",
        success: function (result) {
            GlossaryXML = result;
            parseGlossaryXml(GlossaryXML);
        }
    });
}


//------------------------------------------------------------------------------------------------------------------
function initVolumeBox() {
    if (admin_DisableVolume) {
        $("#volume-button").removeClass("volume-button-style").addClass("volume-button-disabled-style");
    }
    else {
        $(document).one('mouseup', function () {
            VolumeSliderMouseDown = false;
        });
        $("#volume-button").bind('click', toggleVolumeMute);
        $("#volume-popup-mute").bind('click', toggleVolumeMute);
        $("#volume-button").bind('mouseover', ShowVolume);
        $("#volume-button").bind('mouseout', function () {
            VolumeTimer = setTimeout('HideVolume()', 500);
        });

        $("#volume-slider").bind('mousedown', function () {
            VolumeSliderMouseDown = true;
            ChangeVolume(VolumerelativePosition.top);
            if (TemplateArrayHasVideo[CurrentTemplateID]) {
                $("#jplayer_video").jPlayer("volume", VolumeValue / 100);
            }
            $("#jplayer_audio").jPlayer("volume", VolumeValue / 100);
            $("#jplayer_background").jPlayer("volume", VolumeValue / 100);
            $("#jplayer_effectSound").jPlayer("volume", VolumeValue / 100);
        });

        $("#volume-slider").bind('mouseup', function () {
            VolumeSliderMouseDown = false;
        });
        $("#volume-slider").mousemove(function (e) {
            UpdateMouseVolume(e)
        });

        $("#volume-box").bind('mouseover', ShowVolume);
        $("#volume-box").bind('mouseup', function () {
            VolumeSliderMouseDown = false;
        });
        $("#volume-box").bind('mouseout', function () {
            VolumeTimer = setTimeout('HideVolume()', 500);
        });

        $("#volume-popup-mute").removeClass("volume-popup-mute-style").addClass("volume-popup-speaker-style");
    }
}


//------------------------------------------------------------------------------------------------------------------
function ExitClick() {

    if (admin_UseScorm12) {
        CloseCourse(false);
    }
    if (admin_UseScorm2004) {
        CloseCourse_2004(false);
    }
}

//------------------------------------------------------------------------------------------------------------------
function ScormTime() {
    if ((admin_UseScorm) && (ScormInitialized) && (!startingTime)) {
        //read scorm total time once
        startingTime = true;
        if (admin_UseScorm12) {
            ScormTotalTime = LMSGetValue("cmi.core.total_time");
        }
        else {
            //ScormTotalTime = SCORM2004_CallGetValue("cmi.total_time");
            ScormTotalTime = "00:00:00";
        }
        if (ScormTotalTime == "") {
            ScormTotalTime = "00:00:00";
        }
        if (ScormTotalTime == null) {
            ScormTotalTime = "00:00:00";
        }

        var splitTime = ScormTotalTime.split(":");
        ScormTotalHours = parseInt(splitTime[0], 10);
        ScormTotalMinutes = parseInt(splitTime[1], 10);
        ScormTotalSeconds = parseInt(splitTime[2], 10);
    }

    if ((!startingTime) && (!admin_UseScorm)) {
        startingTime = true;
        ScormTotalHours = 0;
        ScormTotalMinutes = 0;
        ScormTotalSeconds = 0;
    }

    if ((admin_ShowTimer) && (startingTime)) {
        $("#scorm-timer-container").show();

        var endtime2 = new Date();
        var totaltime2 = Math.floor((endtime2 - CourseStartTime) / 1000);

        var totalhours2 = Math.floor(totaltime2 / 3600);

        var totalminutes2 = (Math.floor((totaltime2 % 3600) / 60) + ScormTotalMinutes);
        if (totalminutes2 >= 60) {
            totalhours2++;
            totalminutes2 = totalminutes2 - 60;
        }

        var totalseconds2 = (Math.floor(totaltime2 % 60) + ScormTotalSeconds);
        if (totalseconds2 >= 60) {
            totalminutes2++;
            totalseconds2 = totalseconds2 - 60;
        }

        CourseTotalSeconds = ((totalhours2 + ScormTotalHours) * 3600) + (totalminutes2 * 60) + (totalseconds2);

        $("#scorm-timer").html(admin_TimerText + LZ((totalhours2 + ScormTotalHours)) + ":" + LZ(totalminutes2) + ":" + LZ(totalseconds2));

    }
    setTimeout('ScormTime()', 1000);
}


function PlayBlink(time, interval) {
    if (CourseMode == "Video") {
        PlayButtonBlinkTimer = window.setInterval(function () {
            $("#play-button").css("opacity", "0.1");
            window.setTimeout(function () {
                $("#play-button").css("opacity", "1");
            }, 500);
        }, interval);

        var playtimerblink = window.setTimeout(function () {
            clearInterval(PlayButtonBlinkTimer);
        }, time);
    }
}

function FwdBlink(time, interval) {
    if (admin_ForwardBlink) {
        clearInterval(FwdButtonBlinkTimer);
        clearTimeout(fwdtimerblink);
        FwdButtonBlinkTimer = window.setInterval(function () {
            $("#forward-button").removeClass("forward-button-style").addClass("forward-button-blink-style");
            window.setTimeout(function () {
                $("#forward-button").removeClass("forward-button-blink-style").addClass("forward-button-style");
            }, 500);
        }, interval);

        fwdtimerblink = window.setTimeout(function () {
            clearInterval(FwdButtonBlinkTimer);
            window.setTimeout(function () {
                $("#forward-button").removeClass("forward-button-style").addClass("forward-button-blink-style");
            }, 500);
        }, time);
    }
}

function PreloadImageAnimationInCache() {
    var Source = '';
    $('body').append('<div id="images_preloaded" style="display: none"></div>');
    $(CourseXML).find('Sequence').each(function () {
        if ($(this).attr('Operation') === 'imageanimation') {
            if ($(this).attr('Src') !== undefined && $(this).attr('Src') !== '') {
                Source = $(this).attr('Src');
                LoadImages();
            }
        }
    })

    $(CourseXML).find('ImageAnimation').each(function () {
        if ($(this).attr('Src') !== undefined && $(this).attr('Src') !== '') {
            Source = $(this).attr('Src');
            LoadImages();
        }
    })

    function LoadImages() {

        var pretext = Source.substr(0, Source.indexOf('['));
        var tailtext = Source.substr(Source.indexOf('.'));
        var range = Source.substr(Source.indexOf('[') + 1, Source.indexOf(']') - Source.indexOf('[') - 1);
        var startText = range.split('-')[0];
        var startInt = parseInt(range.split('-')[0]);
        var addZero = startText.length - startInt.toString().length > 0 && true;
        var end = parseInt(range.split('-')[1]);

        for (var i = startInt; i <= end; i++) {
            var preZero = '';
            if (addZero) {
                for (var n = 1; n <= end.toString().length - i.toString().length; n++) {
                    preZero += '0';
                }
            }
            $('#images_preloaded').append('<img src="' + pretext + preZero + i + tailtext + '" />');
        }

    }

}

//------------------------------------------------------------------------------------------------------------------
$(document).ready(function () {

    /*
	 var debugtime = 0;
	 $(document.body).append('<div style="position:absolute; top:10px; right:10px; background-color: white; border: 1px solid #ccc; width: 380px; height: 800px; overflow: auto; border-radius:3px; opacity: 0.5;" id="debugdiv"></div>');

	 setInterval(function () {
	 debugtime++;
	 $("#debugdiv").html("Debug: "+debugtime+"<br><pre>"+syntaxHighlight(UserHistory)+"<pre>");
	 },1000);
	 */

    $("#cc-button").removeClass("cc-button-style").addClass("nocc-button-style");
    $("#cc-button").attr('alt', admin_NoCCText);
    $("#cc-button").attr('title', admin_NoCCText);


    $("#scorm-timer-container").hide();

    var aDate = new Date();
    xcode = $.timerY(aDate.getFullYear() + "." + aDate.getUTCMonth() + "." + aDate.getDate(), 'IEngine');
    XCode = xcode.substring(0, 3) + xcode.substr(xcode.length - 1, 1);

    xcode2 = $.timerY(aDate.getFullYear() + "." + aDate.getUTCMonth() + "." + (aDate.getDate() - 1), 'IEngine');
    XCode2 = xcode2.substring(0, 3) + xcode2.substr(xcode2.length - 1, 1);

    xcode3 = $.timerY(aDate.getFullYear() + "." + aDate.getUTCMonth() + "." + (aDate.getDate() + 1), 'IEngine');
    XCode3 = xcode3.substring(0, 3) + xcode3.substr(xcode3.length - 1, 1);

    LoadVersionXML();


    //blink play button for first load
    if (isiPadFirstTimeLoad) {
        PlayBlink(60000, 1000);
    }

    if (CourseMode == "Video") {
        //initilaze with flash as default on MSIE 9
        if (($.browser.msie && parseInt($.browser.version, 10) === 9)) // || ( (isThisFirefox()) && (isThisMac()) ) -- removed as firefox for mac now supports mp4
        {
            $("#jplayer_audio").jPlayer({
                swfPath: "jplayer",
                solution: "flash,html",
                supplied: "mp3",
                preload: "auto",
                errorAlerts: false
            });

            $("#jplayer_background").jPlayer({
                swfPath: "jplayer",
                solution: "flash,html",
                supplied: "mp3",
                preload: "auto",
                errorAlerts: false
            });

            $("#jplayer_effectSound").jPlayer({
                swfPath: "jplayer",
                solution: "flash,html",
                supplied: "mp3",
                preload: "auto",
                errorAlerts: false
            });
        }
        else {
            $("#jplayer_audio").jPlayer({
                swfPath: "jplayer",
                solution: "html,flash",
                supplied: "mp3",
                preload: "auto",
                errorAlerts: false
            });

            $("#jplayer_background").jPlayer({
                swfPath: "jplayer",
                solution: "html,flash",
                supplied: "mp3",
                preload: "auto",
                errorAlerts: false
            });

            $("#jplayer_effectSound").jPlayer({
                swfPath: "jplayer",
                solution: "html,flash",
                supplied: "mp3",
                preload: "auto",
                errorAlerts: false
            });
        }
    }


    $("body").css("overflow", "hidden");

    $("#tooltip").hide();
    $("#page-select").hide();
    $("#page-select-text").css('margin-bottom', '1px');

//		ChangeVolume( VolumeMouseMin+Math.round( (VolumeMouseMax-VolumeMouseMin) * ( (100-VolumeValue) / 100) ) );

    $(document).bind('click', function (e) {
        //close chapter menu
        if (($(e.target).closest('#page-select').length == 0) && ($(e.target).closest('#page-combo').length == 0)) {
            if (isPageComboOpen == true) {
                isPageComboOpen = false;
                $("#page-combo").addClass("page-combo-style").removeClass("page-combo-style-active");
                $("#page-select").hide('slide', {direction: 'up'}, 350);
                $("#page-select-text").css('margin-bottom', '1px');
            }
        }

        //close mode menu
        if (($(e.target).closest('#mode-box').length == 0) && ($(e.target).closest('#mode-button').length == 0) && ($(e.target).closest('.mode-settings-style').length == 0)) {
            if (isModeVisible == true) {
                toggleModeBox();
            }
        }

        if (($(e.target).closest('#glossary-select').length == 0) && ($(e.target).closest('#glossary-button').length == 0) && ($(e.target).closest('.glossary-select-text-line-style ').length == 0)) {
            if (isGlossaryOpen == true) {
                isGlossaryOpen = false;
                $("#glossary-button").addClass("glossary-button-style").removeClass("glossary-button-style-active");
                $("#glossary-select").hide('slide', {direction: 'up'}, 350);
                $("#glossary-select-middle").css('margin', '1px');
            }
        }

        if (($(e.target).closest('#help-window').length == 0) && ($(e.target).closest('#help-button').length == 0)) {
            if (isHelpOpen == true) {
                isHelpOpen = false;
                $("#help-button").addClass("help-button-style").removeClass("help-button-style-active");
                $("#help-window").hide('slide', {direction: 'up'}, 350);
                $("#wrap").css('margin', '1px');
            }
        }

    });


    //check if volume should be disabled
    //initVolumeBox()
    if (CourseMode == "Video") {
        initVolumeBox();
    }


    $("#progress-bar").bind('mouseover', function () {
        clearTimeout(ProgressTimer);
        ProgressShowTimer = setTimeout('ShowProgress()', 200);
    });
    $("#progress-bar").bind('mouseout', function () {
        clearTimeout(ProgressShowTimer);
        ProgressTimer = setTimeout('HideProgress()', 800);
    });

    $("#mode-button").bind('click', toggleModeBox);

    $(document).mousedown(function () {
        isDown = true;
    });
    $(document).mouseup(function () {
        isDown = false;
    });

    $("#cc-button").bind('click', function () {
        CCEnabled = !CCEnabled;

        if (!CCEnabled) {
            $("#cc-button").removeClass("cc-button-style").addClass("nocc-button-style");
            $("#cc-button").attr('alt', admin_NoCCText);
            $("#cc-button").attr('title', admin_NoCCText);
        }
        else {
            $("#cc-button").removeClass("nocc-button-style").addClass("cc-button-style");
            $("#cc-button").attr('alt', admin_CCText);
            $("#cc-button").attr('title', admin_CCText);
        }


        if (CCEnabled) {
            if (CurrentPageMode == "flash") {
                var SubTitleToShowID = "";
                FlashStageSequencer.find("Sequence").each(function () {
                    if ($(this).attr("Operation") == "subtitle") {
                        $("#" + $(this).attr("ID")).hide();
                        var xTime = $(this).attr("T");
                        xTime = parseInt(xTime, 10);
                        if (xTime <= FlashTime) {
                            SubTitleToShowID = $(this).attr("ID");
                        }
                    }
                });
                if (SubTitleToShowID !== "") $("#" + SubTitleToShowID).show();

            }
            else if (CurrentPageMode == "video") //video mode
            {
                CurrentTextFrame = 0;
                ShowOnVideoTimeIsZero = true;
                VideoWithSingleFrame = true;

                UpdateTextArea(1);
                for (xCounter = 0; xCounter < PageTextArray.length; xCounter++) {
                    //load text into target
                    if (xCounter <= CurrentTextFrame) {
                        if (PageTextArray[xCounter].xInsert == "insert") {
                            $("#" + PageTextArray[xCounter].xTarget).append($(PageTextArray[xCounter].xTarget)).show();
                            attachClickAction();
                        }
                        else if (PageTextArray[xCounter].xInsert == "overwrite") {
                            $("#" + PageTextArray[xCounter].xTarget).hide();
                            $("#" + PageTextArray[xCounter].xTarget).html(PageTextArray[xCounter].xText).show();
                            attachClickAction();
                        }
                        else if (PageTextArray[xCounter].xInsert == "hide") {
                            $("#" + PageTextArray[xCounter].xTarget).hide();
                        }
                        else if (PageTextArray[xCounter].xInsert == "show") {
                            $("#" + PageTextArray[xCounter].xTarget).html(PageTextArray[xCounter].xText).show();
                            attachClickAction();
                        }
                        else if (PageTextArray[xCounter].xInsert == "fadeout") {
                            $("#" + PageTextArray[xCounter].xTarget).hide();
                        }
                    }
                }
            }
        }
        else {
            if (CurrentPageMode == "flash") {
                FlashStageSequencer.find("Sequence").each(function () {
                    if ($(this).attr("Operation") == "subtitle") {
                        $("#" + $(this).attr("ID")).hide();
                    }
                });
            }
            else if (CurrentPageMode == "video") //video mode
            {
                for (xCounter = 0; xCounter < PageTextArray.length; xCounter++) {
                    if (PageTextArray[xCounter].xInsert == "insert") {
                        $("#" + PageTextArray[xCounter].xTarget).html("").hide();
                    }
                    else if (PageTextArray[xCounter].xInsert == "overwrite") {
                        $("#" + PageTextArray[xCounter].xTarget).html("").hide();
                    }
                    else if (PageTextArray[xCounter].xInsert == "hide") {
                        $("#" + PageTextArray[xCounter].xTarget).html("").hide();
                    }
                    else if (PageTextArray[xCounter].xInsert == "show") {
                        $("#" + PageTextArray[xCounter].xTarget).html("").hide();
                    }
                    else if (PageTextArray[xCounter].xInsert == "fadeout") {
                        $("#" + PageTextArray[xCounter].xTarget).html("").hide();
                    }
                }
            }
        }
    });

    $("#forward-button").bind('click', function () {
        ForwardClick();
    });
    $("#backward-button").bind('click', function () {
        BackwardsClick();
    });

    $("#exit-button").bind('click', function () {
        ExitClick();
    });

    $("#replay-button").bind('click', function () {
        ReplayClick();
    });

    $("#page-combo").bind('click', function () {
        ChapterComboClick();
    });

    $("#glossary-button").bind('click', function () {
        $("#glossary-select-middle").css('margin', '2px');
        GlossaryClick();
    });


    $("#help-button").bind('click', function () {
        $("#wrap").css('margin', '2px');
        HelpClick();
    });


    $("#play-button").bind('click', function () {

        if ($("#play-button").hasClass("play-button-disabled-style")) {
            return false;
        }

        if (isPlay == 0) {
            isPlay = 1;
            if (isiPadFirstTimeLoad) {
                isiPadFirstTimeLoad = false;
                $("#play-button").css("opacity", "1");
                window.clearInterval(PlayButtonBlinkTimer);

                //play only jplayer_1 as background audio will not work on tablet as it wont play two streams simultanously
                PlayAudioOne(true);
            }

            if (CurrentPageMode !== "video") {
                PlayAudioOne(true);
                PlayBackground(false);

                if (CurrentPageMode == "flash") {
                    if ($("#jplayer_video").is(":visible")) {
                        PlayVideo(true);
                    }

                    if ((FlashXMLCodePause) || //if flash paused using xml operation pause then ignore the button
                        (FlashFinished)) { /* do nothing */
                    }
                    else //if flash is finished then ignore the button
                    {
                        if (tid == null) {
                            tid = setInterval(FlashFrame, 100);
                        }
                    }
                }
            }
            else {
                PlayVideo(true);
            }
        }
        else {
            isPlay = 0;
            if (CurrentPageMode !== "video") {
                PauseAudioOne(true, false);
                PauseBackgroundAudio(false, false);
                PauseEffectSound(false, false);

                if (CurrentPageMode == "flash") {

                    if ($("#jplayer_video").is(":visible")) {
                        PauseVideo(true, false);
                    }

                    if ((FlashXMLCodePause) || //if flash paused using xml operation pause then ignore the button
                        (FlashFinished)) { /* do nothing */
                    }
                    else //if flash is finished then ignore the button
                    {
                        BreakSequenceLoop = true;
                        FlashAbortTimer();
                    }
                }

            }
            else {
                PauseVideo(true, false);
            }
        }
    });


    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            if (isPageComboOpen == true) {
                isPageComboOpen = false;
                $("#page-combo").addClass("page-combo-style").removeClass("page-combo-style-active");
                $("#page-select").hide('slide', {direction: 'up'}, 350);
                $("#page-select-text").css('margin-bottom', '1px');
            }

            if (isModeVisible == true) {
                toggleModeBox();
            }

            if (isGlossaryOpen == true) {
                isGlossaryOpen = false;
                $("#glossary-button").addClass("glossary-button-style").removeClass("glossary-button-style-active");
                $("#glossary-select").hide('slide', {direction: 'up'}, 350);
                $("#glossary-select-middle").css('margin', '1px');
            }

            if (isHelpOpen == true) {
                isHelpOpen = false;
                $("#help-button").addClass("help-button-style").removeClass("help-button-style-active");
                $("#help-window").hide('slide', {direction: 'up'}, 350);
                $("#wrap").css('margin', '1px');

            }
        }
    });

    $("#jplayer_video").bind('contextmenu', function () {
        return false;
    });
    $("#template-place").bind('contextmenu', function () {
        return false;
    });


    if (CourseMode == "Video") {
        /*
		 * MSIE Fix for hover over video to display progressbar
		 */
        $("#jplayer_video").bind('mouseover', function (e) {

            //TemplateVideoHeight[CurrentTemplateID]
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;

            if ((TemplateArrayHasVideo[CurrentTemplateID]) && (parseInt(TemplateVideoHeight[CurrentTemplateID]) > 0)) {
                MouseOnVideo = true;
                clearTimeout(VideoProgressTimer);
                VideoProgressShowTimer = setTimeout('ShowVideoProgress()', 200);
            }
        });

        $("#jplayer_video").bind('mouseout', function () {
            if ((TemplateArrayHasVideo[CurrentTemplateID]) && (parseInt(TemplateVideoHeight[CurrentTemplateID]) > 0)) {
                MouseOnVideo = false;
                clearTimeout(VideoProgressShowTimer);
                VideoProgressTimer = setTimeout('HideVideoProgress()', 800);
            }
        });

        /*
		 * Show video progress bar on hover over template-space, does not work on MSIE so above code is required
		 */
        $("#template-place").bind('mouseover', function (e) {

            //TemplateVideoHeight[CurrentTemplateID]
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;

            if ((TemplateArrayHasVideo[CurrentTemplateID]) && (parseInt(TemplateVideoHeight[CurrentTemplateID]) > 0)) {
                MouseOnVideo = true;
                clearTimeout(VideoProgressTimer);
                VideoProgressShowTimer = setTimeout('ShowVideoProgress()', 200);
            }
        });

        $("#template-place").bind('mouseout', function () {
            if ((TemplateArrayHasVideo[CurrentTemplateID]) && (parseInt(TemplateVideoHeight[CurrentTemplateID]) > 0)) {
                MouseOnVideo = false;
                clearTimeout(VideoProgressShowTimer);
                VideoProgressTimer = setTimeout('HideVideoProgress()', 800);
            }
        });
    }


    /*
	 * grab space and make it behave like a click for text mode
	 */
    $("body").off("keypress").on("keypress", function (e) {
        if (e.which == 32) {
            $(this).trigger("click");
            //e.preventDefault();
        }

    });

    if (CourseMode == "Video") {
        $("#jplayer_background").bind($.jPlayer.event.ended,
            function (event) {
// -- in older version background audio repeat in Flash mode was decided to be stopped then later it was decided to make it repeat again
//			if (CurrentPageMode == "flash") { } else
                {
                    $("#jplayer_background").jPlayer("play", 0); //loop background audio
                }
            });

        $("#jplayer_audio").bind($.jPlayer.event.paused, function (event) {

//		if (!$('#jplayer_video').data().jPlayer.status.paused)
//		{
//			//if video is playing then dont change isPlay
//		} else
            {
                isPlay = 0;
                $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
                $("#play-button").attr('alt', admin_Play);
                $("#play-button").attr('title', admin_Play);
            }
        });

        $("#jplayer_audio").bind($.jPlayer.event.ended,
            function (event) {

                if ($('#jplayer_video').data().jPlayer.status.paused) //set pause if video paused is true (will happen if video is not playing)
                {
                    isPlay = 0;
                }
                $(this).jPlayer("pause");

                if (CurrentPageMode !== "video") {
                    $(this).jPlayer("clearMedia");
                }

                if (CurrentPageMode === 'bumpyQuiz') {

                    if (CurrentPlayAudio === 'QuestionAudio' && CurrentPlayAudio !== '') {
                        ShowBumpyQuizOptions(TheBumpyQuizOptions);
                    }
                    else if (CurrentPlayAudio === 'IntroBoxAudio' && CurrentPlayAudio !== '') {
                        if (AutoContinueAfterIntroBox === 'true') {
                            $("#FadeOutBackgroundDiv").fadeOut(250);
                            $("#FreeFormDialogDiv").animate({
                                height: '0px',
                            }, {
                                duration: 1000, complete: function () {
                                    $("#FreeFormDialogDiv").attr('style', 'display:none;');
                                }
                            })
                            if (IntroAudio !== undefined && IntroAudio !== '') {
                                CurrentPlayAudio = 'QuestionAudio';
                                LoadAndPlayAudioOne(IntroAudio, true);
                            }
                            else {
                                ShowBumpyQuizOptions(TheBumpyQuizOptions);
                            }
                        }
                    }
                }


                if (CurrentPageMode == "flash") {
                    if (FlashModeAudioEndGoTo != "") {
                        SeqGoToAndPlay(FlashModeAudioEndGoTo);
                        FlashModeAudioEndGoTo = "";
                    }

                    if (FlashModeAudioEndBlink) {
                        $("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
                        UnlockNextPage(false);

                        if ((FlashModeAudioEndNext) && ((admin_AutoForwardDefaultSetting) || (admin_ReviewMode))) {
                            //dont blink as it will go to next in the next if
                        }
                        else {
                            if (selectedPageID < ModulePageArray.length - 1) {
                                FwdBlink(4000, 1000);
                            }
                        }
                        FlashAbortTimer();
                        FlashTime = -1;
                    }

                    if (FlashModeAudioEndNext) {
                        FlashAbortTimer();
                        FlashTime = -1;

                        if ((admin_AutoForwardDefaultSetting) || (admin_ReviewMode)) {
                            FlashMoveNext(true);
                        }
                        else {
                            FlashMoveNext(false);
                        }
                    }
                    return false;
                }

                if ($('#jplayer_video').data().jPlayer.status.paused) //set pause if video paused is true (will happen if video is not playing)
                {
                    $("#play-button").addClass("play-button-style").removeClass("pause-button-style");
                    $("#play-button").attr('alt', admin_Play);
                    $("#play-button").attr('title', admin_Play);
                }

                if (CurrentPageMode == "slide") {
                    if ((admin_AutoForwardDefaultSetting == true) && (selectedPageID < ModulePageArray.length - 1)) {
                        ForwardClick();
                    }
                    else {
                        if (selectedPageID < ModulePageArray.length - 1) {
                            FwdBlink(4000, 1000);
                        }
                    }
                }

            });
    }


//	select is disabled from CSS FILE
    document.onselectstart = function () {
        return false;
    } // ie

    document.onmousedown = function (e) {
        e = e || window.event;
        var elementId = e.target ? e.target.id : e.srcElement.id;
        var element = e.target ? e.target : e.srcElement;

        //#### 22 Aug 2017 --- interference with drag and drop so added check if draggable is true

//    jQuery("input[type=text]").focusin(function () {
//    console.log( element.nodeName);

        if ((elementId != "SurveyMemo" && $(element).attr("draggable") != "true" && $(element).parent().attr("draggable") != "true") && element.nodeName != "INPUT") {
            return false;
        }
    } // mozilla

    setTimeout('ScormTime()', 1000);
});

//------------------------------------------------------------------------------------------------------------------
$(window).resize(function () {
    setTimeout('resizeControls()', 150);
});
