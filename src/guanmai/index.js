(function () {
    function doCallback() {
    }

    function loadScript(url, name, callback = doCallback) {
      const elem = document.createElement('script')
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

    const version = chrome.runtime.getManifest().version;

  const reactUrl = 'https://cdnjs.cloudflare.com/ajax/libs/react/16.8.5/umd/react.development.js'
  const reactDomUrl = 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.8.5/umd/react-dom.development.js'

    loadScript(reactUrl, 'react', () => {
        loadScript(reactDomUrl, 'react-dom', () => {
            loadScript(url('guanmai/inject.js?' + version), 'inject');
        });
    });
})();
