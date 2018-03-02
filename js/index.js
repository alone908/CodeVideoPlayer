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
        }
    }
})

function ContentMapping(jsonObj) {
    var contentMap = [];

    jsonObj.forEach(function (items, key) {
        items.highlights.forEach(function (contInfo, index) {
            var textArray = contInfo.selection.split("");
            textArray.forEach(function (chr, number) {
                if(typeof contentMap[parseInt(contInfo.begin_line)] === 'undefined'){
                    contentMap[parseInt(contInfo.begin_line)] = [];
                }
                contentMap[parseInt(contInfo.begin_line)][parseInt(contInfo.begin_ch)+number] = chr;
            })
        })
    });

    contentMap.forEach(function (line, key) {
        for(var i=0; i<=line.length-1; i++){
            if(typeof contentMap[key][i] === 'undefined'){
                contentMap[key][i] = ' ';
            }
        }
    });

    return contentMap;
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