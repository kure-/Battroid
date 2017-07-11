import 'webfontloader/webfontloader';
import Battroid from './Battroid';

const BattroidExample = new Battroid({
	render: true,
	template: document.getElementById('entry-template').innerHTML,
	targetElement: '#Content'
});

WebFontConfig = {
	google: {
		families: ['Merriweather:300,300i,400,400i,700,700i:latin-ext']
	}
};

WebFont.load(WebFontConfig);
