function getSelectValues(select) {
    var output = document.getElementById('output');



    var result = [];
    var tijdelijkeLijst = [];
    var opt;
    var options;


    for (var a = 0, aLen = select.length; a < aLen; a++ ) {

        console.log(select)
        options = select[a] && select[a].options;

        console.log(options)
        for (var i = 0, iLen = options.length; i < iLen; i++) {
            opt = options[i];
            console.log(opt)
            if (opt.selected) {
                console.log("true")
                tijdelijkeLijst.push(opt.text);
            }
        }
    result.push(tijdelijkeLijst)
    tijdelijkeLijst = [];

    }


    console.log(result)
    output.innerHTML = result;
    $.ajax(
        {
            type: 'POST',
            contentType: 'application/json;charset-utf-08',
            dataType: 'json',
            url: '/tool?value=' + result,
            success: function (data) {
                var reply = data.reply;
                if (reply == "success") {
                    return;
                }
                else {
                    alert("some error ocured in session agent")
                }

            }
        }
    );




/*
    var result = [];
  var options = select && select[1].options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];
    console.log(opt)
    if (opt.selected) {

      result.push(opt.value || opt.text);
    }
  }
      output.innerHTML = result;

  return result;

*/




}
