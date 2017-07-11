import 'webfontloader/webfontloader';
import Battroid from './Battroid';

var fokume = new Battroid({
	render: true,
	template: false,
	targetElement: '#Content'
});

WebFontConfig = {
	google: {
		families: ['Merriweather:300,300i,400,400i,700,700i:latin-ext']
	}
};

WebFont.load(WebFontConfig);
