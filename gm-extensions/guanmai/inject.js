'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Root = document.createElement('div');

Root.style.position = 'fixed';
Root.style.right = '10px';
Root.style.bottom = '10px';
document.body.appendChild(Root);

var KEY = '__gm-extensions_guanmai_show';
var KEYQUICKLOGIN = '__gm-extensions_quick_login';
var KEYQUICKLOGINSHOW = '__gm-extensions_quick_login_show';

// 简单判断是否station
var isStation = window.g_user && window.g_user.station_id;

var QuickLogin = function (_React$Component) {
    _inherits(QuickLogin, _React$Component);

    function QuickLogin(props) {
        _classCallCheck(this, QuickLogin);

        var _this = _possibleConstructorReturn(this, (QuickLogin.__proto__ || Object.getPrototypeOf(QuickLogin)).call(this, props));

        _this.handleLogin = function (_ref) {
            var username = _ref.username,
                password = _ref.password;

            doLogin(username, password).then(function () {
                window.location.href = '/';
            });
        };

        _this.handleShow = function () {
            localStorage.setItem(KEYQUICKLOGINSHOW, !_this.state.show ? '1' : '0');
            _this.setState({
                show: !_this.state.show
            });
        };

        _this.handleAdd = function () {
            var text = window.prompt('请输入 用户名 + 密码 + 备注(可选)，中间空格隔开');
            if (text) {
                var username = text.split(' ')[0];
                var password = text.split(' ')[1];
                var remark = text.split(' ')[2];

                _this.addAccounts(username, password, remark);
            }
        };

        _this.handleRemove = function (_ref2) {
            var username = _ref2.username,
                password = _ref2.password;

            if (window.confirm('确定移除？')) {
                _this.removeAccounts(username, password);
            }
        };

        _this.state = {
            show: localStorage.getItem(KEYQUICKLOGINSHOW) === '1' || false,
            accounts: _this.getAccounts()
        };
        return _this;
    }

    _createClass(QuickLogin, [{
        key: 'getAccounts',
        value: function getAccounts() {
            return JSON.parse(localStorage.getItem(KEYQUICKLOGIN)) || [];
        }
    }, {
        key: 'addAccounts',
        value: function addAccounts(username, password, remark) {
            var accounts = this.getAccounts();
            accounts.push({
                username: username,
                password: password,
                remark: remark
            });
            this.setState({
                accounts: accounts
            });
            localStorage.setItem(KEYQUICKLOGIN, JSON.stringify(accounts));
        }
    }, {
        key: 'removeAccounts',
        value: function removeAccounts(username, password) {
            var accounts = this.getAccounts();
            var index = accounts.findIndex(function (v) {
                return v.username === username && v.password === password;
            });
            if (index > -1) {
                accounts.splice(index, 1);
            }
            this.setState({
                accounts: accounts
            });
            localStorage.setItem(KEYQUICKLOGIN, JSON.stringify(accounts));
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _state = this.state,
                show = _state.show,
                accounts = _state.accounts;

            if (!isStation) {
                return null;
            }

            return React.createElement(
                'div',
                {style: {borderBottom: '1px solid black'}},
                show && React.createElement(
                'div',
                null,
                accounts.map(function (account, i) {
                    return React.createElement(
                        'div',
                        {key: i},
                        React.createElement(
                            'span',
                            {
                                style: {cursor: 'pointer', position: 'relative'},
                                onClick: _this2.handleLogin.bind(_this2, account)
                            },
                            account.username,
                            account.remark ? '(' + account.remark + ')' : ''
                        ),
                        React.createElement(
                            'span',
                            {
                                style: {cursor: 'pointer', position: 'absolute', right: 0},
                                onClick: _this2.handleRemove.bind(_this2, account)
                            },
                            '\xA0-\xA0'
                        )
                    );
                })
                ),
                React.createElement(
                    'div',
                    {style: {textAlign: 'right'}},
                    show && React.createElement(
                    'span',
                    {style: {cursor: 'pointer'}, onClick: this.handleAdd},
                    '\xA0+\xA0'
                    ),
                    React.createElement(
                        'span',
                        {style: {cursor: 'pointer'}, onClick: this.handleShow},
                        'quick login'
                    )
                )
            );
        }
    }]);

    return QuickLogin;
}(React.Component);

