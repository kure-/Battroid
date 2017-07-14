import Battroid from './Battroid';

const batteryWidget = document.getElementById('battroid');
const battroidBookmark = document.getElementById('bookmark-page');
const discardWidget = document.getElementById('battroid-discard');
const minimizeWidgetElement = document.getElementById('battroid-minimize');

const BattroidExample = new Battroid({
	render: true,
	template: document.getElementById('entry-template').innerHTML,
	targetElement: '#battroid-content',
	onLevelChange: shouldShowWidget
});

function lessThan(value, arg) {

}

function shouldShowWidget(battery) {
	if(battery.battery.level < 0.35 && !battery.battery.charging) {
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

function minimizeWidget() {
	if(batteryWidget) {
		let batteryWidgetHeight = batteryWidget.offsetHeight;
		let batteryWidgetHeaderHeight = document.querySelectorAll('.Battroid-header');
		if(batteryWidgetHeaderHeight.length) {
			batteryWidgetHeaderHeight = batteryWidgetHeaderHeight[0].offsetHeight;
		} else {
			batteryWidgetHeaderHeight = 0;
		}
		batteryWidget.style.bottom = (batteryWidgetHeight - batteryWidgetHeaderHeight) * -1 + 'px';
	}
}

function maximizeWidget() {
	if(batteryWidget) {
		batteryWidget.style.bottom = 0;
	}
}

function bookmarkPage(element) {
	var bookmarkURL = window.location.href;
	var bookmarkTitle = document.title;

	if ('addToHomescreen' in window && window.addToHomescreen.isCompatible) {
		// Mobile browsers
		addToHomescreen({ autostart: false, startDelay: 0 }).show(true);
	} else if (window.sidebar && window.sidebar.addPanel) {
		// Firefox version < 23
		window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
	} else if ((window.sidebar && /Firefox/i.test(navigator.userAgent)) || (window.opera && window.print)) {
		// Firefox version >= 23 and Opera Hotlist
		if(element) {
			element.setAttribute('href', bookmarkURL);
			element.setAttribute('title', bookmarkTitle);
			element.setAttribute('rel', 'sidebar');
		}
		return true;
	} else if (window.external && ('AddFavorite' in window.external)) {
		// IE Favorite
		window.external.AddFavorite(bookmarkURL, bookmarkTitle);
	} else {
		// Other browsers (mainly WebKit - Chrome/Safari)
		alert('Please press ' + (/Mac/i.test(navigator.userAgent) ? 'CMD' : 'Strg') + ' + D to add this page to your favorites.');
	}
}

if(battroidBookmark) {
	battroidBookmark.addEventListener('click', (e) => {
		e.preventDefault();
		bookmarkPage(battroidBookmark);
	});
}

if(discardWidget) {
	discardWidget.addEventListener('click', (e) => {
		e.preventDefault();
		hideWidget();
	});
}

if(minimizeWidgetElement) {
	minimizeWidgetElement.addEventListener('click', (e) => {
		e.preventDefault();
		if(minimizeWidgetElement.classList.contains('Battroid-button--maximize')) {
			maximizeWidget();
		} else {
			minimizeWidget();
		}
		minimizeWidgetElement.classList.toggle('Battroid-button--maximize');
	});
}