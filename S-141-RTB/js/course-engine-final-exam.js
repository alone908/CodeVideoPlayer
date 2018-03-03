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

var FinalExamAnswersArray = [];
var FinalExamAnswersArrayOrdered = [];
var FinalExamAnswersArrayOrderedAnswerTexts = [];
var FinalExamMaxAnswers = -1;
var FinalExamRightAnswer = false;
var FinalExamRules;

var FinalExamAnswerLeft = 50;
var FinalExamAnswerTop = 50;
var FinalExamAnswerWidth = 400;
var FinalExamAnswerSpacing = 15;

var FinalXML;

var AnswerLetters = ["A", "B", "C", "D", "E", "F", "G"];
var AnswerTextWithLetter = "";

var FinalExamAnswerCache = [];
var FinalExamAnswerRightCache = [];

var FinalExamScormQuestionCache = [];
var FinalExamScormQuestionIDCache = [];
var FinalExamScormAnswersCache = [];
var FinalExamScormUserAnswerCache = [];
var FinalExamScormCorrectAnswerCache = [];

var ResetExamToBegining = false;
var ResetExamRetakeExamDirectly = false;
var FinalRoot;


var ShowFinalIntro = true;

//------------------------------------------------------------------------------------------------------------------
function RebuildFinalExamArray(QuestionGroup,RandomizeOrder) {
	//build final exam
	FinalExamQArray = [];
	FinalExamGroupMaxQuestions = 0;

	QuestionCounter = 0;
	FinalExamCurrentActiveQuestion = 0;

	var FinalRoot = $(FinalXML).find("Final").find("QuestionGroup[Name='" + QuestionGroup + "']");

	FinalRoot.each(function () {
		QGroup = $(this).attr("Name");

		//loop through each group pull questions revelant to retry counter into array
		QCount = 0;

		FinalExamGroupMaxQuestions = parseInt($(this).attr("QuestionCount"), 10);
		QArrayCounter = (admin_FinalRetakeCounter - 1) * FinalExamGroupMaxQuestions;

		if ((QArrayCounter + 1) > $(this).find("Question").length) {
			QArrayCounter = 0;
		}


		while (QCount < FinalExamGroupMaxQuestions) {
			NewQ = new Object();
			NewQ.groupPosition = QArrayCounter;
			NewQ.group = QGroup;

			FinalExamQArray.push(NewQ);

			QuestionCounter++;

			QCount++;
			QArrayCounter++;
			if ((QArrayCounter + 1) > $(this).find("Question").length) {
				QArrayCounter = 0;
			}
		}

		if (RandomizeOrder) {
			fisherYates4(FinalExamQArray);
		}
	});

}

