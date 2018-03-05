function CodeVideoPlayer(){

    this.PlayerID = "";
    this.EmptyGrid = "`";
    this.SpaceGrid = "``";
    this.TotalFrame = 0;
    this.CurrentFrame = 0;
    this.Speed = 1;  // 1 = 250ms/frame
    this.AutoStart = true;
    this.AutoReplay = false;
    this.VideoTimer = null;
    this.isPlaying = false;

}

CodeVideoPlayer.prototype.CreateVideo = function(JSONString,PlayerID){

    if(typeof JSONString !== 'string' || typeof PlayerID !== 'string'){
        return false;
    }

    //Whene create second video, reset some parameters First.
    CodeVideoPlayer.TotalFrame = 0;
    CodeVideoPlayer.CurrentFrame = 0;
    clearInterval(CodeVideoPlayer.VideoTimer);
    CodeVideoPlayer.isPlaying = false;

    CodeVideoPlayer.PlayerID = PlayerID;
    CodeVideoPlayer.JSONString = JSONString;
    CodeVideoPlayer.JSONObj =  JSON.parse(JSONString);
    var MappingResult = ContentMapping();
    CodeVideoPlayer.ContentMap = MappingResult.ContentMap;
    CodeVideoPlayer.SpaceMap = MappingResult.SpaceMap;
    CodeVideoPlayer.RealFrame = CreateRealFrame();
    CodeVideoPlayer.VirtualFrame = CreateVirtualFrame();
    CodeVideoPlayer.VideoFrame = CreateVideoFrame();
    if(CodeVideoPlayer.AutoStart){
        CodeVideoPlayer.Play();
    }

    function ContentMapping(){
        var ContentMap = [];
        var SpaceMap = {};
        CodeVideoPlayer.JSONObj.forEach(function (items, key) {
            items.highlights.forEach(function (info, index) {
                var textArray = info.selection.split("");
                textArray.forEach(function (chr, number) {
                    if(typeof ContentMap[parseInt(info.begin_line)] === 'undefined'){
                        ContentMap[parseInt(info.begin_line)] = [];
                    }
                    ContentMap[parseInt(info.begin_line)][parseInt(info.begin_ch)+number] = chr;
                })
            })
        });

        ContentMap.forEach(function (line, lineKey) {
            var firstChrHappened = false;
            for(var chrPos=0; chrPos<=line.length-1; chrPos++){
                if(typeof ContentMap[lineKey][chrPos] !== 'undefined' && !firstChrHappened){
                    firstChrHappened = true;
                    for (var i = 0; i < chrPos; i++){
                        SpaceMap[lineKey+'-'+i]['beforeChr'] = chrPos;
                    }
                }
                if(typeof ContentMap[lineKey][chrPos] === 'undefined'){
                    ContentMap[lineKey][chrPos] = CodeVideoPlayer.SpaceGrid;
                    if(firstChrHappened){
                        SpaceMap[lineKey+'-'+chrPos] = 'reserved';
                    }else {
                        SpaceMap[lineKey + '-' + chrPos] = {type: 'indent', beforeChr: 0, happenedframe: 0};
                    }
                }
            }
        });

        var frameCount = 0;
        CodeVideoPlayer.JSONObj.forEach(function (items, key) {
            items.highlights.forEach(function (info, index) {

                var textArray = info.selection.split("");
                var chrPos = parseInt(info.begin_ch);
                var linePos = parseInt(info.begin_line);
                var indentBeforeChr = (typeof SpaceMap[linePos + '-0'] !== 'undefined') ? SpaceMap[linePos + '-0']['beforeChr'] : -1 ;

                textArray.forEach(function (chr, n) {
                    frameCount ++;
                    if (SpaceMap[linePos + '-' + (chrPos - 1)] === 'reserved') {
                        SpaceMap[linePos + '-' + (chrPos - 1)] = {type: 'reserved', happenedframe: frameCount};
                    }
                    if (chrPos === indentBeforeChr){
                        for(var i=0; i<indentBeforeChr; i++){
                            SpaceMap[linePos + '-' + i]['happenedframe'] = frameCount;
                        }
                    }
                    chrPos ++;
                })
            })
        });

        return {ContentMap: ContentMap, SpaceMap: SpaceMap}
    }

    function CreateRealFrame(){
        var RealFrame = [[]];
        CodeVideoPlayer.TotalFrame ++ ;
        CodeVideoPlayer.ContentMap.forEach(function (line, lineKey) {
            line.forEach(function (chr, chrPos) {
                if(typeof RealFrame[0][lineKey] === 'undefined'){
                    RealFrame[0][lineKey] = [];
                }
                if(chr === CodeVideoPlayer.SpaceGrid){
                    RealFrame[0][lineKey][chrPos] = CodeVideoPlayer.SpaceGrid;
                }else {
                    RealFrame[0][lineKey][chrPos] = CodeVideoPlayer.EmptyGrid;
                }
            })
        });

        CodeVideoPlayer.JSONObj.forEach(function (items, key) {
            items.highlights.forEach(function (info, index) {

                var textArray = info.selection.split("");
                var chrPos = info.begin_ch;

                textArray.forEach(function (chr, n) {

                    CodeVideoPlayer.TotalFrame ++ ;
                    RealFrame.push([]);

                    RealFrame[RealFrame.length-2].forEach(function(line,lineKey){
                        RealFrame[RealFrame.length-1][lineKey] = [];
                        line.forEach(function(chr,chrPos){
                            RealFrame[RealFrame.length-1][lineKey].push(chr);
                        })
                    })

                    if(RealFrame[RealFrame.length-2][info.begin_line][chrPos] === CodeVideoPlayer.EmptyGrid){
                        RealFrame[RealFrame.length-1][info.begin_line][chrPos] = chr;
                    }else {
                        RealFrame[RealFrame.length-1][info.begin_line].splice(chrPos, 0, chr);
                    }
                    chrPos ++;
                })
            })
        });

        return RealFrame;
    }

    function CreateVirtualFrame(){
        var VirtualFrame = [];
        CodeVideoPlayer.RealFrame.forEach(function (Frame, frameKey) {
            VirtualFrame[frameKey] = [];
            Frame.forEach(function (line, lineKey) {
                var isJunkLine = true;
                VirtualFrame[frameKey].push([]);
                line.forEach(function (chr, chrPos) {
                    if(chr !== CodeVideoPlayer.EmptyGrid && chr !== CodeVideoPlayer.SpaceGrid){
                        isJunkLine = false;
                        VirtualFrame[frameKey][VirtualFrame[frameKey].length-1].push(chr);
                    }
                    if(chr === CodeVideoPlayer.SpaceGrid){
                        if(CodeVideoPlayer.SpaceMap[lineKey+'-'+chrPos].type === 'reserved' && frameKey >= CodeVideoPlayer.SpaceMap[lineKey+'-'+chrPos].happenedframe){
                            isJunkLine = false;
                            VirtualFrame[frameKey][VirtualFrame[frameKey].length-1].push(' ');
                        }
                        if(CodeVideoPlayer.SpaceMap[lineKey+'-'+chrPos].type === 'indent' && frameKey >= CodeVideoPlayer.SpaceMap[lineKey+'-'+chrPos].happenedframe){
                            isJunkLine = false;
                            VirtualFrame[frameKey][VirtualFrame[frameKey].length-1].push("&nbsp;");

                        }
                    }
                })
                if(isJunkLine){
                    VirtualFrame[frameKey].splice(-1,1)
                }
            })
        })
        return VirtualFrame;
    }

    function CreateVideoFrame(){
        var VideoFrame = [];
        CodeVideoPlayer.VirtualFrame.forEach(function (Frame, frameKey) {
            VideoFrame[frameKey] = [];
            var frameContent = '';

            Frame.forEach(function (line, lineKey) {
                frameContent += '<span id="line-'+lineKey+'" style="display:block;color: white; font-size: 16px; vertical-align: text-top;">'+CodeVideoPlayer.htmlEncode(line.join(''))+'</span>';
            })
            VideoFrame[frameKey] = frameContent;
        })

        return VideoFrame;
    }
}

