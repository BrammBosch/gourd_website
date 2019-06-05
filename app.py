from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
import subprocess
from itertools import product
import json

app = Flask(__name__, static_folder="static", static_url_path="")


def retrieve_data():
    """In this function a connection is made with the Mongo database and is where we put all our queries.
    All the keywords from the database are retrieved, these are put in a 2d list for each term by comparing them to the dict_data.
    All possible pairs between the terms in the 2d list are generated and each pair is checked for possible connections in the database,
    if this is true the pairs will be assigned the score from the database and the articles will be put in a list in order to generate an
    HTML table.

    :return: All data from the keyword database in dictionarys, a list with the pairs of keywords and their score, a list of all selected keywords
    and a list containing the information of each article.
    """
    client = MongoClient("mongodb+srv://textminingdata-m49re.azure.mongodb.net/test", 27107, username="admin",
                         password="blaat1234")
    db = client.gourd_goru
    collection = db.searchWords
    dict_data = {}
    data_base_data = collection.find({})
    for value in data_base_data:
        dict_data.update({value["upper_term"].replace(" ", "_"): value["sub_terms"]})

    temp_list = []
    graph_col = db.miningResults
    all_graph_list = []
    all_table_list = []
    products = set()
    graph_data = graph_col.find({})
    all_key_list = []

    for key, value in dict_data.items():
        temp_list.append(value)

    for value in dict_data.values():
        for line in value:
            if any(line in sublist for sublist in temp_list):
                all_key_list.append(line)

    for i in range(len(temp_list) - 1):
        for i2 in range(i, len(temp_list) - 1):
            products.update(set(product(temp_list[i], temp_list[i2 + 1])))

    for item in graph_data:
        for line in products:
            if line[0] in item["keywords"] and line[1] in item["keywords"]:
                i = 0
                score = 0
                if item["articles"] != []:
                    while i < len(item["articles"]):
                        score += int(item["articles"][i]["score"])
                        all_table_list.append(
                            [item["keywords"][0], item["keywords"][1], item["articles"][i]["pubmed_id"],
                             item["articles"][i]["title"], item["articles"][i]["journal"],
                             item["articles"][i]["pub_date"], item["articles"][i]["score"]])
                        i += 1
                    all_graph_list.append([item["keywords"][0], item["keywords"][1], score])

    return dict_data, all_graph_list, all_key_list, all_table_list


def graph(dictData, search_words):
    """This function is called when the button to use the selected keywords is pressed in a post method.
    The selected keywords from the menus in the website are compared to the keywords in the database.
    All possible pairs are made from the keywords which are then given their score.
    These pairs with the scores are the edges in the graph while the keywords are the nodes.
    A list of all articles related to the keywords is generated and put into a table.

    :param dictData: Dictionary with all keywords from the database.
    :param search_words: Alle selected keywords from the menus in the website.
    :return: A list with the pairs of keywords and their score, a list of all selected keywords
    and a list containing the information of each article.
    """
    client = MongoClient("mongodb+srv://textminingdata-m49re.azure.mongodb.net/test", 27107, username="admin",
                         password="blaat1234")
    db = client.gourd_goru
    graph_col = db.miningResults
    graph_list = []
    table_list = []
    products = set()
    graph_data = graph_col.find({})
    key_list = []
    search_word_list = []

    for line in search_words:
        word_list = line.split(',')
        for key, value in dictData.items():
            term_list = []
            for item in word_list:
                if item in value:
                    term_list.append(item)
            search_word_list.append(term_list)

    for value in dictData.values():
        for line in value:
            if any(line in sublist for sublist in search_word_list):
                key_list.append(line)

    for i in range(len(search_word_list) - 1):
        for i2 in range(i, len(search_word_list) - 1):
            products.update(set(product(search_word_list[i], search_word_list[i2 + 1])))

    for item in graph_data:
        for line in products:
            if line[0] in item["keywords"] and line[1] in item["keywords"]:
                i = 0
                score = 0
                if item["articles"] != []:
                    while i < len(item["articles"]):
                        score += int(item["articles"][i]["score"])
                        table_list.append([item["keywords"][0], item["keywords"][1], item["articles"][i]["pubmed_id"],
                                           item["articles"][i]["title"], item["articles"][i]["journal"],
                                           item["articles"][i]["pub_date"], item["articles"][i]["score"]])
                        i += 1
                    graph_list.append([item["keywords"][0], item["keywords"][1], score])

    return graph_list, key_list, table_list


