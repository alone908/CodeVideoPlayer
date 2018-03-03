/*
 * IEngine5
 * IEngine5 Video Engine
 *
 * Copyright (c) Inspired eLearning Inc. 2003-2017.  All Rights Reserved.
 * This source file is proprietary property of Inspired eLearning Inc.
 * http://http://www.inspiredelearning.com/inspired/License
 *
 * @version 5.0
 */

var FlashXML;
var tid = null;
var FlashTime = -1;
var FlashStageElements;
var FlashStageSequencer;
var FlashStageSequencerRule = "";
var xLiveRules = [];
var xPlayTime = [];
var FoundFrame = false;
var xTime = "";
var FlashFinished = false;

var EnterGoToPosition = 0;

var GameVar1 = 0;
var GameVar2 = 0;
var GameVar3 = 0;

var FlashXMLCodePause = false;

var MaxiPadImages = 10;
var iPadImageCounter = 0;
var iPadImageDelay = 1000;
var iPadImageFilePattern = "";
var iPadImageInterval = null;
var iPadImageClearLast = true;

var iPadSwapImage = false;

var SequencerVideoEndGoTo = 0;
var SequencerVideoEndBlank = true;

var BreakSequenceLoop = false;

var BrowserIsInternetExplorer = (navigator.userAgent.match(/(msie|trident|edge)/i) !== null);

var xOperation = "";
var xCourseMode = "";

//------------------------------------------------------------------------------------------------------------------
function FlashAbortTimer() { // to be called when you want to stop the timer
  clearInterval(tid);
  tid = null;
}


//------------------------------------------------------------------------------------------------------------------
// Call from within course.xml to change frame position
function SeqGoToAndPlay(FrameNo) {

  xPlayTime2 = parseInt(FrameNo, 10) - 1;

  BreakSequenceLoop = true;
  FlashXMLCodePause = false;
  FlashTime = xPlayTime2;
  if (tid == null) {
    tid = setInterval(FlashFrame, FlashFrameInterval);
  }
}


