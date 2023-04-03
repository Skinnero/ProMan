from flask import Flask, render_template, jsonify
from boards import api_boards

app = Flask(__name__)
app.register_blueprint(api_boards)

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