var Info = function (_React$Component2) {
    _inherits(Info, _React$Component2);

    function Info(props) {
        _classCallCheck(this, Info);

        var _this3 = _possibleConstructorReturn(this, (Info.__proto__ || Object.getPrototypeOf(Info)).call(this, props));

        _this3.state = {
            groupId: getGroupId(),
            cmsKey: getCmsKey(),

            branch: window.____fe_branch
        };
        return _this3;
    }

    _createClass(Info, [{
        key: 'render',
        value: function render() {
            var _state2 = this.state,
                groupId = _state2.groupId,
                cmsKey = _state2.cmsKey,
                branch = _state2.branch;

            return React.createElement(
                'div',
                {style: {borderBottom: '1px solid black'}},
                React.createElement(
                    'div',
                    null,
                    groupId !== undefined && React.createElement(
                    'div',
                    null,
                    'group ',
                    groupId
                    ),
                    cmsKey && React.createElement(
                    'div',
                    null,
                    'cms_key ',
                    cmsKey
                    ),
                    React.createElement(
                        'div',
                        null,
                        'branch ',
                        branch
                    )
                )
            );
        }
    }]);

    return Info;
}(React.Component);

var App = function (_React$Component3) {
    _inherits(App, _React$Component3);

    function App(props) {
        _classCallCheck(this, App);

        var _this4 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this4.handleShow = function () {
            localStorage.setItem(KEY, !_this4.state.show ? '1' : '0');
            _this4.setState({
                show: !_this4.state.show
            });
        };

        _this4.state = {
            show: localStorage.getItem(KEY) === '1' || false,
            hasUpdate: false
        };
        return _this4;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this5 = this;

            // 更新
            getNextVersion().then(function (newVersion) {
                var diff = versionDiff(getVersion(), newVersion);
                if (diff) {
                    _this5.setState({
                        hasUpdate: true
                    });
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _state3 = this.state,
                show = _state3.show,
                hasUpdate = _state3.hasUpdate;


            return React.createElement(
                'div',
                null,
                show && React.createElement(
                'div',
                null,
                React.createElement(QuickLogin, null),
                React.createElement(Info, null)
                ),
                React.createElement(
                    'div',
                    null,
                    hasUpdate && React.createElement(
                    'div',
                    {style: {textAlign: 'right'}},
                    React.createElement(
                        'a',
                        {target: '_blank', href: 'https://github.com/gmfe/gm-extensions'},
                        '\u6709\u65B0\u7248\u672C\uFF0C\u8BF7\u524D\u5F80\u66F4\u65B0'
                    )
                    ),
                    React.createElement(
                        'div',
                        {style: {textAlign: 'right', cursor: 'pointer'}, onClick: this.handleShow},
                        'assistant'
                    )
                )
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), Root);

function doLogin(username, password) {
    return window.fetch('/station/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: 'include',
        body: 'username=' + username + '&password=' + password
    }).then(function (res) {
        if (res.ok) {
            return res.json();
        }
    });
}

function getGroupId() {
    var groupId = undefined;
    if (window.g_group_id !== undefined) {
        groupId = window.g_group_id;
    }
    if (window.g_partner_id !== undefined) {
        groupId = window.g_partner_id;
    }
    return groupId;
}

function getCmsKey() {
    if (window.g_cms_config) {
        return window.g_cms_config.key;
    }
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
    var script = document.getElementById('__gm-extensions_script_inject');
    return script.src.split('?')[1];
}

function versionDiff(version, newVersion) {
    var vArr = version.split('.');
    var nArr = newVersion.split('.');

    if (nArr[0] > vArr[0]) {
        return 'major';
    } else if (nArr[1] > vArr[1]) {
        return 'minor';
    } else if (nArr[2] > vArr[2]) {
        return 'patch';
    }

    return null;
}