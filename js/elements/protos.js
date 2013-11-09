Launch.views.ElementProtoView = Launch.views.View.extend({
	"elementMarkUp":  [
		"<li class='element-sample'>",
		"<header><%= title %></header>",
		"<article><img class='icon' src='<%= icon %>'></article>",
		"</li>"
	].join(""),
	"model": undefined,
	"targetParent": $("#elementCanvas"),
	"scope": Launch.globals.scope.standalone,

	"initialize": function (aOptions) {
		this.scope = this.model.get("scope");
		this.buildElement();
		this.attachClickHandler();
	},

	"buildElement": function () {
		this.setElement(_.template(this.elementMarkUp, {
			"title": this.model.get("title"),
			"icon": this.model.get("icon")
		}));
	},

	"spawnChild": function () {
		return new Launch.views.FormElementView({
			"baseModel": {
				"defaultProperties": this.model.get("defaultProperties"),
				"elementMarkup": this.model.get("elementMarkup"),
				"objectType": this.model.get("objectType")
			},
			"editMode": true
		})
	},

	"attachClickHandler": function () {
		var self = this;
		self.$el.mousedown(function (aEvent) {
			var newEl = self.spawnChild();
			newEl.$el.trigger(aEvent);
			newEl.attachTo(self.targetParent);
			aEvent.preventDefault();
		});
	}
});

Launch.views.QuestionProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[0]
});

Launch.views.ButtonProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[1]
});

Launch.views.TextboxProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[2]
});

Launch.views.RadioButtonProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[3]
});

Launch.views.TermsOfServiceProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[4]
});

Launch.views.ElementPalette = Launch.views.View.extend({
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
			element.attachTo(this.$el);
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
