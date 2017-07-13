import 'webfontloader/webfontloader';
import Battroid from './Battroid';

const batteryWidget = document.getElementById('battroid');
const battroidBookmark = document.getElementById('bookmark-page');

const BattroidExample = new Battroid({
	render: true,
	template: document.getElementById('entry-template').innerHTML,
	targetElement: '#battroid-content',
	onLevelChange: shouldShowWidget,
	onChargingChange: shouldShowWidget
});

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

function bookmarkPage() {
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
		$(this).attr({
			href: bookmarkURL,
			title: bookmarkTitle,
			rel: 'sidebar'
		}).off(e);
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
		bookmarkPage();
	});
}
