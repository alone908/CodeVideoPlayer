/**
 * Created by Chung on 8/4/17.
 */
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

var BumpyRightAnswer = false;
var BranchingRightAnswer = true;
var BumpyQuizPageID = "";

//------------------------------------------------------------------------------------------------------------------
function CloseBumpyFreeFormIntroDialog() {
  $("#FadeOutBackgroundDiv").fadeOut(250);
  $("#FreeFormDialogDiv").fadeOut(250);

  if (CourseMode == "Video") {
    $("#jplayer_audio").jPlayer("stop");
  }
  CurrentPlayAudio = 'QuestionAudio';
  LoadAndPlayAudioOne(IntroAudio, true);

}

//------------------------------------------------------------------------------------------------------------------
function CloseBumpyAnswerFreeFormDialog(CorrectAnswer, BranchingRightAnswer) {
  $("#FreeFormDialogDiv").fadeOut(250);

  if (CourseMode == "Video") {
    isPlay = 0;
    $("#jplayer_audio").jPlayer("stop");
    $("#play-button").removeClass("pause-button-style").addClass("play-button-style");
  }

  if ((CorrectAnswer) || (GamifcationContinueOnFirstChoice)) {
    //if gamfication score is going to be shown then don't auto advance instead call the gamification code which will auto-advance the lesson when closed by user
    if ((GamificationShowInGameScore) || (GamificationLastQuestion)) {
      GamificationDialog(GamificationLastQuestion)
    }
    else {
      $("#FadeOutBackgroundDiv").fadeOut(250);

      BranchingGoToPageID(function (res) {
        if (!res) {
          UnlockNextPage(true);
        }
      });
    }
  }
  else {
    $("#FadeOutBackgroundDiv").fadeOut(250);
    if (CourseMode === 'Video') {
      removeBumpyQuizOptions();
    }

    //load audio file back
    CurrentPlayAudio = 'QuestionAudio';
    LoadAndPlayAudioOne(IntroAudio, true);
  }
  return false
}

//------------------------------------------------------------------------------------------------------------------
function ShowBumpyAnswer(AnswerID) {
  $(CourseXML).find("Modules").each(function () {
    $(CourseXML).find("Module").each(function () {
      if ('M' + $(this).attr("Name") == ModulePageArray[selectedModuleID].xName) {
        $(this).find("Page").each(function () {
          if ('L' + $(this).attr("Name") == ModulePageArray[selectedPageID].xName) {
            $(this).find("Answer").each(function () {
              if ($(this).attr("AnswerID") == AnswerID) {
                //Gamification
                //console.log(GamificationScoreArray+" - "+selectedPageID+" - "+SearchInArray(GamificationScoreArray, selectedPageID)+" - "+GamificationScoreArray.length);
                if ((SearchInArray(GamificationScoreArray, selectedPageID) == -1) || (GamificationScoreArray.length == 0)) {
                  if ($(this).attr("Correct") == "yes") {
                    GamificationUserScore += GamificationQuestionUserScore;
                  }
                  else {
                    GamificationComputerScore += GamificationQuestionComputerScore;
                  }
                  GamificationScoreArray.push(selectedPageID);

                  GamificationSuspendData = GamificationComputerScore + "," + GamificationUserScore + ",";
                  for (var i = 0; i < GamificationScoreArray.length; i++) {
                    GamificationSuspendData += GamificationScoreArray[i] + ",";
                  }
                }

                AnswerResult = $(this).text();
                AnswerResult = GamificationStringReplace(AnswerResult);

                AnswerResultAudio = $(this).attr("AudioFile");
                AnswerTop = $(this).attr("Top");
                AnswerLeft = $(this).attr("Left");
                AnswerWidth = $(this).attr("Width");
                AnswerHeight = $(this).attr("Height");

                AnswerResultNode = $(this);

                if ($(this).attr("StopBackgroundAudio") == "yes") {
                  PauseBackgroundAudio(false, true);
                }

                //if correct then set the button to close on next click
                if ($(this).attr("Correct") == "yes") {
                  BumpyRightAnswer = true;
                  $("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
                }

                if ($(this).attr("BranchingTrue") == "no") {
                  BranchingRightAnswer = false;
                }

                //if answer has audio play it
                CurrentPlayAudio = 'AnswerAudio';
                LoadAndPlayAudioOne(AnswerResultAudio, true);

                //pass quiz answer to scrom
                if (admin_PostGamificationToScorm) {
                  if (admin_UseScorm12) Scorm_Post_Quiz_Answer(BumpyQuizPageID, AnswerID, BumpyRightAnswer);
                  if (admin_UseScorm2004) Scorm2004_Post_Quiz_Answer(BumpyQuizPageID, AnswerID, BumpyRightAnswer);
                }

                if (typeof ModulePageArray[selectedPageID].xName === "undefined") {
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
                      t: 'fq', //type = interactive quiz
                      id: typeof ModulePageArray[selectedPageID].xID === "undefined" ? "" : ModulePageArray[selectedPageID].xID,
                      pid: selectedPageID,
                      ca: BranchingRightAnswer // dont use BumpyRightAnswer as in some courses that use javascript in the xml this is always set to true
                    });
                  }

                }

                //unlock next page if answer is correct
                if (BumpyRightAnswer) {
                  UnlockNextPage(false);
                }


                $("#FreeFormDialogCloseButton").off('click');

                $("#FreeFormDialogDiv").css({"top": AnswerTop + "px", "left": AnswerLeft + "px", "width": AnswerWidth + "px", "height": AnswerHeight + "px"});

                $("#FreeFormDialogDiv").hide();
                $("#FreeFormDialogDiv").html(AnswerResult).promise().done(function () {
                  if ($("#FreeFormDialogCloseButton")[0] !== undefined) {
                    $("#FreeFormDialogCloseButton").on('click', function () {
                      CloseBumpyAnswerFreeFormDialog(BumpyRightAnswer, BranchingRightAnswer);
                      return false;
                    });
                    $("#FreeFormDialogCloseButton").attr('tabindex', "10");
                  }
                  else {
                    setTimeout(function () {
                      $("#FreeFormDialogDiv").fadeOut(250);
                    }, 3000)
                  }
                  $("#FreeFormDialogDiv").fadeIn(250);
                });
                if (AnswerResultNode.attr("DarkenBackground") == "yes") {
                  $("#FadeOutBackgroundDiv").fadeIn(250);
                }
              }
            });
          }
        });
      }
    });
  });
}

