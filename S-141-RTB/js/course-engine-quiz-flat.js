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

var FlatRightAnswer = false;
var BranchingRightAnswer = true;

var FlatQuizPageID = "";

//------------------------------------------------------------------------------------------------------------------
function CloseFlatFreeFormIntroDialog() {
	$("#FadeOutBackgroundDiv").fadeOut(250);
	$("#FreeFormDialogDiv").fadeOut(250);

	PauseAudioOne(false,true);
	LoadAndPlayAudioOne(IntroAudio, true);
}

//------------------------------------------------------------------------------------------------------------------
function CloseFlatAnswerFreeFormDialog(CorrectAnswer, BranchingRightAnswer) {
	$("#FreeFormDialogDiv").fadeOut(250);

	PauseAudioOne(true,true);

	if ((CorrectAnswer) || (GamifcationContinueOnFirstChoice)) {
		//if gamfication score is going to be shown then don't auto advance instead call the gamification code which will auto-advance the lesson when closed by user
		if ((GamificationShowInGameScore) || (GamificationLastQuestion)) {
			GamificationDialog(GamificationLastQuestion);
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

		//load audio file back
		LoadAndPlayAudioOne(IntroAudio,true);
	}
	return false
}

//------------------------------------------------------------------------------------------------------------------
function ShowFlatAnswer(AnswerID) {
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
								AnswerResultNode = $(this);


								//if correct then set the button to close on next click
								if ($(this).attr("Correct") == "yes") {
									FlatRightAnswer = true;
									$("#forward-button").addClass("forward-button-style").removeClass("forward-button-style-offline");
								}

								if ($(this).attr("BranchingTrue") == "no") {
									BranchingRightAnswer = false;
								}

								//if answer has audio play it
								LoadAndPlayAudioOne(AnswerResultAudio, true);

								//pass quiz answer to scrom
								if (admin_PostGamificationToScorm) {
									if (admin_UseScorm12) Scorm_Post_Quiz_Answer(FlatQuizPageID, AnswerID, FlatRightAnswer);
									if (admin_UseScorm2004) Scorm2004_Post_Quiz_Answer(FlatQuizPageID, AnswerID, FlatRightAnswer);
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
											ca: BranchingRightAnswer // dont use FlatRightAnswer as in some courses that use javascript in the xml this is always set to true
										});
									}

								}

								//unlock next page if answer is correct
								if (FlatRightAnswer) {
									UnlockNextPage(false);
								}


								$("#FreeFormDialogCloseButton").off('click');

								$("#FreeFormDialogDiv").css({"top": AnswerTop + "px", "left": AnswerLeft + "px"});

								$("#FreeFormDialogDiv").hide();
								$("#FreeFormDialogDiv").html(AnswerResult).promise().done(function () {
									$("#FreeFormDialogCloseButton").on('click', function () {
										CloseFlatAnswerFreeFormDialog(FlatRightAnswer, BranchingRightAnswer);
										return false;
									});
									$("#FreeFormDialogCloseButton").attr('tabindex', "10");
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
function DrawFlatQuiz() {
	FlatRightAnswer = false;
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

						FlatQuizPageID = $(this).attr("QuestionID");


						RightAnswerHeader = $(this).find("RightAnswerHeader").text();
						WrongAnswerHeader = $(this).find("WrongAnswerHeader").text();

						AnswerBox = $(this).find("AnswerBox");
						IntroAudio = $(this).attr("AudioFile");

						BackgroundAudio = $(this).attr("BackgroundAudioFile");
						LoadAndPlayAudioBackground(BackgroundAudio,true);

						//draw page
						ThePageElements = $(this).find("Elements");
						ThePageElements.find("Element").each(function () {
							var AnswerLink = "onClick='return false;' style='cursor:default'";
							if (typeof $(this).attr("AnswerID") === "undefined") {
							}
							else {
								AnswerLink = "onClick='ShowFlatAnswer(" + $(this).attr("AnswerID") + "); return false;'";
							}

							$("#template-place").append("<a href=\"#\"" + AnswerLink + "><div style='padding:10px; overflow:hidden; position:absolute; top:" + $(this).attr("Top") + "px; left:" + $(this).attr("Left") + "px; width:" + $(this).attr("Width") + "px; height:" + $(this).attr("Height") + "px;' class='" + $(this).attr("HoverClass") + "' >" + $(this).text() + "</div></a>");
						});


						//if has intro dialog then show it, otherwise play the audio
						if ($(this).find("Intro").text().length > 0) {

							$("#FreeFormDialogCloseButton").off('click');
							$("#FreeFormDialogDiv").css({"top": $(this).find("Intro").attr("Top") + "px", "left": $(this).find("Intro").attr("Left") + "px"});

							$("#FreeFormDialogDiv").hide();
							$("#FreeFormDialogDiv").html($(this).find("Intro").text()).promise().done(function () {
								$("#FreeFormDialogCloseButton").on('click', function () {
									CloseFlatFreeFormIntroDialog();
									return false;
								});
								$("#FreeFormDialogCloseButton").attr('tabindex', "0");
								$("#FreeFormDialogDiv").fadeIn(250);
							});

							$("#FadeOutBackgroundDiv").fadeIn(250);

							IntroBoxAudio = $(this).find("Intro").attr("AudioFile");
							LoadAndPlayAudioOne(IntroBoxAudio, true);
						}
						else {
							//play intro audio directly of intro dialog
							LoadAndPlayAudioOne(IntroAudio, true);
						}
					}
				});
			}
		});
	});
}