def push_data(selected_key, term_text, catagory_text):
    """ This function is called when the button on the new words page is pressed.
    It looks whether the user wants to add a keyword to an existing catagory or make a new catagory.
    It makes a connection to the database and puts the new keywords in the right catagory.

    :param selected_key: selected_key is the catagory selected from the dropdown menu.
    :param term_text: term_text is the term which the user wants to be added.
    :param catagory_text: If the user chooses to add a new catagory they will also have to add the new
    :return: No return is needed because all the data is pushed in a database.
    """
    client = MongoClient("mongodb+srv://textminingdata-m49re.azure.mongodb.net/test", 27107, username="admin",
                         password="blaat1234")
    db = client.gourd_goru
    collection = db.searchWords
    catagory_text = catagory_text.replace("_", " ")
    if selected_key == "new":
        collection.insert_one({"upper_term": catagory_text, "sub_terms": [term_text]})
    else:
        dataBaseData = collection.find_one({"upper_term": selected_key})
        lijstData = dataBaseData["sub_terms"]
        lijstData.append(term_text)

        collection.update_one({"upper_term": selected_key}, {"$set": {"sub_terms": lijstData}})


def make_menu():
    """This function uses the retrieve data function and loops over this te write javascript later used in the html page.
    It also filles the menu's shown on the tool page
    :return: A string filled with java script and html code to fill the menu
    """
    dict_data, all_graph_list, all_key_list, all_table_list = retrieve_data()

    java_script_code = ""
    multiple_menu = ""
    i = 0
    list_keys = []

    for key, value in dict_data.items():
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
    """:return: Using render template return the home page
    """
    return render_template('index.html')


@app.route('/input', methods=['GET', 'POST'])
def input():
    """:return: Using render template return the page used for database input
    """

    dict_data, all_graph_list, all_key_list, all_table_list = retrieve_data()
    input_table = "<select class='formKey' id='keyTerm' name = keyTerm onchange='showField(this);'>"

    for key, value in dict_data.items():
        input_table += "<option value=" + key + ">" + key + "</option>"

    input_table += "<option value= new> New catagory </option></select>"

    if request.method == 'POST':
        if request.form.get('submit_button') == 'Add':
            selected_key = request.form.get("keyTerm")
            term_text = request.form.get('term')
            catagory_text = request.form.get('catagory')
            text_mining_process = subprocess.Popen(["python3", "textmining.py", term_text, selected_key])
            push_data(selected_key, term_text, catagory_text)

    return render_template('input.html', inputTable=input_table)


@app.route('/tool', methods=['GET', 'POST'])
def tool():
    """:return: using render template return the tool page.
    Also returns java script code in a string and html code in a string to be used in the tool page.
    """
    dict_data, all_graph_list, all_key_list, all_table_list = retrieve_data()

    javaScriptCode = ""
    multipleMenu = ""
    i = 0
    listKeys = []

    for key, value in dict_data.items():

        listKeys.append(key)
        javaScriptCode += "document.multiselect('#" + str(key) + "');"
        multipleMenu += "<select id =" + str(key) + " multiple>"
        for keyWord in value:
            multipleMenu += "<option text =" + keyWord + " value =" + str(i) + ">" + keyWord + "</option>"
            i += 1
        multipleMenu += "</select>"

    if request.method == 'POST':

        search_words = []
        search_words.append(request.args.get('value'))
        graph_list, key_list, table_list = graph(dict_data, search_words)
        return jsonify({'reply': 'succes'}), render_template('graph.html', dic=dict_data, javaScriptCode=javaScriptCode,
                                                             multipleMenu=multipleMenu,
                                                             table=table_list, graph=graph_list, keys=key_list)

    else:
        return render_template('graph.html', dic=dict_data, javaScriptCode=javaScriptCode, multipleMenu=multipleMenu,
                               table=all_table_list, graph=all_graph_list, keys=all_key_list)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=80)
