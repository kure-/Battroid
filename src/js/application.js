import 'webfontloader/webfontloader';
import Battroid from './Battroid';

var fokume = new Battroid();

WebFontConfig = {
	google: {
		families: ['Merriweather:300,300i,400,400i,700,700i:latin-ext']
	}
};

WebFont.load(WebFontConfig);
