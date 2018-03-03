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

var InteractiveAnswersArray = [];
var InteractiveAnswersArrayOrdered = [];
var InteractiveMaxAnswers = -1;
var InteractiveRightAnswer = false;
var InteractiveRightAnswerSpace = "";
var InteractiveRules;

var InteractiveAnswerLeft = 50;
var InteractiveAnswerTop = 50;
var InteractiveAnswerWidth = 400;
var InteractiveAnswerSpacing = 15;

var InteractiveQuizAnswerCache = [];

var CurrentInteractiveQuiz;

var AnswerResultNode;

var InteractiveQuizPageID = "";

//------------------------------------------------------------------------------------------------------------------
function CloseFreeFormOutroDialog() {
	$("#FadeOutBackgroundDiv").fadeOut(250);
	$("#FreeFormDialogDiv").fadeOut(250);

	PauseAudioOne(false,true);

	//go to next window

	BranchingGoToPageID( function (res) {
		if (!res) { UnlockNextPage(true); }
	});
}

//------------------------------------------------------------------------------------------------------------------
function CloseFreeFormIntroDialog() {
	$("#FadeOutBackgroundDiv").fadeOut(250);
	$("#FreeFormDialogDiv").fadeOut(250);

	PauseAudioOne(false,true);
	LoadAndPlayAudioOne(IntroAudio,true);
}

//------------------------------------------------------------------------------------------------------------------
function CloseAnswerFreeFormDialog(CorrectAnswer) {
	$("#FreeFormDialogDiv").fadeOut(250);

	PauseAudioOne(true,true);

	if ((CorrectAnswer) || ((GamifcationContinueOnFirstChoice) && (AnswerResultNode.attr("AnswerID") != "*") && (AnswerResultNode.attr("AnswerID") != ""))) {
		//if has outro dialog then show it, otherwise go to next page
		if (CurrentInteractiveQuiz.find("Outro").text().length > 20) {

			$("#FreeFormDialogCloseButton").off('click');
			$("#FreeFormDialogDiv").css({
				"top": CurrentInteractiveQuiz.find("Intro").attr("Top") + "px",
				"left": CurrentInteractiveQuiz.find("Intro").attr("Left") + "px"
			});

			$("#FreeFormDialogDiv").hide();
			$("#FreeFormDialogDiv").html(CurrentInteractiveQuiz.find("Outro").text()).promise().done(function () {
				$("#FreeFormDialogCloseButton").on('click', function () {
					CloseFreeFormOutroDialog();
					return false;
				});
				$("#FreeFormDialogCloseButton").attr('tabindex', "0");
				$("#FreeFormDialogDiv").fadeIn(250);
			});

			IntroBoxAudio = CurrentInteractiveQuiz.find("Outro").attr("AudioFile");
			LoadAndPlayAudioOne(IntroBoxAudio,true);
		} else {
			//if gamfication score is going to be shown then don't auto advance instead call the gamification code which will auto-advance the lesson when closed by user
			if ((GamificationShowInGameScore) || (GamificationLastQuestion)) {
				GamificationDialog(GamificationLastQuestion)
			} else {
				$("#FadeOutBackgroundDiv").fadeOut(250);

				BranchingGoToPageID( function (res) {
					if (!res) { UnlockNextPage(true); }
				});
			}
		}
	} else {
		$("#FadeOutBackgroundDiv").fadeOut(250);

		//load audio file back
		LoadAndPlayAudioOne(IntroAudio,true);
	}
	return false
}