//------------------------------------------------------------------------------------------------------------------
function loadCssFile(pathToFile) {

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
function CloseIntroDialogFlash() {
  NewDialogClose();
  PauseAudioOne(true, true);
  StartFlashSimulation();
}


//------------------------------------------------------------------------------------------------------------------
function FlashMoveNext(OpenNextPage) {

  $("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
  if (selectedPageID >= ModulePageArray.length - 1) {
    $("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
  }

  FlashFinished = true;

  if (selectedPageID < ModulePageArray.length - 1) {
    UnlockNextPage(false);

    if (OpenNextPage) {
      NewDialogClose();

      PauseAudioOne(true, true);

      BranchingGoToPageID(function (res) {
        if (!res) {
          if ((admin_AutoForwardDefaultSetting == true) && (selectedPageID < ModulePageArray.length - 1)) {
            selectedPageID++;
            LoadPage(selectedPageID, 0, 0, 1);
          }
          else {
            if (selectedPageID < ModulePageArray.length - 1) {
              FwdBlink(4000, 1000);
            }
          }
        }
      });
    }
    else {
      if (selectedPageID < ModulePageArray.length - 1) {
        FwdBlink(4000, 1000);
      }
    }
  }
}

//------------------------------------------------------------------------------------------------------------------
function FlashMoveToPageID(GoToPageID) {
  $("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
  if (selectedPageID >= ModulePageArray.length - 1) {
    $("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
  }

  FlashFinished = true;


  var FoundPagePos = -1;

  for (var i = 0; i < ModulePageArray.length; i++) {
    if ((typeof ModulePageArrayID[i].xID !== "undefined")) {
      if (ModulePageArrayID[i].xID == GoToPageID) {
        FoundPagePos = i;
      }
    }
  }
  if (FoundPagePos != -1) {
//		console.log("found page ID:"+FoundPagePos+" Current page:"+selectedPageID);

    //unlock pages between current and target location
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

    NewDialogClose();

    PauseAudioOne(true, true);

    LoadPage(selectedPageID, 0, 0, 1);
  }
}


//------------------------------------------------------------------------------------------------------------------
function SetupFlash(FlashXML_Source) {
  //reset flash timer
  FlashAbortTimer();
  FlashTime = -1;
  GameVar1 = 0;
  GameVar2 = 0;
  GameVar3 = 0;
  FlashXMLCodePause = false;
  FlashFinished = false;

  FlashModeAudioEndBlink = false;
  FlashModeAudioEndNext = false;

  FlashXML = FlashXML_Source;

  DisableNextButton = true;
  if (admin_ReviewMode) {
    DisableNextButton = false;
  }
  if ($("#C" + (selectedPageID + 1)).hasClass("page-select-text-line-style")) {
    DisableNextButton = false;
  }

  if (DisableNextButton) {
    $("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
  }

  $("#ajax-loading-graph").hide();
  $("#template-place").html(TemplateArray[CurrentTemplateID]);

  FlashStageElements = $(FlashXML).find("Stage");
  FlashStageSequencer = $(FlashXML).find("Sequencer");

  //if RuleToPass is defined the format will be changed from 1,2,3 to ,1,,2,,3, and as each rule is done it will be removed as ,1, ,2, ,3,
  FlashStageSequencerRule = FlashStageSequencer.attr("RuleToPass");
  if ((FlashStageSequencerRule === "") || (typeof FlashStageSequencerRule == "undefined")) {
    FlashStageSequencerRule = "";
  }
  else {
    FlashStageSequencerRule = FlashStageSequencerRule.replace(/,/g, ",,");
    FlashStageSequencerRule = "," + FlashStageSequencerRule + ",";
  }


  var ExCssFile = $(FlashXML).attr("CSSFile");
  var ExJsFile = $(FlashXML).attr("JSFile");

  if ((ExCssFile === "") || (typeof ExCssFile == "undefined")) {
  }
  else {
    loadCssFile(ExCssFile);
  }
  if ((ExJsFile === "") || (typeof ExJsFile == "undefined")) {
  }
  else {
    $.getScript(ExJsFile, function () { /*initExJS();*/
    });
  }


  FlashStageElements.find("Element").each(function () {
    xText = $(this).text();
    xTarget = $(this).attr("Target");
    xClass = $(this).attr("Class");
    xID = $(this).attr("ID");

    //----------replace policy placeholders
    for (var jj = 0; jj < admin_PolicyBranding_array.length; jj++) {
      var SearchFor = '##branding_' + admin_PolicyBranding_array[jj].CategoryName.replace(new RegExp(' ', 'g'), '_') + '##';
      xText = xText.replace(new RegExp(SearchFor, 'g'), admin_PolicyBranding_array[jj].FileURL);

      SearchFor = '##name_' + admin_PolicyBranding_array[jj].CategoryName.replace(new RegExp(' ', 'g'), '_') + '##';
      xText = xText.replace(new RegExp(SearchFor, 'g'), admin_PolicyBranding_array[jj].Name);
    }

    var SearchFor = '\#\#branding_[^#]*\#\#';
    xText = xText.replace(new RegExp(SearchFor, 'g'), admin_PolicyBrandingBackup_url);
    SearchFor = '\#\#name_[^#]*\#\#';
    xText = xText.replace(new RegExp(SearchFor, 'g'), 'Policy');


    var new_item = $("<div ID='" + xID + "' style='position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;  '>" + xText + "</div>").hide();
    $("#" + xTarget).append(new_item);
  });

  ContinueButton = $(FlashXML).attr("ContinueButton");
  StartButton = $(FlashXML).attr("StartButton");

  BackgroundAudio = $(FlashXML).attr("BackgroundAudioFile");
  LoadAndPlayAudioBackground(BackgroundAudio, false);

  //if has intro dialog then show it, otherwise play the audio
  if ($(FlashXML).find("IntroTitle").length > 0) {
    IntroBoxTitle = $(FlashXML).find("IntroTitle").text();
    IntroBox = $(FlashXML).find("IntroText");
    IntroBoxText = IntroBox.text();
    IntroBoxAudio = IntroBox.attr("AudioFile");

    LoadAndPlayAudioOne(IntroBoxAudio, false);

    NewDialog(IntroBox.attr("Top"), IntroBox.attr("Left"), IntroBox.attr("Width"), IntroBox.attr("Height"), IntroBox.attr("BgAudio"), IntroBoxTitle, IntroBoxText + FlashIntroButton, false);
  }
  else {
    StartFlashSimulation();
  }

  jQuery("input[type=text]").keypress(function (e) {
    if (e.which == 13) {
      if (EnterGoToPosition != 0) {
        BreakSequenceLoop = true;
        FlashTime = EnterGoToPosition;
        //FlashFrame();
        if (tid == null) {
          tid = setInterval(FlashFrame, FlashFrameInterval);
        }
      }
    }
  });

}


//------------------------------------------------------------------------------------------------------------------
function padnum(str, max) {
  str = str.toString();
  return str.length < max ? padnum("0" + str, max) : str;
}

//------------------------------------------------------------------------------------------------------------------
function InitMiniVideo(vTop, vLeft, vWidth, vHeight, VideoFile, WebmFile, PosterFile, ZIndex) {
  vTop = parseInt(vTop, 10);
  vLeft = parseInt(vLeft, 10);
  vWidth = parseInt(vWidth, 10);
  vHeight = parseInt(vHeight, 10);

  if (PosterFile == "") {
    PosterFile = "js/transparent.gif";
  }

  HideVideoProgress();
  var offsetPoster = $('#template-place').position();
  $("#ajax-poster").css({"top": (offsetPoster.top + vTop) + "px"}); //140+55 = 195
  $("#ajax-poster").css({"left": (offsetPoster.left + vLeft) + "px"}); //140+55 = 195
  $("#ajax-poster").css({"height": vHeight + "px"});
  $("#ajax-poster").css({"width": vWidth + "px"});
  $("#ajax-poster").attr("src", PosterFile);
  $("#ajax-poster").css({"z-index": ZIndex});
  $("#ajax-poster").show();


  if (CourseMode == "Video") {
    $("#ajax-poster").css({"z-index": 1});

    $("#jplayer_video").css({"top": (offsetPoster.top + vTop) + "px"}); //140+55 = 195
    $("#jplayer_video").css({"left": (offsetPoster.left + vLeft) + "px"}); //140+55 = 195
    $("#jplayer_video").css({"z-index": ZIndex});

    $("#jplayer_video").jPlayer("clearMedia");
    $("#jplayer_video").jPlayer("option", "size", {height: vHeight + "px", width: vWidth + "px", loop: true});

    if ((VideoFile != "") && (WebmFile != "")) {
      $("#jplayer_video").jPlayer("setMedia", {m4v: VideoFile, webmv: WebmFile});
    }
    if ((VideoFile != "") && (WebmFile == "")) {
      $("#jplayer_video").jPlayer("setMedia", {m4v: VideoFile});
    }
    if ((VideoFile == "") && (WebmFile != "")) {
      $("#jplayer_video").jPlayer("setMedia", {webmv: WebmFile});
    }

    $("#jplayer_video").show();

    if (!admin_DisableVolume) {
      if (VolumeMute) {
        $("#jplayer_video").jPlayer("mute", true);
      }
      else {
        $("#jplayer_video").jPlayer("mute", false);
      }
    }

    $("#ajax-loading-graph").css({"top": parseInt((offsetPoster.top + vTop) + (vHeight / 2) - 16) + "px"});
    $("#ajax-loading-graph").css({"left": parseInt((offsetPoster.left + vLeft) + (vWidth / 2) - 16) + "px"});

    PlayVideo(false);
  }
  else {
    $("#ajax-poster").css({"z-index": ZIndex});
    $("#ajax-poster").show();
  }
}


var SeqDragDropZone = false;

//------------------------------------------------------------------------------------------------------------------
// set interval
function FlashFrame() {
  FlashTime++;
//	console.log(FlashTime);

  if (CourseMode == "Video") {
    isPlay = 1;
    $("#play-button").removeClass("play-button-style").addClass("pause-button-style");
    $("#play-button").attr('alt', admin_Pause);
    $("#play-button").attr('title', admin_Pause);
  }

  var FoundFrame = false;
  BreakSequenceLoop = false;
  xTime = "";

  var TextModeTimer = 0;

  FlashStageSequencer.find("Sequence").each(function () {
      if (!BreakSequenceLoop) {
        xTime = $(this).attr("T");
        xTime = parseInt(xTime, 10);
        xID = $(this).attr("ID");

        TextModeTimer++;

        if (xTime == FlashTime) {
          $(".textlink").off('click');

          FoundFrame = true;
          xClass = $(this).attr("Class");
          xOperation = $(this).attr("Operation");

          if ((xOperation === "") || (typeof xOperation == "undefined")) {
            xOperation = "";
          }

          xOperation = xOperation.toLowerCase();

          xCourseMode = $(this).attr("Mode");

          if ((xCourseMode === "") || (typeof xCourseMode == "undefined")) {
            xCourseMode = "video,fast";
          }
          xCourseMode = xCourseMode.toLowerCase();

          xOptions = $(this).attr("Options");
          if ((xOptions === "") || (typeof xOptions == "undefined")) {
            xOptions = {};
          }
          else {
            xOptions = eval("(" + xOptions + ")");
          }
          xDelay = parseInt($(this).attr("Delay"), 10);

          xEffect = $(this).attr("Effect");
          xClass = $(this).attr("Class");
          xFile = $(this).attr("File");

          if (xOperation == "script1") {
            console.log($(this).text());
            eval($(this).text());
          }

          if (xOperation == "drag") {
            $('#' + xID).attr('draggable', 'true');
            $('#' + xID).attr("data-dropid", xID);
            $('#' + xID).attr("data-invaliddrop", $(this).attr("InvalidDrop"));
            $('#' + xID).attr("data-start", $(this).attr("Start"));

            $('#' + xID).bind('dragstart', function (ev) {
              console.log("dragstart " + $(this).attr("data-start"));
              SeqDragDropZone = false;
              SequencerIsDragging = true;
              //	$(this).css({"transform": "scale(0.7)"});

              SeqGoToAndPlay($(this).attr("data-start"));
              ev.originalEvent.dataTransfer.setData("text", $(this).attr("id"));
            });

            $('#' + xID).bind('dragend', function (ev) {
              //	$(this).css({"transform": "scale(1)"});
              SequencerIsDragging = false;
              ev.preventDefault();
              console.log("drag end");
              if (!SeqDragDropZone) {
                SeqGoToAndPlay($("#" + $(this).attr('id')).attr("data-invaliddrop"));
              }
            });


          }
          else if (xOperation == "drop") {
            $('#' + xID).attr("data-validdrop", $(this).attr("ValidDrop"));
            $('#' + xID).attr("data-invaliddrop", $(this).attr("InvalidDrop"));

            $('#' + xID).bind('dragover', function (ev) {
              console.log("on drag over");
              ev.preventDefault();
            });

            $('#' + xID).bind('drop', function (ev) {
              console.log("on drop");
              SeqDragDropZone = true;
              ev.preventDefault();
              var SourceID = ev.originalEvent.dataTransfer.getData("text");
              console.log(SourceID);

              var GoodSplit1 = $(this).attr("data-validdrop");
              var GoodSplit2 = GoodSplit1.split(",");

              for (var i = 0; i < GoodSplit2.length; i++) {
                var GoodSplit3 = GoodSplit2[i];
                var GoodSplit4 = GoodSplit3.split(":");
                if (SourceID == GoodSplit4[0]) {
                  SeqGoToAndPlay(GoodSplit4[1]);
                }
              }

              var BadSplit1 = $(this).attr("data-invaliddrop");
              var BadSplit2 = BadSplit1.split(",");

              for (var i = 0; i < BadSplit2.length; i++) {
                var BadSplit3 = BadSplit2[i];
                var BadSplit4 = BadSplit3.split(":");
                if (SourceID == BadSplit4[0]) {
                  SeqGoToAndPlay(BadSplit4[1]);
                  return false;
                }
              }
            });
          }

          else if (xOperation == "focus") {
            $("#" + xID).focus();
          }

          else if (xOperation == "tabs") {
            $("#" + xID).tabs();
          }

          else if (xOperation == "ienginetabs") {
            if ($(this).attr("stylePrefix") != "" && $(this).attr("tabSpeed") != "" && $(this).attr("width") != "" && $(this).attr("panelHeight") != "") {
              $("#" + xID).IEngineTabs($(this).attr("stylePrefix"), $(this).attr("tabSpeed"), $(this).attr("width"), $(this).attr("panelHeight"));
            }
          }

          else if (xOperation == "addclass") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#" + xID).addClass(xClass);
            }
          }

          else if (xOperation == "removeclass") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#" + xID).removeClass(xClass);
            }
          }

          else if (xOperation == "playvideo") {

//slide show on iPAD instead of video
            var iPadSeq = $(this).attr("iPadSeq");
            if ((isiPad)) { // || (iPadSeq !== "" && CourseMode !== "Video")) {
              var str = iPadSeq.substring(iPadSeq.indexOf("[") + 1);
              var str2 = str.substr(0, str.indexOf(']'));

              iPadImageFilePattern = iPadSeq;
              iPadImageFilePattern = iPadImageFilePattern.replace('[' + str2 + ']', '***');

              var str3 = str2.split(",");

              MaxiPadImages = parseInt(str3[0], 10);
              iPadImageCounter = 1;
              iPadImageDelay = parseInt(str3[1], 10);
//							iPadImageDelay = 1000;
              iPadImageClearLast = str3[2].toLowerCase() === 'true';
              //console.log(iPadImageFilePattern+' '+MaxiPadImages+' '+iPadImageCounter+' '+iPadImageDelay);

              iPadImageInterval = setInterval(function () {
                iPadImageCounter++;

                if (iPadImageCounter > MaxiPadImages) {
                  if (iPadImageClearLast) {
                    $("#ipadvideoimagediv").remove();
                  }
                  clearInterval(iPadImageInterval);
                  if (SequencerVideoEndGoTo != 0) {
                    SeqGoToAndPlay(SequencerVideoEndGoTo); //jump to timefreme
                  }
                }
                else {
                  iPadSwapImage = !iPadSwapImage;

                  if (iPadSwapImage) {
                    $("#ipadvideoimage2").hide();
                    $("#ipadvideoimage2").attr({"src": iPadImageFilePattern.replace('***', padnum(iPadImageCounter, 2))});

                    $("#ipadvideoimagediv1").css({"z-index": "190"});
                    $("#ipadvideoimagediv2").css({"z-index": "200"});

                    $("#ipadvideoimage2").hide().fadeIn(iPadImageDelay);

                  }
                  else {
                    $("#ipadvideoimage1").hide();
                    $("#ipadvideoimage1").attr({"src": iPadImageFilePattern.replace('***', padnum(iPadImageCounter, 2))});

                    $("#ipadvideoimagediv2").css({"z-index": "190"});
                    $("#ipadvideoimagediv1").css({"z-index": "200"});

                    $("#ipadvideoimage1").hide().fadeIn(iPadImageDelay);
                  }
                }
              }, iPadImageDelay);

              var vTop = parseInt($(this).attr("Top"), 10);
              var vLeft = parseInt($(this).attr("Left"), 10);
              var vWidth = parseInt($(this).attr("Width"), 10);
              var vHeight = parseInt($(this).attr("Height"), 10);

              $('#template-place').append("<div style='position:absolute; overflow:hidden' id='ipadvideoimagediv1'><img src='' id='ipadvideoimage1' /></div><div style='position:absolute; overflow:hidden' id='ipadvideoimagediv2'><img src='' id='ipadvideoimage2' /></div>");

              SequencerVideoEndGoTo = $(this).attr("GoToAndPlayAtEnd");
              if (typeof SequencerVideoEndGoTo == "undefined") {
                SequencerVideoEndGoTo = 0;
              }


              $("#ipadvideoimagediv1").css({"z-index": "200"});
              $("#ipadvideoimagediv1").css({"top": (vTop) + "px"});
              $("#ipadvideoimagediv1").css({"left": (vLeft) + "px"});
              $("#ipadvideoimagediv1").css({"height": vHeight + "px"});
              $("#ipadvideoimagediv1").css({"width": vWidth + "px"});

              $("#ipadvideoimagediv2").css({"z-index": "190"});
              $("#ipadvideoimagediv2").css({"top": (vTop) + "px"});
              $("#ipadvideoimagediv2").css({"left": (vLeft) + "px"});
              $("#ipadvideoimagediv2").css({"height": vHeight + "px"});
              $("#ipadvideoimagediv2").css({"width": vWidth + "px"});

              $("#ipadvideoimage1").attr("src", iPadImageFilePattern.replace('***', padnum(iPadImageCounter, 2)));
              $("#ipadvideoimage2").attr("src", iPadImageFilePattern.replace('***', padnum(iPadImageCounter, 2)));


              $("#ipadvideoimagediv").css({"z-index": 5});
              $("#ipadvideoimagediv").show();
            }
            else {
              $("#video-progress-bar").hide();
              $("#jplayer_video").show();
              $("#jplayer_video").jPlayer("clearMedia");
              var VideoImageFile = $(this).attr("VideoImage");

              SequencerVideoEndGoTo = $(this).attr("GoToAndPlayAtEnd");
              if (typeof SequencerVideoEndGoTo == "undefined") {
                SequencerVideoEndGoTo = 0;
              }

              SequencerVideoEndBlank = $(this).attr("BlankAtEnd");
              if (typeof SequencerVideoEndBlank == "undefined") {
                SequencerVideoEndBlank = false;
              }
              else {
                SequencerVideoEndBlank = SequencerVideoEndBlank.toLowerCase() === 'true';
              }

              tempStrX = $(this).attr("File");
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
                if (VideoImageFile !== "") {
                  VideoImageFile = cleanURL(document.URL) + VideoImageFile + "";
                }
                else {
                  VideoImageFile = "";
                }
              }
              var videoZindex = $(this).attr("zIndex");
              if (typeof videoZindex == "undefined") {
                videoZindex = 0;
              }

              InitMiniVideo($(this).attr("Top"), $(this).attr("Left"), $(this).attr("Width"), $(this).attr("Height"), m4vFile, WebmFile, VideoImageFile, videoZindex);
            }
          }

          else if (xOperation == "stopvideo") {
            if (CourseMode == "Video") {
              if (isiPad) {
                $("#ajax-poster").hide();
              }
              else {
                PauseVideo(false, true);
                $("#jplayer_video").hide();
                $("#jplayer_video").jPlayer("clearMedia");
              }
            }
            else {
              $("#ajax-poster").hide();
            }
          }

          else if (xOperation == "playsound") {
            if (CourseMode == "Video") {

              FlashModeAudioEndGoTo = $(this).attr("AudioEndGoTo");
              if (typeof FlashModeAudioEndGoTo == "undefined") {
                FlashModeAudioEndGoTo = "";
              }

              FlashModeAudioEndBlink = false;
              FlashModeAudioEndNext = false;

              if (xFile == "") {
                PauseAudioOne(false, true);
              }
              else {
                LoadAndPlayAudioOne(xFile, false);

                if ($(this).attr("AudioEndBlink") == "true") {
                  FlashModeAudioEndBlink = true;
                }
                if ($(this).attr("AudioEndNext") == "true") {
                  FlashModeAudioEndNext = true;
                }
              }
            }
          }

          else if (xOperation == "stopsound") {
            PauseAudioOne(false, true);
          }

          else if (xOperation == "playbackgroundsound") {
            LoadAndPlayAudioBackground(xFile, false);
          }

          else if (xOperation == "stopbackgroundsound") {
            PauseBackgroundAudio(false, true);
          }

          else if (xOperation == "gamifictioncomputer") {
            //Gamification
            if ((SearchInArray(GamificationScoreArray, selectedPageID) == -1) || (GamificationScoreArray.length == 0)) {
              GamificationComputerScore += parseInt($(this).attr("Point"), 10);
              GamificationScoreArray.push(selectedPageID);

              GamificationSuspendData = GamificationComputerScore + "," + GamificationUserScore + ",";
              for (var i = 0; i < GamificationScoreArray.length; i++) {
                GamificationSuspendData += GamificationScoreArray[i] + ",";
              }

              if ($(this).attr("UpdateTextBlock") != "") {
                $("#" + $(this).attr("UpdateTextBlock")).html(GamificationStringReplace($("#" + $(this).attr("UpdateTextBlock")).html()));
              }
            }
          }

          else if (xOperation == "gamifictionuser") {
            //Gamification
            if ((SearchInArray(GamificationScoreArray, selectedPageID) == -1) || (GamificationScoreArray.length == 0)) {
              GamificationUserScore += parseInt($(this).attr("Point"), 10);
              GamificationScoreArray.push(selectedPageID);

              GamificationSuspendData = GamificationComputerScore + "," + GamificationUserScore + ",";
              for (var i = 0; i < GamificationScoreArray.length; i++) {
                GamificationSuspendData += GamificationScoreArray[i] + ",";
              }

              if ($(this).attr("UpdateTextBlock") != "") {
                $("#" + $(this).attr("UpdateTextBlock")).html(GamificationStringReplace($("#" + $(this).attr("UpdateTextBlock")).html()));
              }
            }
          }

          else if (xOperation == "animate") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#" + xID).animate(xOptions, xDelay);
            }
          }

          else if (xOperation == "showeffect") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#" + xID).show(xEffect, xOptions, xDelay);
            }
          }

          else if (xOperation == "hideeffect") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#" + xID).hide(xEffect, xOptions, xDelay);
            }
          }

          else if (xOperation == "attr") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#" + xID).attr($(this).attr("attr"), $(this).attr("value"));
            }

            $("#" + xID).find(".reload_gif").show().each(function () {
              if (BrowserIsInternetExplorer) {
                $(this).prop('src', $(this).attr("src") + "?" + Math.random());
//              console.log("replay: " + $(this).attr('src'));
              }
              else {
                $(this).prop('src', $(this).attr("src"));
//              console.log("replay: " + $(this).attr("src"));
              }
            });
          }

          else if (xOperation == "fadein") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#" + xID).fadeIn(xDelay);
            }

            $("#" + xID).find(".reload_gif").show().each(function () {
              if (BrowserIsInternetExplorer) {
                $(this).prop('src', $(this).attr("src") + "?" + Math.random());
                console.log("replay: " + $(this).attr('src'));
              }
              else {
                $(this).prop('src', $(this).attr("src"));
                console.log("replay: " + $(this).attr("src"));
              }
            });
          }

          else if (xOperation == "fadeout") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#" + xID).fadeOut(xDelay);
            }
          }

          else if (xOperation == "videomode_fadeout") {
            if (CourseMode == "Video") {
              $("#" + xID).fadeOut(xDelay);
            }
          }

          else if (xOperation == "fadeto") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#" + xID).fadeTo(xDelay, $(this).attr("Opacity"));
            }
          }

          else if (xOperation == "show") {

            if (BrowserIsInternetExplorer) {
              $("#" + xID).find(".reload_gif").each(function () {
                $(this).prop('src', $(this).attr("src") + "?" + Math.random());
              });

              setTimeout(function (xID) {
                console.log("11351 " + xID);
                if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
                  $("#" + xID).show();
                }
                $("#" + xID).find(".reload_gif").show();
              }, 300, xID);
            }
            else {

              if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
                $("#" + xID).show();
              }

              $("#" + xID).find(".reload_gif").show().each(function () {
                $(this).prop('src', $(this).attr("src"));
              });
            }
          }

          else if (xOperation == "hide") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#" + xID).hide();
            }
          }

          else if (xOperation == "subtitle" && CourseMode == "Video" && CCEnabled) {
            FlashStageSequencer.find("Sequence").each(function () {
              if ($(this).attr("Operation") == "subtitle") {
                $("#" + $(this).attr("ID")).hide();
              }
            });
            $("#" + xID).show();
          }

          else if (xOperation == "subtitle_fast" && CourseMode == "Fast") {
            $("#" + xID).show();
          }
          else

          //pause ignored in textmode -- 2017.08.29 doesnt apply any longer
          if (xOperation == "pause") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              BreakSequenceLoop = true;
              FlashXMLCodePause = true;
              FlashAbortTimer();
            }
          }

          else if ((xOperation == "videopause") && (CourseMode == "Video")) {
            BreakSequenceLoop = true;
            FlashXMLCodePause = true;
            FlashAbortTimer();
          }

          else if ((xOperation == "fastmodepause") && (CourseMode == "Fast")) {
            BreakSequenceLoop = true;
            FlashXMLCodePause = true;
            FlashAbortTimer();
          }

          else if ((xOperation == "textmodewait") && (CourseMode == "Fast")) {
            BreakSequenceLoop = true;
            FlashXMLCodePause = true;
            FlashAbortTimer();

            setTimeout(function () {
              if (tid == null) {
                tid = setInterval(FlashFrame, FlashFrameInterval);
              }
            }, $(this).attr("Delay"))
          }

          else if ((xOperation == "wait")) {
            BreakSequenceLoop = true;
            FlashXMLCodePause = true;
            FlashAbortTimer();

            setTimeout(function () {
              if (tid == null) {
                tid = setInterval(FlashFrame, FlashFrameInterval);
              }
            }, $(this).attr("Delay"))
          }

          //special pause that is only for textmode -- no longer used
          else if ((xOperation == "textmodepause")) {
            //obsolute no longer accepted
          }

          else if (xOperation == "play") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {

              xPlayTime2 = $(this).attr("GoTo");
              xPlayTime2 = parseInt(xPlayTime2, 10) - 1;

              BreakSequenceLoop = true;
              FlashXMLCodePause = false;
              FlashTime = xPlayTime2;
              if (tid == null) {
                tid = setInterval(FlashFrame, FlashFrameInterval);
              }
            }
          }

          else if (xOperation == "enterkey") {
            EnterGoToPosition = $(this).attr("GoTo");
            EnterGoToPosition = parseInt(EnterGoToPosition, 10) - 1;
          }

          else if (xOperation == "branching") {
            if (typeof ModulePageArray[selectedPageID].xID === "undefined") {
            }
            else {
              var uh_found = false;
              for (var uhi = 0; uhi < UserHistory.length; uhi++) {
                if (UserHistory[uhi].id == ModulePageArray[selectedPageID].xID) {
                  uh_found = true;
                }
              }
              if (!uh_found) {
                UserHistory.push({
                  t: 's', //type s=sequencer
                  id: typeof ModulePageArray[selectedPageID].xID === "undefined" ? "" : ModulePageArray[selectedPageID].xID,
                  ca: $(this).attr("Value") == "true"
                });
              }

              BranchingGoToPageID(function (res) { });

            }
          }

          else if (xOperation == "savevar") {
            var uh_found = false;
            var uh_id = $(this).attr("ID");
            for (var uhi = 0; uhi < UserHistory.length; uhi++) {
              if (UserHistory[uhi].id == uh_id) {
                uh_found = true;
                UserHistory[uhi].ca = $(this).attr("Value");
              }
            }

            if (!uh_found) {
              UserHistory.push({
                t: 'x', //type s=sequencer variable
                id: uh_id,
                ca: $(this).attr("Value")
              });
            }

          }

          else if (xOperation == "removeclick") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#" + xID).off('click');
            }
          }

          else if (xOperation == "addclick") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              xPlayTime[xID] = $(this).attr("GoTo");
              xPlayTime[xID] = parseInt(xPlayTime[xID], 10) - 1;

              xLiveRules[xID] = $(this).attr("AddRule");
              if ((xLiveRules[xID] === "") || (typeof xLiveRules[xID] == "undefined")) {
                xLiveRules[xID] = "";
              }

              //remove any event in case a loop is initiated that would make multiple assignments to same object
              $("#" + xID).off('click');

              $("#" + xID).click(function () {
                FlashTime = xPlayTime[$(this).attr("id")];

                //remove the clicked rule frome the liverules string
                if (xLiveRules[$(this).attr("id")] != "") {
                  FlashStageSequencerRule = FlashStageSequencerRule.replace("," + xLiveRules[$(this).attr("id")] + ",", "");
                }

                if (tid == null) {
                  tid = setInterval(FlashFrame, FlashFrameInterval);
                }
              });
            }
          }

          else if (xOperation == "removehover") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#" + xID).off('mouseenter mouseleave');
            }
          }
          else if (xOperation == "addhover") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {

              xPlayTime[xID + "_in"] = $(this).attr("GoTo");
              xPlayTime[xID + "_in"] = parseInt(xPlayTime[xID + "_in"], 10) - 1;

              xPlayTime[xID + "_out"] = $(this).attr("GoToOut");
              xPlayTime[xID + "_out"] = parseInt(xPlayTime[xID + "_out"], 10) - 1;

              //remove any event in case a loop is initiated that would make multiple assignments to same object
              $("#" + xID).off('mouseenter mouseleave');

              $("#" + xID).hover(function () {
                FlashTime = xPlayTime[$(this).attr("id") + "_in"];

                if (tid == null) {
                  tid = setInterval(FlashFrame, FlashFrameInterval);
                }
              }, function () {
                FlashTime = xPlayTime[$(this).attr("id") + "_out"];

                if (tid == null) {
                  tid = setInterval(FlashFrame, FlashFrameInterval);
                }
              });
            }
          }

          else if (xOperation == "hoverelementshow") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              xPlayTime[xID + "_hoverelementshow"] = $(this).attr("ShowSelector");

              //remove any event in case a loop is initiated that would make multiple assignments to same object
              $("#" + xID).off('mouseenter mouseleave');

              $("#" + xID).hover(function () {
                $(xPlayTime[$(this).attr("id") + "_hoverelementshow"]).show();
              }, function () {
                $(xPlayTime[$(this).attr("id") + "_hoverelementshow"]).hide();
              });
            }
          }

          else if (xOperation == "enableprevious") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
            }
          }

          else if (xOperation == "disableprevious") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              $("#backward-button").addClass("backward-button-style").removeClass("backward-button-style-offline");
              $("#backward-button").removeClass("backward-button-style").addClass("backward-button-style-offline");
            }
          }

          else if (xOperation == "enablenext") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              UnlockNextPage(false);
            }
          }

          else if (xOperation == "blinknext") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              if (selectedPageID < ModulePageArray.length - 1) {
                FwdBlink(4000, 1000);
              }
            }
          }

          else if (xOperation == "blinknextontext") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {

              if (CourseMode == "Fast") {
                if (selectedPageID < ModulePageArray.length - 1) {
                  FwdBlink(4000, 1000);
                }
              }
            }
          }

          else if (xOperation == "moveforwardonvideo") {
            if (CourseMode == "Video") {
              if ((admin_AutoForwardDefaultSetting) || (admin_ReviewMode)) {
                FlashAbortTimer();
                FlashTime = -1;
                FlashMoveNext(true);
              }
              else {
                FlashAbortTimer();
                FlashTime = -1;
                FlashMoveNext(false);
              }
            }
          }

          else if (xOperation == "moveforward") {
            if (xCourseMode.indexOf(CourseMode.toLowerCase()) >= 0) {
              if ((admin_AutoForwardDefaultSetting) || (admin_ReviewMode)) {
                FlashAbortTimer();
                FlashTime = -1;
                FlashMoveNext(true);
              }
              else {
                FlashAbortTimer();
                FlashTime = -1;
                FlashMoveNext(false);
              }
            }
          }

          else if (xOperation == "setfirstgamevar") {
            if ($(this).attr("Action") == "+") {
              GameVar1++;
            }
            if ($(this).attr("Action") == "-") {
              GameVar1--;
            }
            if ($(this).attr("UpdateSelector") != "") {
              $($(this).attr("UpdateSelector")).html(GameVar1);
            }
          }

          else if (xOperation == "setsecondgamevar") {
            if ($(this).attr("Action") == "+") {
              GameVar2++;
            }
            if ($(this).attr("Action") == "-") {
              GameVar2--;
            }
            if ($(this).attr("UpdateSelector") != "") {
              $($(this).attr("UpdateSelector")).html(GameVar2);
            }
          }

          else if (xOperation == "setthirdgamevar") {
            if ($(this).attr("Action") == "+") {
              GameVar3++;
            }
            if ($(this).attr("Action") == "-") {
              GameVar3--;
            }
            if ($(this).attr("UpdateSelector") != "") {
              $($(this).attr("UpdateSelector")).html(GameVar3);
            }
          }

          else if (xOperation == "comparegamevar") {
            var Equals1 = $(this).attr("FirstGameVar");
            var Equals2 = $(this).attr("SecondGameVar");
            var Equals3 = $(this).attr("ThirdGameVar");

            if (typeof Equals1 !== 'undefined' && Equals1 !== false) {
              Equals1 = parseInt(Equals1, 10);
            }
            else {
              Equals1 = GameVar1;
            }
            if (typeof Equals2 !== 'undefined' && Equals2 !== false) {
              Equals2 = parseInt(Equals2, 10);
            }
            else {
              Equals2 = GameVar2;
            }
            if (typeof Equals3 !== 'undefined' && Equals3 !== false) {
              Equals3 = parseInt(Equals3, 10);
            }
            else {
              Equals3 = GameVar3;
            }

            if ((Equals1 == GameVar1) && (Equals2 == GameVar2) && (Equals3 == GameVar3)) {
              xPlayTime2 = $(this).attr("IfTrue");
              xPlayTime2 = parseInt(xPlayTime2, 10) - 1;
              //console.log("jump: "+xPlayTime2);

              BreakSequenceLoop = true;
              FlashTime = xPlayTime2;
              if (tid == null) {
                //	console.log("resume");
                tid = setInterval(FlashFrame, FlashFrameInterval);
              }
            }
          }

          else if (xOperation == "checktext") {
            var TextToMatch = $(this).attr("Value");
            var TextInput = $("input[id=" + $(this).attr("ID") + "]").val();

            if (TextToMatch == TextInput) {
              xPlayTime2 = $(this).attr("IfTrue");
              xPlayTime2 = parseInt(xPlayTime2, 10) - 1;

              BreakSequenceLoop = true;
              FlashTime = xPlayTime2;
              if (tid == null) {
                //console.log("resume");
                tid = setInterval(FlashFrame, FlashFrameInterval);
              }
            }
          }

          else if (xOperation == "checkrule") {
            xPlayTime2 = $(this).attr("IfTrue");
            xPlayTime2 = parseInt(xPlayTime2, 10) - 1;

            if (FlashStageSequencerRule == "") {
              BreakSequenceLoop = true;
              FlashTime = xPlayTime2;
              if (tid == null) {
                //	console.log("resume");
                tid = setInterval(FlashFrame, FlashFrameInterval);
              }
            }
          }

          else if (xOperation == "jumppage") {
            GoToPageID = $(this).attr("GoToPage");
            FlashAbortTimer();
            FlashTime = -1;
            FlashMoveToPageID(GoToPageID);
          }

          else if (xOperation == "imageanimation") {
            SetImageAnimation($(this).attr("Src"), $(this).attr("ImageID"), {
              Time: 0,
              Fps: $(this).attr("Fps"),
              Loop: $(this).attr("Loop"),
              HideWhenEnd: $(this).attr("HideWhenEnd")
            });
          }


          $(".textlink").on('click', function () {
            TextModeLinkClick = 1;
            VideoPopopStyle = "content";
            ShowStandardDialog($(this).data('dialog'));
            return false;
          });

        }
      }
    }
  )
  ;

//frame not found and flashTime is equal or greater than last time then end of file move forward to next page
  if ((!FoundFrame) && (FlashTime >= xTime)) {
    FlashAbortTimer();

    //if gamfication score is going to be shown then don't auto advance instead call the gamification code which will auto-advance the lesson when closed by user
    if ((GamificationShowInGameScore) || (GamificationLastQuestion)) {
      FlashTime = -1;
      GamificationDialog(GamificationLastQuestion);
    }
    else {
      if ((FlashModeAudioEndBlink) || (FlashModeAudioEndNext)) {
      }
      else {
        FlashTime = -1;
        FlashMoveNext(false);
      }
    }
  }
}


//------------------------------------------------------------------------------------------------------------------
function StartFlashSimulation() {
  FlashFrame();
  if (tid == null) {
    tid = setInterval(FlashFrame, FlashFrameInterval);
  }
}
