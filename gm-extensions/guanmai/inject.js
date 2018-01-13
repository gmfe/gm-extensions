'use strict';

(function () {
    var key = '__gm-extensions_guanmai_show';

    var show = localStorage.getItem(key) !== '0';

    var showUpdate = false;

    var div = document.createElement('div');
    div.innerHTML = 'assistant';
    div.style.position = "fixed";
    div.style.bottom = '10px';
    div.style.right = '10px';
    div.style.zIndex = '10000';
    div.style.cursor = 'pointer';

    document.body.appendChild(div);

    var updateEle = document.createElement('a');
    updateEle.innerHTML = '点我更新';
    updateEle.href = 'https://github.com/gmfe/gm-extensions/raw/master/gm-extensions.crx';
    updateEle.target = '_blank';

    var toggleEle = document.createElement('div');
    toggleEle.style.textAlign = 'right';
    toggleEle.style.borderTop = '1px solid black';
    toggleEle.innerHTML = 'assistant';
    toggleEle.onclick = function () {
        show = !show;
        localStorage.setItem(key, show ? '1' : '0');
        render();
    };

    var groupId = undefined;
    if (window.g_group_id !== undefined) {
        groupId = window.g_group_id;
    }
    if (window.g_partner_id !== undefined) {
        groupId = window.g_partner_id;
    }

    var groupEle = document.createElement('div');
    groupEle.innerHTML = 'group ' + groupId;

    var cmsKeyEle = document.createElement('div');
    cmsKeyEle.innerHTML = 'cms_key ' + (window.g_cms_config && window.g_cms_config.key);

    var branchEle = document.createElement('div');
    branchEle.innerHTML = 'branch ' + window.____fe_branch;

    show && render();

    getNextVersion().then(function (version) {
        if (version !== getVersion()) {
            showUpdate = true;
            render();
        }
    });

    function render() {
        div.innerHTML = '';
        if (show) {
            if (groupId !== undefined) {
                div.appendChild(groupEle);
            }

            if (window.g_cms_config) {
                div.appendChild(cmsKeyEle);
            }

            if (window.____fe_branch) {
                div.appendChild(branchEle);
            }

            if (showUpdate) {
                div.appendChild(updateEle);
            }
        }
        div.appendChild(toggleEle);
    }

    function getCookie(name) {
        var map = {};
        var arr = document.cookie.split(';');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                // 以等号（=）分组
                var kv = arr[i].split("=");
                // Trim() 是自定义的函数，用来删除字符串两边的空格
                map[kv[0].trim()] = kv[1].trim();
            }
        }
        return map[name];
    }

    // 更新逻辑
    function getNextVersion() {
        return fetch('https://raw.githubusercontent.com/gmfe/gm-extensions/master/gm-extensions/manifest.json?' + Math.random()).then(function (res) {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject('fetch manifest.json error');
        }).then(function (json) {
            return json.version;
        });
    }

    function getVersion() {
        var script = document.getElementById('__gm-extensions_script');
        return script.src.split('?')[1];
    }
})();