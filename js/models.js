Launch.models.Model = Backbone.Model.extend({

});

Launch.models.ElementProto = Launch.models.Model.extend({
	"defaults": {
		"objectType": undefined,
		"title": undefined,
		"description": undefined,
		"width": undefined,
		"height": undefined
	},

	"initialize": function () {

	}
});

Launch.models.Element = Launch.models.Model.extend({
	"defaults": {
		"objectType": undefined,
		"css": {
			"width": undefined,
			"height": undefined,
			"top": undefined,
			"left": undefined
		}
	},

	"initialize": function () {

	}
});