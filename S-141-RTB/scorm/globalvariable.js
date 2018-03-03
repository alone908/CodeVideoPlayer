///////////// GLOBAL VARIABLES /////////////////////////////////////

//Set this to true to turn debuggin on
var SEND_EMAIL_ON_FAILURE = false;

// Course Name, Code and Description
var COURSE_NAME = "SCORM 1.2 Demo Course";
var COURSE_CODE = "DEMO";
var COURSE_DESC = "After completing this course, you will understand information technology security threats, what you can do to stop them and how important your role is in securing your organization&#146;s information resources.";

// Time out in minutes
// Default value is 30 minutes
var SESSION_TIMEOUT = 30;

// To track the course launch behaviour
// 0 - if course launched as a popup window, 1 - if course is launched in the LMS window.
// Default value is 0
var LAUNCH_WINDOW = 0;

// Do we need completion certificate to open
// 1 - Open course certificate on completion, 0 - Do not open certificate
// Default value is 1
var DISPLAY_CERTIFICATE = 1;

// Does course has Final Exam
// 1 - Course has exam, 0 - Course doesn't contain exam
// Default value is 1
var FINAL_EXAM = 1;

// Passing Score for the exam
//Only require if FINAL_EXAM = 1
var MASTER_SCORE = 70;

//Total question in the exam
//Only require if FINAL_EXAM = 1  and to calculate scaling factor
var TOTAL_QUESTION = 10;

var TOTAL_EXAM_ATTEMPTS = 3;

var USE_EXAM_ATTEMPT = false;

//Scaling value for the Exam
//Only require if FINAL_EXAM = 1
var SCORE_SCALE = 100 / TOTAL_QUESTION;
SCORE_SCALE = Math.round(SCORE_SCALE * 100)/100;

//Course Window size is controle by the course or by LMS
//If true, then  course window will be controlled by the course or else by LMS
var WINDOW_SIZE_CONTROL_BY_COURSE = true;

//Flag to decide whether Interaction Question should be overwrite or append
//If set to true, interactions will overwrite previously recorded interactions
var OVERWRITE_INTERACTION = false;

//Last Slide No of the Course
//Only require if FINAL_EXAM = 0
var LAST_SLIDE = "0";


//Number of Retries to set completion status
//Default value = 1
var RETRY_ATTEMPT = 2;

//Language Name
var SCORM_STUDENT_PREFERENCE_LANGAUGE_SUPPORT = false;
var LANGUAGE_NAME = "english";

///////////// END /////////////////////////////////////

///////////// Error MESSAGES /////////////////////////////////////
var ERROR_LMS_COMMUNICATION = "Error occured while communicating with the Learning Management System. Please launch the course again.";
var BOOKMARK_NOT_RECORDED = "Bookmark has not been recorded with the Learning Management System. Please close the course window and launch it again.";
var SCORE_NOT_RECORDED = "Score has not been recorded with the Learning Management System. Please close the course window and launch it again.";
var STATUS_NOT_RECORDED = "Your completion status has not been recorded with the Learning Management System. Please contact administrator for further assistance.";
var TIMEOUT_MESSAGE = "Your course session has timed out due to inactivity. Click OK to close the course window. You can then re-open the course and resume at the last lesson where you left off.";
var API_ERROR = "Unable to locate the LMS's API Implementation";
var CLOSE_MESSAGE = "Your course progress has been recorded with the learning management system. Please click the 'Exit' above to go back to home page.";
var API_NOT_FOUND = "Error - Unable to locate the LMS's API Implementation, content may not play properly and results may not be recorded.  Please contact technical support.";
///////////// END /////////////////////////////////////

///////////// SCORM Error Codes /////////////////////////////////////
var CODE_0 = "No Error";
var CODE_101 = "General exception";
var CODE_201 = "Invalid argument error";
var CODE_202 = "Element cannot have children";
var CODE_203 = "Element not an array - cannot have count";
var CODE_301 = "Not initialized";
var CODE_401 = "Not implemented error";
var CODE_402 = "Invalid set value, element is a keyword";
var CODE_403 = "Element is read only";
var CODE_404 = "Element is write only";
var CODE_405 = "Incorrect data type";
var CODE_ = "";
///////////// END /////////////////////////////////////

/////////////Set Page Title//////////////////////////////
function SetPageTitle()
{
//	document.title = COURSE_NAME;
}
SetPageTitle();

///////////// END /////////////////////////////////////