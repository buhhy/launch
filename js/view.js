Launch.views.View = Backbone.View.extend({
	"attachTo": function($aEl) {
		$aEl.append(this.$el);
	},

	"detach": function() {
		this.$el.detach();
	},

	"overrideDefaultClickHandlers": function () {
		this.$el.find("input").click(function (aEvent) {
			aEvent.preventDefault();
		});
	}
});
