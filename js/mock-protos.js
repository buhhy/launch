Launch.defaultElementProtos = null;
Launch.getDefaultElementProtos = function () {
	if (!this.defaultElementProtos) {
		this.defaultElementProtos = [
			new Launch.models.ElementProto({
				"objectType": 1,
				"elementType": [
					Launch.globals.elementType.standalone,
					Launch.globals.elementType.container
				],
				"elementMarkup": [
					"<h1 class='question-number'>1</h1>",
					"<span class='divider'>|</span>",
					"<h2 class='question-title'>Ask a question?</h2>"
				].join(""),
				"defaultCss": {
					"width": "300",
					"height": null,
				},
				"title": "Question",
				"description": "A question string",
				"icon": "images/question.png"
			}),
			new Launch.models.ElementProto({
				"scope": Launch.globals.scope.form,
				"objectType": 2,
				"elementType": [
					Launch.globals.elementType.form
				],
				"elementMarkup": "<input type='button' class='button' value='Button'>",
				"title": "Button",
				"description": "A push button",
				"defaultCss": {
					"width": 200,
					"height": null,
				},
				"icon": "images/pushbutton.png"
			}),
			new Launch.models.ElementProto({
				"scope": Launch.globals.scope.form,
				"objectType": 3,
				"elementType": [
					Launch.globals.elementType.form
				],
				"elementMarkup": "<input type='text' class='textbox' value=''>",
				"title": "Textbox",
				"description": "An input text box",
				"defaultCss": {
					"width": 200,
					"height": null,
				},
				"icon": "images/textinput.png"
			}),
			new Launch.models.ElementProto({
				"scope": Launch.globals.scope.form,
				"objectType": 4,
				"elementType": [
					Launch.globals.elementType.form
				],
				"elementMarkup": [
					"<section>",
					"<input type='radio' class='radio-button' value='value'>",
					"<label>",
					"<img class='radio-image'>",
					"<h1 class='radio-title'></h1>",
					"</label>",
					"</section>"
				].join(""),
				"editableMarkup": [
					"<label>Enter image URL:</label>",
					"<input type='text' class='edit-textbox'>"
				].join(""),
				"title": "Radio Button",
				"description": "An exclusive button set",
				"defaultCss": {
					"width": 100,
					"height": 100,
				},
				"defaultProperties": {
					"iconUrl": "http://gkoonz.com/wp-content/uploads/2013/02/placeholder.jpg",
					"optionTitle": "A radio button",
					"radioChecked": false
				},
				"icon": "icon": "images/radiobutton.png"
			}),
			new Launch.models.ElementProto({
				"objectType": 5,
				"elementType": [
					Launch.globals.elementType.form,
					Launch.globals.elementType.standalone
				],
				"elementMarkup": [
					"<div class='tos'>",
					"<article></article>",
					"<footer><input type='checkbox'><label></label></footer>",
					"</div>"
				].join(""),
				"title": "Terms of Service",
				"description": "A sample ToC to sign",
				"defaultCss": {
					"width": 350,
					"height": 300,
				},
				"defaultProperties": {
					"tosText": [
						"Copyright (c) 2012-2013 Terry & Jessica",
						"MIT License",
						"Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:",
						"The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.",
						"THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE."
					].join("<br><br>")
				},
				"icon": "images/toc.png"
			})
		];
	}
	return this.defaultElementProtos;
};

