function fill(pubmedId, articleName, journal, pubDate,score) {
    /*
    This function fills the table used on the tool page
    return: None, it is pasted straight onto the page

     */
var table = document.getElementById("myTable");

var row = table.insertRow(-1);
var cell1 = row.insertCell(0);
var cell2 = row.insertCell(1);
var cell3 = row.insertCell(2);
var cell4 = row.insertCell(3);
var cell5 = row.insertCell(4);

cell1.innerHTML = pubmedId;
cell2.innerHTML = articleName;
cell3.innerHTML = journal;
cell4.innerHTML = pubDate;
cell5.innerHTML = score;


}

