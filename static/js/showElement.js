function showField(value) {

    valueText = value.options[value.selectedIndex].value
    if (valueText == "new") {
        document.getElementsByClassName("catagory")[0].style.display = "block";
    } else {
        document.getElementsByClassName("catagory")[0].style.display = "none";
    }
}