//------------------------------------------------------------------------------------------------------------------
function AnswerCheckV3() {
	if (InteractiveRightAnswer) {
		$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
	} else {
		Results1 = "";
		//loop the answers build the string to compare with results
		if (InteractiveAnswerType == "checkbox") {
			for (xCounter = 0; xCounter <= InteractiveMaxAnswers; xCounter++) {
				if ($("#InteractiveQuiz_" + InteractiveAnswersArrayOrdered[xCounter]).is(':checked')) {
					if (Results1 != "") {
						Results1 += ",";
					}
					Results1 += InteractiveAnswersArrayOrdered[xCounter];
				}
			}
		} else if (InteractiveAnswerType == "radio") {
			if ($('input[name=InteractiveQuizAnswer]:checked').val() != null) {
				Results1 = $('input[name=InteractiveQuizAnswer]:checked').val();
			}
		}


		//search the rules for correct answer
		AnswerResult = "";
		AnswerResultAudio = "";
		AnswerTop = "100";
		AnswerLeft = "100";


		InteractiveRules.find("Rule").each(function () {
			if (($(this).attr("AnswerID") + "," == Results1 + ",") || (($(this).attr("AnswerID").indexOf("-") == 0) && ($(this).attr("AnswerID").indexOf(Results1) > 0))) {
				AnswerResult = $(this).text();
				AnswerResultAudio = $(this).attr("AudioFile");
				AnswerTop = $(this).attr("Top");
				AnswerLeft = $(this).attr("Left");
				AnswerResultNode = $(this);

				//Gamification
				if ((SearchInArray(GamificationScoreArray, selectedPageID) == -1) || (GamificationScoreArray.length == 0)) {
					if ($(this).attr("Correct") == "yes") {
						GamificationUserScore += GamificationQuestionUserScore;
					} else {
						GamificationComputerScore += GamificationQuestionComputerScore;
					}
					GamificationScoreArray.push(selectedPageID);

					GamificationSuspendData = GamificationComputerScore + "," + GamificationUserScore + ",";
					for (var i = 0; i < GamificationScoreArray.length; i++) {
						GamificationSuspendData += GamificationScoreArray[i] + ",";
					}

				}
				AnswerResult = GamificationStringReplace(AnswerResult);

				//if correct then set the button to close on next click
				if ($(this).attr("Correct") == "yes") {
					InteractiveRightAnswer = true;
					InteractiveQuizAnswerCache[selectedPageID] += $(this).attr("AnswerID") + ",";
					$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
				}
			}
		});

		//find the * answer generic wrong result
		if (AnswerResult == "") {
			InteractiveRules.find("Rule").each(function () {
				if ($(this).attr("AnswerID") == "*") {
					AnswerResult = $(this).text();
					AnswerResultAudio = $(this).attr("AudioFile");
					AnswerTop = $(this).attr("Top");
					AnswerLeft = $(this).attr("Left");
					AnswerResultNode = $(this);

				}
			});
		}

		//if answer has audio play it
		LoadAndPlayAudioOne(AnswerResultAudio,true);

		//pass quiz answer to scrom
		if (admin_PostGamificationToScorm) {
			if (admin_UseScorm12) Scorm_Post_Quiz_Answer(InteractiveQuizPageID, Results1, InteractiveRightAnswer);
			if (admin_UseScorm2004) Scorm2004_Post_Quiz_Answer(InteractiveQuizPageID, Results1, InteractiveRightAnswer);
		}

		if (typeof ModulePageArray[selectedPageID].xID === "undefined") {
		} else {
			var uh_found = false;
			for (var uhi = 0; uhi < UserHistory.length; uhi++) {
				if (UserHistory[uhi].id == ModulePageArray[selectedPageID].xID) {
					uh_found = true;
				}
			}
			if (!uh_found) {
				UserHistory.push({
					t: 'iq', //type = interactive quiz
					id: typeof ModulePageArray[selectedPageID].xID === "undefined" ? "" : ModulePageArray[selectedPageID].xID,
					pid: selectedPageID,
					ca: InteractiveRightAnswer
				});
			}
		}

		//unlock next page if answer is correct
		if (InteractiveRightAnswer) {
			UnlockNextPage(false);
		}

		$("#FreeFormDialogCloseButton").off('click');
		$("#FreeFormDialogDiv").css({"top": AnswerTop + "px", "left": AnswerLeft + "px"});

		$("#FreeFormDialogDiv").hide();
		$("#FreeFormDialogDiv").html(AnswerResult).promise().done(function (pageData) {
			$("#FreeFormDialogCloseButton").on('click', function () {
				CloseAnswerFreeFormDialog(InteractiveRightAnswer);
				return false;
			});

			AddContinueButtonDelayActivity("Rule", pageData);

			$("#FreeFormDialogCloseButton").attr('tabindex', "10");
			$("#FreeFormDialogDiv").fadeIn(250);
		}(AnswerResultNode));

		if (AnswerResultNode.attr("DarkenBackground") == "yes") {
			$("#FadeOutBackgroundDiv").fadeIn(250);
		}
	}
}


