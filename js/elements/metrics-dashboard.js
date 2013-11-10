Launch.views.DonutChart = Backbone.View.extend({
	"initialize": function (aOptions) {
		this.domId = "chart_" + aOptions.elementId;

		this.$el.prop("id", this.domId);

		var width = 500;
		var height = 500;
		var radius = Math.min(width, height) / 2;

		var color = d3.scale.ordinal().range([
			"#98abc5",
			"#8a89a6",
			"#7b6888",
			"#6b486b",
			"#a05d56",
			"#d0743c",
			"#ff8c00"
		]);

		var arc = d3.svg.arc()
				.outerRadius(radius - 10)
				.innerRadius(radius - 70);

		var pie = d3.layout.pie()
				.sort(null)
				.value(function (d) { return d.selects; });

		var svg = d3.select("#" + this.domId).append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	}
});

Launch.views.BarChart = Backbone.View.extend({
	"initialize": function (aOptions) {
		this.domId = "chart" + aOptions.elementId;

		this.$el.prop("id", this.domId);
	}
});

Launch.views.MetricsList = Launch.views.View.extend({
	"objectTypeChartClass": [
		undefined,
		undefined,
		undefined,
		Launch.views.BarChart,
		Launch.views.DonutChart,
		undefined,
		undefined
	],

	"charts": {},

	"initialize": function (aOptions) {
		Launch.views.View.prototype.initialize.call(this, aOptions);

		this.charts = {};
	},

	"getChart": function (aKey, aObjectType) {
		if (this.charts[aKey] === undefined) {
			var cClass = this.objectTypeChartClass[aObjectType];
			if (cClass) {
				var $elem = $("<li></li>");
				this.$el.append($elem);
				this.charts[aKey] = new cClass({
					"el": $elem,
					"elementId": aKey
				});
			}
		}

		return this.charts[aKey];
	},

	"updateData": function (aData) {
		_.each(aData, function (aValue, aKey) {
			var chart = this.getChart(aKey, aValue.objectType);

			if (chart !== undefined) {
				console.log(aKey);
				console.log(aValue);
			}
		}, this);
	},

	"attachViews": function (aViews) {
		_.each(aViews, function (aElemView) {
			this.attachNewElementView(aElemView);
		}, this);
	}
});

Launch.views.Metrics = Backbone.View.extend({
	"initialize": function () {
		this.metricsList = new Launch.views.MetricsList({
			"el": "#metricsList"
		});

		this.firebase = new Firebase(Launch.globals.firebase.root);

		this.setupDataListeners();
	},

	"filterData": function (aData) {
		var responses = {};

		_.each(aData, function (aInstance) {
			_.each(aInstance, function (aQuestion) {
				if (aQuestion.answers) {
					_.each(aQuestion.answers, function (aAnswer) {
						var inputId = aAnswer.inputId;

						if (aAnswer.radioGroupName) {
							if (aAnswer.value) {
								var groupName = aAnswer.radioGroupName;

								if (!responses[groupName]) {
									responses[groupName] = {
										"question": aQuestion,
										"options": {},
										"objectType": aAnswer.objectType
									};
								}

								if (!responses[groupName].options[inputId]) {
									responses[groupName].options[inputId] = [];
								}

								responses[groupName].options[inputId].push(aAnswer);
							}
						} else {
							if (!responses[inputId]) {
								responses[inputId] = {
									"question": aQuestion,
									"answers": [],
									"objectType": aAnswer.objectType
								};
							}

							responses[inputId].answers.push(aAnswer);
						}
					}, this);
				}
			}, this);
		}, this);

		return responses;
	},

	"setupDataListeners": function () {
		var self = this;
		self.firebase.child(Launch.globals.firebase.results).on("value", function (aSnapshot) {
			var data = aSnapshot.val();
			if (data !== null) {
				console.log("updated!");
				var responses = self.filterData(data);
				self.metricsList.updateData(responses);
			}
		});
	}
});