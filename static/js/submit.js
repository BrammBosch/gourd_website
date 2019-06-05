function getSelectValues(select) {


    var result = [];
    var tijdelijkeLijst = [];
    var opt;
    var options;


    for (var a = 0, aLen = select.length; a < aLen; a++) {

        options = select[a] && select[a].options;

        for (var i = 0, iLen = options.length; i < iLen; i++) {
            opt = options[i];
            if (opt.selected) {
                tijdelijkeLijst.push(opt.text);
            }
        }
        result.push(tijdelijkeLijst);
        tijdelijkeLijst = [];

    }


    $.ajax(
        {
            type: 'POST',
            contentType: 'application/json;charset-utf-08',
            dataType: 'json',
            url: '/tool?value=' + result,
            success: function (data) {
                var reply = data.reply;
                if (reply == "success") {

                } else {
                    alert("some error ocured in session agent")
                }

            }
        }
    );


}
