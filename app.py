from pprint import pprint

from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient

app = Flask(__name__, static_folder="static", static_url_path="")


def dataOphalen():
    client = MongoClient("mongodb+srv://textminingdata-m49re.azure.mongodb.net/test",27107,username = "admin",password = "blaat1234")
    db = client.gourd_goru
    collection = db.searchWords
    dictData = {}
    dataBaseData = collection.find({})
    for value in dataBaseData:
        dictData.update({value["upper_term"].replace(" ", "_"): value["sub_terms"]})

    pprint(dictData)
    return dictData

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/tool', methods=['GET', 'POST'])
def tool():
    dictData = dataOphalen()


    javaScriptCode = ""
    multipleMenu = ""
    i = 0
    listKeys = []

    for key, value in dictData.items():
        listKeys.append(key)
        javaScriptCode += "document.multiselect('#" + str(key) + "');"
        multipleMenu += "<select id =" + str(key) + " multiple>"
        for keyWord in value:
            multipleMenu += "<option text =" + keyWord + " value =" + str(i) + ">" + keyWord + "</option>"
            i += 1
        multipleMenu += "</select>"

    if request.method == 'POST':
        if request.form.get("submitButton") == "Use these terms":
            pass

    return render_template('tool.html', dic=dictData, javaScriptCode=javaScriptCode, multipleMenu=multipleMenu)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80)


