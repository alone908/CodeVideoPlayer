/*
 * IEngine4
 * IEngine4 Video Engine
 *
 * Copyright (c) Inspired eLearning Inc. 2003-2014.  All Rights Reserved.
 * This source file is proprietary property of Inspired eLearning Inc.
 * http://http://www.inspiredelearning.com/inspired/License
 *
 * @version 4.8.30
 */

//http://scorm.com/scorm-explained/technical-scorm/run-time/run-time-reference/

var _Debug = false;  // set this to false to turn debugging off
var RECORD_INTERACTIONS = true;
var OVERWRITE_QUESTIONS = true;
var RECORD_SCORE = true;
var RETRY_ATTEMPT = 2;
var ERROR_CODE = "0";

var startTime;
var scoTimer;
var exitPageStatus = false;
var bookmarkSupport = true;
var LastBookmark = "";
var LessonMode = "";
var LessonComplete = false;
var InteractionID = 0;
var ScormInitialized = false;
var CourseRetake = false;
var StudentName = "";
var PreExamInteractionId = 0;
var PreExamValues = "PreExam";
var oldRetakeCounter = "";
var baseInteractionIdentifier = "interaction-id-000";

var LatestBookmarkPageID = 0;


if (!(typeof (_Debug) == "undefined") && _Debug === true) {
	WriteToDebug("Showing Interactive Debug Windows");
	ShowDebugWindow();
}
WriteToDebug("----------------------------------------");
WriteToDebug("----------------------------------------");
WriteToDebug("In Start - Version: " + VERSION + "  -- Last Modified=" + window.document.lastModified);
WriteToDebug("Browser Info (" + navigator.appName + " " + navigator.appVersion + ")");
WriteToDebug("URL: " + window.document.location.href);
WriteToDebug("----------------------------------------");
WriteToDebug("----------------------------------------");