//------------------------------------------------------------------------------------------------------------------
function DrawBumpyQuiz() {
  BumpyRightAnswer = false;
  BranchingRightAnswer = true;

  $("#FadeOutBackgroundDiv").removeClass().addClass("InteractiveFadeoutStyle");
  $("#FadeOutBackgroundDiv").css({
    "top": (!isMobile) ? "5px" : "0px",
    "left": (!isMobile) ? "5px" : "0px",
    "width": (!isMobile) ? ($("#skin-container").width() - 10) + "px" : $("#template-place").width() + "px",
    "height": (!isMobile) ? ($("#skin-container").height() - 15) + "px" : $("#template-place").height() + "px",
    "border-radius": "5px"
  });

  $("#ajax-loading-graph").hide();

  $(CourseXML).find("Modules").each(function () {
    $(CourseXML).find("Module").each(function () {
      if ('M' + $(this).attr("Name") == ModulePageArray[selectedModuleID].xName) {
        $(this).find("Page").each(function () {

          if ('L' + $(this).attr("Name") == ModulePageArray[selectedPageID].xName) {
            ModuleName = $(this).attr("Name");
            $("#template-place").html("");
            $("#template-place").html(TemplateArray[CurrentTemplateID]);

            ContinueButton = $(this).attr("ContinueButton");
            StartButton = $(this).attr("StartButton");

            GamifcationContinueOnFirstChoice = false;
            GamifcationContinueOnFirstChoice = $(this).attr("GamifcationContinueOnFirstChoice");
            if (typeof GamifcationContinueOnFirstChoice == "undefined") {
              GamifcationContinueOnFirstChoice = false;
            }

            GamificationQuestionUserScore = $(this).attr("GamifictionUser");
            if (typeof GamificationQuestionUserScore == "undefined") {
              GamificationQuestionUserScore = 0;
            }
            else {
              GamificationQuestionUserScore = parseInt(GamificationQuestionUserScore, 10);
            }

            GamificationQuestionComputerScore = $(this).attr("GamifictionComputer");
            if (typeof GamificationQuestionComputerScore == "undefined") {
              GamificationQuestionComputerScore = 0;
            }
            else {
              GamificationQuestionComputerScore = parseInt(GamificationQuestionComputerScore, 10);
            }

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

            BumpyQuizPageID = $(this).attr("QuestionID");


            RightAnswerHeader = $(this).find("RightAnswerHeader").text();
            WrongAnswerHeader = $(this).find("WrongAnswerHeader").text();

            AnswerBox = $(this).find("AnswerBox");
            IntroAudio = $(this).attr("AudioFile");

            BackgroundAudio = $(this).attr("BackgroundAudioFile");
            LoadAndPlayAudioBackground(BackgroundAudio, true);

            //draw bumpy page
            ThePageElements = $(this).find("Elements");
            ThePageElements.find("Element").each(function () {

              $("#template-place").append("<div id='" + $(this).attr("ID") + "' class='" + $(this).attr("Class") + "' style='overflow:hidden; position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;'>" + $(this).text() + "</div>");

            });

            TheImageAnimations = $(this).find("ImageAnimations");
            TheImageAnimations.find("ImageAnimation").each(function () {
              SetImageAnimation($(this).attr("Src"), $(this).attr("ImageID"), {
                Time: $(this).attr("T"),
                Fps: $(this).attr("Fps"),
                Loop: $(this).attr("Loop"),
                HideWhenEnd: $(this).attr("HideWhenEnd")
              });
            })

            //find options to append after intro audio is finished.
            TheBumpyQuizOptions = $(this).find("Options");

            //if has intro dialog then show it, otherwise play the audio
            if ($(this).find("Intro").text().length > 0) {

              $("#FreeFormDialogCloseButton").off('click');
              $("#FreeFormDialogDiv").css({
                "top": $(this).find("Intro").attr("Top") + "px",
                "left": $(this).find("Intro").attr("Left") + "px",
                "width": $(this).find("Intro").attr("Width") + "px",
                "height": $(this).find("Intro").attr("Height") + "px"
              });

              $("#FreeFormDialogDiv").hide();
              $("#FreeFormDialogDiv").html($(this).find("Intro").text()).promise().done(function () {
                $("#FreeFormDialogCloseButton").on('click', function () {
                  CloseBumpyFreeFormIntroDialog();
                  if (IntroAudio === undefined || IntroAudio === '') {
                    ShowBumpyQuizOptions(TheBumpyQuizOptions);
                  }
                  return false;
                });
                $("#FreeFormDialogCloseButton").attr('tabindex', "0");
                $("#FreeFormDialogDiv").fadeIn(250);
              });

              $("#FadeOutBackgroundDiv").fadeIn(250);

              IntroBoxAudio = $(this).find("Intro").attr("AudioFile");
              AutoContinueAfterIntroBox = $(this).find("Intro").attr("AutoContinue");

              if ((CourseMode === 'Video' && IntroBoxAudio !== undefined && IntroBoxAudio !== '') && AutoContinueAfterIntroBox === 'true') {
                CurrentPlayAudio = 'IntroBoxAudio';
                LoadAndPlayAudioOne(IntroBoxAudio, true);
              }
              else if ((CourseMode === 'Video' && IntroBoxAudio !== undefined && IntroBoxAudio !== '') && AutoContinueAfterIntroBox !== 'true') {
                CurrentPlayAudio = 'IntroBoxAudio';
                LoadAndPlayAudioOne(IntroBoxAudio, true);

              }
              else if ((CourseMode === 'Fast' || IntroBoxAudio !== undefined || IntroBoxAudio !== '') && AutoContinueAfterIntroBox === 'true') {

                var DelayIfNoAudio_Intro = ( $(this).find("Intro").attr("DelayIfNoAudio") !== undefined && $(this).find("Intro").attr("DelayIfNoAudio") !== '' ) ? parseInt($(this).find("Intro").attr("DelayIfNoAudio")) : 3000;

                BumpyQuizIntroTimeout = setTimeout(function () {
                  $("#FadeOutBackgroundDiv").fadeOut(250);
                  $("#FreeFormDialogDiv").animate({
                    height: '0px',
                  }, {
                    duration: 1000, complete: function () {
                      $("#FreeFormDialogDiv").attr('style','display:none;');
                    }
                  });
                  if (IntroAudio !== undefined && IntroAudio !== '') {
                    CurrentPlayAudio = 'QuestionAudio';
                    LoadAndPlayAudioOne(IntroAudio, true);
                  }
                  else {
                    var DelayIfNoAudio_Options = ( $(this).find("Options").attr("DelayIfNoAudio") !== undefined && $(this).find("Options").attr("DelayIfNoAudio") !== '' ) ? parseInt($(this).find("Options").attr("DelayIfNoAudio")) : 3000;
                    BumpyQuizOptionsTimeout = setTimeout(function () {
                      ShowBumpyQuizOptions(TheBumpyQuizOptions);
                    }, DelayIfNoAudio_Options);
                  }

                }, DelayIfNoAudio_Intro)

              }
              else if ((CourseMode === 'Fast' || IntroBoxAudio !== undefined || IntroBoxAudio !== '') && AutoContinueAfterIntroBox !== 'true') {

              }

            }
            else {
              //play intro audio directly of intro dialog
              if (IntroAudio !== undefined && IntroAudio !== '' && CourseMode === 'Video') {
                CurrentPlayAudio = 'QuestionAudio';
                LoadAndPlayAudioOne(IntroAudio, true);
              }
              else {
                var DelayIfNoAudio_Options = ( $(this).find("Options").attr("DelayIfNoAudio") !== undefined && $(this).find("Options").attr("DelayIfNoAudio") !== '' ) ? parseInt($(this).find("Options").attr("DelayIfNoAudio")) : 3000;
                BumpyQuizOptionsTimeout = setTimeout(function () {
                  ShowBumpyQuizOptions(TheBumpyQuizOptions);
                }, DelayIfNoAudio_Options);
              }
            }
          }
        });
      }
    });
  });
}

