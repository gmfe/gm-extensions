'use strict';

(function () {
    function doCallback() {}

    function loadScript(url, name) {
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : doCallback;

        var elem = document.createElement('script');
        elem.id = '__gm-extensions_script_' + name;
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

    loadScript(reactUrl, 'react', function () {
        loadScript(reactDomUrl, 'react-dom', function () {
            loadScript(url('guanmai/inject.js?' + version), 'inject');
        });
    });
})();