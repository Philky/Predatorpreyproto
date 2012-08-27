function Species() {
	this.growthRate = 0,
	this.kind = 'prey',
	this.population = 0,
	this.depletion = 0,
	this.name = "",
	this.alive = []
};

var rabbit = new Species();
var fox = new Species();
var lion = new Species();
var chart;

Game = {
	firstrun: true,
	life: [],
	cycleCount: 100,
	boomCycle: 0,
	cycle: function() {
		rabbit.population = (rabbit.population + ((rabbit.population * rabbit.growthRate) * Math.random(1, 1.1))) - (rabbit.population * rabbit.depletion) - (fox.population * fox.growthRate * rabbit.population);
		rabbit.alive.push(parseInt(Math.max(2, rabbit.population)));

		fox.population = fox.population + (fox.population * fox.growthRate * rabbit.population) - (fox.population * fox.depletion) - (fox.population * lion.population * lion.growthRate);
		fox.alive.push(parseInt(Math.max(2, fox.population)));

		lion.population = lion.population + (lion.population * lion.growthRate * fox.population) - (lion.population * lion.depletion);
		lion.alive.push(parseInt(Math.max(2, lion.population)));
	},
	dynamicCycle: function() {
		//work out overall growth rate modifier for the prey


		//work out overall growth rate modifier for predator
	},
	calcPrey: function(prey) {
		//first calculate our prey growth
		prey.population = (prey.population + ((prey.population * prey.growthRate)) * Math.random(1, 1.1));
		//now calculate our predators hit on the population
		$.each(this.life, function(index, predator) {
			if (predator.kind != 'predator') return;
			prey.population = prey.population - (predator.population * predator.growthRate * prey.population);
		});

		//now append this cycles final amount
		prey.alive.push(prey.population);
	},
	calcTotalPopulationOfType: function(type) {
		var total = 0;
		$.each(this.life, function(i, life) {
			if (life.kind != type) return;
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


		for (i=1;i < 10000; i++) {
			$.each(self.life, function(index, life) {
				switch (life.kind) {
					case 'prey':
						self.calcPrey(life);
						break;
					case 'predator':
						self.calcPredator(life);
						break;
				}
			});
		}
		
		self.render();
	},
	init: function() {
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
		predator.name = "predator 1"

		
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


		chart = new Highcharts.Chart({
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
}

function run() {
	//set variables

	rabbit.population = parseFloat($('#rabbitpop').val());
	rabbit.growthRate = parseFloat($('#rabbitgrowth').val());
	rabbit.depletion = parseFloat($('#rabbitdepletion').val());

	fox.population = parseFloat($('#foxpop').val());
	fox.growthRate = parseFloat($('#foxgrowth').val());
	fox.depletion = parseFloat($('#foxdepletion').val());

	lion.population = parseFloat($('#lionpop').val());
	lion.growthRate = parseFloat($('#liongrowth').val());
	lion.depletion = parseFloat($('#liondepletion').val());


	Game.cycleCount = parseInt($('#cycleCount').val());
	Game.boomCycle = parseInt($('#boomCycle').val());

	//zero out previous values
	rabbit.alive = [];
	fox.alive = [];
	lion.alive = [];

	//loop cycle
	for (i=1; i <= Game.cycleCount; i++) {
		//create a period of boom growth for 20 cycles
		if (i > Game.boomCycle && i < (Game.boomCycle + 20)) {
			rabbit.growthRate = 0.025;
		}
		Game.cycle();
	}

	chart = new Highcharts.Chart({
		chart: {
			renderTo: 'chart',
			type: 'line'
		},
		title: {
			text: 'predator prey model',
			x: -30
		},
		series: [{
			name: 'rabbits',
			data: rabbit.alive
		}, {
			name: 'foxes',
			data: fox.alive
		}, {
			name: 'lion',
			data: lion.alive
		}]
	});
}

function runDynamic() {
	Game.dynamicCycle();
}

function init() {
	console.log(Game);
}