/*******************************************************************************
**
** Advanced Distributed Learning Co-Laboratory (ADL Co-Lab) grants you
** ("Licensee") a non-exclusive, royalty free, license to use and redistribute
** this software in source and binary code form, provided that i) this copyright
** notice and license appear on all copies of the software; and ii) Licensee
** does not utilize the software in a manner which is disparaging to ADL Co-Lab.
**
** This software is provided "AS IS," without a warranty of any kind.  ALL
** EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING ANY
** IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR
** NON-INFRINGEMENT, ARE HEREBY EXCLUDED.  ADL Co-Lab AND ITS LICENSORS SHALL
** NOT BE LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING,
** MODIFYING OR DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO EVENT WILL
** ADL Co-Lab OR ITS LICENSORS BE LIABLE FOR ANY LOST REVENUE, PROFIT OR DATA,
** OR FOR DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR PUNITIVE
** DAMAGES, HOWEVER CAUSED AND REGARDLESS OF THE THEORY OF LIABILITY, ARISING
** OUT OF THE USE OF OR INABILITY TO USE SOFTWARE, EVEN IF ADL Co-Lab HAS BEEN
** ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
**
*******************************************************************************/

/*******************************************************************************
**
** This file is being presented to Content Developers, Content Programmers and
** Instructional Designers to demonstrate one way to abstract API calls from the
** actual content to allow for uniformity and reuse of content fragments.
**
** The purpose in wrapping the calls to the API is to (1) provide a
** consistent means of finding the LMS API adapter within the window
** hierarchy, (2) to ensure that the method calls are called correctly by the
** SCO and (3) to make possible changes to the actual API Specifications and
** Standards easier to implement/change quickly.
**
** This is just one possible example for implementing the API guidelines for
** runtime communication between an LMS and executable content components.
** There are many other possible implementations.
**
*******************************************************************************/


//Constants
var VERSION="2.0";
var _2004Debug;
var LESSON_STATUS_PASSED=1;
var LESSON_STATUS_COMPLETED=2;
var LESSON_STATUS_FAILED=3;
var LESSON_STATUS_INCOMPLETE=4;
var LESSON_STATUS_BROWSED=5;
var LESSON_STATUS_NOT_ATTEMPTED=6;
var ENTRY_REVIEW=1;
var ENTRY_FIRST_TIME=2;
var ENTRY_RESUME=3;
var MODE_NORMAL=1;
var MODE_BROWSE=2;
var MODE_REVIEW=3;
var MAX_CMI_TIME=36002439990;
var EXIT_TYPE_SUSPEND="SUSPEND";
var EXIT_TYPE_FINISH="FINISH";
var EXIT_TYPE_TIMEOUT="TIMEOUT";
var EXIT_TYPE_UNLOAD="UNLOAD";
var INTERACTION_RESULT_CORRECT="CORRECT";
var INTERACTION_RESULT_WRONG="WRONG";
var INTERACTION_RESULT_UNANTICIPATED="UNANTICIPATED";
var INTERACTION_RESULT_NEUTRAL="NEUTRAL";
var INTERACTION_TYPE_TRUE_FALSE="true-false";
var INTERACTION_TYPE_CHOICE="choice";
var INTERACTION_TYPE_FILL_IN="fill-in";
var INTERACTION_TYPE_LONG_FILL_IN="long-fill-in";
var INTERACTION_TYPE_MATCHING="matching";
var INTERACTION_TYPE_PERFORMANCE="performance";
var INTERACTION_TYPE_SEQUENCING="sequencing";
var INTERACTION_TYPE_LIKERT="likert";
var INTERACTION_TYPE_NUMERIC="numeric";
var FORCED_COMMIT_TIME="5000";

