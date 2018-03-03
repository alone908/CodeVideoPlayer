function CodeVideoPlayer(){

    this.EmptyGrid = "`";
    this.SpaceGrid = "``";
    this.TotalFrame = 0;
    this.CurrentFrame = 0;
    this.Speed = 1;

}

CodeVideoPlayer.prototype.CreateVideo = function(JSONString,PlayerID){

    if(typeof JSONString !== 'string' || typeof PlayerID !== 'string'){
        return false;
    }

    CodeVideoPlayer.JSONString = JSONString;
    CodeVideoPlayer.JSONObj =  JSON.parse(JSONString);
    CodeVideoPlayer.ContentMap = ContentMapping();
    CodeVideoPlayer.RealFrame = CreateRealFrame();
    CodeVideoPlayer.VirtualFrame = CreateVirtualFrame();

    function ContentMapping(){
        var ContentMap = [];

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
            for(var chrPos=0; chrPos<=line.length-1; chrPos++){
                if(typeof ContentMap[lineKey][chrPos] === 'undefined'){
                    ContentMap[lineKey][chrPos] = CodeVideoPlayer.SpaceGrid;
                }
            }
        });

        return ContentMap;
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
                        isJunkLine = false;
                        VirtualFrame[frameKey][VirtualFrame[frameKey].length-1].push(' ');
                    }
                })
                if(isJunkLine){
                    VirtualFrame[frameKey].splice(-1,1)
                }
            })
        })
        return VirtualFrame;
    }
}
