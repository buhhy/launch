Launch.views.ElementProtoView = Launch.views.View.extend({
	"defaults": {
		"objectType": null,
		"title": "",
		"description": undefined,
		"width": null,
		"height": null
	},

	"elementMarkup": undefined,
	"model": undefined,
	"targetParent": $("#elementCanvas"),
	"scope": Launch.globals.scope.standalone,

	"initialize": function (aOptions) {
		this.scope = this.model.get("scope");
		this.buildElement();
		this.attachDragHandlers();
	},

	"attachDragHandlers": function () {
		this.$el.draggable({
			"opacity": 0.8,
			"helper": "clone",
			"appendTo": this.parent,
			"scope": this.scope,
			"cancel": false
		});
	},

	"buildElement": function () {
		this.setElement("<div class='element'></div>");
		this.setCss("width");
		this.setCss("height");

		if (this.elementMarkup) {
			this.$el.html(this.elementMarkup);
			this.$el.data("objectType", this.model.get("objectType"));
			this.overrideDefaultClickHandlers();
		}
	},

	"setCss": function(aKey) {
		var value = this.model.get("aKey");
		if (value !== undefined) {
			if (value === null)
				value = "";
			this.$el.css(aKey, value);
		}
	}
});

Launch.views.QuestionProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[0],
	"elementMarkup": "<input type='button' class='button' value='Button'>"
});

Launch.views.ButtonProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[1],
	"elementMarkup": "<input type='button' class='button' value='Button'>"
});

Launch.views.TextboxProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[2],
	"elementMarkup": "<input type='button' class='button' value='Button'>"
});

Launch.views.RadioButtonProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[3],
	"elementMarkup": "<input type='button' class='button' value='Button'>"
});

Launch.views.TermsOfServiceProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[4],
	"elementMarkup": "<input type='button' class='button' value='Button'>"
});

Launch.views.ElementPalette = Launch.views.View.extend({
	"listElement":  [
		"<li class='element-sample'>",
		"<header><%= title %></header>",
		"<article></article>",
		"</li>"
	].join(""),

	"elements": [
		Launch.views.QuestionProtoView,
		Launch.views.ButtonProtoView,
		Launch.views.TextboxProtoView,
		Launch.views.RadioButtonProtoView,
		Launch.views.TermsOfServiceProtoView
	],

	"initialize": function () {
		_.each(this.elements, function (aElement, aIndex, aList) {
			var element = new aElement();
			var $listEl = $(_.template(this.listElement, {
				"title": element.model.get("title")
			}));
			element.attachTo($listEl.children("article"));
			this.$el.append($listEl);
		}, this);
	}
});

Launch.views.ElementCanvas = Launch.views.View.extend({
	"elements": [],

	"initialize": function () {
		var self = this;
		self.$el.droppable({
			"accept": ".element",
			"scope": Launch.globals.scope.standalone,
			"drop": function (aEvent, aUi) {
				var type = aUi.draggable.data("objectType");

				// only proto objects have this object type property
				if (type) {
					var cloned = aUi.helper.clone();
					cloned.css("opacity", 1.0);
					self.$el.append(cloned);
					self.elements.push(new Launch.views.ElementView({
						"el": cloned,
						"objectType": type,
						"editMode": true
					}));
				}
			}
		});
	}
});
