Launch.models.Model = Backbone.Model.extend({

});

Launch.models.ElementProto = Launch.models.Model.extend({
	"defaults": {
		"scope": Launch.globals.scope.standalone,
		"defaultCss": {
			"width": "200",
			"height": undefined
		},
		"defaultProperties": {},
		"elementType": [],
		"objectType": undefined,
		"title": undefined,
		"description": undefined,
		"width": undefined,
		"height": undefined,
		"icon": undefined,
		"children": undefined
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
		},
		"properties": {}
	}
});

Launch.models.ElementCollection = Backbone.Collection.extend({
	"model": Launch.models.Element
});