//------------------------------------------------------------------------------------------------------------------
function fisherYates2(myArray) {
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
function DrawInteractiveQuiz() {
	if (typeof InteractiveQuizAnswerCache[selectedPageID] != 'undefined') {
	} else {
		InteractiveQuizAnswerCache[selectedPageID] = "N/A";
	}

	//if next chapter is grayed and not in review mode disable next button
	var DisableNextButton = false;
	if (selectedPageID < ModulePageArray.length-1) {
		if ((ModulePageArray[selectedPageID + 1].xViewable != 1) && (ModulePageArray[selectedPageID + 1].xName.charAt(0) != "M")) {
			DisableNextButton = true;
		}
		if ((ModulePageArray[selectedPageID + 2].xViewable != 1) && (ModulePageArray[selectedPageID + 1].xName.charAt(0) == "M")) {
			DisableNextButton = true;
		}
	}
	if (admin_ReviewMode) {
		DisableNextButton = false;
	}
	if (DisableNextButton) {
		$("#forward-button").removeClass("forward-button-style").addClass("forward-button-style-offline");
	}

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

						CurrentInteractiveQuiz = $(this);

						IntroAudio = $(this).attr("AudioFile");

						InteractiveQuizPageID = $(this).attr("QuestionID");

						GamifcationContinueOnFirstChoice = false;
						GamifcationContinueOnFirstChoice = $(this).attr("GamifcationContinueOnFirstChoice");
						if (typeof GamifcationContinueOnFirstChoice == "undefined") {
							GamifcationContinueOnFirstChoice = false;
						}

						GamificationQuestionUserScore = $(this).attr("GamifictionUser");
						if (typeof GamificationQuestionUserScore == "undefined") {
							GamificationQuestionUserScore = 0;
						} else {
							GamificationQuestionUserScore = parseInt(GamificationQuestionUserScore, 10)
						}
						;
						GamificationQuestionComputerScore = $(this).attr("GamifictionComputer");
						if (typeof GamificationQuestionComputerScore == "undefined") {
							GamificationQuestionComputerScore = 0;
						} else {
							GamificationQuestionComputerScore = parseInt(GamificationQuestionComputerScore, 10)
						}
						;

						GamificationShowInGameScore = $(this).attr("GamificationShowInGameScore");
						if (typeof GamificationShowInGameScore == "undefined") {
							GamificationShowInGameScore = false;
						} else {
							GamificationShowInGameScore = true;
						}
						;

						GamificationLastQuestion = $(this).attr("GamificationLastQuestion");
						if (typeof GamificationLastQuestion == "undefined") {
							GamificationLastQuestion = false;
						} else {
							GamificationLastQuestion = true;
						}
						;


						BackgroundAudio = $(this).attr("BackgroundAudioFile");
						LoadAndPlayAudioBackground(BackgroundAudio,true);

						//draw page elements
						ThePageElements = $(this).find("Elements");
						ThePageElements.find("Element").each(function () {

							$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;'>" + $(this).text() + "</div>");
						});

						//load randomize and draw page answers
						InteractiveAnswerType = $(this).find("Answers").attr("Type").toLowerCase();

						InteractiveAnswerLeft = parseInt($(this).find("Answers").attr("Left"), 10);
						InteractiveAnswerTop = parseInt($(this).find("Answers").attr("Top"), 10);
						InteractiveAnswerWidth = parseInt($(this).find("Answers").attr("Width"), 10);
						InteractiveAnswerSpacing = parseInt($(this).find("Answers").attr("Spacing"), 10);

						InteractiveAnswersArray = [];
						InteractiveAnswersArrayOrdered = [];
						InteractiveMaxAnswers = -1;
						InteractiveRightAnswer = false;
						InteractiveRules = $(this).find("Rules");

						$(this).find("Answers").find("Answer").each(function () {
							InteractiveMaxAnswers++;
							InteractiveAnswersArray[InteractiveMaxAnswers] = $(this).attr("AnswerID");
							InteractiveAnswersArrayOrdered[InteractiveMaxAnswers] = $(this).attr("AnswerID");
						});

						//randomize questions if Randomize attribute is yes
						if ($(this).find("Answers").attr("Randomize") == "yes") {
							fisherYates2(InteractiveAnswersArray);
						}

						Answers = "<table border=0 cellspacing=0 cellpadding=2>";
						tabIndexC = 0;

						for (xCounter = 0; xCounter <= InteractiveMaxAnswers; xCounter++) {
							$(this).find("Answers").find("Answer").each(function () {
								if ($(this).attr("AnswerID") == InteractiveAnswersArray[xCounter]) {
									var CheckCorrectAnswer = "";
									if (InteractiveQuizAnswerCache[selectedPageID].indexOf($(this).attr("AnswerID")) !== -1) {
										CheckCorrectAnswer = " checked ";
									}

									tabIndexC++;
									if (InteractiveAnswerType == "radio") {
										Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + InteractiveAnswerSpacing + "px;\"><input type='radio' name='InteractiveQuizAnswer' value='" + $(this).attr("AnswerID") + "' class='graphically' id='InteractiveQuiz_" + $(this).attr("AnswerID") + "' " + CheckCorrectAnswer + "><label tabindex='" + tabIndexC + "' class='graphically' for='InteractiveQuiz_" + $(this).attr("AnswerID") + "'></label></td><td><label tabindex='" + tabIndexC + "' style='display:block; cursor:pointer;' for='InteractiveQuiz_" + $(this).attr("AnswerID") + "'>" + $(this).text() + "</label></td></tr>";
									} else if (InteractiveAnswerType == "checkbox") {
										Answers += "<tr><td valign=top style='padding-top:6px'><span style=\"display:block; margin-bottom:" + InteractiveAnswerSpacing + "px;\"><input type='checkbox'  class='graphically' id='InteractiveQuiz_" + $(this).attr("AnswerID") + "' " + CheckCorrectAnswer + "><label tabindex='" + tabIndexC + "' class='graphically' for='InteractiveQuiz_" + $(this).attr("AnswerID") + "'></label></td><td><label tabindex='" + tabIndexC + "' style='display:block; cursor:pointer;' for='InteractiveQuiz_" + $(this).attr("AnswerID") + "'>" + $(this).text() + "</label></td></tr>";
									}
								}
							});
						}
						Answers += "</table>";

						$("#template-place").append("<div style='padding:0px; overflow:hidden; position:absolute; top:" + InteractiveAnswerTop + "px; left:" + InteractiveAnswerLeft + "px; width:" + InteractiveAnswerWidth + "px;'>" + Answers + "</div>");

						//add answer button
						var AnswerButtonV3 = "<a href='#' onClick='AnswerCheckV3(); return false' id='AnswerBtn" + selectedPageID + "' style='text-align:center; position:absolute; width:" + $(this).find("AnswerButton").attr("Width") + "px; top:" + $(this).find("AnswerButton").attr("Top") + "px; left:" + $(this).find("AnswerButton").attr("Left") + "px; margin-bottom:5px;' class='" + $(this).find("AnswerButton").attr("Class") + "' name='btn1' value='" + $(this).find("AnswerButton").attr("Text") + "'>" + $(this).find("AnswerButton").attr("Text") + InteractiveQuizSubmitButton + "</a>";

						$("#template-place").append(AnswerButtonV3).promise().done(function(pageData) {
							if (pageData.find("Intro").text().length <= 0) {
								AddContinueButtonDelayActivity("Answers", pageData);
							}
						}($(this)));

						//if has intro dialog then show it, otherwise play the audio
						if ($(this).find("Intro").text().length > 0) {

							$("#FreeFormDialogCloseButton").off('click');
							$("#FreeFormDialogDiv").css({"top": $(this).find("Intro").attr("Top") + "px", "left": $(this).find("Intro").attr("Left") + "px"});

							$("#FreeFormDialogDiv").hide();
							$("#FreeFormDialogDiv").html($(this).find("Intro").text()).promise().done(function (pageData) {
								$("#FreeFormDialogCloseButton").on('click', function () {
									CloseFreeFormIntroDialog();
									return false;
								});

								AddContinueButtonDelayActivity("IntroAndAnswers", pageData);

								$("#FreeFormDialogCloseButton").attr('tabindex', "0");
								$("#FreeFormDialogDiv").fadeIn(250);
							}($(this)));

							$("#FadeOutBackgroundDiv").fadeIn(250);

							IntroBoxAudio = $(this).find("Intro").attr("AudioFile");
							LoadAndPlayAudioOne(IntroBoxAudio,true);
						} else {
							//play intro audio directly of intro dialog
							LoadAndPlayAudioOne(IntroAudio,true);
						}
					}
				});
			}
		});
	});
}

