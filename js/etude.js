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
	"defaultElementProtos": function () {
		return [
			new Launch.models.ElementProto({
				"objectType": 1,
				"title": "Question",
				"description": "A question string",
				"width": "100%",
				"height": null,
				"icon": null
			}),
			new Launch.models.ElementProto({
				"scope": Launch.globals.scope.form,
				"objectType": 2,
				"title": "Button",
				"description": "A push button",
				"width": 200,
				"height": null,
				"icon": null
			}),
			new Launch.models.ElementProto({
				"scope": Launch.globals.scope.form,
				"objectType": 3,
				"title": "Textbox",
				"description": "An input text box",
				"width": 200,
				"height": null,
				"icon": null
			}),
			new Launch.models.ElementProto({
				"scope": Launch.globals.scope.form,
				"objectType": 4,
				"title": "Radio Button",
				"description": "An exclusive button set",
				"width": 100,
				"height": 100,
				"icon": null
			}),
			new Launch.models.ElementProto({
				"objectType": 5,
				"title": "Terms of Service",
				"description": "A sample ToC to sign",
				"width": 400,
				"height": 400,
				"icon": null
			})
		]
	}
};