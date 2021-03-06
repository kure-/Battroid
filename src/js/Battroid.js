import 'es6-promise/dist/es6-promise.auto';
import 'sizzle/dist/sizzle';
import 'handlebars/dist/handlebars';
import template from './templates';

export default class Battroid {
	constructor(options) {
		if(!this.isBatteryApiSupported()) {
			return console.warn('Battery API not supported.');
		} else {
			this.getBattery(options);
		}
	}

	getBattery(options) {
		this.options = options;
		let that = this;
		navigator.getBattery().then((battery) => {
			that.battery = battery;
			that.bindListeners(that.battery);
			that.render();
			return that.battery;
		});
	}

	isBatteryApiSupported() {
		return typeof navigator.getBattery === "function";
	}

	bindListeners(battery) {
		battery.addEventListener('chargingtimechange', (e) => {
			if(this.options.onChargingTimeChange) {
				this.options.onChargingTimeChange(this);
			}
			this.render();
		});

		battery.addEventListener('chargingchange', (e) => {
			if(this.options.onChargingChange) {
				this.options.onChargingChange(this);
			}
			this.render();
		});

		battery.addEventListener('dischargingtimechange', (e) => {
			if(this.options.onDischargingTimeChange) {
				this.options.onDischargingTimeChange(this);
			}
			this.render();
		});

		battery.addEventListener('levelchange', (e) => {
			if(this.options.onLevelChange) {
				this.options.onLevelChange(this);
			}
			this.render();
		});
	}

	registerHandleBarsHelpers() {
		if(typeof Handlebars !== "undefined" && typeof Handlebars.registerHelper !== "undefined") {
			Handlebars.registerHelper("parseSeconds", (seconds) => {
				if(!isNaN(seconds) && seconds != "Infinity") {
					let time = parseInt(seconds);
					return secondsToHms(seconds);
				} else {
					return seconds;
				}
			});

			Handlebars.registerHelper("percentage", (number) => {
				if(!isNaN(number)) {
					return (number * 100).toFixed() + '%';
				} else {
					return number;
				}
			});

			Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
				switch (operator) {
					case '==':
						return (v1 == v2) ? options.fn(this) : options.inverse(this);
					case '===':
						return (v1 === v2) ? options.fn(this) : options.inverse(this);
					case '!=':
						return (v1 != v2) ? options.fn(this) : options.inverse(this);
					case '!==':
						return (v1 !== v2) ? options.fn(this) : options.inverse(this);
					case '<':
						return (v1 < v2) ? options.fn(this) : options.inverse(this);
					case '<=':
						return (v1 <= v2) ? options.fn(this) : options.inverse(this);
					case '>':
						return (v1 > v2) ? options.fn(this) : options.inverse(this);
					case '>=':
						return (v1 >= v2) ? options.fn(this) : options.inverse(this);
					case '&&':
						return (v1 && v2) ? options.fn(this) : options.inverse(this);
					case '||':
						return (v1 || v2) ? options.fn(this) : options.inverse(this);
					default:
						return options.inverse(this);
				}
			});
		}
	}

	render() {
		if(this.options.render) {
			this.registerHandleBarsHelpers();
			if(!this.options.template) {
				this.template = Handlebars.compile(template);
			} else {
				this.template = Handlebars.compile(this.options.template);
			}
			if(this.options.targetElement) {
				let renderTarget = Sizzle(this.options.targetElement);
				if(renderTarget.length) {
					renderTarget[0].innerHTML = this.template({data: this.battery});
				} else {
					console.warn("Render target doesn't exist. Omitting rendering.");
				}
			} else {
				console.warn('No target element specified, omitting rendering.');
			}
		} else {
			console.warn('Rendering turned off, ommitting rendering.');
		}
	}
}

/**
 * Convert seconds to h:m:s format
 * thanks to https://stackoverflow.com/questions/5539028/converting-seconds-into-hhmmss
 * @param  {string} d    Time in seconds
 * @return {string}      Time in h:m:s format
 */
function secondsToHms(d) {
	d = Number(d);

	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);

	return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
};