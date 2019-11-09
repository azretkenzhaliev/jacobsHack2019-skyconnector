from flask import Blueprint, redirect, render_template, request, url_for
import requests
import json

crud = Blueprint('crud', __name__)


@crud.route("/")
def main():
    # r = requests.get("http://localhost:5000")
    # return r.json()['hello']
    return render_template("base.html")

@crud.route("/lectureView")
def lectureView():
    return render_template("lectureView.html")

@crud.route("/lectureList")
def lectureList():
    return render_template("lectureList.html")


# Sample code for referenece
# @crud.route('/<id>/edit', methods=['GET', 'POST'])
# def edit(id):
#     book = get_model().read(id)
    
#     if request.method == 'POST':
#         data = request.form.to_dict(flat=True)

#         book = get_model().update(data, id)

#         return redirect(url_for('.view', id=book['id']))
    
#     return render_template("form.html", action="Edit", book=book)
