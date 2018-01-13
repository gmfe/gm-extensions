'use strict';

(function () {

    function doCallback() {
    }

    function loadScript(url) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : doCallback;

        var elem = document.createElement('script');
        elem.id = '__gm-extensions_script';
        elem.type = 'text/javascript';
        elem.charset = 'utf-8';
        elem.addEventListener('load', callback, false);
        elem.src = url;
        document.getElementsByTagName('head')[0].appendChild(elem);
    }

    function url(file) {
        return chrome.extension.getURL(file);
    }

    var version = chrome.runtime.getManifest().version;

    var reactUrl = 'https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/umd/react.development.js';
    var reactDomUrl = 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.2.0/umd/react-dom.development.js';
    // loadScript(url('guanmai/inject.js?' + version));
    loadScript(reactUrl, function () {
        console.log('load react');
        loadScript(reactDomUrl, function () {
            console.log('load react-dom');
            loadScript(url('guanmai/react.js?' + version), function () {
                console.log('load react.js');
            });
        });
    });
})();