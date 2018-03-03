/*
 * CYQ change final exam submit button
 */

var FinalExamSubmitButton = "<p class='form-font-14 color-white' style='text-align: center;margin: 5px;'>SUBMIT</p>";


var PolicySuccessBoxButton = "<a href='#' onclick='acceptAndGoNext(); return false' style='display:block; position:absolute; right:10px; bottom:10px; width:90px; height:30px; margin-bottom:0px;' class='themebutton themesimple' title='" + ContinueButton + "'><p class='form-font-14' style='margin-top: 5px; position: absolute; text-align: center; width:90px;'>CONTINUE</p></a>"
+"<script type='text/javascript'>"
+"function acceptAndGoNext(){"
+"NewDialogClose();" 
+"FlashMoveNext(true);"
+"}</script>";

var PolicyInvalidBoxButton = "<a href='#' onclick='ClosePolicyDialog(0); return false' style='display:block; position:absolute; right:10px; bottom:10px; width:90px; height:30px; margin-bottom:0px;' class='themebutton themesimple' title='" + ContinueButton + "'><p class='form-font-14' style='margin-top: 5px; position: absolute; text-align: center; width:90px;'>CONTINUE</p></a>";

var PolicyIncompleteBoxButton = "<a href='#' onclick='ClosePolicyDialog(0); return false' style='display:block; position:absolute; right:10px; bottom:10px; width:90px; height:30px; margin-bottom:0px;' class='themebutton themesimple' title='" + ContinueButton + "'><p class='form-font-14' style='margin-top: 5px; position: absolute; text-align: center; width:90px;'>CONTINUE</p></a>";