///////////////////Global Variables///////////////////////
var IE_NAME = "MSIE";
var FF_NAME = "FIREFOX";
var SF_NAME = "SAFARI";
var CH_NAME = "CHROME";
var WIN_NAME = "WIN";
var MAC_NAME = "MAC";
var LINUX_NAME = "LINUX";
var IPAD_NAME = "IPAD";
var IPHONE_NAME = "IPHONE";
var ANDROID_NAME = "ANDROID";
var NEXUS_NAME = "NEXUS";

var MIN_IE_VERSION = 8.0;
var MIN_FIREFOX_VERSION = 11.0;
var MIN_CHROME_VERSION = 18.0;
var MIN_SAFARI_VERSION = 5.0;
var MIN_SAFARI_IPAD_VERSION = 0;
var MIN_SAFARI_IPHONE_VERSION = 0;
var MIN_ANDRIOD_VERSION = 0;

var ALLOW_MIN_FLASH_VERSION = "6.0.47";
var DISALLOW_FLASH_VERSION = 0;
var ALLOW_MIN_RESOLUTION = '800|600';

var CHECK_SCREEN_RESOLUTION = false;
var CHECK_FLASH_VERSION = false;
var CHECK_FLASH_VERSION_ON_NEXUS = true;
var CHECK_OS = false;

var WARNING_FOR_BROWSERVERSION = 1;
var WARNING_FOR_FLASHVERSION = 1;
var WARNING_FOR_RESOLUTION = 1;

var REDIRECT_SUPPORT_PAGE = 'support.htm';

var _ClientDebug = false;

///////////////////////////////////////////////////////


