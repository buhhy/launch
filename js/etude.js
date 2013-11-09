var Launch = {
	"globals": {
		"scope": {
			"standalone": "standalone",
			"form": "form"
		}
	},

	"views": {},
	"models": {},
	"collections": {},

	"defaultElementProtos": null,
	"getDefaultElementProtos": function () {
		if (!this.defaultElementProtos) {
			this.defaultElementProtos = [
				new Launch.models.ElementProto({
					"objectType": 1,
					"elementMarkup": "<input type='text' class='button' value='Button'>",
					"defaultProperties": {
						"width": "100%",
						"height": null,
					},
					"title": "Question",
					"description": "A question string",
					"icon": "http://icons.iconarchive.com/icons/artua/mac/256/Setting-icon.png"
				}),
				new Launch.models.ElementProto({
					"scope": Launch.globals.scope.form,
					"objectType": 2,
					"elementMarkup": "<input type='button' class='button' value='Button'>",
					"title": "Button",
					"description": "A push button",
					"defaultProperties": {
						"width": 200,
						"height": null,
					},
					"icon": "http://icons.iconarchive.com/icons/artua/mac/256/Setting-icon.png"
				}),
				new Launch.models.ElementProto({
					"scope": Launch.globals.scope.form,
					"objectType": 3,
					"elementMarkup": "<input type='text' class='textbox' value=''>",
					"title": "Textbox",
					"description": "An input text box",
					"defaultProperties": {
						"width": 200,
						"height": null,
					},
					"icon": "http://icons.iconarchive.com/icons/artua/mac/256/Setting-icon.png"
				}),
				new Launch.models.ElementProto({
					"scope": Launch.globals.scope.form,
					"objectType": 4,
					"elementMarkup": "<input type='radio' class='button' value='Button'>",
					"title": "Radio Button",
					"description": "An exclusive button set",
					"defaultProperties": {
						"width": 100,
						"height": 100,
					},
					"icon": "http://icons.iconarchive.com/icons/artua/mac/256/Setting-icon.png"
				}),
				new Launch.models.ElementProto({
					"objectType": 5,
					"elementMarkup": "<div class='toc'><textarea></textarea></div>",
					"title": "Terms of Service",
					"description": "A sample ToC to sign",
					"defaultProperties": {
						"width": 400,
						"height": 400,
					},
					"icon": "http://icons.iconarchive.com/icons/artua/mac/256/Setting-icon.png"
				})
			];
		}
		return this.defaultElementProtos;
	}
};