(function(exports) {
	function Species() {
		this.growthRate = 0;
		this.kind = 'prey';
		this.population = 0;
		this.depletionRate = 0;
		this.name = "";
		this.alive = [];
	}

	exports.Game = {
		life: [],
		cycles: 0,
		addSpecies: function() {
			var self = this;
			//first create the new species object
			var newSpecies = new Species();

			newSpecies.population = parseFloat($('#population').val());
			newSpecies.growthRate = parseFloat($('#growthrate').val());
			newSpecies.depletionRate = parseFloat($('#depletionrate').val());
			newSpecies.kind = $('#type').val();
			newSpecies.name = $('#name').val();

			//push this species to our array
			self.life.push(newSpecies);

			//now append the details to the dom
			this.appendSpeciesToDom(newSpecies);

			//refocus to the name field
			$('#name').focus();
		},
		appendSpeciesToDom: function(species) {
			var template = $('#speciesTemplate').clone();

			template.find('.name').html(species.name);
			template.find('.population').html('P: ' + species.population);
			template.find('.growthrate').html('GR: ' + species.growthRate);
			template.find('.depletionrate').html('DR: ' + species.depletionRate);
			template.find('.kind').html('K: ' + species.kind);

			template.appendTo('.speciesList');
		},
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
			predator.population = predator.population + (predator.population * predator.growthRate * this.calcTotalPopulationOfType('prey')) - (predator.population * predator.depletionRate);
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
			for (var i = 1;i < this.cycles; i++) {
				$.each(self.life, calc);
			}
			
			//render
			self.render();
		},
		init: function() {
			//cleanup existing data
			$.each(this.life, function(i, l) {
				l.alive = [];
			});
			this.cycles = $('#cycles').val();
		},
		reset: function() {
			//clear the life array
			this.life = [];
			//clear dom
			$('.speciesList').html('');
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

			//render the data
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
