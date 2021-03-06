Launch.views.DonutChart = Backbone.View.extend({
	"initialize": function (aOptions) {
		this.elementId = aOptions.elementId;
		this.domId = "chart_" + aOptions.elementId;
		this.$el.html("<h1>" + aOptions.object.question.title + "</h1>")

		this.$el.prop("id", this.domId);

		var width = 350;
		var height = 350;
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
				.innerRadius(radius - 40);

		var pie = d3.layout.pie()
				.value(function (aData) {
					return aData.answers.length;
				});

		var svg = d3.select("#" + this.domId)
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		this.width = width;
		this.height = height;
		this.radius = radius;
		this.color = color;
		this.arc = arc;
		this.pie = pie;
		this.svg = svg;
	},

	"updateData": function (aData) {
		var self = this;
		var counter = 0;
		var mutatedData = _.map(aData.options, function (aValue, aKey) {
			return {
				"id": aKey,
				"answers": aValue,
				"color": counter ++
			};
		});
		console.log(mutatedData);

		this.svg.data(mutatedData);

		var g = this.svg.selectAll("path").data(this.pie(mutatedData));

		g.attr("d", this.arc);

		var enter = g.enter();

		enter.append("g")
				.attr("class", "arc")
				.append("path")
				.attr("d", this.arc)
				.style("fill", function (aData) {
					return self.color(aData.data.color);
				});
		enter.append("text")
				.attr("transform", function (d) {
					return "translate(" + self.arc.centroid(d) + ")";
				})
				.attr("dy", ".35em")
				.style("text-anchor", "middle")
				.text(function (aData) {
					return aData.data.answers[0].optionTitle;
				});

		g.exit().remove();
	}
});

Launch.views.BarChart = Backbone.View.extend({
	"initialize": function (aOptions) {
		this.domId = "chart" + aOptions.elementId;

		this.$el.prop("id", this.domId);
	},

	"updateData": function (aData) {

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

	"getChart": function (aKey, aValue) {
		if (this.charts[aKey] === undefined) {
			var cClass = this.objectTypeChartClass[aValue.objectType];
			if (cClass) {
				var $elem = $("<li></li>");
				this.$el.append($elem);
				this.charts[aKey] = new cClass({
					"object": aValue,
					"el": $elem,
					"elementId": aKey
				});
			}
		}

		return this.charts[aKey];
	},

	"updateData": function (aData) {
		_.each(aData, function (aValue, aKey) {
			var chart = this.getChart(aKey, aValue);

			if (chart !== undefined) {
				chart.updateData(aValue);
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