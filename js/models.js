Launch.models.Model = Backbone.Model.extend({

});

Launch.models.ElementProto = Launch.models.Model.extend({
	"defaults": {
		"objectType": undefined,
		"title": undefined,
		"description": undefined,
		"width": undefined,
		"height": undefined
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

Launch.models.QuestionElement = Launch.models.Element.extend({
	"defaults": _.extend({}, Launch.models.Element.defaults, {
		"children": new Launch.models.ElementCollection()
	})
});

Launch.models.ElementCollection = Backbone.Collection.extend({
	"model": Launch.models.Element
})