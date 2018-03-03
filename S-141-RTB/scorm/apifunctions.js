/*******************************************************************************
** FileName: APIFunctions.js
*******************************************************************************/

var objWin;
var childFlag=0;
var recordAttempt=0;
var callClose="0";
var ERROR_CODE="0"; //Variable to hold error code return by the LMS
	
//var objAPI = getAPIHandle();
var _mStudentId="";
var _mStudentActualId="";
var _mStudentName="";
var _mLessonLocation="";
var _mLessonStatus="";
var _mEngineStatus="";
var _mEngineBookmark="";
var _mEngineScore="";
var _mEngineLanguage="";
var _mEngineReviewMode="";
var _mExamRetries=0;
var _mSuspendData="";
var _mTotalInteractions=0;
var _isStatusCompleted=false;
var cdate;
	
var ElapsedTime="";
dtmStart=new Date();

function StartCourseLaunch(){

//Call LMSInitialize
if(!IsLMSInitialized){
var _11 = LMSInitialize();
_11 = _11+'';
if(_11 == SCORM_FALSE){
	alert(API_NOT_FOUND);
	//top.close();
}
}
//Get Student Name from LMS
if(_mStudentName==null){
	_mStudentName=LMSGetValue("cmi.core.student_name");
	_mStudentId=LMSGetValue("cmi.core.student_id");
}
//console.log(_mStudentName+" "+_mStudentId);
if(_mStudentId.length==null){
	if(_mStudentName) {
		_mStudentId=_mStudentName;
	}
}

//Get Bookmark from LMS
_mLessonLocation=LMSGetValue("cmi.core.lesson_location");
if(LMSGetLastError().toString()!="0"){
	alert(ERROR_LMS_COMMUNICATION);
}
if (_mLessonLocation==null || _mLessonLocation=="" || _mLessonLocation==" " || _mLessonLocation=="0" ){
	cdate="0";
	_mEngineBookmark=0;
}
else{
	cdate = Math.random();
	_mEngineBookmark=_mLessonLocation;
}

_mLessonStatus=LMSGetValue("cmi.core.lesson_status");
if(LMSGetLastError().toString()!="0"){
	alert(ERROR_LMS_COMMUNICATION);
}
_mLessonStatus = _mLessonStatus.toLowerCase();
if (_mLessonStatus==SCORM_COMPLETED || _mLessonStatus==SCORM_PASSED || _mLessonStatus==SCORM_FAILED){
	_mEngineStatus=SCORM_COMPLETED;
	_mEngineBookmark=0;
	_mEngineReviewMode=SCORM_REVIEW;
}
else{
	_mEngineStatus=SCORM_INCOMPLETE;
	_mEngineReviewMode="";
}

//Set incomplete status on course launch
if(_mLessonStatus.toLowerCase()!=SCORM_COMPLETED && _mLessonStatus.toLowerCase()!=SCORM_PASSED && _mLessonStatus.toLowerCase()!=SCORM_FAILED){
	LMSSetValue("cmi.core.lesson_status", SCORM_INCOMPLETE);
	LMSCommit();
}

//Fetch Student Preferred langauge from LMS,
//Set default language if value is blank or error occured
/*
_mEngineLanguage=LMSGetValue("cmi.student_preference.language");
if(_mEngineLanguage==null || _mEngineLanguage=="" || _mEngineLanguage==" "){
	_mEngineLanguage=LANGUAGE_NAME;
	LMSSetValue("cmi.student_preference.language",_mEngineLanguage);
}
*/

//Total Interaction Count
_mTotalInteractions=LMSGetValue("cmi.interactions._count");
ERROR_CODE=LMSGetLastError().toString();
if(ERROR_CODE!="0" || ERROR_CODE!=""){	
	alert(ERROR_LMS_COMMUNICATION);
}
if(_mTotalInteractions==null || _mTotalInteractions==""){
	_mTotalInteractions=0;
}

//Get SuspendData Value
_mSuspendData=GetData();

}
	
