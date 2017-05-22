import 'es6-promise/dist/es6-promise.auto';
import 'js-cookie/src/js.cookie';
import 'sizzle/dist/sizzle';

export default class Battroid {
	constructor() {
		if(!this.isBatteryApiSupported()) {
			return console.info('Battery API not supported');
		} else {
			this.checkBattery();
			console.log(this.battery);
			this.bindListeners(this.battery);
		}
	}

	checkBattery() {
		let that = this;
		navigator.getBattery().then((battery) => {
			that.battery = battery;
		});

		return this.battery;
	}

	getChargeInfo(battery) {
		return battery.charging;
	}

	getBatteryLevel(battery) {
		return battery.level;
	}

	isBatteryApiSupported() {
		return typeof navigator.getBattery === "function" ? true : false;
	}

	bindListeners(battery) {
		battery.addEventListener('chargingtimechange', (e) => {
			console.log(battery.chargingTime + ' seconds');
		});

		battery.addEventListener('chargingchange', (e) => {
			console.log(battery.charging ? "yes" : "no");
			
		});

		battery.addEventListener('dischargingtimechange', (e) => {
			console.log(battery.dischargingTime + " seconds");
		});
	}

}
