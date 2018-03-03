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

var PreExamAnswersArray = [];

var PreExamMaxAnswers = -1;
var PreExamRightAnswer = false;
var PreExamRules;
var PreExamQuestion;

var PreExamRandomizeQuestionOrder = false;
var PreExamMultiQuestionXML;

var PreExamAnswerLeft = 50;
var PreExamAnswerTop = 50;
var PreExamAnswerWidth = 400;
var PreExamAnswerSpacing = 15;

var PreExamXML;

var AnswerLetters = ["A", "B", "C", "D", "E", "F", "G"];
var AnswerTextWithLetter = "";

var PreExamAnswerCache = [];
var PreExamScormArray = [];

var PreExamRoot;

var PreExamQuestionOrderArray = [];

var PreExamIntroNodeValue = "Intro";

var AdaptiveSectionsStr = "";

var CloseScoreDialogAdvancePage = true;


function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

//------------------------------------------------------------------------------------------------------------------
function CloseIntroDialogPreExam(SkipTest) {
  $("#FadeOutBackgroundDiv").fadeOut(250);
  $("#FreeFormDialogDiv").fadeOut(250);

  PauseAudioOne(false, true);

  UserHistory.push({t: 'p', skip: SkipTest}); //p=pretest

  if (SkipTest) {

    if (selectedPageID < ModulePageArray.length - 1) {
      ScormPreExamSkipNotification();
      FinalExamEnabled = false;

      var TempselectedModuleID = selectedModuleID;
      var TempselectedPageID = selectedPageID;

      LoadTOC(CourseXML);
      selectedModuleID = TempselectedModuleID;
      selectedPageID = TempselectedPageID;

      if (selectedPageID > ModulePageArray.length - 1) {
        selectedModuleID = 0;
        selectedPageID = 1;
      }

      for (var i = 0; i < selectedPageID; i++) {
        ModulePageArray[i].xViewable = 1;
        $("#C" + (i)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
      }

      $("#module-name").html(ModulePageArray[selectedModuleID].xName.slice(1));
      $("#page-combo").html(ModulePageArray[selectedPageID].xName.slice(1));

      //add style to new row and save its ID
      PageRowDivID = "C" + selectedPageID;
      $("#" + PageRowDivID).addClass("page-select-text-line-style-active");

      $(".page-select-text-line-style").bind('click', function (event) {
        PageClick(event);
      });
      $(".page-disabled-text-line-style").bind('click', function (event) {
        PageClick(event);
      });

      UnlockNextPage(true);
    }
  }
  else {
    DrawPreExamQuiz(PreExamCurrentActiveQuestion);
  }
}


//------------------------------------------------------------------------------------------------------------------
function ClosePreExamScoreDialog() {
  $("#FadeOutBackgroundDiv").fadeOut(250);
  $("#FreeFormDialogDiv").fadeOut(250);

  PauseAudioOne(false, true);

  if (ModulePageArray[selectedPageID].xType == "PreExam") {
    UnlockNextPage(true);
  } else
  {
    LoadPage(selectedPageID, 0, 0, 1);
  }
}

//------------------------------------------------------------------------------------------------------------------
function UpdatePreExamMultiQuestionMode() {
  if (PreExamAdaptiveTraining) {
    PreExamSkipModules = ",";

    AdaptiveSectionsStr = "";
    PreExamMultiQuestionXML.find("Rule").each(function () {
      if (AdaptiveSectionsStr != "") {
        AdaptiveSectionsStr += ", ";
      }
      AdaptiveSectionsStr += $(this).attr("FriendlySectionName");
    });
    console.log("-------------");
    console.log(AdaptiveSectionsStr);

    PreExamMultiQuestionXML.find("Rule").each(function () {
      console.log($(this).attr("Questions"));
      var TempStr = $(this).attr("Questions");
      var TempQuestions = TempStr.split(',');
      var TotalQuestions = 0;
      var TotalCorrect = 0;
      for (var i = 0; i < TempQuestions.length; i++) {
        TotalQuestions++;

        for (var j = 0; j < PreExamMaxQuestions; j++) {
          //console.log(j+" "+PreExamQuestionOrderArray[j]);
          if (typeof PreExamScormArray[PreExamQuestionOrderArray[j]].QuestionID !== "undefined") {
            if ((PreExamScormArray[PreExamQuestionOrderArray[j]].QuestionID == TempQuestions[i]) && (PreExamScormArray[PreExamQuestionOrderArray[j]].CorrectAnswer == PreExamScormArray[PreExamQuestionOrderArray[j]].UserAnswer)) {
              TotalCorrect++;
              //console.log(j+" "+TempStr+" "+PreExamScormArray[PreExamQuestionOrderArray[j]].QuestionID+" --- "+PreExamScormArray[PreExamQuestionOrderArray[j]].CorrectAnswer+" "+PreExamScormArray[PreExamQuestionOrderArray[j]].UserAnswer);
            }
          }
        }
      }

      var SectionPassingPercentage = parseInt($(this).attr("PassingPercentage"), 10);
      var SectionCurrentPercentage = Math.round((TotalCorrect / TotalQuestions) * 100);
      console.log(TempStr + "  -- " + TotalCorrect + "/" + TotalQuestions + " " + SectionCurrentPercentage + "% of " + SectionPassingPercentage + "%");

      if (SectionCurrentPercentage >= SectionPassingPercentage) {
        PreExamSkipModules += $(this).attr("SkipModules") + ",";
//        console.log(PreExamSkipModules);

        AdaptiveSectionsStr = AdaptiveSectionsStr.replace($(this).attr("FriendlySectionName") + ", ", "");
        AdaptiveSectionsStr = AdaptiveSectionsStr.replace($(this).attr("FriendlySectionName"), "");
//        console.log(AdaptiveSectionsStr);
        //console.log(PreExamSkipModules);


        //update TOC on right answer
        var TempselectedModuleID = selectedModuleID;
        var TempselectedPageID = selectedPageID;

        //console.log(PreExamSkipModules);

        LoadTOC(CourseXML);
        selectedModuleID = TempselectedModuleID;
        selectedPageID = TempselectedPageID;

        if (selectedPageID > ModulePageArray.length - 1) {
          selectedModuleID = 0;
          selectedPageID = 1;
        }

        for (var i = 1; i <= selectedPageID; i++) {
          ModulePageArray[i].xViewable = 1;
          $("#C" + (i)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
        }

        $("#module-name").html(ModulePageArray[selectedModuleID].xName.slice(1));
        $("#page-combo").html(ModulePageArray[selectedPageID].xName.slice(1));

        //add style to new row and save its ID
        PageRowDivID = "C" + selectedPageID;
        $("#" + PageRowDivID).addClass("page-select-text-line-style-active");

        $(".page-select-text-line-style").bind('click', function (event) {
          PageClick(event);
        });
        $(".page-disabled-text-line-style").bind('click', function (event) {
          PageClick(event);
        });
      }

    });
  }
}


//------------------------------------------------------------------------------------------------------------------
function ShowPreExamScore() {
  PauseAudioOne(false, true);

  var TotalPreExamScore = 0;
  for (var i = 0; i < PreExamMaxQuestions; i++) {
    if (PreExamAnswerCache[i].Right) {
      TotalPreExamScore++;
    }
  }

  UpdatePreExamMultiQuestionMode();

  // if score is %100 and Adaptive Training then check if any more modules to remove
  if ((TotalPreExamScore == PreExamMaxQuestions) && (PreExamAdaptiveTraining)) {
    PreExamSkipModules += $(PreExamXML).find("PreExam").attr("AllCorrectSkipModules") + ",";
//		console.log(PreExamSkipModules);

    var TempselectedModuleID = selectedModuleID;
    var TempselectedPageID = selectedPageID;

    var TempselectedName = ModulePageArray[selectedPageID].xName.slice(1);

    LoadTOC(CourseXML);
    selectedModuleID = TempselectedModuleID;
    selectedPageID = TempselectedPageID;


    if (selectedPageID > ModulePageArray.length - 1) {
      selectedModuleID = 0;
      selectedPageID = 1;
      CloseScoreDialogAdvancePage = false;
    }
    else

    //if page that existed before no longer exists make page number equal to first page of that module.
    if (TempselectedName != ModulePageArray[selectedPageID].xName.slice(1)) {
      selectedPageID = selectedModuleID + 1;
      CloseScoreDialogAdvancePage = false;
    }


    for (var i = 0; i < selectedPageID; i++) {
      ModulePageArray[i].xViewable = 1;
      $("#C" + (i)).removeClass("page-disabled-text-line-style").addClass("page-select-text-line-style");
    }

    $("#module-name").html(ModulePageArray[selectedModuleID].xName.slice(1));
    $("#page-combo").html(ModulePageArray[selectedPageID].xName.slice(1));

    //add style to new row and save its ID
    PageRowDivID = "C" + selectedPageID;
    $("#" + PageRowDivID).addClass("page-select-text-line-style-active");
    LoadPage(selectedPageID, 0, 0, 1);
  }

  PreExamScorePercentage = Math.round((TotalPreExamScore / PreExamMaxQuestions) * 100);

  if (admin_UseScorm12) {
    UpdateBookmark(selectedModuleID, selectedPageID + "-0", selectedPageID);
  }
  if (admin_UseScorm2004) {
    UpdateBookmark_2004(selectedModuleID, selectedPageID + "-0", selectedPageID);
  }

  var ModuleScoreNode;
  var ModuleScoreResultX = "";

  if (PreExamAdaptiveTraining) {
    $(PreExamXML).find("AdaptiveTrainingDialog").each(function () {
      var RangeMin = parseInt($(this).attr("RangeMin"), 10);
      var RangeMax = parseInt($(this).attr("RangeMax"), 10);

      if ((PreExamScorePercentage >= RangeMin) && (PreExamScorePercentage <= RangeMax)) {
        ModuleScoreNode = $(this);
      }
    });
  }
  else {
    ModuleScoreNode = $(PreExamXML).find("PreEndDialog");
  }

  ModuleScoreResultX = ModuleScoreNode.text();

  //show results
  ModuleScoreResultX = ModuleScoreResultX.replace("#UserScore", TotalPreExamScore);
  ModuleScoreResultX = ModuleScoreResultX.replace("#MaxScore", PreExamMaxQuestions);
  ModuleScoreResultX = ModuleScoreResultX.replace("#UserPercentage", PreExamScorePercentage);

  if (endsWith(AdaptiveSectionsStr, ", ")) {
    AdaptiveSectionsStr = AdaptiveSectionsStr.substring(0, AdaptiveSectionsStr.length - 2);
  }
  if (endsWith(AdaptiveSectionsStr, ",")) {
    AdaptiveSectionsStr = AdaptiveSectionsStr.substring(0, AdaptiveSectionsStr.length - 1);
  }
  var CommaPos = AdaptiveSectionsStr.lastIndexOf(',');
  if (CommaPos != -1) {
    AdaptiveSectionsStr = AdaptiveSectionsStr.substring(0, CommaPos) + admin_preExamAndText + ' ' + AdaptiveSectionsStr.substring(CommaPos + 1);
  }

  ModuleScoreResultX = ModuleScoreResultX.replace("#ModulesToTake", AdaptiveSectionsStr);


  $("#FreeFormDialogCloseButton").off('click');
  $("#FreeFormDialogDiv").css({"top": ModuleScoreNode.attr("Top") + "px", "left": ModuleScoreNode.attr("Left") + "px"});
  $("#FreeFormDialogDiv").hide();
  $("#FreeFormDialogDiv").html(ModuleScoreResultX).promise().done(function () {
    $("#FreeFormDialogCloseButton").on('click', function () {
      ClosePreExamScoreDialog();
      return false;
    });

    $("#FreeFormDialogCloseButton").attr('tabindex', "0");
    $("#FreeFormDialogDiv").fadeIn(250);
  });

  $("#FadeOutBackgroundDiv").fadeIn(250);

  if (PreExamAdaptiveTraining) {
    //stars animation js
  }

  LoadAndPlayAudioOne(ModuleScoreNode.attr("AudioFile"), true);
}

//------------------------------------------------------------------------------------------------------------------
function PreExamCloseQuestionAnswerDialog(UserChoice) {
  $("#FadeOutBackgroundDiv").fadeOut(250);
  $("#FreeFormDialogDiv").fadeOut(250);

  PauseAudioOne(false, true);

  //if user clicked without selecting just go back to the question
  if (UserChoice != "") {
    //if last question check results, if it is the last question call javascript function
    if (PreExamCurrentActiveQuestion == PreExamMaxQuestions) {
      ShowPreExamScore();
    }
    else {
      ForwardClick();
    }
  }
}

//------------------------------------------------------------------------------------------------------------------
function AnswerCheckPreExam() {
  if (PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Result == 'N/A') {

    Results1 = "";
    var UserSelectedAnswersString = "";
    //loop the answers build the string to compare with results
    if (PreExamAnswerType == "checkbox") {
      for (xCounter = 0; xCounter <= PreExamMaxAnswers; xCounter++) {
        if ($("#PreExamQuiz_" + PreExamAnswersArray[xCounter].Ordered).is(':checked')) {
          if (Results1 != "") {
            Results1 += ",";
          }
          Results1 += PreExamAnswersArray[xCounter].Ordered;

          if (UserSelectedAnswersString != "") {
            UserSelectedAnswersString += ",";
          }
          UserSelectedAnswersString += (xCounter + 1).toString();
        }
      }
    }
    else if (PreExamAnswerType == "radio") {
      if ($('input[name=PreExamQuizAnswer]:checked').val() != null) {
        Results1 = $('input[name=PreExamQuizAnswer]:checked').val();

        UserSelectedAnswersString = $('input[name=PreExamQuizAnswer]:checked').val();
      }
    }

    //search the rules for correct answer
    AnswerResult = "";
    var AnswerResultNode;
    PreExamRules.find("Rule").each(function () {
      if ($(this).attr("AnswerID") + "," == Results1 + ",") {
        AnswerResult = $(this).text();
        AnswerResultNode = $(this);

        //if correct then set boolean to true to save to cache
        if ($(this).attr("Correct") == "yes") {
          PreExamRightAnswer = true;
        }
      }
    });


    //find the * answer generic wrong result
    if (AnswerResult == "") {
      PreExamRules.find("Rule").each(function () {
        if ($(this).attr("AnswerID") == "*") {
          AnswerResult = $(this).text();
          AnswerResultNode = $(this);
        }
      });
    }

    var AnswerResultNoReplace = AnswerResult;
    //replace *** in Answer Result with the correct letter
    //find the correct AnswerID's position in the array
    PreExamRules.find("Rule").each(function () {
      if ($(this).attr("Correct") == "yes") {
        var j = 0;
        for (var i = 0; i < PreExamAnswersArray.length; i++) {
          if (PreExamAnswersArray[i].AnswerID == $(this).attr("AnswerID")) {
            j = i;
          }
        }

        AnswerResult = AnswerResult.replace("***", AnswerLetters[j]);
        PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].CorrectAnswer = $(this).attr("AnswerID");
      }
    });

    //show free form dialog (can also be targeted text, if DarkenBackground is not set to "yes" the next button will work
    $("#FreeFormDialogCloseButton").off('click');
    $("#FreeFormDialogDiv").css({"top": AnswerResultNode.attr("Top") + "px", "left": AnswerResultNode.attr("Left") + "px"});
    $("#FreeFormDialogDiv").hide();
    $("#FreeFormDialogDiv").html(AnswerResult).promise().done(function () {
      $("#FreeFormDialogCloseButton").on('click', function () {
        PreExamCloseQuestionAnswerDialog(Results1);
        return false;
      });
      $("#FreeFormDialogCloseButton").attr('tabindex', "0");
      $("#FreeFormDialogDiv").fadeIn(250);
    });


    if (AnswerResultNode.attr("DarkenBackground") == "yes") {
      $("#FadeOutBackgroundDiv").fadeIn(250);
    }

    LoadAndPlayAudioOne(AnswerResultNode.attr("AudioFile"), true);

    //disable the form and submit button if an answer has been choosen also set the cache also enable the next button
    if (Results1 != "") {
      PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Result = Results1;
      PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Text = AnswerResultNoReplace;

      PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].UserAnswer = UserSelectedAnswersString;

      $('input.graphically').attr('disabled', true);
      $('input.graphically').attr('disabled', true);

      $("#AnswerBtn" + PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]).addClass("disabled");

      //save right/wrong answer
      PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Right = PreExamRightAnswer;

      //unlock next button
      $("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
    }

    //post question to javascript call after each question
    //

    /*
    UserHistory.push({
      t: 'p',
      qid: PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].QuestionID,
      ua: PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].UserAnswer,
      ca: PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Right
    });
    */

    if (admin_UseScorm12) {
      UpdateBookmark(selectedModuleID, selectedPageID + "-0", selectedPageID);

      AddScormPreExamAnswer(PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].QuestionID, PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Question, PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Answers, PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].CorrectAnswer, PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].UserAnswer, PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Right, "");
    }
    if (admin_UseScorm2004) {
      UpdateBookmark_2004(selectedModuleID, selectedPageID + "-0", selectedPageID);

      AddScormPreExamAnswer_2004(PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].QuestionID, PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Question, PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Answers, PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].CorrectAnswer, PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].UserAnswer, PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Right, "");
    }

    UpdatePreExamMultiQuestionMode();
  }
}


