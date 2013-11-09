Launch.models.Model = Backbone.Model.extend({

});

Launch.models.ElementProto = Launch.models.Model.extend({
	"defaults": {
		"scope": Launch.globals.scope.standalone,
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
		}
	}
});

Launch.models.ElementCollection = Backbone.Collection.extend({
	"model": Launch.models.Element
});

Launch.models.QuestionElement = Launch.models.Element.extend({
	"defaults": _.extend({}, Launch.models.Element.defaults, {
		"children": new Launch.models.ElementCollection()
	})
});