var SCORM_LOGOUT="logout";
var SCORM_SUSPEND="suspend";
var SCORM_NORMAL_EXIT="normal";
var SCORM_TIMEOUT="time-out";
var SCORM_PASSED="passed";
var SCORM_FAILED="failed";
var SCORM_COMPLETED="completed";
var SCORM_BROWSED="browsed";
var SCORM_INCOMPLETE="incomplete";
var SCORM_NOT_ATTEMPTED="not attempted";
var SCORM_UNKNOWN="unknown";
var SCORM_CREDIT="credit";
var SCORM_NO_CREDIT="no-credit";
var SCORM_BROWSE="browse";
var SCORM_NORMAL="normal";
var SCORM_REVIEW="review";
var SCORM_ENTRY_RESUME="resume";
var SCORM_ENTRY_NORMAL="";
var SCORM_RESULT_CORRECT="correct";
var SCORM_RESULT_WRONG="incorrect";
var SCORM_RESULT_UNANTICIPATED="unanticipated";
var SCORM_RESULT_NEUTRAL="neutral";
var SCORM_INTERACTION_TYPE_TRUE_FALSE="true-false";
var SCORM_INTERACTION_TYPE_CHOICE="choice";
var SCORM_INTERACTION_FILL_IN="fill-in";
var SCORM2004_INTERACTION_TYPE_LONG_FILL_IN="long-fill-in";
var SCORM_INTERACTION_TYPE_MATCHING="matching";
var SCORM_INTERACTION_TYPE_PERFORMANCE="performance";
var SCORM_INTERACTION_TYPE_SEQUENCING="sequencing";
var SCORM_INTERACTION_TYPE_LIKERT="likert";
var SCORM_INTERACTION_TYPE_NUMERIC="numeric";
var SCORM_TRUE="true";
var SCORM_FALSE="false";

var SCORM_findAPITries=0;

// Define exception/error codes
var _NoError = 0;
var _GeneralException = 101; 
var _InvalidArgumentError = 201;
var _NotInitialized = 301;
var _NotImplementedError = 401;

// local variable definitions
var SCORM2004_objAPI=null;
var intSCORM2004Error=_NoError;
var strSCORM2004ErrorString="";
var strSCORM2004ErrorDiagnostic="";
var blnReviewModeSoReadOnly=false;
var blnStandAlone=false;
var dtmStart=null;
var dtmEnd=null;
var aryDebug=new Array();
var strDebug="";
var winDebug;

// local variable definitions used for finding the API
var apiHandle = null;

var noAPIFound = "false";

// local variable used to keep from calling Terminate() more than once
var terminated = "false";

// ==================================================================================================================================

function SCORM2004_GrabAPI(){
WriteToDebug_2004("....In SCORM2004_GrabAPI");
if(typeof (SCORM2004_objAPI)=="undefined"||SCORM2004_objAPI==null){
SCORM2004_objAPI=SCORM2004_GetAPI();
}
WriteToDebug_2004("....Grab API, returning, found API = "+(SCORM2004_objAPI!=null));
return SCORM2004_objAPI;
}
function SCORM2004_ScanParentsForApi(win){
var _17e=500;
var _17f=0;
while((win.API_1484_11==null||win.API_1484_11==undefined)&&(win.parent!=null)&&(win.parent!=win)&&(_17f<=_17e)){
_17f++;
WriteToDebug_2004("....SCORM_findAPITries -- " + _17f);
win=win.parent;
}
return win.API_1484_11;
}
function SCORM2004_GetAPI(){
var API=null;
if((window.parent!=null)&&(window.parent!=window)){
API=SCORM2004_ScanParentsForApi(window.parent);
}
if((API==null)&&(window.top.opener!=null)){
API=SCORM2004_ScanParentsForApi(window.top.opener);
}
return API;
}

function SCORM2004_CallInitialize(){
var _172;
WriteToDebug_2004("..In SCORM2004_CallInitialize");
WriteToDebug_2004("Grabbing API");
SCORM2004_objAPI=SCORM2004_GrabAPI();
if(typeof(SCORM2004_objAPI)=="undefined" || SCORM2004_objAPI == null){
WriteToDebug_2004(API_NOT_FOUND);
return false;
}
WriteToDebug_2004("..Calling Initialize");
_172=SCORM2004_objAPI.Initialize("");
_172=_172+"";
WriteToDebug_2004("..strResult="+_172);
if(_172==SCORM_FALSE){
WriteToDebug_2004("..Error - Failed Initializing LMS");
SCORM2004_SetErrorInfo();
return false;
}
return true;
}

function SCORM2004_IsAlreadyInitialize(){
var _174;
WriteToDebug_2004("..In SCORM2004_IsAlreadyInitialize");
_174=SCORM2004_CallGetValue("cmi.completion_status");
intSCORM2004Error=SCORM2004_objAPI.GetLastError();
if(intSCORM2004Error!=_NoError){
	return false;
}
else{
	return true;
}
}

