/**
 * This example shows how the battroid class can be used in real.
 * In the example I'm using a custom template to render the widget and binding here
 * some actions to the widget controls.
 * The example behaves mostly to a practical usage, so if you un/plug your laptop, it minimizes :)
 * So in real, you might want to use such behaviour e.g. in e-shop or blog, simply to remind
 * the visitor to do some action before he runs out of battery (bookmark page, send himself a link
 * to email, ...).
 * It's a shame that the Battery API will probably get removed by any time and probably Chrome
 * and Opera are the only ones left who support it, but hey, it's pretty amazing to see and start
 * realizing what are the functionalities and APIs in the browser to get the information about your
 * users :-)
 */
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

/**
 * Show widget only when battery is lower than 35% and if not charging,
 * otherwise minimize the widget.
 * @param  {Object} battery
 * @return {Function}
 */
function shouldShowWidget(battery) {
	if(battery.battery.level < 0.25 && !battery.battery.charging) {
		return maximizeWidget();
	} else {
		return minimizeWidget();
	}
}

/**
 * Show widget completely
 */
function showWidget() {
	if(batteryWidget) {
		batteryWidget.classList.add('Battroid--visible');
	}
}

/**
 * Hide widget completely
 */
function hideWidget() {
	if(batteryWidget) {
		batteryWidget.classList.remove('Battroid--visible');
	}
}

/**
 * Calculate the height of widget and minimize it, so the header with controls is visible
 */
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
		if(minimizeWidgetElement) {
			minimizeWidgetElement.classList.add('Battroid-button--maximize');
			minimizeWidgetElement.classList.remove('Battroid-button--minimize');
		}
	}
}

/**
 * Show the widget at its full height and switch the minimize/maximize button
 */
function maximizeWidget() {
	if(batteryWidget) {
		batteryWidget.style.bottom = 0;
		if(minimizeWidgetElement) {
			minimizeWidgetElement.classList.remove('Battroid-button--maximize');
			minimizeWidgetElement.classList.add('Battroid-button--minimize');
		}
	}
}

/**
 * Bookmark page if supported, otherwise just show alert with instructions
 */
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

/**
 * Bind bookmark page listener
 */
if(battroidBookmark) {
	battroidBookmark.addEventListener('click', (e) => {
		e.preventDefault();
		bookmarkPage(battroidBookmark);
	});
}

/**
 * Bind discard widget listener, so its completely hidden on click
 */
if(discardWidget) {
	discardWidget.addEventListener('click', (e) => {
		e.preventDefault();
		hideWidget();
	});
}

/**
 * Bind minimize widget element to control
 */
if(minimizeWidgetElement) {
	minimizeWidgetElement.addEventListener('click', (e) => {
		e.preventDefault();
		if(minimizeWidgetElement.classList.contains('Battroid-button--maximize')) {
			maximizeWidget();
		} else {
			minimizeWidget();
		}
	});
}