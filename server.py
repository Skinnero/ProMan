from flask import Flask, render_template, jsonify
from route.boards import api_boards
from route.columns import api_columns

app = Flask(__name__)
app.register_blueprint(api_boards)
app.register_blueprint(api_columns)

@app.route("/")
def index():
    """Render main page

    Returns:
        render_template: index.html
    """    
    return render_template('index.html')

def main():
    app.run(debug=True)

if __name__ == '__main__':
    main()