function IsSCORM2004APIAvailable(){
SCORM2004_objAPI=SCORM2004_GrabAPI();
if (typeof(SCORM2004_objAPI)=="undefined" || SCORM2004_objAPI == null){
return false;
}
return true;
}

function SCORM2004_CallSetValue(_173,_174){
var _175;
WriteToDebug_2004("....In SCORM2004_CallSetValue strElement="+_173+", strValue="+_174);
/*if(blnReviewModeSoReadOnly===true){
WriteToDebug_2004("..Mode is Review and configuration setting dictates this should be read only so exiting.");
return true;
}
*/
if(!IsSCORM2004APIAvailable()){
WriteToDebug_2004(API_NOT_FOUND);
return false;
}
_173=_173+"";
_174=_174+"";
_175=SCORM2004_objAPI.SetValue(_173,_174);
_175=_175+"";
WriteToDebug_2004("....strResult="+_175);
intSCORM2004Error=SCORM2004_objAPI.GetLastError();
if(intSCORM2004Error!=_NoError){
WriteToDebug_2004("....Error - Unable to store value in LMS");
SCORM2004_SetErrorInfo();
return false;
}
return true;
}
function SCORM2004_CallGetValue(_176){
var _177;
WriteToDebug_2004("....In SCORM2004_CallGetValue strElement="+_176);
if(!IsSCORM2004APIAvailable()){
WriteToDebug_2004(API_NOT_FOUND);
return null;
}
_176=_176+"";
_177=SCORM2004_objAPI.GetValue(_176);
WriteToDebug_2004("....strResult="+_177);
intSCORM2004Error=SCORM2004_objAPI.GetLastError();
if(intSCORM2004Error!=_NoError){
WriteToDebug_2004("....Error - Unable to read value from LMS");
SCORM2004_SetErrorInfo();
return null;
}
WriteToDebug_2004(".." + _176 + " = " + _177);
return _177;
}

function SCORM2004_CallCommit(){
var _178;
WriteToDebug_2004("....In SCORM2004_CallCommit");
if(!IsSCORM2004APIAvailable()){
WriteToDebug_2004(API_NOT_FOUND);
return false;
}
_178=SCORM2004_objAPI.Commit("");
_178=_178+"";
WriteToDebug_2004("....strResult="+_178);
intSCORM2004Error=SCORM2004_objAPI.GetLastError();
if(intSCORM2004Error!=_NoError){
WriteToDebug_2004("....Error - Unable to commit");
SCORM2004_SetErrorInfo();
return false;
}
return true;
}

function SCORM2004_CallTerminate(){
var _179;
WriteToDebug_2004("....In SCORM2004_CallTerminate");
if(!IsSCORM2004APIAvailable()){
WriteToDebug_2004(API_NOT_FOUND);
return false;
}
_179=SCORM2004_objAPI.Terminate("");
_179=_179+"";
WriteToDebug_2004("....strResult="+_179);
intSCORM2004Error=SCORM2004_objAPI.GetLastError();
if(intSCORM2004Error!=_NoError){
WriteToDebug_2004("....Error - Unable to Terminate");
SCORM2004_SetErrorInfo();
return false;
}
terminated = true;
return true;
}



