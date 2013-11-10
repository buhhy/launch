Launch.views.ElementProtoView = Launch.views.View.extend({
	"elementMarkUp":  [
		"<li class='element-sample'>",
		"<header><%= title %></header>",
		"<article><img class='icon' src='<%= icon %>'></article>",
		"</li>"
	].join(""),

	"viewClass": Launch.views.FormElementView,
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
		return new this.viewClass({
			"baseModel": this.model,
			"parent": $("body"),
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
	"model": Launch.getDefaultElementProtos()[0],
	"viewClass": Launch.views.QuestionElementView
});

Launch.views.ButtonProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[1],
	"viewClass": Launch.views.ButtonElementView
});

Launch.views.TextboxProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[2],
	"viewClass": Launch.views.TextboxElementView
});

Launch.views.RadioButtonProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[3],
	"viewClass": Launch.views.RadioButtonElementView
});

Launch.views.TermsOfServiceProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[4],
	"viewClass": Launch.views.TermsOfUseElementView
});

Launch.views.TextProtoView = Launch.views.ElementProtoView.extend({
	"model": Launch.getDefaultElementProtos()[5],
	"viewClass": Launch.views.TextElementView
});
