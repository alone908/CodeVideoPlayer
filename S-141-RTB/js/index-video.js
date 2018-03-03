var json_file_list = [];

$(document).ready(function () {

    $.ajax({
        type: 'POST',
        url: "../appphp/get_json_filelist.php",
        dataType: 'JSON',
        success: function (data) {

            console.log(data.filelist);

        }
    })

})