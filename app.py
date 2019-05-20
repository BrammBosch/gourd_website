from flask import Flask, render_template, jsonify

app = Flask(__name__, static_folder="static", static_url_path="")


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/tool')
def tool():
    menu = '''
    
    
    
    <div class="sidenav">
  <a href="#about">About</a>
  <a href="#services">Services</a>
  <a href="#clients">Clients</a>
  <a href="#contact">Contact</a>
  <button class="dropdown-btn">Dropdown 
    <i class="fa fa-caret-down"></i>
  </button>
  <div class="dropdown-container">

    <a href="#">Link 3</a>
  </div>
  <a href="#contact">Search</a>
</div>




 {% for item in lijst %}

              <button class="dropdown-btn"> {{ item }}  &#x25BC
          </button>
            <form>
         <input id ="upperbox" type = "checkbox" name ="test2" value = "test3">
          </form>

          <div class="dropdown-container">
            <form>
          test <input id = "box" type="checkbox" name = "test" value ="test1">
          test2 <input id = "box" type="checkbox" name = "test" value ="test1">
                test3 <input id = "box" type="checkbox" name = "test" value ="test1">

            </form>
          </div>

      {% endfor %}
      
      
      
      
      <select id='testSelect1' multiple>
	<option value='1'>Item 1</option>
	<option value='2'>Item 2</option>
	<option value='3'>Item 3</option>
	<option value='4'>Item 4</option>
	<option value='5'>Item 5</option>
</select>
    '''

    lijstWaardes = {"bittergourd": ['plant', 'bitter', 'gen'], "obesitas": ['gen', 'symptoon'],
                    "diabetes": ['ziekte', 'suiker', 'bloedsuiker']}


    javaScriptCode = ""

    for key, value in lijstWaardes.items():

        javaScriptCode += "document.multiselect('#" + str(key) + "');"

    return render_template('tool.html', dic=lijstWaardes, javaScriptCode=javaScriptCode)


if __name__ == '__main__':
    app.run(host="0.0.0.0",port=80)
