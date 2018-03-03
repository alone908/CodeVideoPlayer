function IEngineScriptHandler(xml, option) {

    if (xml === undefined || option === undefined || option.TagSearchRule === undefined) {
        return false;
    }

    if(option.File === undefined) option.File = '';
    if(option.RemoveScript === undefined) option.RemoveScript = true;
    if(option.RunIEngScript === undefined) option.RunIEngScript = true;
    if(option.Recursive === undefined) option.Recursive = true;
    if(option.PrintConsole === undefined) option.PrintConsole = true;
    if(option.ScriptNumberLimit === undefined) option.ScriptNumberLimit = 3;

    option.TagSearchRule.forEach(function (rule, index) {
        if (rule.tag !== undefined && typeof rule.tag === 'object') {
            rule.tag.forEach(function (tagName, index) {
                $(xml).find(tagName).each(function (key, node) {
                    if (rule.conditions !== undefined) {
                        rule.conditions.forEach(function (condi, index) {
                            if (isVerified(node, condi.verify)) {
                                ScriptHandler(node);
                            }
                        })
                    }
                    else {
                        ScriptHandler(node);
                    }
                })
            })
        }
    })

    function isVerified(node, verify) {
        for (var index in verify) {
            if (index === 'parentIs') {
                if (node.parentNode.tagName !== verify.parentIs) return false;
            }
            if (index === 'hasAttr') {
                for (var attr in verify.hasAttr) {
                    if (verify.hasAttr[attr] === '_any') {
                        if (node.getAttribute(attr) === null) return false;
                    }
                    if (verify.hasAttr[attr] !== '_any') {
                        if (node.getAttribute(attr) !== verify.hasAttr[attr]) return false;
                    }
                }
            }
        }

        return true;
    }

    function ScriptHandler(node, data) {

        data = (data === undefined) ? {logText: '', iEngScriptErrorLogText: '', level: 0, scriptFoundCount: 0, tagSearched: node.tagName, iEngScriptErrorCount: 0} : data;

        var childrenOfNode = $(node).children(); //Fix for IE, using jQuery method get parent and children instead of html dom object.

        if(option.Recursive && childrenOfNode.length !== 0){

            for(var index=0; index < childrenOfNode.length; index ++){ // Fix for IE9, using basic for loop instead of using for(var in node.childNodes).

                data.level++;
                var returnData = ScriptHandler(childrenOfNode[index], {
                    scriptFoundCount: data.scriptFoundCount,
                    iEngScriptErrorCount: data.iEngScriptErrorCount,
                    logText: data.logText,
                    iEngScriptErrorLogText: data.iEngScriptErrorLogText,
                    level: data.level,
                    tagSearched: data.tagSearched
                });
                data.scriptFoundCount = returnData.scriptFoundCount;
                data.iEngScriptErrorCount = returnData.iEngScriptErrorCount;
                data.logText = returnData.logText;
                data.iEngScriptErrorLogText = returnData.iEngScriptErrorLogText;
                data.level--;

                if (returnData.logText !== '' && Number(index) === childrenOfNode.length - 1 && data.level === 0) {
                    console.log(returnData.logText);
                }
                if (returnData.iEngScriptErrorLogText !== '' && Number(index) === childrenOfNode.length - 1 && data.level === 0) {
                    console.log(returnData.iEngScriptErrorLogText);
                }

            }

        }
        else {

            var scriptRemoved = false;
            var iEngineScriptHasError = false;
            var iEngScriptSyntaxError = '';
            var scriptRemovedWithError = false;
            var regRemove = new RegExp("<(\\s|\\n)*?script(.|\\s|\\n)*?>(.|\\s|\\n)*?(<(\\s|\\n)*?\/(\\s|\\n)*?script(\\s|\\n)*?>|$)", "gi");
            var regComment = new RegExp("<!--[^]*?-->", "g");
            var regIEngScript = new RegExp("<(\\s|\\n)*?iEngineScript(.|\\s|\\n)*?>(.|\\s|\\n)*?<(\\s|\\n)*?\/(\\s|\\n)*?iEngineScript(\\s|\\n)*?>", "g");
            var regScriptCloseTag = new RegExp("<(\\s|\\n)*?\/(\\s|\\n)*?script(\\s|\\n)*?>", "gi");

            for(var index = 0; index < node.childNodes.length; index ++) { // Fix for IE9, using basic for loop instead of using for(var in node.childNodes).

                if (node.childNodes[index].nodeName === '#text' || node.childNodes[index].nodeName === '#cdata-section') {

                    var nodeText = node.childNodes[index].nodeValue; // Fix for IE9, using nodeValue instead of using textContent.

                    if(option.RemoveScript){
                        var matchRemoveRes = nodeText.match(regRemove);
                        if (matchRemoveRes !== null) {
                            matchRemoveRes.forEach(function(matchText,i){
                                if(matchText.match(regScriptCloseTag) === null){
                                    scriptRemovedWithError = true;
                                }
                            })
                            node.childNodes[index].nodeValue = nodeText.replace(regRemove, ''); // Fix for IE9, using nodeValue instead of using textContent.
                            scriptRemoved = true;
                        }
                    }

                    if(option.RunIEngScript) {

                        var matchComment = nodeText.match(regComment);
                        if(matchComment !== null){
                            matchComment.forEach(function (comment, n) {
                                var matchIEngScript = comment.match(regIEngScript);
                                if(matchIEngScript !== null){
                                    matchIEngScript.forEach(function (iEngScript, i) {
                                        var ScriptObj = IEngScriptSyntaxCheck(iEngScript);
                                        if(typeof ScriptObj === 'string' && ScriptObj.indexOf('iEngineScript Error:') !== -1){
                                            iEngineScriptHasError = true;
                                            iEngScriptSyntaxError += ScriptObj+'\n';
                                        }else {
                                            node.childNodes[index].nodeValue = node.childNodes[index].nodeValue+'\n'+IEngScriptWriter(node.childNodes[index],ScriptObj); // Fix for IE9, using nodeValue instead of using textContent.
                                        }
                                    })
                                }
                            })
                        }

                    }
                }
            }

            if (scriptRemoved && option.RemoveScript && option.PrintConsole) {
                data.scriptFoundCount++;
                var logData = ConsoleLog(node, {log: [], scriptFoundCount: data.scriptFoundCount, tagSearched: data.tagSearched, logType: 'RemoveScript', scriptRemovedWithError: scriptRemovedWithError});
                data.logText += logData.log + '\n';
                if ( childrenOfNode.length === 0 && data.level === 0 ) {
                    console.log(data.logText);
                }
            }

            if (iEngineScriptHasError && option.RunIEngScript && option.PrintConsole) {
                data.iEngScriptErrorCount++;
                var iEngScriptLogData = ConsoleLog(node, {log: [], iEngScriptErrorCount: data.iEngScriptErrorCount, tagSearched: data.tagSearched, logType: 'iEngScriptError', iEngScriptSyntaxError: iEngScriptSyntaxError});
                data.iEngScriptErrorLogText += iEngScriptLogData.log + '\n';
                if ( childrenOfNode.length === 0 && data.level === 0 ) {
                    console.log(data.iEngScriptErrorLogText);
                }
            }

        }

        return {scriptFoundCount: data.scriptFoundCount, logText: data.logText, iEngScriptErrorLogText: data.iEngScriptErrorLogText, level: data.level, iEngScriptErrorCount: data.iEngScriptErrorCount};
    }

    function IEngScriptSyntaxCheck(iEngScript){

        var SyntaxCheck = true;
        var SyntaxCheckError = '';
        var TimerID, StartDelay, CommandObj=[];

        iEngScriptXML = $.parseXML( iEngScript );
        var CommandLines = $(iEngScriptXML).find("CommandLine");

        var iEngineScriptOpPool = {
            show: { parameters: [] },
            hide: { parameters: [] },
            fadein: { parameters: ['time'] },
            fadeout: { parameters: ['time'] },
            fadeto: { parameters: ['time','opacity'] },
            addclass: { parameters: ['class'] },
            removeclass: { parameters: ['class'] },
            css: { parameters: ['key','value'] }
        }

        $(iEngScriptXML).find('iEngineScript').each(function (i,node) {
            if(i===0){

                TimerID = $(node).attr('ID') !== undefined && $(node).attr('ID') !== '' && $(node).attr('ID') ;
                if(!TimerID){
                    SyntaxCheck = false;
                    SyntaxCheckError = 'iEngineScript Error: iEngineScript ID is missing !'
                }
                if(parseInt(TimerID) > option.ScriptNumberLimit){
                    SyntaxCheck = false;
                    SyntaxCheckError = 'iEngineScript Error: iEngineScript ID is out of limit !'
                }
                StartDelay = ($(node).attr('StartDelay') !== undefined && $(node).attr('StartDelay') !== '') ? $(node).attr('StartDelay') : '0';
                return false;

            }
        })

        if(!SyntaxCheck){ return SyntaxCheckError; }

        CommandLines.each(function (i,command) {

            var op = $(command).attr('op') !== undefined && $(command).attr('op') !== '' && $(command).attr('op') ;
            var mode = $(command).attr('mode') !== undefined && $(command).attr('mode') !== '' && $(command).attr('mode') ;
            var selector = $(command).attr('selector') !== undefined && $(command).attr('selector') !== '' && $(command).attr('selector') ;

            if(!selector){
                SyntaxCheck = false;
                SyntaxCheckError = 'iEngineScript Error: CommandLine selector is not defined !';
                return false;
            }
            if(!mode){
                SyntaxCheck = false;
                SyntaxCheckError = 'iEngineScript Error: CommandLine mode is not defined !';
                return false;
            }
            if(mode !== 'video' && mode !== 'fast' && mode !== 'video,fast' && mode !== 'fast,video' ){
                SyntaxCheck = false;
                SyntaxCheckError = 'iEngineScript Error: CommandLine mode is not correct, try: \'video\', \'fast\', \'video,fast\', or \'fast,video\' !';
                return false;
            }
            if(!op){
                SyntaxCheck = false;
                SyntaxCheckError = 'iEngineScript Error: CommandLine op is not defined !';
                return false;
            }
            if(iEngineScriptOpPool[op] === undefined){
                SyntaxCheck = false;
                SyntaxCheckError = 'iEngineScript Error: CommandLine op:'+op+' is not defined !';
                return false;
            }
            if(iEngineScriptOpPool[op] !== undefined && op ){
                iEngineScriptOpPool[op].parameters.forEach(function (para,i) {
                    if($(command).attr(para) === undefined || $(command).attr(para) === ''){
                        SyntaxCheck = false;
                        SyntaxCheckError = 'iEngineScript Error: CommandLine op:'+op+' is missing parameter:'+para+' !';
                        return false;
                    }
                })
            }

            if(!SyntaxCheck){ return false; }

            CommandObj.push({
                selector: selector,
                op: op,
                mode: mode,
                time: $(command).attr('time'),
                opacity: $(command).attr('opacity'),
                class: $(command).attr('class'),
                key: $(command).attr('key'),
                value: $(command).attr('value')
            });

        })

        if(!SyntaxCheck){ return SyntaxCheckError; }

        return {TimerID: TimerID, StartDelay: StartDelay, CommandObj: CommandObj};
    }

    function IEngScriptWriter(node, ScriptObj) {

        var scriptHead = 'var iEngineScript'+ScriptObj.TimerID+' = setTimeout(function () {\n';
        var scriptBody = '';
        var scriptFoot = '},'+ScriptObj.StartDelay+');';

        ScriptObj.CommandObj.forEach(function (command, i) {

            if(command.mode === 'video,fast' || command.mode === 'fast,video'){ var condi = '  if(CourseMode === \'Video\' || CourseMode === \'Fast\'){\n' }
            if(command.mode === 'video'){ var condi = '  if(CourseMode === \'Video\'){\n' }
            if(command.mode === 'fast'){ var condi = '  if(CourseMode === \'Fast\'){\n' }

            switch (command.op){
                case 'show':
                case 'hide':

                    if(command.op === 'show') scriptBody += condi + '    $(\''+command.selector+'\').show();\n'+'  }\n';
                    if(command.op === 'hide') scriptBody += condi + '    $(\''+command.selector+'\').hide();\n'+'  }\n';

                    break;

                case 'fadein':
                case 'fadeout':

                    if(command.op === 'fadein') scriptBody += condi + '    $(\''+command.selector+'\').fadeIn('+command.time+');\n'+'  }\n';
                    if(command.op === 'fadeout') scriptBody += condi + '    $(\''+command.selector+'\').fadeOut('+command.time+');\n'+'  }\n';

                    break;

                case 'fadeto':

                    scriptBody += condi + '    $(\''+command.selector+'\').fadeTo('+command.time+','+command.opacity+');\n'+'  }\n';

                    break;

                case 'addclass':
                case 'removeclass':

                    if(command.op === 'addclass') scriptBody += condi + '    $(\''+command.selector+'\').addClass(\''+command.class+'\');\n'+'  }\n';
                    if(command.op === 'removeclass') scriptBody += condi + '    $(\''+command.selector+'\').removeClass(\''+command.class+'\');\n'+'  }\n';

                    break;

                case 'css':

                    scriptBody += condi + '    $(\''+command.selector+'\').css(\''+command.key+'\',\''+command.value+'\');\n'+'  }\n';

                    break;
            }
        });

        return '<script>\n$(document).ready(function(){\n'+scriptHead+scriptBody+scriptFoot+'\n'+'})\n</script>\n';
    }

    function ConsoleLog(node, data) {

        var nthOfNode = 0;
        if(option.File === 'course.xml'){
            var module = (data.module === undefined && node.tagName === 'Module') ? node.getAttribute('Name') : data.module;
            var page = (data.page === undefined && node.tagName === 'Page') ? node.getAttribute('Name') : data.page;
        }
        if(option.File === 'preexam.xml'){
            var qFriendlyName = (data.qFriendlyName === undefined && node.tagName === 'Question') ? node.getAttribute('FriendlySectionName') : data.qFriendlyName;
        }
        if(option.File === 'exam.xml'){
            if(data.qFriendlyName === undefined && node.tagName === 'Question'){
                var qFriendlyName;
                $(node).find('QuestionText').each(function (i,eachNode) {
                    qFriendlyName = eachNode.getAttribute('QuestionCategory') ;
                })
            }else {
                var qFriendlyName = data.qFriendlyName ;
            }
        }

        var parentObj = $(node).parent();   //Fix for IE, using jQuery method get parent and children instead of html dom object
        var parentNode = parentObj[0];

        if(parentObj.length !== 0 && parentNode.nodeName !== '#document'){

            var childrenOfParentNode = $(parentNode).children();

            for(var index=0; index < childrenOfParentNode.length; index ++){ // Fix for IE9, using basic for loop instead of using for(var in node.childNodes).
                if (childrenOfParentNode[index].tagName === node.tagName) {
                    nthOfNode++;
                }
                if (childrenOfParentNode[index] === node) {
                    data.log.push(node.tagName + ':nth(' + nthOfNode + ')');
                    break;
                }
            }

            var returnData = ConsoleLog(parentNode, {
                log: data.log,
                logType: data.logType,
                module: module,
                page: page,
                qFriendlyName: qFriendlyName,
                scriptFoundCount: data.scriptFoundCount,
                iEngScriptErrorCount: data.iEngScriptErrorCount,
                tagSearched: data.tagSearched,
                iEngScriptSyntaxError: data.iEngScriptSyntaxError,
                scriptRemovedWithError: data.scriptRemovedWithError
            });

            data.log = returnData.log;

        }
        else {

            data.log.push(node.tagName);
            data.log = data.log.reverse().join(' -> ');
            if(data.logType === 'RemoveScript'){
                var removeScriptErrorText = (data.scriptRemovedWithError) ? '(with error: close tag <\/script> is missing)' : '';
                if (data.scriptFoundCount === 1){
                    var moduleLogText = (data.module === undefined) ? '' : 'Module: ' + data.module + '\n';
                    var pageLogText = (data.page === undefined) ? '' : 'Page: ' + data.page + '\n';
                    var qFriendlyNameLogText = (data.qFriendlyName === undefined) ? '' : 'Question Friendly Name: ' + data.qFriendlyName + '\n';
                    data.log = 'File: ' + option.File + '\nTag Searched: ' + data.tagSearched + '\n'+moduleLogText+pageLogText+qFriendlyNameLogText+'Script Removed'+removeScriptErrorText+'(' + data.scriptFoundCount + '): ' + data.log;
                }
                if (data.scriptFoundCount > 1) data.log = 'Script Removed'+removeScriptErrorText+'(' + data.scriptFoundCount + '): ' + data.log;
            }else if(data.logType === 'iEngScriptError'){
                if(data.iEngScriptErrorCount === 1){
                    var moduleLogText = (data.module === undefined) ? '' : 'Module: ' + data.module + '\n';
                    var pageLogText = (data.page === undefined) ? '' : 'Page: ' + data.page + '\n';
                    var qFriendlyNameLogText = (data.qFriendlyName === undefined) ? '' : 'Question Friendly Name: ' + data.qFriendlyName + '\n';
                    data.log = 'File: ' + option.File + '\nTag Searched: ' + data.tagSearched + '\n'+moduleLogText+pageLogText+qFriendlyNameLogText+data.iEngScriptSyntaxError+'(at '+data.log+')';
                }
                if(data.iEngScriptErrorCount > 1) data.log = data.iEngScriptSyntaxError+'(at '+data.log+')';
            }

        }

        return {
            log: data.log,
            module: module,
            page: page,
            qFriendlyName: qFriendlyName,
            scriptFoundCount: data.scriptFoundCount,
            iEngScriptSyntaxError: data.iEngScriptSyntaxError,
            scriptRemovedWithError: data.scriptRemovedWithError
        };
    }

    return xml;

}