function ShowBumpyQuizOptions(TheBumpyQuizOptions) {

  var TheQuizOptions = TheBumpyQuizOptions.find("Option");
  var autoOptionHeight = Math.ceil($('#template-place').height() / TheQuizOptions.length);

  TheQuizOptions.each(function (i, optionNode) {

    var optionTop = ($(optionNode).attr("Top") !== undefined && $(optionNode).attr("Top") !== '') ? $(optionNode).attr("Top") : autoOptionHeight * (i);
    var optionHeight = ($(optionNode).attr("Height") !== undefined && $(optionNode).attr("Height") !== '') ? $(optionNode).attr("Height") : autoOptionHeight;

    $("#template-place").append("<div class='_theOption " + $(optionNode).attr("Class") + "' style='position:absolute; top:" + optionTop + "px; left:" + $(optionNode).attr("Left") + "px; width:" + $(optionNode).attr("Width") + "px; height:" + optionHeight + "px;' AnswerID='" + $(optionNode).attr("AnswerID") + "' MouseInClass='" + $(optionNode).attr("MouseInClass") + "' MouseOutClass='" + $(optionNode).attr("MouseOutClass") + "' ClickClass='" + $(optionNode).attr("ClickClass") + "' ClickSound='" + $(optionNode).attr("ClickSound") + "'>" + $(optionNode).text() + "</div>");

  });

  $("#template-place ._theOption").on('click', function () {
    if (this.hasAttribute('ClickSound') && $(this).attr('ClickSound') !== '') {
      LoadAndPlayEffectSound($(this).attr('ClickSound'), true);
    }

    $("#template-place ._theOption").each(function (i, optionNode) {
      $(optionNode).removeClass($(optionNode).attr('ClickClass'));
      this.style.webkitAnimationName = '';
      this.style.webkitAnimationDelay = '';
      $(optionNode).css('top', $(this).position().top + 'px').css('left', $(this).position().left + 'px').css('width', $(this).width() + 'px').css('height', $(this).height() + 'px');
      $(optionNode).addClass($(optionNode).attr('ClickClass'));
    })

    ShowBumpyAnswer($(this).attr("AnswerID"));
  });

  if (!isMobile) {
    $("#template-place ._theOption").on('mouseenter', function () {
      $(this).addClass($(this).attr('MouseInClass')).removeClass($(this).attr('MouseOutClass'));
    });

    $("#template-place ._theOption").on('mouseleave', function () {
      $(this).addClass($(this).attr('MouseOutClass')).removeClass($(this).attr('MouseInClass'));
    });
  }
}