//------------------------------------------------------------------------------------------------------------------
function SetupPreExam() {

  var PreExamRoot = $(PreExamXML).find("PreExam").find("Questions");
  PreExamMaxQuestions = 0;
  $(PreExamXML).find("PreExam").find("Question").each(function () {

    PreExamScormArray[PreExamMaxQuestions] = {};
    PreExamAnswerCache[PreExamMaxQuestions] = {};

    PreExamQuestionOrderArray[PreExamMaxQuestions] = PreExamMaxQuestions;

    PreExamMaxQuestions++;
  });


  //console.log(AdaptiveSectionsStr);

  PreExamRandomizeQuestionOrder = false;
  PreExamRandomizeQuestionOrderNode = $(PreExamXML).find("PreExam").attr("RandomizeOrder");
  if (typeof PreExamRandomizeQuestionOrderNode == "undefined") {
  }
  else {
    if (PreExamRandomizeQuestionOrderNode.toLowerCase() === 'yes') {
      fisherYates2(PreExamQuestionOrderArray);
      //	console.log(PreExamQuestionOrderArray);
      PreExamRandomizeQuestionOrder = true;
    }
  }

  PreExamMultiQuestionXML = $(PreExamXML).find("MultiQuestionRules");

  AdaptiveSectionsStr = "";
  PreExamMultiQuestionXML.find("Rule").each(function () {
    if (AdaptiveSectionsStr != "") {
      AdaptiveSectionsStr += ", ";
    }
    AdaptiveSectionsStr += $(this).attr("FriendlySectionName");
  });


  PreExamCurrentActiveQuestion = 1;

  if (PreExamAdaptiveTraining) {
    PreExamIntroNodeValue = "AdaptiveIntro";
  }
  else {
    PreExamIntroNodeValue = "Intro";
  }

  $("#ajax-loading-graph").hide();
  $("#template-place").html(TemplateArray[CurrentTemplateID]);

  BackgroundAudio = PreExamRoot.attr("BackgroundAudioFile");
  LoadAndPlayAudioBackground(BackgroundAudio, true);

  $("#FadeOutBackgroundDiv").removeClass().addClass("InteractiveFadeoutStyle");
  $("#FadeOutBackgroundDiv").css({
    "top": (!isMobile) ? "5px" : "0px",
    "left": (!isMobile) ? "5px" : "0px",
    "width": (!isMobile) ? ($("#skin-container").width() - 10) + "px" : $("#template-place").width() + "px",
    "height": (!isMobile) ? ($("#skin-container").height() - 15) + "px" : $("#template-place").height() + "px",
    "border-radius": "5px"
  });

  //if has intro dialog then show it
  if (PreExamRoot.find(PreExamIntroNodeValue).text().length > 0) {
    $("#FreeFormDialogCloseButton").off('click');
    $("#FreeFormDialogDiv").css({
      "top": PreExamRoot.find(PreExamIntroNodeValue).attr("Top") + "px",
      "left": PreExamRoot.find(PreExamIntroNodeValue).attr("Left") + "px"
    });

    introtext = PreExamRoot.find(PreExamIntroNodeValue).text();
    introtext = introtext.replace("#TotalQuestionCount", PreExamMaxQuestions);

    $("#FreeFormDialogDiv").hide();
    $("#FreeFormDialogDiv").html(introtext).promise().done(function () {
      $("#FreeFormDialogCloseButton").on('click', function () {
        CloseIntroDialogPreExam(false);
        return false;
      });

      $("#SkipPreTest").on('click', function () {
        CloseIntroDialogPreExam(true);
        return false;
      });
      $("#FreeFormDialogCloseButton").attr('tabindex', "0");
      $("#FreeFormDialogDiv").fadeIn(250);
    });


    $("#FadeOutBackgroundDiv").fadeIn(250);

    IntroBoxAudio = PreExamRoot.find(PreExamIntroNodeValue).attr("AudioFile");
    LoadAndPlayAudioOne(IntroBoxAudio, true);
  }
  else {
    DrawPreExamQuiz(PreExamCurrentActiveQuestion);
  }


}