function StartCourse(CourseName)
{
	//SuspendData = "5,1,1,10,0,1|5,2,1,10,0,1|5,3,1,10,0,1|5,4,2,0,10,0|6,1,1,0,10,0| 6,2,1,0,10,0|6,3,1,10,0,1|16,1,1,10,0,1|16,2,2,0,10,0|16,3,2,0,10,0|16,4,2,0,10,0|17,1,1,0,10,0| ";
	//LastBookmark = "15-17";
	//alert("admin_ReviewMode = " + admin_ReviewMode);
	//admin_ReviewMode = true;
	WriteToDebug("Calling StartCourse Function");
	WriteToDebug("..Admin_UseSCORM = " + admin_UseScorm);
	if (admin_UseScorm)
	{
		startTime = startTimer();
		
		WriteToDebug("..Calling LMSInitialize");
		ScormInitialized = LMSInitialize();

		if(!ScormInitialized){
			if (LMSIsInitialized()) {
				WriteToDebug("..LMS is already Initialized");
				ScormInitialized = true;
			}
		}
	
		//console.log( "scorm init status: "+ScormInitialized );
		// uncomment bellow line to start in review mode
		// admin_ReviewMode = true;
		WriteToDebug("..LMS Initialized = " + ScormInitialized);
		if (ScormInitialized)
		{
			var status = IsStringNullOrEmpty(LMSGetValue("cmi.core.lesson_status")).toString(); //(“passed�?, “completed�?, “failed�?, “incomplete�?, “browsed�?, “not attempted�?, RW)
			WriteToDebug("..Lesson Status = " + status);
			if (status.toLowerCase() == "completed" || status.toLowerCase() == "passed" || status.toLowerCase() == "failed")
			{
				admin_ReviewMode = true;
				WriteToDebug("..Course will run in REVIEW mode");
			}
			else
			{
				admin_ReviewMode = false;
			}
			var status2 = IsStringNullOrEmpty(LMSGetValue("cmi.core.entry")).toString(); //  (“ab-initio�?, “resume�?, “�?, RO) Asserts whether the learner has previously accessed the SCO
			WriteToDebug("..Cmi.Core.Entry = " + status2);
			if ((status == "not attempted") || (status2 == "ab-initio"))
			{
				// the student is now attempting the lesson
				WriteToDebug("..Setting incomplete status");
				LMSSetValue("cmi.core.lesson_status", "incomplete");
				admin_ReviewMode = false;
			}

			StudentName = IsStringNullOrEmpty(LMSGetValue("cmi.core.student_name")).toString();
			WriteToDebug("..Student Name = " + StudentName);

			//console.log("status: "+ status + " entry: "+ status2 );
			LessonMode = IsStringNullOrEmpty(LMSGetValue("cmi.core.lesson_mode")).toString(); // (“browse�?, “normal�?, “review�?, RO)
			WriteToDebug("..Lesson Mode = " + LessonMode);
			LastBookmark = LMSGetValue("cmi.core.lesson_location");
			WriteToDebug("..Last Bookmark = " + LastBookmark.toString());
			SuspendData = LMSGetValue("cmi.suspend_data");
      SuspendData = unescape(String(SuspendData)); //			SuspendData = String(SuspendData);

//			console.log('read suspend data:');
//			console.log(SuspendData);
			//load quiz retake number from suspendData and delete it, so it wont stack

			var SuspendDataArrayTemp = SuspendData.split('|');

			if (SuspendDataArrayTemp.length >= 1) {
				if (SuspendDataArrayTemp[0] !== "") {
					var TempSuspendData = JSON.parse(SuspendDataArrayTemp[0]);
					SuspendData = SuspendData.substring(SuspendData.indexOf("|") + 1);

					//load quiz retake number

					InteractionID = TempSuspendData['PreExamInteractionID'];

					var retakeCounterStr = TempSuspendData['Retake'];
					admin_FinalRetakeCounter = parseInt(retakeCounterStr, 10);

					GamificationCounterStr = TempSuspendData['Gamification'];
					var GamificationCounterStrSplit1 = GamificationCounterStr.split(",");

					GamificationComputerScore = 0;
					GamificationUserScore = 0;

					if (GamificationCounterStrSplit1.length >= 2) {
						GamificationComputerScore = parseInt(GamificationCounterStrSplit1[0]);
						GamificationUserScore = parseInt(GamificationCounterStrSplit1[1]);

						for (var i = 2; i < GamificationCounterStrSplit1.length; i++) {
							if (GamificationCounterStrSplit1[i] != "") {
								GamificationScoreArray.push(parseInt(GamificationCounterStrSplit1[i]));
							}
						}
					}

					PreExamSkipModules = TempSuspendData['PreExam'];
					if (typeof PreExamSkipModules === 'undefined') {
						PreExamSkipModules = "";
					}

          PreExamSkipModules = TempSuspendData['SkipModule'];
					PreExamScorePercentage = TempSuspendData['PreExamScorePercentage'];


					//WriteToDebug("..Calling GetPreExamValueFromSuspendData function");
					var xTempArray = TempSuspendData['PreExam'];
					//WriteToDebug("....Length = " + xTempArray.length);
					for (i = 0; i < xTempArray.length; i++) {
						if (xTempArray[i].toString().indexOf("PreExam") > -1) {
							//WriteToDebug("....PreExam value found");
							var PreExamArrayTemp = xTempArray[i].split("-");
							if (PreExamArrayTemp.length > 1) {
								PreExamValues = PreExamValues + "-" + PreExamArrayTemp[1] + "-" + PreExamArrayTemp[2];
								PreExamInteractionId = PreExamArrayTemp[1];

								//WriteToDebug("....InteractionID = " + PreExamArrayTemp[1] + " -- Percentage = " + PreExamArrayTemp[2]);
							}
						}
					}

					UserHistory = TempSuspendData['History'];
				}
			}

			WriteToDebug("..Suspend Data = " + SuspendData.toString());

			if (RECORD_INTERACTIONS) {
				WriteToDebug("..RECORD_INTERACTIONS = " + RECORD_INTERACTIONS.toString());
				if (OVERWRITE_QUESTIONS) {
					InteractionID = 0;
				}
				else {
					InteractionID = LMSGetValue("cmi.interactions._count");
				}

				if (admin_HostedOniLMS == true && PreExamEnabled == true)
				{
					InteractionID = PreExamInteractionId;
				}
				else
				{
					InteractionID = LMSGetValue("cmi.interactions._count");
					if(InteractionID == "") InteractionID = 0;
				}
				WriteToDebug("..HostedOniLMS = " + admin_HostedOniLMS + " , PreExamEnabled = " + PreExamEnabled);
				WriteToDebug("..Interaction Count = " + InteractionID);
			}
			//console.log("BookMark: "+ LastBookmark + ", Suspend Data: "+ SuspendData );
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}

function UpdateBookmark(ModuleID, PageID, PageIDInt)
{
	WriteToDebug("Calling UpdateBookmark Function");
	if (ScormInitialized && !admin_ReviewMode)
	{
		if (PageIDInt > LatestBookmarkPageID) {
			LatestBookmarkPageID = PageIDInt;
			//console.log(ModuleID,PageID);
			WriteToDebug("..Setting Bookmark = " + ModuleID + "-" + PageID);
			LMSSetValue("cmi.core.lesson_location", ModuleID + "-" + PageID);

			WriteToDebug("......Calling VerifyData for Bookmark verification");
			var verificationResult = VerifyData("bookmark", ModuleID + "-" + PageID);
			WriteToDebug("......Result of Bookmark Verification = " + verificationResult);
			if (!verificationResult)
				alert(ERROR_CODE + " -- " + lang040);
		}

		//update suspend data with bookmark in case final exam doesnt report each question to scorm
		var TempSuspendData = {'Retake':admin_FinalRetakeCounter, 'Gamification':GamificationSuspendData, 'PreExam':PreExamSkipModules, 'PreExamInteractionID':InteractionID , 'PreExamScorePercentage':PreExamScorePercentage, 'SkipModule':PreExamSkipModules, 'History':UserHistory};

		var TempSuspendString = JSON.stringify(TempSuspendData);

//		console.log('write suspend data:');
//		console.log(TempSuspendString + "|" + SuspendData);

		WriteToDebug("..Setting Suspend Data as = " + TempSuspendString + "|" + SuspendData.toString());
    LMSSetValue("cmi.suspend_data", escape(TempSuspendString + "|" + SuspendData)); // LMSSetValue("cmi.suspend_data", TempSuspendString + "|" + SuspendData);
	}
}

function AddScormQuizAnswer(QuestionID, QuestionText, AnswerTexts, CorrectAnswerText, UserAnswerText, AnswerIsCorrect)
{
	//console.log( QuestionID + " , " + AnswerTexts + " , " + CorrectAnswerText + " , " + UserAnswerText + " , " + AnswerIsCorrect );
	//console.log(SuspendData);
	WriteToDebug("Calling AddScormQuizAnswer Function");
	WriteToDebug("..QuestionId = " + QuestionID);
	WriteToDebug("..QuestionText = " + striphtmlcode(QuestionText));
	WriteToDebug("..AnswerTexts = " + striphtmlcode(AnswerTexts));
	WriteToDebug("..CorrectAnswerText = " + CorrectAnswerText.toString());
	WriteToDebug("..UserAnswerText = " + UserAnswerText);
	WriteToDebug("..AnswerIsCorrect = " + AnswerIsCorrect);
	//this function will be called at the end of the lesson for all quiz questions answered (will only be called together with SetLessonPassed when learner is successful)

	if (ScormInitialized && !admin_ReviewMode)
	{
		/*
		 **
		 *currently this gives error:
		 *[08:32:16.675] LMSSetValue('cmi.interactions.Question_4.id', 'Question 4') returned 'false' in 0.001 seconds
		 *[08:32:16.676] CheckForSetValueError (cmi.interactions.Question_4.id, Question 4, cmi.interactions.Question_n.id, , )
		 *[08:32:16.676] SCORM ERROR FOUND - Set Error State: 201 - The parameter 'cmi.interactions.Question_4.id' is not recognized.
		 *
		 *
		 var QuestionID2 = QuestionID.replace(" ","_");
		 LMSSetValue( "cmi.interactions."+QuestionID2+".id", QuestionID );
		 LMSSetValue( "cmi.interactions."+QuestionID2+".type", "choice" );
		 LMSSetValue( "cmi.interactions."+QuestionID2+".student_response", UserAnswerText );
		 LMSSetValue( "cmi.interactions."+QuestionID2+".correct_responses.1.pattern", CorrectAnswerText );
		 LMSSetValue( "cmi.interactions."+QuestionID2+".result", AnswerIsCorrect );
		 */
		//WriteToDebug("..RECORD_INTERACTIONS = " + RECORD_INTERACTIONS.toString());
		if (RECORD_INTERACTIONS) {
			if (admin_HostedOniLMS) {
				WriteToDebug("..Recording Interaction for ID = " + InteractionID.toString());
				LMSSetValue("cmi.interactions." + InteractionID + ".id", QuestionID.toString());
				LMSSetValue("cmi.interactions." + InteractionID + ".type", "choice");
				LMSSetValue("cmi.interactions." + InteractionID + ".student_response", UserAnswerText.toString());
				LMSSetValue("cmi.interactions." + InteractionID + ".correct_responses.0.pattern", CorrectAnswerText.toString());
				if (AnswerIsCorrect.toString().toLowerCase() == "true")
					AnswerIsCorrect = "correct";
				if (AnswerIsCorrect.toString().toLowerCase() == "false")
					AnswerIsCorrect = "wrong";
				LMSSetValue("cmi.interactions." + InteractionID + ".result", AnswerIsCorrect);
				InteractionID = parseInt(InteractionID) + 1;
			}
			else {
				WriteToDebug("..Recording Interaction for ID = " + InteractionID.toString());
				LMSSetValue("cmi.interactions." + InteractionID + ".id", QuestionText.toString());
				LMSSetValue("cmi.interactions." + InteractionID + ".type", "choice");
				LMSSetValue("cmi.interactions." + InteractionID + ".student_response", UserAnswerText.toString());
				LMSSetValue("cmi.interactions." + InteractionID + ".correct_responses.0.pattern", CorrectAnswerText.toString());
				if (AnswerIsCorrect.toString().toLowerCase() == "true")
					AnswerIsCorrect = "correct";
				if (AnswerIsCorrect.toString().toLowerCase() == "false")
					AnswerIsCorrect = "wrong";
				LMSSetValue("cmi.interactions." + InteractionID + ".result", AnswerIsCorrect);
				InteractionID = parseInt(InteractionID) + 1;
			}
		}
	}
}

function CloseCourse(CourseFailed)
{
	WriteToDebug("Calling CloseCourse Function");
	if (ScormInitialized)
	{
		if (!admin_ReviewMode)
		{
			if (CourseFailed)
			{
				if ((admin_FinalRetakeTillPass) && (admin_FinalRetakeCounter < admin_FinalRetakeMaxCount))
				{
					SetCourseRetake();
				}
			} else
			{
				WriteToDebug("..LessonComplete = " + LessonComplete.toString());
				if (!LessonComplete) {
					LMSSetValue("cmi.core.lesson_status", "incomplete");
				}
				else {
					LMSSetValue("cmi.core.lesson_location", "0");
					if (DISPLAY_CERTIFICATE)
					{
						window.open("certificate.htm?lang=" + CourseLanguage + "&studentname=" + StudentName, "_new", "toolbar=no, menubar=no, status=no, location=no,height=500, width=700");
					}
				}
			}
		}
		else
		{
			if (DISPLAY_CERTIFICATE_FOR_COMPLETED_COURSE)
			{
				window.open("certificate.htm?lang=" + CourseLanguage + "&studentname=" + StudentName, "_new", "toolbar=no, menubar=no, status=no, location=no,height=500, width=700");
			}
		}

		WriteToDebug("..Setting Session Time as = " + endTimer(startTime));
		LMSSetValue("cmi.core.session_time", endTimer(startTime));
		LMSSetValue("cmi.core.exit", "");
		WriteToDebug("..Calling LMSCommit");
		LMSCommit("");
		WriteToDebug("..Calling LMSFinish");
		LMSFinish("");
		self.close();
	} else
	{
		//navigate to urlonExit
		if (admin_URLOnExit != "") {
			try
			{
				window.location.href = admin_URLOnExit;
			}
			catch (e)
			{
				// do nothing
			}
			//window.location.assign("http://www.google.com");
		}
	}
}

function unloadPage()
{
	if (admin_UseScorm2004) {
		unloadPage_2004();
	}
	else
	{
		WriteToDebug("Calling unloadPage Function");
		CloseCourse(false);
	}
}

function SetLessonPassed(ScorePercentage, HasPassedQuiz)
{
	//console.log(ScorePercentage+" "+HasPassedQuiz+" "+ScormInitialized);
	//this function will be called at the end of the lesson after the learner is successful with the quiz)
	WriteToDebug("Calling SetLessonPassed Function");
	WriteToDebug("..ScorePercentage = " + ScorePercentage.toString());
	WriteToDebug("..HasPassedQuiz = " + HasPassedQuiz.toString());
	if (ScormInitialized && !admin_ReviewMode)
	{
		if(RECORD_SCORE){
			LMSSetValue("cmi.core.score.min", "0");
			LMSSetValue("cmi.core.score.max", "100");
			WriteToDebug("..Setting Score");
			LMSSetValue("cmi.core.score.raw", ScorePercentage.toString());

			WriteToDebug("......Calling VerifyData for Score verification");
			var verificationResult = VerifyData("score", ScorePercentage.toString());
			WriteToDebug("......Result of Score Verification = " + verificationResult);
			if (!verificationResult)
				alert(ERROR_CODE + " -- " + lang041);
		}
		
		LMSSetValue("cmi.core.lesson_location", "0");
		LessonComplete = true;

		if (HasPassedQuiz)
		{
			WriteToDebug("..Setting Lesson Status as Passed");
			LMSSetValue("cmi.core.lesson_status", "passed");

			WriteToDebug("......Calling VerifyData for Status verification");
			var verificationResult = VerifyData("status", "passed");
			WriteToDebug("......Result of Status Verification = " + verificationResult);
			if (!verificationResult)
				alert(ERROR_CODE + " -- " + lang042);

		}
		else
		{
			WriteToDebug("..Setting Lesson Status as failed");
			LMSSetValue("cmi.core.lesson_status", "failed");

			WriteToDebug("......Calling VerifyData for Status verification");
			var verificationResult = VerifyData("status", "failed");
			WriteToDebug("......Result of Status Verification = " + verificationResult);
			if (!verificationResult)
				alert(ERROR_CODE + " -- " + lang042);
		}
	}
}

function SetScormCoursePassed()
{
	//console.log(ScorePercentage+" "+HasPassedQuiz+" "+ScormInitialized);
	//this function will be called at the end of the lesson after the learner is successful with the quiz)
	WriteToDebug("Calling SetLessonPassed Function");
	if (ScormInitialized && !admin_ReviewMode)
	{
		LessonComplete = true;

		LMSSetValue("cmi.core.lesson_location", "0");

		WriteToDebug("..Setting Lesson Status as completed");
		LMSSetValue("cmi.core.lesson_status", "completed");

		WriteToDebug("......Calling VerifyData for Status verification");
		verificationResult = VerifyData("status", "completed");
		WriteToDebug("......Result of Status Verification = " + verificationResult);
		if (!verificationResult)
			alert(ERROR_CODE + " -- " + lang042);
	}
}

function VerifyData(dataElement, valueFromCourse)
{
	WriteToDebug("........In VerifyData for = " + dataElement);
	var result = true;
	var _155;
	if (dataElement.toLowerCase() == "bookmark") {
		_155 = LMSGetValue("cmi.core.lesson_location");
		_155 = _155 + '';
		if (_155 != valueFromCourse) {
			WriteToDebug("........value is not matching from LMS, retrying...");
			for (var i = 0; i < RETRY_ATTEMPT - 1; i++) {
				LMSSetValue("cmi.core.lesson_location", valueFromCourse);
				var ERROR_CODE = LMSGetLastError().toString();
				if (ERROR_CODE.toString() == "0" || ERROR_CODE.toString() == "") {
					result = true;
					break;
				}
				else {
					result = false;
				}
			}
		}
	}
	if (dataElement.toLowerCase() == "status") {
		_155 = LMSGetValue("cmi.core.lesson_status");
		_155 = _155 + '';
		if (_155 != valueFromCourse) {
			WriteToDebug("........value is not matching from LMS, retrying...");
			for (var i = 0; i < RETRY_ATTEMPT - 1; i++) {
				LMSSetValue("cmi.core.lesson_status", valueFromCourse);
				var ERROR_CODE = LMSGetLastError().toString();
				if (ERROR_CODE.toString() == "0" || ERROR_CODE.toString() == "") {
					result = true;
					break;
				}
				else {
					result = false;
				}
			}
		}
	}
	if (dataElement.toLowerCase() == "score") {
		_155 = LMSGetValue("cmi.core.score.raw");
		_155 = _155 + '';
		if (_155 != valueFromCourse) {
			WriteToDebug("........value is not matching from LMS, retrying...");
			for (var i = 0; i < RETRY_ATTEMPT - 1; i++) {
				LMSSetValue("cmi.core.score.raw", valueFromCourse);
				var ERROR_CODE = LMSGetLastError().toString();
				if (ERROR_CODE.toString() == "0" || ERROR_CODE.toString() == "") {
					result = true;
					break;
				}
				else {
					result = false;
				}
			}
		}
	}
	return result;
}

function SetCourseRetake()
{
	CourseRetake = true;
	FirstExamPage = true;
	if (ScormInitialized && !admin_ReviewMode) {
		WriteToDebug("Calling SetCourseRetake Function");
		WriteToDebug("..Setting Bookmark as blank");

		LatestBookmarkPageID = 0;

		LMSSetValue("cmi.core.lesson_location", "0");
		WriteToDebug("......Calling VerifyData for Bookmark verification");
		var verificationResult = VerifyData("bookmark", "");
		WriteToDebug("......Result of Status Verification = " + verificationResult);
		if (!verificationResult)
			alert(ERROR_CODE + " -- " + lang042);

		WriteToDebug("..Setting Status as incopmlete");
		LMSSetValue("cmi.core.lesson_status", "incomplete");

		if(RECORD_SCORE){
			WriteToDebug("..Setting Score as zero");
		//	LMSSetValue("cmi.core.score.raw","0"); ------------------------------- **** SOME LMS missunderstand this as the course is completed with fail
			WriteToDebug("......Calling VerifyData for Score verification");
			var verificationResult = VerifyData("score", "0");
			WriteToDebug("......Result of Status Verification = " + verificationResult);
			if (!verificationResult)
				alert(ERROR_CODE + " -- " + lang042);

		}
		
		WriteToDebug("..Setting SuspendData as blank");
    LMSSetValue("cmi.suspend_data", escape("|")); // LMSSetValue("cmi.suspend_data", "|");
	}

}

function striphtmlcode(html)
{
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

function ScormPreExamSkipNotification()
{
}

function AddScormPreExamAnswer(QuestionID, QuestionText, AnswerTexts, CorrectAnswerText, UserAnswerText, AnswerIsCorrect, QuestionModules)
{
	//console.log("QuestionID: "+ striphtmlcode(QuestionID) );
	//console.log("QuestionText: "+ striphtmlcode(QuestionText) );
	//console.log("Answers: "+ striphtmlcode(AnswerTexts) );
	//console.log("Correct Answer: "+ CorrectAnswerText );
	//console.log("User Choice: "+ UserAnswerText );
	//console.log("is Correct: "+ AnswerIsCorrect );
	WriteToDebug("Calling AddScormPreExamAnswer Function");
	WriteToDebug("..QuestionId = " + QuestionID);
	WriteToDebug("..QuestionText = " + striphtmlcode(QuestionText));
	//WriteToDebug("..AnswerTexts = " + AnswerTexts);
	WriteToDebug("..CorrectAnswerText = " + CorrectAnswerText.toString());
	WriteToDebug("..UserAnswerText = " + UserAnswerText);
	WriteToDebug("..AnswerIsCorrect = " + AnswerIsCorrect);
	WriteToDebug("..QuestionModules = " + QuestionModules);

	if (ScormInitialized && !admin_ReviewMode)
	{
		if (RECORD_INTERACTIONS && admin_HostedOniLMS) {
			WriteToDebug("..Recording Interaction for ID = " + InteractionID.toString());
			LMSSetValue("cmi.interactions." + InteractionID + ".id", QuestionID.toString());
			LMSSetValue("cmi.interactions." + InteractionID + ".type", "choice");
			LMSSetValue("cmi.interactions." + InteractionID + ".student_response", UserAnswerText.toString());
			LMSSetValue("cmi.interactions." + InteractionID + ".correct_responses.0.pattern", CorrectAnswerText.toString());
			if (AnswerIsCorrect.toString().toLowerCase() == "true") {
				AnswerIsCorrect = "correct";
				WriteToDebug("..PreExamAdaptiveTraining = " + PreExamAdaptiveTraining);
				if (PreExamAdaptiveTraining) {
					WriteToDebug("..Adding QuestionModules");
				}
			}
			if (AnswerIsCorrect.toString().toLowerCase() == "false")
				AnswerIsCorrect = "wrong";
			LMSSetValue("cmi.interactions." + InteractionID + ".result", AnswerIsCorrect);
			InteractionID = parseInt(InteractionID) + 1;
		}
	}

}


function GetPreExamValueFromSuspendData(suspendDataText)
{
}

function ResetInteractionIDOnExamRetake()
{
	WriteToDebug("..Calling ResetInteractionIDOnExamRetake function");
	InteractionID = PreExamInteractionId;
}

function AddScormSurveyAnswer(QuestionID, QuestionText, AnswerTexts, UserAnswerText, UserAnswerMemo)
{
	// QuestionID contains question ID
	// QuestionText contains question text
	// AnswerTexts contains all options (including text)
	// UserAnswerText contains selected choice by the user. In case of free form question, this contains blank
	// UserAnswerMemo contains free form answer entered by the user. In case question doesn't have this option, then it will return as undefined
	//alert("Survey Question: "+ striphtmlcode(QuestionID) );
	//alert("Answers: "+ striphtmlcode(AnswerTexts) );
	//alert("User Choice: "+ UserAnswerText );
	//alert("User Memo: "+ UserAnswerMemo );

	WriteToDebug("Calling AddScormSurveyAnswer Function");
	WriteToDebug("..QuestionId = " + QuestionID);
	WriteToDebug("..QuestionText = " + striphtmlcode(QuestionText));
	WriteToDebug("..AnswerTexts = " + striphtmlcode(AnswerTexts));
	WriteToDebug("..UserAnswerText = " + UserAnswerText);
	WriteToDebug("..UserAnswerMemo = " + UserAnswerMemo);

	if (ScormInitialized && !admin_ReviewMode)
	{
		if (RECORD_INTERACTIONS && admin_HostedOniLMS) {
			var surveyQuestionCode = ""; // F - Free Form, M - Multiple Choice, S - Multiple Choice + Free Form
			if (UserAnswerMemo != null && UserAnswerMemo != 'undefined') {
				if (UserAnswerText == "") {
					surveyQuestionCode = "F";
				}
				else {
					surveyQuestionCode = "S";
				}
			}
			else {
				surveyQuestionCode = "M";
			}

			switch (surveyQuestionCode) {
				case "F":
					WriteToDebug("..Recording Survey Interaction for ID = " + InteractionID.toString());
					LMSSetValue("cmi.interactions." + InteractionID + ".id", QuestionID.toString());
					LMSSetValue("cmi.interactions." + InteractionID + ".type", "fill-in");
					LMSSetValue("cmi.interactions." + InteractionID + ".student_response", UserAnswerMemo.toString());
					//LMSSetValue( "cmi.interactions."+InteractionID+".correct_responses.0.pattern", CorrectAnswerText.toString());
					LMSSetValue("cmi.interactions." + InteractionID + ".result", "correct");
					InteractionID = parseInt(InteractionID) + 1;
					break;
				case "M":
					WriteToDebug("..Recording Survey Interaction for ID = " + InteractionID.toString());
					LMSSetValue("cmi.interactions." + InteractionID + ".id", QuestionID.toString());
					LMSSetValue("cmi.interactions." + InteractionID + ".type", "choice");
					LMSSetValue("cmi.interactions." + InteractionID + ".student_response", UserAnswerText.toString());
					//LMSSetValue( "cmi.interactions."+InteractionID+".correct_responses.0.pattern", CorrectAnswerText.toString());
					LMSSetValue("cmi.interactions." + InteractionID + ".result", "correct");
					InteractionID = parseInt(InteractionID) + 1;
					break;
				case "S":
					WriteToDebug("..Recording Survey Interaction for ID = " + InteractionID.toString());
					LMSSetValue("cmi.interactions." + InteractionID + ".id", QuestionID.toString() + ".1");
					LMSSetValue("cmi.interactions." + InteractionID + ".type", "choice");
					LMSSetValue("cmi.interactions." + InteractionID + ".student_response", UserAnswerText.toString());
					//LMSSetValue( "cmi.interactions."+InteractionID+".correct_responses.0.pattern", CorrectAnswerText.toString());
					LMSSetValue("cmi.interactions." + InteractionID + ".result", "correct");
					InteractionID = parseInt(InteractionID) + 1;

					LMSSetValue("cmi.interactions." + InteractionID + ".id", QuestionID.toString() + ".2");
					LMSSetValue("cmi.interactions." + InteractionID + ".type", "fill-in");
					LMSSetValue("cmi.interactions." + InteractionID + ".student_response", UserAnswerMemo.toString());
					//LMSSetValue( "cmi.interactions."+InteractionID+".correct_responses.0.pattern", CorrectAnswerText.toString());
					LMSSetValue("cmi.interactions." + InteractionID + ".result", "correct");

					InteractionID = parseInt(InteractionID) + 1;
					break;
			}

		}
	}
}
function IsStringNullOrEmpty(str)
{
	if (str && str != '')
		return str;
	else
		return "";
}

function Scorm_Post_Quiz_Answer(QuizQuestionID,AnswerID,IsCorrect)
{
	//alert("Scorm12 ID: "+QuizQuestionID+", Answer: "+AnswerID+", Correct: "+IsCorrect);
	if(IsStringNullOrEmpty(QuizQuestionID) != "")
	{
		WriteToDebug("Calling Scorm_Post_Quiz_Answer Function");
		WriteToDebug("..QuizQuestionID = " + QuizQuestionID);
		WriteToDebug("..AnswerID = " + AnswerID);
		WriteToDebug("..IsCorrect = " + IsCorrect.toString());

		if (ScormInitialized && !admin_ReviewMode)
		{
			if (RECORD_INTERACTIONS && admin_HostedOniLMS) {
				WriteToDebug("..Recording Interaction for ID = " + InteractionID.toString());
				LMSSetValue("cmi.interactions." + InteractionID + ".id", QuizQuestionID.toString());
				LMSSetValue("cmi.interactions." + InteractionID + ".type", "choice");
				LMSSetValue("cmi.interactions." + InteractionID + ".student_response", AnswerID.toString());
				//LMSSetValue("cmi.interactions." + InteractionID + ".correct_responses.0.pattern", CorrectAnswerText.toString());
				if (IsCorrect.toString().toLowerCase() == "true")
					IsCorrect = "correct";
				if (IsCorrect.toString().toLowerCase() == "false")
					IsCorrect = "wrong";
				LMSSetValue("cmi.interactions." + InteractionID + ".result", IsCorrect);
				InteractionID = parseInt(InteractionID) + 1;
			}
		}
	}

}