//------------------------------------------------------------------------------------------------------------------
function AddContinueButtonDelayActivity(buttonType, pageData) {
	if (pageData.attr('ContinueButtonActiveDelay') == undefined) return;

	var ContinueButtonID = null,
		ContinueButtonActiveDelay = null,
		ContinueButtonDisabledClass = null,
		ContinueButtonBlinkClass = null;

	switch (buttonType) {
		case 'Answers':
			ContinueButtonID = "AnswerBtn" + selectedPageID;
			ContinueButtonActiveDelay = parseInt(pageData.attr('ContinueButtonActiveDelay'), 10) || null;
			ContinueButtonDisabledClass = pageData.attr('ContinueButtonDisabledClass') || null;
			ContinueButtonBlinkClass = pageData.attr('ContinueButtonBlinkClass') || null;
			break;
		case 'Rule':
			ContinueButtonID = "FreeFormDialogCloseButton";
			ContinueButtonActiveDelay = parseInt(pageData.attr('ContinueButtonActiveDelay'), 10) || null;
			ContinueButtonDisabledClass = pageData.attr('ContinueButtonDisabledClass') || null;
			ContinueButtonBlinkClass = pageData.attr('ContinueButtonBlinkClass') || null;
			break;
		case 'IntroAndAnswers':
			ContinueButtonID = "FreeFormDialogCloseButton";
			ContinueButtonActiveDelay = parseInt(pageData.find("Intro").attr('ContinueButtonActiveDelay'), 10) || null;
			ContinueButtonDisabledClass = pageData.attr('ContinueButtonDisabledClass') || null;
			ContinueButtonBlinkClass = pageData.attr('ContinueButtonBlinkClass') || null;
			break;
		default:
			return;
	}

	console.log(ContinueButtonID, ContinueButtonActiveDelay, ContinueButtonBlinkClass, ContinueButtonDisabledClass);

	var $element = $('#' + ContinueButtonID);
	if (ContinueButtonDisabledClass != null) $element.addClass(ContinueButtonDisabledClass);
	setTimeout(function() {
		if (ContinueButtonDisabledClass != null) $element.removeClass(ContinueButtonDisabledClass);
		if (ContinueButtonBlinkClass != "") $element.addClass(ContinueButtonBlinkClass);
	}, ContinueButtonActiveDelay);

	if (buttonType !== "IntroAndAnswers") return;

	var ContinueButtonID2 = "AnswerBtn" + selectedPageID,
	ContinueButtonActiveDelay2 = parseInt(pageData.attr('ContinueButtonActiveDelay'), 10) || null,
	ContinueButtonDisabledClass2 = pageData.attr('ContinueButtonDisabledClass') || null,
	ContinueButtonBlinkClass2 = pageData.attr('ContinueButtonBlinkClass') || null;

	console.log(ContinueButtonID2, ContinueButtonActiveDelay2, ContinueButtonBlinkClass2, ContinueButtonDisabledClass2);

	var $element2 = $('#' + ContinueButtonID2);
	if (ContinueButtonDisabledClass2 != null) $element2.addClass(ContinueButtonDisabledClass2)
	$element.on('click', function() {
		setTimeout(function() {
			$element2.removeClass(ContinueButtonDisabledClass2);
			if (ContinueButtonBlinkClass2 != "") $element2.addClass(ContinueButtonBlinkClass2);
		}, ContinueButtonActiveDelay2);
	});
}