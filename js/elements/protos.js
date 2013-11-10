Launch.views.ElementProtoView = Launch.views.View.extend({
	"elementMarkUp":  [
		"<li class='element-sample'>",
		"<header><%= title %></header>",
		"<article><img class='icon' src='<%= icon %>'></article>",
		"</li>"
	].join(""),

	"canvasView": undefined,
	"model": undefined,
	"targetParent": undefined,
	"scope": undefined,

	"initialize": function (aOptions) {
		Launch.views.View.prototype.initialize.call(this, aOptions);

		this.canvasView = aOptions.canvasView;
		this.targetParent = this.canvasView.$el;
		this.scope = this.model.get("scope");
		this.buildElement();
		this.attachClickHandler();
	},

	"buildElement": function () {
		this.setElement(
			$(_.template(this.elementMarkUp, {
				"title": this.model.get("title"),
				"icon": this.model.get("icon")
			}))
		);
	},

	"processViewObject": function ($aEl) {
		return $aEl;
	},

	"spawnChild": function () {
		return new (this.model.get("viewClass"))({
			"baseModel": this.model,
			"editMode": true
		})
	},

	"attachClickHandler": function () {
		var self = this;
		self.$el.mousedown(function (aEvent) {
			var newEl = self.spawnChild();
			newEl.moveToMouseCursor(aEvent);
			newEl.$el.trigger(aEvent);
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

Launch.views.TextProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[5]
});