ValidateBrowser = function () {
	//debugger;
	var _mOS = GetOperatingSystem();
	_mOS = _mOS.toUpperCase();
	var _mBrowserName = GetBrowserType();
	_mBrowserName = _mBrowserName.toUpperCase();
	var _mBrowserVersion = $.browser.version; // Returns the value in float

	var strUserAgent = navigator.userAgent.toUpperCase();
	var IsAndroidDevice = false;
	var IsNexusDevice = false;

	if (_ClientDebug) {
		alert("OS = " + _mOS + " -- Browser = " + _mBrowserName + " -- Version = " + _mBrowserVersion);
		alert(strUserAgent);
	}
	var doRedirectToSupport = true;

	if (CHECK_SCREEN_RESOLUTION) {
		var screenResolutionX, screenResolutionY;
		screenResolutionX = ALLOW_MIN_RESOLUTION.split("|")[0] * 1;
		screenResolutionY = ALLOW_MIN_RESOLUTION.split("|")[1] * 1;
		if ((screen.width < screenResolutionX) || (screen.height < screenResolutionY)) {
			doRedirectToSupport = true;
		}
		else {
			WARNING_FOR_RESOLUTION = 0;
		}
	}
	else if (CHECK_OS) {
	}
	else {
		switch (_mOS) {
			case WIN_NAME:
			{
				if (_mBrowserName == IE_NAME && (MIN_IE_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_IE_VERSION))) {
					WARNING_FOR_BROWSERVERSION = 0;
					doRedirectToSupport = false;
					if (CHECK_FLASH_VERSION) {

					}
				}
				else if (_mBrowserName == FF_NAME && (MIN_FIREFOX_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_FIREFOX_VERSION))) {
					WARNING_FOR_BROWSERVERSION = 0;
					doRedirectToSupport = false;
				}
				else if (_mBrowserName == CH_NAME && (MIN_CHROME_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_CHROME_VERSION))) {
					WARNING_FOR_BROWSERVERSION = 0;
					doRedirectToSupport = false;
				}
				else if (_mBrowserName == SF_NAME && (MIN_SAFARI_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_SAFARI_VERSION))) {
					WARNING_FOR_BROWSERVERSION = 0;
					doRedirectToSupport = false;
				}
				break;
			}
			case MAC_NAME:
			{
				if (_mBrowserName == FF_NAME && (MIN_FIREFOX_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_FIREFOX_VERSION))) {
					WARNING_FOR_BROWSERVERSION = 0;
					doRedirectToSupport = false;
				}
				else if (_mBrowserName == CH_NAME && (MIN_CHROME_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_CHROME_VERSION))) {
					WARNING_FOR_BROWSERVERSION = 0;
					doRedirectToSupport = false;
				}
				else if (_mBrowserName == SF_NAME && (MIN_SAFARI_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_SAFARI_VERSION))) {
					WARNING_FOR_BROWSERVERSION = 0;
					doRedirectToSupport = false;
				}
				break;
			}
			case LINUX_NAME:
			{
				//Checking Andriod OS
				if (strUserAgent.indexOf(ANDROID_NAME)) {
					IsAndroidDevice = true;
					//Checking Nexus Deviuce
					if (strUserAgent.indexOf(NEXUS_NAME)) {
						//Allow Chrome and Firefox if Device is Nexus
						IsNexusDevice = true;
						if (_mBrowserName == CH_NAME && (MIN_CHROME_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_CHROME_VERSION))) {
							WARNING_FOR_BROWSERVERSION = 0;
							doRedirectToSupport = false;
						}
						else if (_mBrowserName == FF_NAME && (MIN_FIREFOX_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_FIREFOX_VERSION))) {
							WARNING_FOR_BROWSERVERSION = 0;
							doRedirectToSupport = false;
						}
					}
					else {
						//Allow only safari on Andriod OS and if Device is not Nexus
						if (_mBrowserName == SF_NAME && (MIN_SAFARI_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_SAFARI_VERSION))) {
							WARNING_FOR_BROWSERVERSION = 0;
							doRedirectToSupport = false;
						}
					}
				}
				else {
					//For all other Linux opertating systems
					if (_mBrowserName == FF_NAME && (MIN_FIREFOX_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_FIREFOX_VERSION))) {
						WARNING_FOR_BROWSERVERSION = 0;
						doRedirectToSupport = false;
					}
					else if (_mBrowserName == CH_NAME && (MIN_CHROME_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_CHROME_VERSION))) {
						WARNING_FOR_BROWSERVERSION = 0;
						doRedirectToSupport = false;
					}
				}
				break;
			}
      case ANDROID_NAME:
      {
        WARNING_FOR_BROWSERVERSION = 0;
        doRedirectToSupport = false;
        break;
      }
			case IPAD_NAME:
			{
				if (_mBrowserName == SF_NAME && (MIN_SAFARI_IPAD_VERSION == 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_SAFARI_IPAD_VERSION))) {
					WARNING_FOR_BROWSERVERSION = 0;
					doRedirectToSupport = false;
				}
				break;
			}
      case IPHONE_NAME:
      {
//        if (_mBrowserName == SF_NAME && (MIN_SAFARI_IPHONE_VERSION== 0 || parseFloat(_mBrowserVersion) >= parseFloat(MIN_SAFARI_IPHONE_VERSION))) {
          WARNING_FOR_BROWSERVERSION = 0;
          doRedirectToSupport = false;
//        }
        break;
      }
		}
		//End of Switch Statement
		if (_ClientDebug) {
			alert("doRedirectToSupport = " + doRedirectToSupport);
		}
		if (!doRedirectToSupport) {
			var flashVersion = '0';
			//Get Flash Plug-in version
			var playerVersion = swfobject.getFlashPlayerVersion();
			var flashVersion = playerVersion.major + '.' + playerVersion.minor + '.' + playerVersion.release;
			var swfVer = parseFloat(flashVersion);

			//Check if HTML 5 Video is supported by browser
			var IsHTML5VideoSupported = Modernizr.video;
			//Modernizr.video.mp4;
			//Modernizr.video.webm
			if (_ClientDebug) {
				alert("IsHTML5VideoSupported = " + IsHTML5VideoSupported);
				alert("Flash Version = " + swfVer);
				alert("IsNexusDevice = " + IsNexusDevice);
			}
			if (IsHTML5VideoSupported) {
				//Added code for Nexus Device only to check Flash Version
				if (IsNexusDevice && CHECK_FLASH_VERSION_ON_NEXUS) {
					if (swfVer >= parseFloat(ALLOW_MIN_FLASH_VERSION)) {
						WARNING_FOR_FLASHVERSION = 0;
						doRedirectToSupport = false;
					}
					else {
						doRedirectToSupport = true;
					}
				}
				else {
					WARNING_FOR_FLASHVERSION = 0;
					doRedirectToSupport = false;
				}
			}
			else {
				if (_mBrowserName == IE_NAME && parseFloat(_mBrowserVersion) >= 9.0) {
					WARNING_FOR_FLASHVERSION = 0;
					doRedirectToSupport = false;
				}
				else {
					if (_ClientDebug) {
						alert("Checking Flash version for = " + swfVer);
					}
					if (swfVer >= parseFloat(ALLOW_MIN_FLASH_VERSION)) {
						WARNING_FOR_FLASHVERSION = 0;
						doRedirectToSupport = false;
					}
				}
			}
		}
	}
	//End of Else Statement
	if (doRedirectToSupport) {
		//self.location=REDIRECT_SUPPORT_PAGE;
		return false;
	}
	else {
		return true;
	}
};

GetBrowserType = function () {
	if ($.browser.msie) {
		return "MSIE";
	} else if ($.browser.mozilla) {
		return "FIREFOX";
	} else if ($.browser.webkit) {
		return GetSpecificBrowser();
	} else {
		return "UNKNOWN";
	}
};

GetSpecificBrowser = function () {
	if ($.browser.chrome) {
		return "CHROME";
	} else if ($.browser.safari) {
		return "SAFARI";
	} else if ($.browser.opera) {
		return "OPERA";
	} else {
		return "UNKNOWN";
	}
};

GetOperatingSystem = function () {
	if ($.browser.win) {
		return "WIN";
	} else if ($.browser.mac) {
		return "MAC";
	} else if ($.browser.linux) {
		return "LINUX";
	} else if ($.browser.android) {
		return "ANDROID";
	} else if ($.browser.ipad) {
		return "IPAD";
	} else if ($.browser.iphone) {
		return "IPHONE";
	} else {
		return "UNKNOWN";
	}
};