(function(exports) {
	function Species() {
		this.growthRate = 0;
		this.kind = 'prey';
		this.population = 0;
		this.depletion = 0;
		this.name = "";
		this.alive = [];
	}

	exports.Game = {
		life: [],
		calcPrey: function(prey) {
			//first calculate our prey growth
			prey.population = (prey.population + ((prey.population * prey.growthRate)) * Math.random(1, 1.1));
			//now calculate our predators hit on the population
			$.each(this.life, function(index, predator) {
				if (predator.kind !== 'predator') {
					return;
				}
				prey.population = prey.population - (predator.population * predator.growthRate * prey.population);
			});

			//now append this cycles final amount
			prey.alive.push(prey.population);
		},
		calcTotalPopulationOfType: function(type) {
			var total = 0;
			$.each(this.life, function(i, life) {
				if (life.kind !== type) {
					return;
				}
				total += life.population;
			});

			return total;
		},
		calcPredator: function(predator) {
			//calculate predator pop, based on available prey and other vars
			predator.population = predator.population + (predator.population * predator.growthRate * this.calcTotalPopulationOfType('prey')) - (predator.population * predator.depletion);
			predator.alive.push(predator.population);
		},
		main: function() {
			var self = this;

			self.init();

			var calc = function(index, life) {
					switch (life.kind) {
						case 'prey':
							self.calcPrey(life);
							break;
						case 'predator':
							self.calcPredator(life);
							break;
					}
				};
			for (var i = 1;i < 10000; i++) {
				$.each(self.life, calc);
			}
			
			self.render();
		},
		init: function() {
			this.life = [];

			var prey = new Species();
			prey.population = 100;
			prey.growthRate = 0.02;
			prey.name = "prey 1";
			this.life.push(prey);

			var prey2 = new Species();
			prey2.population = 100;
			prey2.growthRate = 0.02;
			prey2.name = "prey 2";
			this.life.push(prey2);

			var predator = new Species();
			predator.kind = 'predator';
			predator.population = 50;
			predator.growthRate = 0.0005;
			predator.depletion = 0.05;
			predator.name = "predator 1";

			
			this.life.push(predator);
		},
		render: function() {
			//setup our data array
			var series = [];
			$.each(this.life, function(i, l) {
				series.push({
					name: l.name,
					data: l.alive
				});
			});


			var chart = new Highcharts.Chart({
				chart: {
					renderTo: 'chart',
					type: 'line'
				},
				title: {
					text: 'predator prey model',
					x: -30
				},
				series: series
			});
		}
	};

}(this));
