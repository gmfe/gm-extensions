(function () {


    function doCallback() {
    }

    function loadScript(url) {
        var elem = document.createElement('script');
        elem.id = '__gm-extensions_script';
        elem.type = 'text/javascript';
        elem.charset = 'utf-8';
        elem.addEventListener('load', doCallback, false);
        elem.src = url;
        document.getElementsByTagName('head')[0].appendChild(elem);
    }

    function url(file) {
        return chrome.extension.getURL(file);
    }

    const version = chrome.runtime.getManifest().version;

    loadScript(url('guanmai/inject.js?' + version));
})();