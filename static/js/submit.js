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
