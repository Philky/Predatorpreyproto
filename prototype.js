function Life() {
	this.growthRate = 0,
	this.consumptionRate = 0,
	this.kind = 'prey',
	this.population = 0,
	this.alive = []
};

var rabbit = new Life();
var fox = new Life();
var lion = new Life();
var chart;


Game = {
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

function init() {
	console.log(Game);
}