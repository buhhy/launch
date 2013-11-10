Launch.defaultElementProtos = null;

Launch.getElementProtoForObjectType = function (aType) {
	return this.getDefaultElementProtos()[aType - 1];
};

Launch.getDefaultElementProtos = function () {
	if (!this.defaultElementProtos) {
		this.defaultElementProtos = [
			new Launch.models.ElementProto({
				"elementType": [
					Launch.globals.elementType.standalone,
					Launch.globals.elementType.container
				],
				"elementMarkup": [
					"<h1 data-widget='questionNumber'><%= number %></h1>",
					"<span class='divider' data-widget='divider'>|</span>",
					"<span class='text' data-widget='questionTitle'><%= title %></h2>"
				].join(""),
				"defaultCss": {
					"width": 600,
					"height": 250,
				},
				"defaultProperties": {
					"number": 1,
					"title": "Double-click to enter your question."
				},
				"title": "Question",
				"description": "A question string",
				"icon": "images/question.png",
				"viewClass": Launch.views.QuestionElementView
			}),
			new Launch.models.ElementProto({
				"scope": Launch.globals.scope.standalone,
				"elementType": [
					Launch.globals.elementType.form,
					Launch.globals.elementType.standalone
				],
				"elementMarkup": "<input class='button' type='button' data-widget='button' value='<%= label %>'>",
				"title": "Button",
				"description": "A push button",
				"defaultCss": {
					"width": 98,
					"height": 35,
				},
				"defaultProperties": {
					"label": "Continue"
				},
				"icon": "images/pushbutton.png",
				"viewClass": Launch.views.ButtonElementView
			}),
			new Launch.models.ElementProto({
				"scope": Launch.globals.scope.form,
				"elementType": [
					Launch.globals.elementType.form
				],
				"elementMarkup": "<input type='text' data-widget='textbox' placeholder='<%= placeholder %>'>",
				"title": "Textbox",
				"description": "An input text box",
				"defaultCss": {
					"width": 200,
					"height": null,
				},
				"defaultProperties": {
					"placeholder": "Placeholder text here:"
				},
				"icon": "images/textinput.png",
				"viewClass": Launch.views.TextboxElementView
			}),
			new Launch.models.ElementProto({
				"scope": Launch.globals.scope.form,
				"elementType": [
					Launch.globals.elementType.form
				],
				"elementMarkup": [
					"<section class='center'>",
						"<input type='radio' data-widget='radioButton' value='value'>",
						"<label data-widget='radioLabel'>",
							"<img class='img-option' data-widget='radioImage'>",
							"<span='text' data-widget='radioTitle'></span>",
						"</label>",
					"</section>"
				].join(""),
				"title": "Radio Button",
				"description": "An exclusive button set",
				"defaultCss": {
					"width": 126,
					"height": 178,
				},
				"defaultProperties": {
					"iconUrl": "images/photos.png",
					"optionTitle": "A radio button",
					"inputId": "",
					"radioGroupName": "",
					"radioChecked": false
				},
				"icon": "images/radiobutton.png",
				"viewClass": Launch.views.RadioButtonElementView
			}),
			new Launch.models.ElementProto({
				"elementType": [
					Launch.globals.elementType.form,
					Launch.globals.elementType.standalone
				],
				"elementMarkup": [
					"<div data-widget='tosContainer'>",
						"<article class='frame' data-widget='tosText'></article>",
						"<footer data-widget='agreement'>",
							"<input class='checkbox' data-widget='agreeCheckbox' type='checkbox'>",
							"<label class='text' data-widget='agreePrompt'></label>",
						"</footer>",
					"</div>"
				].join(""),
				"title": "Terms of Service",
				"description": "A sample ToS to sign",
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
					].join("<br><br>"),
					"agreePrompt": "I agree to the terms of use specified here."
				},
				"icon": "images/toc.png",
				"viewClass": Launch.views.TermsOfUseElementView
			}),
			new Launch.models.ElementProto({
				"elementType": [
					Launch.globals.elementType.standalone
				],
				"elementMarkup": "<h1 class='heading' data-widget='title'><%= title %></h1>",
				"defaultCss": {
					"width": 550,
					"height": 120,
				},
				"defaultProperties": {
					"title": "Double-click to edit."
				},
				"title": "Heading",
				"description": "A heading",
				"icon": "images/text.png",
				"viewClass": Launch.views.TextElementView
			})
		];

		for (var i = 0; i < this.defaultElementProtos.length; i++)
			this.defaultElementProtos[i].objectType = i + 1;
	}
	return this.defaultElementProtos;
};