function SCORM2004_GetStudentName(){
WriteToDebug_2004("..In SCORM2004_GetStudentName");
return SCORM2004_CallGetValue("cmi.learner_name");
}
function SCORM2004_GetBookmark(){
WriteToDebug_2004("..In SCORM2004_GetBookmark");
return SCORM2004_CallGetValue("cmi.location");
}
function SCORM2004_SetBookmark(_88){
WriteToDebug_2004("..In SCORM2004_SetBookmark strBookmark="+_88);
return SCORM2004_CallSetValue("cmi.location",_88);
}
function SCORM2004_SetLanguagePreference(_97){
WriteToDebug_2004("..In SCORM2004_SetLanguagePreference strLanguage="+_97);
return SCORM2004_CallSetValue("cmi.learner_preference.language",_97);
}
function SCORM2004_GetLanguagePreference(){
WriteToDebug_2004("..In SCORM2004_GetLanguagePreference");
return SCORM2004_CallGetValue("cmi.learner_preference.language");
}
function SCORM2004_GetPassingScore(){
var _a5;
WriteToDebug_2004("..In SCORM2004_GetPassingScore");
_a5=SCORM2004_CallGetValue("cmi.scaled_passing_score");
WriteToDebug_2004("..fltScore="+_a5);
if(_a5==""){
_a5=0;
}
if(!IsValidDecimal(_a5)){
WriteToDebug_2004("....Error - Invalid Mastery score received from LMS");
return null;
}
_a5=parseFloat(_a5);
_a5=_a5*100;
return _a5;
}
function SCORM2004_SetScore(_a6,_a7,_a8){
var _a9;
var _aa;
WriteToDebug_2004("..In SCORM2004_SetScore intScore="+_a6+", intMaxScore="+_a7+", intMinScore="+_a8);
_aa=_a6/100;
RoundToPrecision(_aa,7);
_a9=SCORM2004_CallSetValue("cmi.score.raw",_a6);
_a9=SCORM2004_CallSetValue("cmi.score.max",_a7)&&_a9;
_a9=SCORM2004_CallSetValue("cmi.score.min",_a8)&&_a9;
_a9=SCORM2004_CallSetValue("cmi.score.scaled",_aa)&&_a9;
WriteToDebug_2004("..Returning "+_a9);
return _a9;
}
function SCORM2004_GetScore(){
WriteToDebug_2004("..In SCORM2004_GetScore");
return SCORM2004_CallGetValue("cmi.score.raw");
}
function SCORM2004_GetLessonMode(){
var _10f;
WriteToDebug_2004("..In SCORM2004_GetLessonMode");
_10f=SCORM2004_CallGetValue("cmi.mode");
WriteToDebug_2004("..strLessonMode="+_10f);
if(_10f==SCORM_BROWSE){
return MODE_BROWSE;
}else{
if(_10f==SCORM_NORMAL){
return MODE_NORMAL;
}else{
if(_10f==SCORM_REVIEW){
return MODE_REVIEW;
}else{
WriteToDebug_2004("..ERROR - Invalid lesson_mode vocab received from LMS");
return null;
}
}
}
}
function SCORM2004_SetFailed(){
WriteToDebug_2004("..In SCORM2004_SetFailed");
var _12f;
_12f=SCORM2004_CallSetValue("cmi.success_status",SCORM_FAILED);
_12f=SCORM2004_CallSetValue("cmi.completion_status",SCORM_COMPLETED)&&_12f;
WriteToDebug_2004("..result = " + _12f);
return _12f;
}
function SCORM2004_SetPassed(){
WriteToDebug_2004("..In SCORM2004_SetPassed");
var _130;
_130=SCORM2004_CallSetValue("cmi.success_status",SCORM_PASSED);
_130=SCORM2004_CallSetValue("cmi.completion_status",SCORM_COMPLETED)&&_130;
WriteToDebug_2004("..result = " + _130);
return _130;
}
function SCORM2004_SetCompleted(){
WriteToDebug_2004("..In SCORM2004_SetCompleted");
var _131;
_131=SCORM2004_CallSetValue("cmi.completion_status",SCORM_COMPLETED);
WriteToDebug_2004("..result = " + _131);
return _131;
}
function SCORM2004_SetInComplete(){
WriteToDebug_2004("..In SCORM2004_SetInComplete");
var _132;
_132=SCORM2004_CallSetValue("cmi.completion_status",SCORM_INCOMPLETE);
WriteToDebug_2004("..result = " + _132);
return _132;
}
function SCORM2004_GetCompletionStatus()
{
var _133;
var _134;
WriteToDebug_2004("..In SCORM2004_GetCompletionStatus");
_134=SCORM2004_CallGetValue("cmi.completion_status");
WriteToDebug_2004("..strCompletionStatus="+_134);
if(_134==SCORM_COMPLETED){
WriteToDebug_2004("..Returning Completed");
return SCORM_COMPLETED;
}
else if(_134==SCORM_INCOMPLETE){
WriteToDebug_2004("..Returning Incomplete");
return SCORM_INCOMPLETE;
}
else if(_134==SCORM_NOT_ATTEMPTED||_134==SCORM_UNKNOWN){
WriteToDebug_2004("..Returning Not Attempted");
return SCORM_NOT_ATTEMPTED;
}
else{
WriteToDebug_2004("..Invalid lesson status received from LMS");
return null;
}
}
function SCORM2004_GetSuccessStatus()
{
var _133;
var _134;
WriteToDebug_2004("..In SCORM2004_GetSuccessStatus");
_133=SCORM2004_CallGetValue("cmi.success_status");
WriteToDebug_2004("..strSuccessStatus="+_133);
if(_133==SCORM_PASSED){
WriteToDebug_2004("..Returning Passed");
return LESSON_STATUS_PASSED;
}
else if(_133==SCORM_FAILED){
WriteToDebug_2004("..Returning Failed");
return LESSON_STATUS_FAILED;
}
else{
WriteToDebug_2004("..Invalid lesson status received from LMS");
return null;
}
}

