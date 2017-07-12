import 'webfontloader/webfontloader';
import Battroid from './Battroid';

const batteryWidget = document.getElementById('battroid');

const BattroidExample = new Battroid({
	render: true,
	template: document.getElementById('entry-template').innerHTML,
	targetElement: '#battroid',
	onLevelChange: shouldShowWidget,
	onChargingChange: shouldShowWidget
});

WebFontConfig = {
	google: {
		families: ['Merriweather:300,300i,400,400i,700,700i:latin-ext']
	}
};

WebFont.load(WebFontConfig);

function shouldShowWidget(battery) {
	if(battery.battery.level < 0.8) {
		showWidget();
	} else {
		hideWidget();
	}
}

function showWidget() {
	if(batteryWidget) {
		batteryWidget.classList.add('Battroid--visible');
	}
}

function hideWidget() {
	if(batteryWidget) {
		batteryWidget.classList.remove('Battroid--visible');
	}
}