//Fetch Cmi.suspend_data for exam attempts
function GetData()
{
var _110;
if(SCORM_objAPI){
	var _110=LMSGetValue("cmi.suspend_data");
	_110=_110+'';
	ERROR_CODE=LMSGetLastError().toString();
	if(ERROR_CODE!="0" || ERROR_CODE!=""){	
		alert(ERROR_LMS_COMMUNICATION);
	}
}
/*
if(_110!=''){
	var _111='';
	if(_110.split("=").length>1)
		_111=_110.split("=")[1];
	else
		_111="0";
	_mExamRetries=parseInt(_111);
}
else{
	_mExamRetries=0;
}
*/
return _110.toString();

}

function SetData(_data)
{
	var _111="";
	if(SCORM_objAPI){
		var _111=LMSSetValue("cmi.suspend_data",_data);
		ERROR_CODE=LMSGetLastError().toString();
		if(ERROR_CODE!="0" || ERROR_CODE!=""){	
			alert(ERROR_LMS_COMMUNICATION);
		}
	}
}
	
function getElapsedTime(){
	dtmEnd=new Date();
	var tottime=Math.round((dtmEnd.getTime()-dtmStart.getTime())/1000.);
	var hr,min,sec;
	hr=Math.floor(tottime/3600);
	min=Math.floor((tottime-(hr*3600))/60);
	sec=tottime - hr*3600 - min*60;
	var eltime=format2(hr)+":"+format2(min)+":"+format2(sec);
	delete dtmEnd;
	return eltime;
}

//Get Bookmark
function GetBookmark(){
	var _401=0;
	if(SCORM_objAPI){
		_mEngineBookmark=LMSGetValue("cmi.core.lesson_location");
		ERROR_CODE=LMSGetLastError().toString();
		if(ERROR_CODE!="0" || ERROR_CODE!=""){	
			alert(ERROR_LMS_COMMUNICATION);
			_mEngineBookmark=0;
		}
		if (_mLessonStatus==SCORM_COMPLETED || _mLessonStatus==SCORM_PASSED || _mLessonStatus==SCORM_FAILED){
			_mEngineBookmark=0;
		}
	}
	else{
		_401=1;
		alert(API_ERROR);
	}
	WriteToDebug("......Bookmark Value = " + _mEngineBookmark);
	return _mEngineBookmark;
}
//Set Bookamrk to LMS
function SetBookmark(lesson){
	var _402=0;
	if(SCORM_objAPI){
		LMSSetValue("cmi.core.lesson_location", lesson);
		ERROR_CODE=LMSGetLastError().toString();
		if(ERROR_CODE!="0" || ERROR_CODE!=""){	
			_402=2;
		}
		if(_402==2 || _402==0){
			WriteToDebug("......Calling VerifyBookmark for verification");
			var verificationResult=VerifyBookmark(lesson);
			WriteToDebug("......Result of Bookmark Verification = " + verificationResult);
			if(!verificationResult)
				alert(ERROR_CODE + " -- " + BOOKMARK_NOT_RECORDED);
		}
	}
	else{
		_402=1;
		alert(API_ERROR);
	}
	return _402;
}

