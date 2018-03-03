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

var SlidePageTextArray = [];
var SlidePageTextArrayTime = [];
var SlidePageTextArrayTop = [];
var SlidePageTextArrayLeft = [];
var SlidePageTextArrayWidth = [];
var SlidePageTextArrayHeight = [];
var MaxSlidePageTextCount = 0;
var CurrentSlideTextFrame = 0;
var CurrentSlidePosition = 0;

//------------------------------------------------------------------------------------------------------------------
function UpdateSlideTextArea(ForceUpdate) {
	if ((isPlay == 1) || (ForceUpdate == 1)) {
		for (xCounter = 1; xCounter <= MaxSlidePageTextCount; xCounter++) {
			//load text into target
			if (((xCounter < MaxSlidePageTextCount) && (CurrentSlideTextFrame != xCounter) && (CurrentSlidePosition >= SlidePageTextArrayTime[xCounter]) && (CurrentSlidePosition < SlidePageTextArrayTime[xCounter + 1])) || ((xCounter == MaxSlidePageTextCount) && (CurrentSlideTextFrame != xCounter) && (CurrentSlidePosition >= SlidePageTextArrayTime[xCounter]))) {
				CurrentSlideTextFrame = xCounter;

				xTop1 = "top:" + SlidePageTextArrayTop[CurrentSlideTextFrame] + "px; ";
				xLeft1 = "left:" + SlidePageTextArrayLeft[CurrentSlideTextFrame] + "px; ";
				xWidth1 = "width:" + SlidePageTextArrayWidth[CurrentSlideTextFrame] + "px; ";
				if ((SlidePageTextArrayWidth[CurrentSlideTextFrame] == "") || (SlidePageTextArrayWidth[CurrentSlideTextFrame] == "undefined") || (SlidePageTextArrayWidth[CurrentSlideTextFrame] == null)) {
					xWidth1 = "";
				}
				xHeight1 = "height:" + SlidePageTextArrayHeight[CurrentSlideTextFrame] + "px; ";
				if ((SlidePageTextArrayHeight[CurrentSlideTextFrame] == "") || (SlidePageTextArrayHeight[CurrentSlideTextFrame] == "undefined") || (SlidePageTextArrayHeight[CurrentSlideTextFrame] == null)) {
					xHeight1 = "";
				}

				$("#template-place").append("<div style='overflow:hidden; position:absolute; " + xTop1 + xLeft1 + xWidth1 + xHeight1 + "'>" + SlidePageTextArray[CurrentSlideTextFrame] + "</div>");
			}
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function DrawAllZeroSlide() {
	for (xCounter = 1; xCounter <= MaxSlidePageTextCount; xCounter++) {
		//load text into target
		if (SlidePageTextArrayTime[xCounter] == 0) {
			xTop1 = "top:" + SlidePageTextArrayTop[xCounter] + "px; ";
			xLeft1 = "left:" + SlidePageTextArrayLeft[xCounter] + "px; ";
			xWidth1 = "width:" + SlidePageTextArrayWidth[xCounter] + "px; ";
			if ((SlidePageTextArrayWidth[xCounter] == "") || (SlidePageTextArrayWidth[xCounter] == "undefined") || (SlidePageTextArrayWidth[xCounter] == null)) {
				xWidth1 = "";
			}
			xHeight1 = "height:" + SlidePageTextArrayHeight[xCounter] + "px; ";
			if ((SlidePageTextArrayHeight[xCounter] == "") || (SlidePageTextArrayHeight[xCounter] == "undefined") || (SlidePageTextArrayHeight[xCounter] == null)) {
				xHeight1 = "";
			}

			$("#template-place").append("<div style='overflow:hidden; position:absolute; " + xTop1 + xLeft1 + xWidth1 + xHeight1 + "'>" + SlidePageTextArray[xCounter] + "</div>");
		}
	}
}

//------------------------------------------------------------------------------------------------------------------
function DrawAllSlide() {
	for (xCounter = 1; xCounter <= MaxSlidePageTextCount; xCounter++) {
		//load texts into target

		CurrentSlideTextFrame = xCounter;

		xTop1 = "top:" + SlidePageTextArrayTop[CurrentSlideTextFrame] + "px; ";
		xLeft1 = "left:" + SlidePageTextArrayLeft[CurrentSlideTextFrame] + "px; ";
		xWidth1 = "width:" + SlidePageTextArrayWidth[CurrentSlideTextFrame] + "px; ";
		if ((SlidePageTextArrayWidth[CurrentSlideTextFrame] == "") || (SlidePageTextArrayWidth[CurrentSlideTextFrame] == "undefined") || (SlidePageTextArrayWidth[CurrentSlideTextFrame] == null)) {
			xWidth1 = "";
		}
		xHeight1 = "height:" + SlidePageTextArrayHeight[CurrentSlideTextFrame] + "px; ";
		if ((SlidePageTextArrayHeight[CurrentSlideTextFrame] == "") || (SlidePageTextArrayHeight[CurrentSlideTextFrame] == "undefined") || (SlidePageTextArrayHeight[CurrentSlideTextFrame] == null)) {
			xHeight1 = "";
		}

		$("#template-place").append("<div style='overflow:hidden; position:absolute; " + xTop1 + xLeft1 + xWidth1 + xHeight1 + "'>" + SlidePageTextArray[CurrentSlideTextFrame] + "</div>");
	}
}


//------------------------------------------------------------------------------------------------------------------
function DrawSlide() {
	$("#ajax-loading-graph").hide();

	if (CourseMode == "Video") {
		$("#jplayer_audio").bind($.jPlayer.event.timeupdate,
			function (event) {
				if (CurrentPageMode == "slide") {
					CurrentSlidePosition = Math.floor(event.jPlayer.status.currentTime);
					UpdateSlideTextArea(0);
				}
			});
	}
	else {
		DrawAllSlide();
	}

	$(CourseXML).find("Modules").each(function () {

		$(CourseXML).find("Module").each(function () {

			if ('M' + $(this).attr("Name") == ModulePageArray[selectedModuleID].xName) {
				$(this).find("Page").each(function () {

					if ('L' + $(this).attr("Name") == ModulePageArray[selectedPageID].xName) {
						ModuleName = $(this).attr("Name");
						$("#template-place").html("");
						$("#template-place").html(TemplateArray[CurrentTemplateID]);

						ThePageElements = $(this).find("Element");

						//Load Page Text Fields into Arrays
						MaxSlidePageTextCount = 0;
						ThePageElements.each(function () {
							MaxSlidePageTextCount++;
							SlidePageTextArray[MaxSlidePageTextCount] = $(this).text();
							xTime = $(this).attr("TimeToShow");
							xTimes = xTime.split(":");

							SlidePageTextArrayTime[MaxSlidePageTextCount] = parseInt(xTimes[0] * 3600, 10) + parseInt(xTimes[1] * 60, 10) + parseInt(xTimes[2], 10);

							SlidePageTextArrayTop[MaxSlidePageTextCount] = $(this).attr("Top");
							SlidePageTextArrayLeft[MaxSlidePageTextCount] = $(this).attr("Left");
							SlidePageTextArrayWidth[MaxSlidePageTextCount] = $(this).attr("Width");
							SlidePageTextArrayHeight[MaxSlidePageTextCount] = $(this).attr("Height");

						});
						CurrentSlideTextFrame = 0;
						CurrentSlidePosition = 0;

						LoadAndPlayAudioOne($(this).attr("AudioFile"), true);

						if (CourseMode == "Video") {
							DrawAllZeroSlide();
						}
						else {
							DrawAllSlide();
						}


					}
				});
			}
		});
	});
}


