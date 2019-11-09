import logging

from flask import current_app, Flask, redirect, url_for
from flask_restful import Resource, Api
from flask_cors import CORS



def create_app(debug=False, testing=False, config_overrides=None):
    app = Flask(__name__)
    CORS(app)

    app.debug = debug
    app.testing = testing

    # Configure logging
    if not app.testing:
        logging.basicConfig(level=logging.INFO)

    # Setup the data model.
    #with app.app_context():
    #    model = get_model()
    #    model.init_app(app)

    # Register the Bookshelf CRUD blueprint.
    from .crud import crud
    app.register_blueprint(crud, url_prefix='/')

    @app.route('/')
    def hello():
        return redirect(url_for('crud.main'))


    # Add an error handler. This is useful for debugging the live application,
    # however, you should disable the output of the exception for production
    # applications.
    @app.errorhandler(500)
    def server_error(e):
        return """
        An internal error occurred: <pre>{}</pre>
        See logs for full stacktrace.
        """.format(e), 500

    return app


