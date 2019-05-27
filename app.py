from flask import Flask, render_template, jsonify, request

app = Flask(__name__, static_folder="static", static_url_path="")


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/tool', methods=['GET', 'POST'])
def tool():
    lijstWaardes = {"bittergourd": ['plant', 'bitter', 'gen'], "obesitas": ['gen', 'symptoon'],
                    "diabetes": ['ziekte', 'suiker', 'bloedsuiker']}

    javaScriptCode = ""
    multipleMenu = ""
    i = 0
    listKeys = []

    for key, value in lijstWaardes.items():
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

    return render_template('tool.html', dic=lijstWaardes, javaScriptCode=javaScriptCode, multipleMenu=multipleMenu)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80)