function SCORM2004_GetStatus(){
var _133;
var _134;
WriteToDebug_2004("..In SCORM2004_GetStatus");
_133=SCORM2004_CallGetValue("cmi.success_status");
_134=SCORM2004_CallGetValue("cmi.completion_status");
WriteToDebug_2004("..strSuccessStatus="+_133);
WriteToDebug_2004("..strCompletionStatus="+_134);
if(_133==SCORM_PASSED){
WriteToDebug_2004("..Returning Passed");
return LESSON_STATUS_PASSED;
}else{
if(_133==SCORM_FAILED){
WriteToDebug_2004("..Returning Failed");
return LESSON_STATUS_FAILED;
}else{
if(_134==SCORM_COMPLETED){
WriteToDebug_2004("..Returning Completed");
return LESSON_STATUS_COMPLETED;
}else{
if(_134==SCORM_INCOMPLETE){
WriteToDebug_2004("..Returning Incomplete");
return LESSON_STATUS_INCOMPLETE;
}else{
if(_134==SCORM_NOT_ATTEMPTED||_134==SCORM_UNKNOWN){
WriteToDebug_2004("..Returning Not Attempted");
return LESSON_STATUS_NOT_ATTEMPTED;
}else{
WriteToDebug_2004("..Invalid lesson status received from LMS");
return null;
}
}
}
}
}
}
function SCORM2004_GetSuspendData(){
WriteToDebug_2004("..In SCORM2004_GetSuspendData");
return SCORM2004_CallGetValue("cmi.suspend_data");
}
function SCORM2004_SetSuspendData(_88){
WriteToDebug_2004("..In SCORM2004_SetSuspendData strSuspendData="+_88);
return SCORM2004_CallSetValue("cmi.suspend_data",_88);
}


function SCORM2004_GetInteractionsCount(){
WriteToDebug_2004("..In SCORM2004_GetInteractionsCount");
return SCORM2004_CallGetValue("cmi.interactions._count");
}

function SCORM2004_RecordInteraction(_a0,_a1,_a2,_a3,_a4,_a5,_a6){
WriteToDebug_2004("..In SCORM2004_RecordInteraction");
// _mInteractionID,_mInteractionIdentifer,SCORM_INTERACTION_TYPE_CHOICE,_mQuestionText,_mLearnerResponse,_mCorrectResponse,interactionResult
var _b5;
if(_a3==""){
	_b5=SCORM2004_CallSetValue("cmi.interactions."+_a0+".id",_a1);
}
else{
	_b5=SCORM2004_CallSetValue("cmi.interactions."+_a0+".id",_a3);
	if(SCORM2004_GetLastError()!="0"){
	_b5=SCORM2004_CallSetValue("cmi.interactions."+_a0+".id",_a1);
	}
}
_b5=SCORM2004_CallSetValue("cmi.interactions."+_a0+".type",_a2)&&_b5;
_b5=SCORM2004_CallSetValue("cmi.interactions."+_a0+".learner_response",_a4)&&_b5;
_b5=SCORM2004_CallSetValue("cmi.interactions."+_a0+".result",_a6)&&_b5;
_b5=SCORM2004_CallSetValue("cmi.interactions."+_a0+".correct_responses.0.pattern",_a5)&&_b5;
WriteToDebug_2004("..strResult="+_b5);
return _b5;
}


