from flask import request, jsonify,render_template
from application.processing import get_best_answer
from application import app


@app.route("/", methods=['GET','POST'])
@app.route("/Question_Answering_AR", methods=['GET','POST'])
def home_page_ar():
    return render_template("indexar.html")


@app.route("/Question_Answering_EN", methods=['GET','POST'])
def home_page_en():
    return render_template("index.html")


@app.route('/process_data', methods=['POST'])
def process_data():
    data = request.get_json()
    print(data["question"])
    answer = get_best_answer(data["question"], 5, 2000, data["language"])
    # Do preprocessing here using the data
    result = {
        'message': 'Data processed successfully',
        'answer': answer
        }
    return jsonify(result)


