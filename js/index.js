$.ajax({
    type: 'POST',
    url: "appphp/get_json.php",
    data: {filename:'helloworld'},
    dataType: 'JSON',
    success: function (data) {
        if(data.result === 'good'){
            console.log(data);

            var contentMap = ContentMapping(data.jsonObj);
            console.log(contentMap);

            var contnetString = WriteContentString(contentMap);
            console.log(contnetString);

            var parser = new DOMParser()
            var doc = parser.parseFromString(contnetString, "text/xml");
            console.log(doc);

            PrintOut(contentMap);
        }
    }
})

function ContentMapping(jsonObj) {
    var ContentMap = [];

    jsonObj.forEach(function (items, key) {
        items.highlights.forEach(function (contInfo, index) {
            var textArray = contInfo.selection.split("");
            textArray.forEach(function (chr, number) {
                if(typeof ContentMap[parseInt(contInfo.begin_line)] === 'undefined'){
                    ContentMap[parseInt(contInfo.begin_line)] = [];
                }
                ContentMap[parseInt(contInfo.begin_line)][parseInt(contInfo.begin_ch)+number] = chr;
            })
        })
    });

    ContentMap.forEach(function (line, key) {
        for(var i=0; i<=line.length-1; i++){
            if(typeof ContentMap[key][i] === 'undefined'){
                ContentMap[key][i] = ' ';
            }
        }
    });

    return ContentMap;
}

function WriteContentString(ContentMap) {
    var contentString = '';

    ContentMap.forEach(function (line, key) {
        line.forEach(function (chr, index) {
            contentString += chr;
        });
        contentString += "\n";
    });

    return contentString;
}

var line = 0;
var chr = 0;
var lastLine = 0;
var lastChr = 0;
function PrintOut(ContentMap) {
    var PrintOutTimer = setInterval(function () {

        $('#x'+lastChr+'y'+lastLine).css('border-right','0px');
        $('#x'+chr+'y'+line).html(ContentMap[line][chr]).css('border-right','1px solid black');

        lastChr = chr;
        lastLine = line;

        if(chr === ContentMap[line].length-1){
            line ++;
            chr = 0;
        }else {
            chr ++;
        }
        if(line === ContentMap.length && chr === 0){
            clearInterval(PrintOutTimer);
        }
    },250);
}
