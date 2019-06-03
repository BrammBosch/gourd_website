from flask import Flask, render_template, request
from pymongo import MongoClient
import subprocess

app = Flask(__name__, static_folder="static", static_url_path="")



def data_ophalen():
    """
    In this function a connection is made with the Mongo database and is where we put all our queries.

    :return: The data from the database in dictionarys
    """
    client = MongoClient("mongodb+srv://textminingdata-m49re.azure.mongodb.net/test", 27107, username="admin",
                         password="blaat1234")
    db = client.gourd_goru
    collection = db.searchWords
    dict_data = {}
    data_base_data = collection.find({})
    for value in data_base_data:
        dict_data.update({value["upper_term"].replace(" ", "_"): value["sub_terms"]})

    return dict_data


def push_data(selected_key, term_text, catagory_text):
    """

    :param selected_key: selected_key uses
    :param term_text:
    :param catagory_text:
    :return:
    """
    client = MongoClient("mongodb+srv://textminingdata-m49re.azure.mongodb.net/test", 27107, username="admin",
                         password="blaat1234")
    db = client.gourd_goru
    collection = db.searchWords
    print(selected_key)
    catagory_text = catagory_text.replace("_", " ")
    if selected_key == "new":
        collection.insert_one({"upper_term": catagory_text, "sub_terms":[term_text]})
    else:
        dataBaseData = collection.find_one({"upper_term":selected_key})
        print(selected_key)
        lijstData = dataBaseData["sub_terms"]
        lijstData.append(term_text)

        collection.update_one({"upper_term":selected_key}, {"$set":{"sub_terms":lijstData}})

def make_menu():
    """
    This function uses the retrieve data function and loops over this te write javascript later used in the html page.
    It also filles the menu's shown on the tool page
    :return: A string filled with java script and html code to fill the menu
    """
    dictData = data_ophalen()

    java_script_code = ""
    multiple_menu = ""
    i = 0
    list_keys = []

    for key, value in dictData.items():
        list_keys.append(key)
        java_script_code += "document.multiselect('#" + str(key) + "');"
        multiple_menu += "<select id =" + str(key) + " multiple>"
        for key_word in value:
            multiple_menu += "<option text =" + key_word + " value =" + str(i) + ">" + key_word + "</option>"
            i += 1
        multiple_menu += "</select>"

    return java_script_code, multiple_menu

@app.route('/')
def home():
    """
    :return: Using render template return the home page
    """
    return render_template('index.html')


@app.route('/input', methods=['GET', 'POST'])
def input():
    """

    :return: Using render template return the page used for database input
    """

    dict_data = data_ophalen()
    input_table = "<select class='formKey' id='keyTerm' name = keyTerm onchange='showField(this);'>"
    for key, value in dict_data.items():
        input_table += "<option value=" + key + ">" + key + "</option>"

    input_table += "<option value= new> New catagory </option></select>"

    if request.method == 'POST':
        if request.form.get('submit_button') == 'Add':
            selected_key = request.form.get("keyTerm")
            term_text = request.form.get('term')
            catagory_text = request.form.get('catagory')
            text_mining_process = subprocess.Popen(["python3","textmining.py",term_text,catagory_text])
            push_data(selected_key, term_text, catagory_text)



    return render_template('input.html',inputTable = input_table)


@app.route('/tool', methods=['GET', 'POST'])
def tool():
    """

    :return: using render template return the tool page.
    Also returns java script code in a string and html code in a string to be used in the tool page.
    """
    java_script_code, multiple_menu = make_menu()

    if request.method == 'POST':
        pass


    return render_template('tool.html', javaScriptCode=java_script_code, multipleMenu=multiple_menu)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80)
