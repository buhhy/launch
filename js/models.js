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
		"icon": undefined
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
		"properties": {},
		"children": undefined
	},
	"initialize": function () {
		Launch.models.Model.prototype.initialize.call(this);
		var collection = new Launch.models.ElementCollection();
		collection.reset(this.get("children"));
		this.set("children", collection);
	}
});

Launch.models.ElementCollection = Backbone.Collection.extend({
	"model": Launch.models.Element
});
