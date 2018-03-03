function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if (results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function () {

  var admin_AiccUrl = "";
  var admin_AiccSid = "";
  admin_AiccUrl = getParameterByName('AICC_URL');
  admin_AiccSid = getParameterByName('AICC_SID');

//Read licensing param
  var admin_BrandingQS = "";
  admin_Branding = getParameterByName('ReqData');

  admin_Branding_URL = getParameterByName('ApiPath');
  if (admin_Branding_URL == "") {
    admin_Branding_URL = "https://api.inspiredlms.com";
  }

  if (admin_Branding != "") {
    admin_BrandingQS = "&ReqData=" + admin_Branding + "&ApiPath=" + admin_Branding_URL;
  }

  if (admin_AiccUrl != "" && admin_AiccSid != "") {
    $('#videoMode1').attr('href', '../../index-video.htm?lang=en&mode=1&AICC_URL=' + admin_AiccUrl + '&AICC_SID=' + admin_AiccSid);
    $('#videoMode2').attr('href', '../../index-video.htm?lang=en&mode=2&AICC_URL=' + admin_AiccUrl + '&AICC_SID=' + admin_AiccSid);
    $('#fastMode').attr('href', '../../index-fast.htm?lang=en&mode=2&AICC_URL=' + admin_AiccUrl + '&AICC_SID=' + admin_AiccSid);
    $('#textMode').attr('href', '../../index-text.htm?lang=en&AICC_URL=' + admin_AiccUrl + '&AICC_SID=' + admin_AiccSid);
  }


  $('a').each(function () {
    var href = $(this).attr('href');

    if (href) {
      href += admin_BrandingQS;
      $(this).attr('href', href);
    }
  });

  var url = window.location.href;
  var arr = url.split("/");
  var hosturl = arr[0] + "//" + arr[2];

  var LogoURL = admin_Branding_URL + "/Branding/logo?reqdata=" + admin_Branding; //"//stagingapi.inspiredlms.com

  if (admin_Branding != "") {
    $.ajax({
      type: "GET",
      url: LogoURL,
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      dataType: 'json',
      success: function (response) {
        try {
          if (response != "") {
            admin_LogoBranding_url = response.FileURL;
            console.log("Logo URL: " + admin_LogoBranding_url);
            $("#logoplaceholder").attr("src", admin_LogoBranding_url);
          }
        }
        catch (e) {
        }
      }
    });
  }

});