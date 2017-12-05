(function () {
    const key = '__gm-extensions_guanmai_show';

    const show = localStorage.getItem(key) !== '0';

    function toggleShow() {
        if (div.innerHTML === 'assistant') {
            localStorage.setItem(key, '1');


            div.innerHTML = [
                `<div>GroupID ${window.g_group_id === undefined ? window.g_partner_id : window.g_group_id}</div>`,
                `<div>分支 ${window.____fe_branch}</div>`,
                `<div style="text-align: right;border-top: 1px solid black;">assistant</div>`
            ].join('');
        } else {
            localStorage.setItem(key, '0');
            div.innerHTML = 'assistant';
        }
    }

    const div = document.createElement('div');
    div.innerHTML = 'assistant';
    div.style.position = "fixed";
    div.style.bottom = '10px';
    div.style.right = '10px';
    div.style.zIndex = '10000';
    div.style.cursor = 'pointer';


    div.onclick = toggleShow;

    document.body.appendChild(div);

    show && toggleShow();
})();