//------------------------------------------------------------------------------------------------------------------
function fisherYates4(myArray) {
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
function CloseIntroDialogFinalExam() {
	$("#FadeOutBackgroundDiv").fadeOut(250);
	$("#FreeFormDialogDiv").fadeOut(250);

	PauseAudioOne(false,true);

	DrawFinalExamQuiz(FinalExamCurrentActiveQuestion);
}


//------------------------------------------------------------------------------------------------------------------
function CloseFinalScoreDialog() {
	$("#FadeOutBackgroundDiv").fadeOut(250);
	$("#FreeFormDialogDiv").fadeOut(250);

	PauseAudioOne(false,true);


	if (CourseFailureCloseCourse) {
		//call exit function
		if (admin_UseScorm12) {
			CloseCourse(true);
		}

		if (admin_UseScorm2004) {
			CloseCourse_2004(true);
		}
	}
	else if (ResetExamToBegining) {
		//Delete all answers and questions for current group only
		for (var i = 0; i < FinalExamGroupMaxQuestions; i++) {
			FinalExamAnswerCache[i] = "N/A";
			FinalExamScormUserAnswerCache[i] = "N/A";
			FinalExamAnswerRightCache[i] = "N/A";

			FinalExamScormQuestionCache[i] = "N/A";
			FinalExamScormQuestionIDCache[i] = "N/A";
			FinalExamScormAnswersCache[i] = "N/A";
			FinalExamScormCorrectAnswerCache[i] = "N/A";
		}

		if (ResetExamRetakeExamDirectly) {
			LoadPage(selectedPageID, 0, 0, 1);
		}
		else {
			if (!admin_ReviewMode) {
				for (i = 3; i < ModulePageArray.length; i++) {
					ModulePageArray[i].xViewable = 0;
					$("#C" + (i)).removeClass("page-select-text-line-style").addClass("page-disabled-text-line-style");
				}
			}

			LoadPage(1, 0, 0, 1);
		}
	}
	else {
		UnlockNextPage(true);
	}
}


//------------------------------------------------------------------------------------------------------------------
function ShowFinalScore() {
	PauseAudioOne(false,true);

	var TotalUserScore = 0;

	for (var i = 0; i < FinalExamGroupMaxQuestions; i++) {
		if (FinalExamAnswerRightCache[i]) {
			TotalUserScore++;
		}
	}

	var ScorePercentage = Math.round((TotalUserScore / FinalExamGroupMaxQuestions) * 100);


	var ModuleScoreNode;
	var ModuleScoreResultX;

	ResetExamToBegining = false;
	ResetExamRetakeExamDirectly = true;

	if (ScorePercentage < admin_FinalPassingPercentage) //fail
	{
		if ((admin_FinalRetakeCounter < admin_FinalRetakeMaxCount)) //reset quiz and allow retake don't post til scorm
		{
			ShowFinalIntro = false;
			ResetExamToBegining = true;
			ResetExamRetakeExamDirectly = true;

			ResetInteractionIDOnExamRetake();

			ModuleScoreNode = $(FinalXML).find("SubFinalFail");
		}
		else if ((admin_FinalRetakeTillPass) && (admin_FinalRetakeCounter >= admin_FinalRetakeMaxCount)) //reset quiz to the begining and allow retake don't post til scorm
		{
			admin_FinalRetakeCounter = 0;
			ResetExamToBegining = true;
			ResetExamRetakeExamDirectly = false;
			ShowFinalIntro = true;

			ResetInteractionIDOnExamRetake();

			ModuleScoreNode = $(FinalXML).find("SubFinalResetFail");
		}
		else //fail the course close the window
		{
			CourseFailureCloseCourse = true;
			if (admin_UseScorm12) {
				SetLessonPassed(ScorePercentage, false);
			}
			if (admin_UseScorm2004) {
				SetLessonPassed_2004(ScorePercentage, false);
			}

			ModuleScoreNode = $(FinalXML).find("FinalFullFail");
		}
	}
	else {
		ShowFinalIntro = true;

		if (admin_UseScorm12) SetLessonPassed(ScorePercentage, true);
		if (admin_UseScorm2004) SetLessonPassed_2004(ScorePercentage, true);

		//if last page is exam then post the course passed too, else this will be posted from course-engine directly
		if (selectedPageID == ModulePageArray.length - 1) {
			if (admin_UseScorm12) SetScormCoursePassed();
			if (admin_UseScorm2004) SetScormCoursePassed_2004();
		}

		ModuleScoreNode = $(FinalXML).find("FinalPass");
	}

	if (admin_ShowFinalScoreDialog) {
        ModuleScoreResultX = ModuleScoreNode.text();
        ModuleScoreResultX = ModuleScoreResultX.replace("#UserScore", TotalUserScore);
        ModuleScoreResultX = ModuleScoreResultX.replace("#MaxScore", FinalExamGroupMaxQuestions);
        ModuleScoreResultX = ModuleScoreResultX.replace("#PassingPercentage", admin_FinalPassingPercentage);
        ModuleScoreResultX = ModuleScoreResultX.replace("#UserPercentage", ScorePercentage);

        ModuleScoreResultX = ModuleScoreResultX.replace("#MaxAtempt", admin_FinalRetakeMaxCount);
        ModuleScoreResultX = ModuleScoreResultX.replace("#AtemptsLeft", admin_FinalRetakeMaxCount - admin_FinalRetakeCounter);
        ModuleScoreResultX = ModuleScoreResultX.replace("#SectionQuestionCount", FinalExamGroupMaxQuestions);
        ModuleScoreResultX = ModuleScoreResultX.replace("#TotalQuestionCount", FinalExamGroupMaxQuestions);

        $("#FreeFormDialogCloseButton").off('click');
        $("#FreeFormDialogDiv").css({"top": ModuleScoreNode.attr("Top") + "px", "left": ModuleScoreNode.attr("Left") + "px"});
        $("#FreeFormDialogDiv").hide();
        $("#FreeFormDialogDiv").html(ModuleScoreResultX).promise().done(function () {
            $("#FreeFormDialogCloseButton").on('click', function () {
                CloseFinalScoreDialog();
                return false;
            });
            $("#FreeFormDialogCloseButton").attr('tabindex', "0");
            $("#FreeFormDialogDiv").fadeIn(250);
        });

        $("#FadeOutBackgroundDiv").fadeIn(250);
        LoadAndPlayAudioOne(ModuleScoreNode.attr("AudioFile"), true);
    } else
    {
        CloseFinalScoreDialog();
    }
}

//------------------------------------------------------------------------------------------------------------------
function CloseQuestionAnswerDialog(UserChoice) {
	$("#FadeOutBackgroundDiv").fadeOut(250);
	$("#FreeFormDialogDiv").fadeOut(250);

	PauseAudioOne(false,true);

	//if user clicked without selecting just go back to the question
	if (UserChoice != "") {
		//if last question check results, if it is the last question group then post to scorm as well
		if (FinalExamCurrentActiveQuestion == FinalExamGroupMaxQuestions-1) {
			ShowFinalScore();
		}
		else {
			ForwardClick();
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function AnswerCheckFinalExam() {
	var Results1 = "";
	if (FinalExamAnswerCache[FinalExamCurrentActiveQuestion] == 'N/A') {
		var UserSelectedAnswersString = "";
		//loop the answers build the string to compare with results
		if (FinalExamAnswerType == "checkbox") {
			for (xCounter = 0; xCounter <= FinalExamMaxAnswers; xCounter++) {
				if ($("#FinalExamQuiz_" + FinalExamAnswersArrayOrdered[xCounter]).is(':checked')) {
					if (Results1 != "") {
						Results1 += ",";
					}
					Results1 += FinalExamAnswersArrayOrdered[xCounter];

					if (UserSelectedAnswersString != "") {
						UserSelectedAnswersString += ",";
					}
					UserSelectedAnswersString += (xCounter + 1).toString();
				}
			}
		}
		else if (FinalExamAnswerType == "radio") {
			if ($('input[name=FinalExamQuizAnswer]:checked').val() != null) {
				Results1 = $('input[name=FinalExamQuizAnswer]:checked').val();

				UserSelectedAnswersString = $('input[name=FinalExamQuizAnswer]:checked').val();
			}
		}

		//search the rules for correct answer
		AnswerResult = "";
		var AnswerResultNode;
		FinalExamRules.find("Rule").each(function () {
		//	console.log($(this).attr("AnswerID") + ", == " + Results1 + ",");
			if ($(this).attr("AnswerID") + "," == Results1 + ",") {
				AnswerResult = $(this).text();
				AnswerResultNode = $(this);

				//if correct then set boolean to true to save to cache
				if ($(this).attr("Correct") == "yes") {
					FinalExamRightAnswer = true;
				}
			}
		});

		//find the * answer generic wrong result
		if (AnswerResult == "") {
			FinalExamRules.find("Rule").each(function () {
				if ($(this).attr("AnswerID") == "*") {
					AnswerResult = $(this).text();
					AnswerResultNode = $(this);
				}
			});
		}

		var AnswerResultNoReplace = AnswerResult;
		//replace *** in Answer Result with the correct letter
		//find the correct AnswerID's position in the array
		FinalExamRules.find("Rule").each(function () {
			if ($(this).attr("Correct") == "yes") {

				var CorrectLettersText = "";

				var xSplitAnswers_temp = $(this).attr("AnswerID");
				var xSplitAnswers = xSplitAnswers_temp.split(",");
				for (var i = 0; i < xSplitAnswers.length; i++) {
					if (CorrectLettersText != "") {CorrectLettersText += " and "; }
					CorrectLettersText += AnswerLetters[FinalExamAnswersArray.indexOf(xSplitAnswers[i])];
				}

				AnswerResult = AnswerResult.replace("***", CorrectLettersText);
				FinalExamScormCorrectAnswerCache[FinalExamCurrentActiveQuestion] = $(this).attr("AnswerID");
			}
		});

		//show free form dialog (can also be targeted text, if DarkenBackground is not set to "yes" the next button will work
		$("#FreeFormDialogCloseButton").off('click');
		$("#FreeFormDialogDiv").css({"top": AnswerResultNode.attr("Top") + "px", "left": AnswerResultNode.attr("Left") + "px"});
		$("#FreeFormDialogDiv").hide();
		$("#FreeFormDialogDiv").html(AnswerResult).promise().done(function () {
			$("#FreeFormDialogCloseButton").on('click', function () {
				CloseQuestionAnswerDialog(Results1);
				return false;
			});
			$("#FreeFormDialogCloseButton").attr('tabindex', "0");
			$("#FreeFormDialogDiv").fadeIn(250);

		});

		if (AnswerResultNode.attr("DarkenBackground") == "yes") {
			$("#FadeOutBackgroundDiv").fadeIn(250);
		}
		LoadAndPlayAudioOne(AnswerResultNode.attr("AudioFile"),true);

		//disable the form and submit button if an answer has been choosen also set the cache also enable the next button
		if (Results1 != "") {
			FinalExamAnswerCache[FinalExamCurrentActiveQuestion] = Results1;
			FinalExamScormUserAnswerCache[FinalExamCurrentActiveQuestion] = UserSelectedAnswersString;

			$('input.graphically').attr('disabled', true);
			$('input.graphically').attr('disabled', true);

			$("#AnswerBtn" + FinalExamCurrentActiveQuestion).addClass("disabled");

			//save right/wrong answer
			FinalExamAnswerRightCache[FinalExamCurrentActiveQuestion] = FinalExamRightAnswer;

			//unlock next button
			$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
		}

		//post question to scorm directly after answer
		if (admin_UseScorm12) {
			UpdateBookmark(selectedModuleID, selectedPageID + "-0", selectedPageID);
		}
		if (admin_UseScorm2004) {
			UpdateBookmark_2004(selectedModuleID, selectedPageID + "-0", selectedPageID);
		}

		if ((admin_FinalExamPostQuestionsScorm == true) && (UserSelectedAnswersString!=="")) {
			if (admin_UseScorm12) {
				AddScormQuizAnswer(FinalExamScormQuestionIDCache[FinalExamCurrentActiveQuestion], FinalExamScormQuestionCache[FinalExamCurrentActiveQuestion], FinalExamScormAnswersCache[FinalExamCurrentActiveQuestion], FinalExamScormCorrectAnswerCache[FinalExamCurrentActiveQuestion], FinalExamScormUserAnswerCache[FinalExamCurrentActiveQuestion], FinalExamAnswerRightCache[FinalExamCurrentActiveQuestion]);
			}
			if (admin_UseScorm2004) {
				AddScormQuizAnswer_2004(FinalExamScormQuestionIDCache[FinalExamCurrentActiveQuestion], FinalExamScormQuestionCache[FinalExamCurrentActiveQuestion], FinalExamScormAnswersCache[FinalExamCurrentActiveQuestion], FinalExamScormCorrectAnswerCache[FinalExamCurrentActiveQuestion], FinalExamScormUserAnswerCache[FinalExamCurrentActiveQuestion], FinalExamAnswerRightCache[FinalExamCurrentActiveQuestion]);
			}
		}
	}
}


//------------------------------------------------------------------------------------------------------------------
function SetupFinalExam(QuestionGroup) {
	CurrentQuestionGroup = QuestionGroup;
	var FinalRoot = $(FinalXML).find("Final").find("QuestionGroup[Name='" + QuestionGroup + "']");

	//find first question of group real position and exam postion
	FinalExamCurrentActiveQuestion = -1;
	nCount = 0;
	while ((FinalExamCurrentActiveQuestion == -1) && (nCount < FinalExamQArray.length-1)) {
		if (FinalExamQArray[nCount].group == QuestionGroup) {
			FinalExamCurrentActiveQuestion = nCount;
		}
		nCount++;
	}

	//console.log("first quesiton in qroup: "+FinalExamCurrentActiveQuestion+" "+QuestionGroup);

	$("#ajax-loading-graph").hide();
	$("#template-place").html(TemplateArray[CurrentTemplateID]);

	BackgroundAudio = FinalRoot.attr("BackgroundAudioFile");
	LoadAndPlayAudioBackground(BackgroundAudio,true);


	$("#FadeOutBackgroundDiv").removeClass().addClass("InteractiveFadeoutStyle");
	$("#FadeOutBackgroundDiv").css({
        "top": (!isMobile) ? "5px" : "0px !important;",
        "left": (!isMobile) ? "5px" : "0px !important;",
        "width": (!isMobile) ? ($("#skin-container").width() - 10) + "px" : $("#template-place").width() + "px",
        "height": (!isMobile) ? ($("#skin-container").height() - 15) + "px" : $("#template-place").height() + "px",
		"border-radius": "5px"
	});

	//if has intro dialog then show it
	if ((FinalRoot.find("Intro").text().length > 0) && (ShowFinalIntro)) {
		$("#FreeFormDialogCloseButton").off('click');
		$("#FreeFormDialogDiv").css({"top": FinalRoot.find("Intro").attr("Top") + "px", "left": FinalRoot.find("Intro").attr("Left") + "px"});

		introtext = FinalRoot.find("Intro").text();

		introtext = introtext.replace("#MaxAtempt", admin_FinalRetakeMaxCount);
		introtext = introtext.replace("#AtemptsLeft", admin_FinalRetakeMaxCount - admin_FinalRetakeCounter + 1);
		introtext = introtext.replace("#SectionQuestionCount", FinalExamGroupMaxQuestions);
		introtext = introtext.replace("#TotalQuestionCount", FinalExamGroupMaxQuestions);

		$("#FreeFormDialogDiv").hide();
		$("#FreeFormDialogDiv").html(introtext).promise().done(function () {
			$("#FreeFormDialogCloseButton").on('click', function () {
				CloseIntroDialogFinalExam();
				return false;
			});
			$("#FreeFormDialogCloseButton").attr('tabindex', "0");
			$("#FreeFormDialogDiv").fadeIn(250);
		});

		$("#FadeOutBackgroundDiv").fadeIn(250);

		IntroBoxAudio = FinalRoot.find("Intro").attr("AudioFile");
		LoadAndPlayAudioOne(IntroBoxAudio,true);
	}
	else {
		DrawFinalExamQuiz(FinalExamCurrentActiveQuestion);
	}
	ShowFinalIntro = true;
}

//------------------------------------------------------------------------------------------------------------------
function DrawFinalExamQuiz(questionNo) {
	if (typeof FinalExamAnswerCache[questionNo] != 'undefined') {
	}
	else {
		FinalExamAnswerCache[questionNo] = "N/A";
	}

	var FinalQuestion = $(FinalXML).find("Final").find("QuestionGroup[Name='" + FinalExamQArray[questionNo].group + "']").find("Question:eq(" + FinalExamQArray[questionNo].groupPosition + ")");
	var FinalQuestionText = FinalQuestion.find("QuestionText");


	$("#template-place").html(TemplateArray[CurrentTemplateID]);

	FinalQuestion.find("Element").each(function () {
		elementtext = $(this).text();
		elementtext = elementtext.replace("#CurrentGroupQ", (questionNo + 1));
		elementtext = elementtext.replace("#CurrentGroupTotal", FinalExamGroupMaxQuestions);

		$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;'>" + elementtext + "</div>");
	});

	//disable next button and play audio for unanswered questions
	if ((FinalExamAnswerCache[questionNo] == 'N/A') && (!admin_ReviewMode)) {
		$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
	}

	LoadAndPlayAudioOne(FinalQuestionText.attr("AudioFile"),true);

	$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + FinalQuestionText.attr("Top") + "px; left:" + FinalQuestionText.attr("Left") + "px; width:" + FinalQuestionText.attr("Width") + "px; height:" + FinalQuestionText.attr("Height") + "px;'>" + FinalQuestionText.text() + "</div>");

	//load randomize and draw page answers
	FinalExamAnswerType = FinalQuestion.find("Answers").attr("Type").toLowerCase();

	FinalExamAnswerLeft = parseInt(FinalQuestion.find("Answers").attr("Left"), 10);
	FinalExamAnswerTop = parseInt(FinalQuestion.find("Answers").attr("Top"), 10);
	FinalExamAnswerWidth = parseInt(FinalQuestion.find("Answers").attr("Width"), 10);
	FinalExamAnswerSpacing = parseInt(FinalQuestion.find("Answers").attr("Spacing"), 10);

	FinalExamAnswersArray = [];
	FinalExamAnswersArrayOrdered = [];
	FinalExamAnswersArrayOrderedAnswerTexts = [];
	FinalExamMaxAnswers = -1;
	FinalExamRightAnswer = false;
	FinalExamRules = FinalQuestion.find("Rules");

	FinalExamScormAnswersCache[questionNo] = "";

	FinalQuestion.find("Answers").find("Answer").each(function () {
		FinalExamMaxAnswers++;
		FinalExamAnswersArray[FinalExamMaxAnswers] = $(this).attr("AnswerID");
		FinalExamAnswersArrayOrdered[FinalExamMaxAnswers] = $(this).attr("AnswerID");
		FinalExamAnswersArrayOrderedAnswerTexts[FinalExamMaxAnswers] = $(this).text();

		//update array for scorm data
		if (FinalExamScormAnswersCache[questionNo] != "") {
			FinalExamScormAnswersCache[questionNo] += ", ";
		}
		FinalExamScormAnswersCache[questionNo] += $(this).text();
	});

	//randomize questions if Randomize attribute is yes
	if (FinalQuestion.find("Answers").attr("Randomize") == "yes") {
		fisherYates2(FinalExamAnswersArray);
	}

	Answers = "<table border=0 cellspacing=0 cellpadding=2>";
	tabIndexC = 0;

	//update array for scorm data
	FinalExamScormQuestionCache[questionNo] = FinalQuestionText.text();

  if (typeof FinalQuestionText.attr("QuestionID") !== typeof undefined && FinalQuestionText.attr("QuestionID") !== false) {
    FinalExamScormQuestionIDCache[questionNo] = FinalQuestionText.attr("QuestionID");
    if (FinalExamScormQuestionIDCache[questionNo]=="") {
      FinalExamScormQuestionIDCache[questionNo] = questionNo;
    }
  } else {
    FinalExamScormQuestionIDCache[questionNo] = questionNo;
  }

	for (xCounter = 0; xCounter <= FinalExamMaxAnswers; xCounter++) {
		FinalQuestion.find("Answers").find("Answer").each(function () {
			if ($(this).attr("AnswerID") == FinalExamAnswersArray[xCounter]) {
				var CheckCorrectAnswer = "";
				//console.log(FinalExamAnswerCache[questionNo]+" "+$(this).attr("AnswerID"));
				if (FinalExamAnswerCache[questionNo].indexOf($(this).attr("AnswerID")) !== -1) {
					CheckCorrectAnswer = " checked ";
				}

				tabIndexC++;

				if (FinalExamAnswerType == "radio") {
					AnswerTextWithLetter = $(this).text();
					AnswerTextWithLetter = AnswerTextWithLetter.replace("***", AnswerLetters[tabIndexC - 1]);

					Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + FinalExamAnswerSpacing + "px;\"><input type='radio' name='FinalExamQuizAnswer' value='" + $(this).attr("AnswerID") + "' class='graphically' id='FinalExamQuiz_" + $(this).attr("AnswerID") + "' " + CheckCorrectAnswer + "><label tabindex='" + tabIndexC + "' class='graphically' for='FinalExamQuiz_" + $(this).attr("AnswerID") + "'></label></td><td><label tabindex='" + tabIndexC + "' style='display:block; cursor:pointer;' for='FinalExamQuiz_" + $(this).attr("AnswerID") + "'>" + AnswerTextWithLetter + "</label></td></tr>";
				}
				else if (FinalExamAnswerType == "checkbox") {
					AnswerTextWithLetter = $(this).text();
					AnswerTextWithLetter = AnswerTextWithLetter.replace("***", AnswerLetters[tabIndexC - 1]);

					Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + FinalExamAnswerSpacing + "px;\"><input type='checkbox'  class='graphically' id='FinalExamQuiz_" + $(this).attr("AnswerID") + "' " + CheckCorrectAnswer + "><label tabindex='" + tabIndexC + "'  class='graphically' for='FinalExamQuiz_" + $(this).attr("AnswerID") + "'></label></td><td><label tabindex='" + tabIndexC + "'  style='display:block; cursor:pointer;' for='FinalExamQuiz_" + $(this).attr("AnswerID") + "'>" + AnswerTextWithLetter + "</label></td></tr>";
				}
			}
		});
	}

	Answers += "</table>";

	$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + FinalExamAnswerTop + "px; left:" + FinalExamAnswerLeft + "px; width:" + FinalExamAnswerWidth + "px;'>" + Answers + "</div>");

	//add answer button
	var AnswerButtonFinalExam = "<a href='#' onClick='AnswerCheckFinalExam(); return false' id='AnswerBtn" + questionNo + "' style='position:absolute; width:" + FinalQuestion.find("AnswerButton").attr("Width") + "px; top:" + FinalQuestion.find("AnswerButton").attr("Top") + "px; left:" + FinalQuestion.find("AnswerButton").attr("Left") + "px; margin-bottom:5px;' class='" + FinalQuestion.find("AnswerButton").attr("Class") + "' name='btn1' value='" + "'>" + FinalExamSubmitButton + "</a>";

	$("#template-place").append(AnswerButtonFinalExam);

	//if quiz has already been answered fill in right answer and disable the buttons
	if (FinalExamAnswerCache[questionNo] != 'N/A') {
		$('input.graphically').attr('disabled', true);
		$('input.graphically').attr('disabled', true);
		$("#AnswerBtn" + FinalExamCurrentActiveQuestion).addClass("disabled");

		//unlock next button
		$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
	}
}