//Get Status
function GetStatus(){
	var _403=0;
	if(SCORM_objAPI){
		_mEngineStatus=LMSGetValue("cmi.core.lesson_status");
		ERROR_CODE=LMSGetLastError().toString();
		if(ERROR_CODE!="0" || ERROR_CODE!=""){	
			alert(ERROR_LMS_COMMUNICATION);
			_mEngineStatus=SCORM_INCOMPLETE;
		}
	}
	else{
		_403=1;
		alert(API_ERROR);
	}
	WriteToDebug("......Status Value = " + _mEngineStatus);
	return _mEngineStatus;
}
//Set Status to LMS
function SetStatus(status){
	var _404=0;
	if(SCORM_objAPI){
		LMSSetValue("cmi.core.lesson_status", status.toLowerCase());
		var ERROR_CODE=LMSGetLastError().toString();
		if(ERROR_CODE!="0" || ERROR_CODE!=""){	
			_404=2;
		}
		if(_404==2 || _404==0){
			LMSCommit("");
			_404=0;
			WriteToDebug("......Calling VerifyStatus for verification");
			var verificationResult=VerifyStatus(status);
			WriteToDebug("......Result of Status Verification = " + verificationResult);
			if(!verificationResult)
				alert(ERROR_CODE + " -- " + STATUS_NOT_RECORDED);
		}
	}
	else{
		_404=1;
	}
	return _404;
}
//Get Score
function GetScore(){
	var _405=0;
	if(SCORM_objAPI){
		_mEngineScore=LMSGetValue("cmi.core.score.raw");
		ERROR_CODE=LMSGetLastError().toString();
		if(ERROR_CODE!="0" || ERROR_CODE!=""){	
			alert(ERROR_LMS_COMMUNICATION);
			_mEngineScore=0;
		}
	}
	else{
		_405=1;
		alert(API_ERROR);
	}
	WriteToDebug("......Score Value = " + _mEngineScore);
	return _mEngineScore;
}
//Set Score to LMS
function SetScore(learnerScore,computerScore){
	var _406=0;
	if(SCORM_objAPI){
		LMSSetValue("cmi.core.score.min", "0");
		LMSSetValue("cmi.core.score.max", "100");
		var _407=((parseInt(learnerScore) / parseInt(computerScore))*100);
		WriteToDebug("......LearnerScore = " + learnerScore + " -- ComputerScore = " + computerScore + " -- Percentage = " + _407);
		LMSSetValue("cmi.core.score.raw", _407.toString());
		ERROR_CODE=LMSGetLastError().toString();
		if(ERROR_CODE!="0" || ERROR_CODE!=""){
			_406=2;
		}
		if(_406==2 || _406==0){
			WriteToDebug("......Calling VerifyScore for verification");
			var verificationResult=VerifyScore(_407.toString());
			WriteToDebug("......Result of Score Verification = " + verificationResult);
			if(!verificationResult)
				alert(ERROR_CODE + " -- " + SCORE_NOT_RECORDED);
		}
	}
	else{
		_406=1;
		alert(API_ERROR);
	}
	return _406;
}

function RecordQuestion(command,argvalue){
	//Interaction Identifier
	if(command==SCORM_COMMAND_INTERACTION_IDENTIFIER){
		if(argvalue.length>255) argvalue=argvalue.substring(0,255);
		SetInteraction("cmi.interactions."+_mTotalInteractions+".id",argvalue);
	}
	//Interaction Type
	if(command==SCORM_COMMAND_INTERACTION_TYPE){
		SetInteraction("cmi.interactions."+_mTotalInteractions+".type",argvalue);
	}
	//Interacction Learner Response
	if(command==SCORM_COMMAND_INTERACTION_LEARNER_RESPONSE){
		if(argvalue.length>255) argvalue=argvalue.substring(0,255);
		SetInteraction("cmi.interactions."+_mTotalInteractions+".student_response",argvalue);
	}
	//Interaction Correct Response
	if(command==SCORM_COMMAND_INTERACTION_CORRECT_RESPONSE){
		if(argvalue.length>255) argvalue=argvalue.substring(0,255);
		SetInteraction("cmi.interactions."+_mTotalInteractions+".correct_responses.0.pattern",argvalue);
	}
	//Interaction Result
	if(command==SCORM_COMMAND_INTERACTION_RESULT){
		SetInteraction("cmi.interactions."+_mTotalInteractions+".result",argvalue);
		_mTotalInteractions++;
	}
}