function removeBumpyQuizOptions() {
  $('#template-place ._theOption').remove();
}

function SetImageAnimation(Source, ImageId, Option) {

  if (Source === undefined || Source === '' || ImageId === undefined || ImageId === '') {
    return false;
  }

  if (Option === undefined) {
    Option = {Time: 0, Fps: 60, Loop: false, HideWhenEnd: false}
  }

  if (Option.Time === undefined || Option.Time === '') {
    Option.Time = 0;
  }
  if (Option.Fps === undefined || Option.Fps === '') {
    Option.Fps = 60;
  }
  if (Option.Loop === undefined || Option.Loop !== 'true') {
    Option.Loop = false;
  }
  if (Option.HideWhenEnd === undefined || Option.HideWhenEnd !== 'true') {
    Option.HideWhenEnd = false;
  }

  $('#' + ImageId).html('');
  $('#' + ImageId).css('display', 'none');

  var pretext = Source.substr(0, Source.indexOf('['));
  var tailtext = Source.substr(Source.indexOf('.'));
  var range = Source.substr(Source.indexOf('[') + 1, Source.indexOf(']') - Source.indexOf('[') - 1);
  var startText = range.split('-')[0];
  var startInt = parseInt(range.split('-')[0]);
  var addZero = startText.length - startInt.toString().length > 0 && true;
  var end = parseInt(range.split('-')[1]);
  var ImageLoadedObj = [];
  var isIEorFirefox = (navigator.userAgent.indexOf('Firefox') !== -1 || navigator.userAgent.indexOf('Trident') !== -1 || navigator.userAgent.indexOf('Edge') !== -1 || ($.browser.msie && parseInt($.browser.version, 10) === 11) || ($.browser.msie && parseInt($.browser.version, 10) === 10) || ($.browser.msie && parseInt($.browser.version, 10) === 9)) ? true : false;
  var imageZIndex = 0;

  for (var i = startInt; i <= end; i++) {
    var preZero = '';
    if (addZero) {
      for (var n = 1; n <= end.toString().length - i.toString().length; n++) {
        preZero += '0';
      }
    }
    if (!isIEorFirefox) {
      $('#' + ImageId).append('<img id="' + ImageId + '-' + i + '" src="' + pretext + preZero + i + tailtext + '" style="display: none" />');
    }
    else if (isIEorFirefox) {
      imageZIndex--;
      $('#' + ImageId).append('<img id="' + ImageId + '-' + i + '" src="' + pretext + preZero + i + tailtext + '" style="position: absolute; z-index: ' + imageZIndex + '" data-zIndex="' + imageZIndex + '" />');
    }
  }

  $('#' + ImageId + ' img').load(function (e) {
    // console.log('loaded ' + e.target.src + ' in element ' + ImageId);
    ImageLoadedObj.push(e.target.id);
    var animationReady = checkAllImageLoaded(ImageId);
    if (animationReady) {
      playImageAnimation(ImageId);
    }
  });

  $('#' + ImageId + ' img').error(function (e) {
    // console.log('loaded error ' + e.target.src + ' in element ' + ImageId);
    // If any image loaded error, skip error and then still play animation.
    ImageLoadedObj.push(e.target.id);
    var animationReady = checkAllImageLoaded(ImageId);
    if (animationReady) {
      playImageAnimation(ImageId);
    }
  });

  function checkAllImageLoaded(ImageId) {

    var allImageLoaded = true;

    $('#' + ImageId + ' img').each(function () {
      if (ImageLoadedObj.indexOf($(this).attr('id')) === undefined) {
        allImageLoaded = false;
        return false;
      }
    });

    // console.log('all images loaded in element ' + ImageId + ':' + allImageLoaded);

    return allImageLoaded;
  }

  function playImageAnimation(ImageId) {

    ImageAnimationTimeout = setTimeout(function () {

      var frame = 1;
      $('#' + ImageId).css('display', 'block');
      if (!isIEorFirefox) {
        $('#' + ImageId + ' img:first-child').css('display', 'inline');
      }
      else if (isIEorFirefox) {
        $('#' + ImageId + ' img:first-child').css('z-index', '0');
      }
      frame++;

      ImageAnimationInterval = setInterval(function () {

        if (frame <= $('#' + ImageId + ' img').length) {

          var hide_img_nth = frame - 1;
          var show_img_nth = frame;
          if (!isIEorFirefox) {
            $('#' + ImageId + ' img:nth-child(' + hide_img_nth + ')').css('display', 'none');
            $('#' + ImageId + ' img:nth-child(' + show_img_nth + ')').css('display', 'inline');
          }
          else if (isIEorFirefox) {
            $('#' + ImageId + ' img:nth-child(' + show_img_nth + ')').css('z-index', '0');
          }

        }
        else if (frame === $('#' + ImageId + ' img').length + 1) {

          if (Option.Loop) {
            if (!isIEorFirefox) {
              $('#' + ImageId + ' img:last-child').css('display', 'none');
              $('#' + ImageId + ' img:first-child').css('display', 'inline');
            }
            else if (isIEorFirefox) {
              $('#' + ImageId + ' img').each(function () {
                $(this).css('z-index', $(this).data('zindex'));
              });
            }
            frame = 1;
          }
          else {
            clearInterval(ImageAnimationInterval);
            if (Option.HideWhenEnd) {
              $('#' + ImageId).css('display', 'none');
            }
          }

        }

        frame++;

      }, 1000 / Option.Fps);

    }, parseInt(Option.Time, 10) * 100);

  }

}