function SCORM2004_GetLastError(){
var _189;
WriteToDebug_2004("..In SCORM2004_GetLastError");
if(!IsSCORM2004APIAvailable()){
WriteToDebug_2004(API_NOT_FOUND);
return false;
}
var _189=SCORM2004_objAPI.GetLastError();
_189=_189+'';
WriteToDebug_2004("....Last Error = " + _189);
return _189;
} 

function SCORM2004_ClearErrorInfo(){
intSCORM2004Error=_NoError;
strSCORM2004ErrorString="";
strSCORM2004ErrorDiagnostic="";
}
function SCORM2004_SetErrorInfo(){
SCORM2004_ClearErrorInfo();
WriteToDebug_2004("....In SCORM2004_SetErrorInfo");
intSCORM2004Error=SCORM2004_objAPI.GetLastError();
strSCORM2004ErrorString=SCORM2004_objAPI.GetErrorString(intSCORM2004Error);
strSCORM2004ErrorDiagnostic=SCORM2004_objAPI.GetDiagnostic("");
intSCORM2004Error=intSCORM2004Error+"";
strSCORM2004ErrorString=strSCORM2004ErrorString+"";
strSCORM2004ErrorDiagnostic=strSCORM2004ErrorDiagnostic+"";
WriteToDebug_2004("....intSCORM2004Error="+intSCORM2004Error);
WriteToDebug_2004("....strSCORM2004ErrorString="+strSCORM2004ErrorString);
WriteToDebug_2004("....strSCORM2004ErrorDiagnostic="+strSCORM2004ErrorDiagnostic);
}



function IsValidDecimal(_66){
WriteToDebug_2004("..In IsValidDecimal, strValue="+_66);
_66=new String(_66);
if(_66.search(/[^.\d-]/)>-1){
WriteToDebug_2004("..Returning False - character other than a digit, dash or period found");
return false;
}
if(_66.search("-")>-1){
if(_66.indexOf("-",1)>-1){
WriteToDebug_2004("..Returning False - dash found in the middle of the string");
return false;
}
}
if(_66.indexOf(".")!=_66.lastIndexOf(".")){
WriteToDebug_2004("..Returning False - more than one decimal point found");
return false;
}
if(_66.search(/\d/)<0){
WriteToDebug_2004("..Returning False - no digits found");
return false;
}
WriteToDebug_2004("..Returning True");
return true;
}
function IsValidCMITimeSpan(_46){
WriteToDebug_2004("..In IsValidCMITimeSpan strValue="+_46);
var _47=/^\d?\d?\d?\d:\d?\d:\d?\d(.\d\d?)?$/;
if(_46.search(_47)>-1){
WriteToDebug_2004("..Returning True");
return true;
}else{
WriteToDebug_2004("..Returning False");
return false;
}
}
function RoundToPrecision(_80,_81){
_80=parseFloat(_80);
return (Math.round(_80*Math.pow(10,_81))/Math.pow(10,_81));
}
function IsAlphaNumeric(_67){
WriteToDebug_2004("..In IsAlphaNumeric");
if(_67.search(/\w/)<0){
WriteToDebug_2004("..Returning false");
return false;
}else{
WriteToDebug_2004("..Returning true");
return true;
}
}
function LTrim(str){
str=new String(str);
return (str.replace(/^\s+/,""));
}
function RTrim(str){
str=new String(str);
return (str.replace(/\s+$/,""));
}
function Trim(_6e){
var str=LTrim(RTrim(_6e));
return (str.replace(/\s{2,}/g," "));
}


function WriteToDebug_2004(_165) {
if (_2004Debug) {
var dtm = new Date();
var _167;
_167 = aryDebug.length + ":" + dtm.toString() + " - " + _165;
aryDebug[aryDebug.length] = _167;
if (winDebug && !winDebug.closed) {
winDebug.document.write(_167 + "<br>\n");
}
}
return;
}
function ShowDebugWindow_2004() {
if (winDebug && !winDebug.closed) {
winDebug.close();
}
try{
winDebug = window.open("blank.html", "Debug", "width=600,height=300,resizable,scrollbars");
winDebug.document.write(aryDebug.join("<br>\n"));
winDebug.document.close();
winDebug.focus();
}
catch (e)
{}
return;
}