function SetInteraction(command, argvalue){
	if(!DO_NOT_REPORT_INTERACTIONS){
		LMSSetValue(command, argvalue);
	}
}
	
	function VerifyStatus(status){
		var result=true;
		if(status.toLowerCase()==SCORM_COMPLETED || status.toLowerCase()==SCORM_PASSED || status.toLowerCase()==SCORM_FAILED){
			var statusFromLMS=LMSGetValue("cmi.core.lesson_status").toLowerCase();
			if(statusFromLMS!=SCORM_COMPLETED && statusFromLMS!=SCORM_PASSED){
				for(i=0; i < RETRY_ATTEMPT - 1; i++){
					LMSSetValue("cmi.core.lesson_status", status);
					var ERROR_CODE=LMSGetLastError().toString();
					if(ERROR_CODE.toString()=="0" || ERROR_CODE.toString()==""){	
						result=true;
						break;
					}
					else{
						result=false;
					}
				}
			}
		}
		return result;
	}
	function VerifyBookmark(bookmark){
		var result=true;
		var bookmarkFromLMS=LMSGetValue("cmi.core.lesson_location");
		if(bookmarkFromLMS!=bookmark){
			for(i=0; i<RETRY_ATTEMPT-1; i++){
				LMSSetValue("cmi.core.lesson_location",bookmark);
				var ERROR_CODE=LMSGetLastError().toString();
				if(ERROR_CODE.toString()=="0" || ERROR_CODE.toString()==""){
					result=true;
					break;
				}
				else{
					result=false;
				}
			}
		}
		return result;
	}
	function VerifyScore(score){
		var result=true;
		var scoreFromLMS=LMSGetValue("cmi.core.score.raw");
		if(scoreFromLMS!=score){
			for(i=0; i<RETRY_ATTEMPT-1; i++){
				LMSSetValue("cmi.core.score.raw",score);
				//var ERROR_CODE=LMSGetLastError().toString();
				if(ERROR_CODE.toString()=="0" || ERROR_CODE.toString()==""){
					result=true;
					break;
				}
				else{
					result=false;
				}
			}
		}
		return result;
	}	
	
function SetSessionTime(sTime){
	if(SCORM_objAPI){
		LMSSetValue("cmi.core.session_time", sTime);
	}
	else{
		alert(API_ERROR);
	}
}

function FinishSession(){
	LMSCommit();
	LMSFinish();
	
	pause(500);
	close_window();
}

function pause(millisecond){    
var now=new Date();    
var exitTime=now.getTime()+millisecond;    
while(true){        
now=new Date();        
if(now.getTime()>exitTime) return;    
}
}	
	
function close_window(){
	if (callClose=="0"){
		callClose="1";
//		fnGoUnload();
//		pause(500);
		childFlag = 1;
		if(LAUNCH_WINDOW==0){
			//window.parent.opener.top.close(); //Closing parent window
		}
		top.close(); //Closing child window
	}		
}
		
function SaveAndExit(){ 
	WriteToDebug("....In SaveAndExit");
	var bookmark="";
	var status="";
	var mScore="",score="";
	
	if(_mEngineStatus="c"){
		bookmark=0;
		status=SCORM_COMPLETED;
		//SetBookmark(bookmark);
		//var resultFlag=SetStatus(status);
		//FinishSession();
	}
	else{
		bookmark=_mEgineBookmark;
		status=_mEngineStatus;
		//SetBookmark(bookmark);
	}
	SetData(_mSuspendData);
	WriteToDebug("......Updating Bookmark to LMS = " + bookmark);
	SetBookmark(bookmark);
	WriteToDebug("......Updating Status to LMS = " + status);
	var resultFlag=SetStatus(status);
	WriteToDebug("......resultFlag (After updating status) = " + resultFlag);
	if(resultFlag==1) {
		alert(API_ERROR);
	}
	else if(resultFlag==2 || resultFlag==0) {
		if(status==SCORM_COMPLETED || status==SCORM_FAILED || status==SCORM_PASSED){
			WriteToDebug("......Calling CheckStatus for verification");
			var val = VerifyStatus(status);
			WriteToDebug("......Result of Status verification = " + val);
			if(!val){
				alert(ERROR_CODE + " -- " + STATUS_NOT_RECORDED);
			}
			//else if(val && DISPLAY_CERTIFICATE==1 && status!=SCORM_FAILED) {
			//	window.open("certificate.htm?sid="+document.frmCheck.txtFldStudentName.value ,"_new","toolbar=no, menubar=no, status=no, location=no,height=500, width=700");
			//}
		}
	}
	WriteToDebug("......Updating Session Time to LMS");
	SetSessionTime(getElapsedTime());
	WriteToDebug("......Calling FinishSession");
	FinishSession();
}

