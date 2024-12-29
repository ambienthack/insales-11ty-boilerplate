import { updateScrollbarWidth } from './ui';
import { init as initCommonV2Mock } from './common-v2-mock';

import _ from 'lodash';
((w) => {
    w._ = _; //for insales variant templates to work
    w.devmode = true; //TODO remove in insales!
})(window as any)

if (window['devmode']) {
    initCommonV2Mock();
}

$('body').addClass('page');
updateScrollbarWidth();

