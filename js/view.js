Launch.views.View = Backbone.View.extend({
	"attachTo": function($aEl) {
		$aEl.append(this.$el);
	},

	"overrideDefaultClickHandlers": function () {
		this.$el.find("input").click(function (aEvent) {
			aEvent.preventDefault();
		});
	}
});
