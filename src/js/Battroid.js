import 'es6-promise/dist/es6-promise.auto';
import 'js-cookie/src/js.cookie';
import 'sizzle/dist/sizzle';
import 'handlebars/dist/handlebars';
import template from './templates';

export default class Battroid {
	constructor(options) {
		if(!this.isBatteryApiSupported()) {
			return console.warn('Battery API not supported');
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
		return typeof navigator.getBattery === "function" ? true : false;
	}

	bindListeners(battery) {
		battery.addEventListener('chargingtimechange', (e) => {
			this.render();
		});

		battery.addEventListener('chargingchange', (e) => {
			this.render();
		});

		battery.addEventListener('dischargingtimechange', (e) => {
			this.render();
		});

		battery.addEventListener('levelchange', (e) => {
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