CodeVideoPlayer.prototype.Play = function(){

    CodeVideoPlayer.isPlaying = true;

    CodeVideoPlayer.VideoTimer = setInterval(function () {

        $('#'+CodeVideoPlayer.PlayerID).html(CodeVideoPlayer.VideoFrame[CodeVideoPlayer.CurrentFrame]);
        CodeVideoPlayer.CurrentFrame ++;

        if(CodeVideoPlayer.CurrentFrame === CodeVideoPlayer.VideoFrame.length){
            CodeVideoPlayer.CurrentFrame = 0;
            if(!CodeVideoPlayer.AutoReplay){
                CodeVideoPlayer.isPlaying = false;
                clearInterval(CodeVideoPlayer.VideoTimer);
                CodeVideoPlayer.VideoEnded();
            }
        }

    },(1/CodeVideoPlayer.Speed)*250);

}

CodeVideoPlayer.prototype.Replay = function(){
    clearInterval(CodeVideoPlayer.VideoTimer);
    CodeVideoPlayer.CurrentFrame = 0;
    CodeVideoPlayer.Play();
}

CodeVideoPlayer.prototype.Pause = function(){
    CodeVideoPlayer.isPlaying = false;
    clearInterval(CodeVideoPlayer.VideoTimer);
}

CodeVideoPlayer.prototype.Stop = function(){
    CodeVideoPlayer.isPlaying = false;
    CodeVideoPlayer.CurrentFrame = 0;
    clearInterval(CodeVideoPlayer.VideoTimer);
}

CodeVideoPlayer.prototype.ChangeSpeed = function(Speed){
    CodeVideoPlayer.Speed = Speed;
    if(CodeVideoPlayer.isPlaying){
        CodeVideoPlayer.Pause();
        CodeVideoPlayer.Play();
    }
}

CodeVideoPlayer.prototype.GoToNextFrame = function(){
    clearInterval(CodeVideoPlayer.VideoTimer);
    if(CodeVideoPlayer.CurrentFrame < CodeVideoPlayer.VideoFrame.length-1){
        CodeVideoPlayer.CurrentFrame ++ ;
        $('#'+CodeVideoPlayer.PlayerID).html(CodeVideoPlayer.VideoFrame[CodeVideoPlayer.CurrentFrame]);
    }
}

CodeVideoPlayer.prototype.BackToLastFrame = function(){
    clearInterval(CodeVideoPlayer.VideoTimer);
    if(CodeVideoPlayer.CurrentFrame > 0){
        CodeVideoPlayer.CurrentFrame -- ;
        $('#'+CodeVideoPlayer.PlayerID).html(CodeVideoPlayer.VideoFrame[CodeVideoPlayer.CurrentFrame]);
    }
}

CodeVideoPlayer.prototype.htmlEncode = function(str) {
    var buf = [];

    for (var i=str.length-1;i>=0;i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }

    return buf.join('');
}

CodeVideoPlayer.prototype.htmlDecode = function(str) {
    return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
}