//------------------------------------------------------------------------------------------------------------------
function DrawPreExamQuiz() {
  if (typeof PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Result != 'undefined') {
  }
  else {
    PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Result = "N/A";
    PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Text = "";
  }

  PreExamQuestion = $(PreExamXML).find("PreExam").find("Questions").find("Question:eq(" + (PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1] ) + ")");

  var PreExamQuestionText = PreExamQuestion.find("QuestionText");

  $("#template-place").html(TemplateArray[CurrentTemplateID]);

  PreExamQuestion.find("Element").each(function () {
    elementtext = $(this).text();
    elementtext = elementtext.replace("###", PreExamCurrentActiveQuestion);

    $("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;'>" + elementtext + "</div>");
  });

  //disable next button and play audio for unanswered questions
  if ((PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Result == 'N/A') && (!admin_ReviewMode)) {
    $("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
  }

  LoadAndPlayAudioOne(PreExamQuestionText.attr("AudioFile"), true);

  $("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + PreExamQuestionText.attr("Top") + "px; left:" + PreExamQuestionText.attr("Left") + "px; width:" + PreExamQuestionText.attr("Width") + "px; height:" + PreExamQuestionText.attr("Height") + "px;'>" + PreExamQuestionText.text() + "</div>");

  //load and draw page answers
  PreExamAnswerType = PreExamQuestion.find("Answers").attr("Type").toLowerCase();

  PreExamAnswerLeft = parseInt(PreExamQuestion.find("Answers").attr("Left"), 10);
  PreExamAnswerTop = parseInt(PreExamQuestion.find("Answers").attr("Top"), 10);
  PreExamAnswerWidth = parseInt(PreExamQuestion.find("Answers").attr("Width"), 10);
  PreExamAnswerSpacing = parseInt(PreExamQuestion.find("Answers").attr("Spacing"), 10);

  PreExamAnswersArray = [];
//	PreExamAnswersArrayOrdered = [];
//	PreExamAnswersArrayOrderedAnswerTexts = [];
  PreExamMaxAnswers = -1;
  PreExamRightAnswer = false;
  PreExamRules = PreExamQuestion.find("Rules");

  PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Answers = "";

  PreExamQuestion.find("Answers").find("Answer").each(function () {
    PreExamMaxAnswers++;
    PreExamAnswersArray[PreExamMaxAnswers] = {};
    PreExamAnswersArray[PreExamMaxAnswers].AnswerID = $(this).attr("AnswerID");
    PreExamAnswersArray[PreExamMaxAnswers].Ordered = $(this).attr("AnswerID");
    PreExamAnswersArray[PreExamMaxAnswers].OrderedAnswerTexts = $(this).text();

    //update array for scorm data
    if (PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Answers != "") {
      PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Answers += ", ";
    }
    PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Answers += $(this).text();
  });

  //randomize questions if Randomize attribute is yes
  if (PreExamQuestion.find("Answers").attr("Randomize") == "yes") {
    fisherYates2(PreExamAnswersArray);
  }

  Answers = "<table border=0 cellspacing=0 cellpadding=2>";
  tabIndexC = 0;

  //update array for scorm data
  PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Question = PreExamQuestionText.text();
  PreExamScormArray[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].QuestionID = PreExamQuestionText.attr("QuestionID");

  for (xCounter = 0; xCounter <= PreExamMaxAnswers; xCounter++) {
    PreExamQuestion.find("Answers").find("Answer").each(function () {
      if ($(this).attr("AnswerID") == PreExamAnswersArray[xCounter].AnswerID) {
        var CheckCorrectAnswer = "";
        //console.log(PreExamAnswerCache[PreExamCurrentActiveQuestion]+" "+$(this).attr("AnswerID"));
        if (PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Result.indexOf($(this).attr("AnswerID")) !== -1) {
          CheckCorrectAnswer = " checked ";
        }

        tabIndexC++;

        if (PreExamAnswerType == "radio") {
          AnswerTextWithLetter = $(this).text();
          AnswerTextWithLetter = AnswerTextWithLetter.replace("***", AnswerLetters[tabIndexC - 1]);

          Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + PreExamAnswerSpacing + "px;\"><input type='radio' name='PreExamQuizAnswer' value='" + $(this).attr("AnswerID") + "' class='graphically' id='PreExamQuiz_" + $(this).attr("AnswerID") + "' " + CheckCorrectAnswer + "><label tabindex='" + tabIndexC + "' class='graphically' for='PreExamQuiz_" + $(this).attr("AnswerID") + "'></label></td><td><label tabindex='" + tabIndexC + "' style='display:block; cursor:pointer;' for='PreExamQuiz_" + $(this).attr("AnswerID") + "'>" + AnswerTextWithLetter + "</label></td></tr>";
        }
        else if (PreExamAnswerType == "checkbox") {
          AnswerTextWithLetter = $(this).text();
          AnswerTextWithLetter = AnswerTextWithLetter.replace("***", AnswerLetters[tabIndexC - 1]);

          Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + PreExamAnswerSpacing + "px;\"><input type='checkbox'  class='graphically' id='PreExamQuiz_" + $(this).attr("AnswerID") + "' " + CheckCorrectAnswer + "><label tabindex='" + tabIndexC + "'  class='graphically' for='PreExamQuiz_" + $(this).attr("AnswerID") + "'></label></td><td><label tabindex='" + tabIndexC + "'  style='display:block; cursor:pointer;' for='PreExamQuiz_" + $(this).attr("AnswerID") + "'>" + AnswerTextWithLetter + "</label></td></tr>";
        }
      }
    });
  }

  Answers += "</table>";

  $("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + PreExamAnswerTop + "px; left:" + PreExamAnswerLeft + "px; width:" + PreExamAnswerWidth + "px;'>" + Answers + "</div>");

  //add answer button
  var AnswerButtonPreExam = "<a href='#' onClick='AnswerCheckPreExam(); return false' id='AnswerBtn" + PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1] + "' style='position:absolute; width:" + PreExamQuestion.find('AnswerButton').attr('Width') + "px; top:" + PreExamQuestion.find('AnswerButton').attr("Top") + "px; left:" + PreExamQuestion.find('AnswerButton').attr('Left') + "px; margin-bottom:5px;';  class='" + PreExamQuestion.find('AnswerButton').attr('Class') + "' name='btn1' value=''>" + PreExamSubmitButton + "</a>";

  $("#template-place").append(AnswerButtonPreExam);

  //if quiz has already been answered fill in right answer and disable the buttons
  if (PreExamAnswerCache[PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]].Result != 'N/A') {
    $('input.graphically').attr('disabled', true);
    $('input.graphically').attr('disabled', true);
    $("#AnswerBtn" + PreExamQuestionOrderArray[PreExamCurrentActiveQuestion - 1]).addClass("disabled");

    //unlock next button
    $("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
  }
}
