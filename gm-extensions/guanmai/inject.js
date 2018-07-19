'use strict';

var _createClass = function () {
  function defineProperties (target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
}()

function _classCallCheck (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function') } }

function _possibleConstructorReturn (self, call) {
  if (!self) { throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called') }
  return call && (typeof call === 'object' || typeof call === 'function') ? call : self
}

function _inherits (subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass) }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  })
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass
}

var Root = document.createElement('div');

Root.style.position = 'fixed';
Root.style.right = '30px'
Root.style.bottom = '10px';
document.body.appendChild(Root);

var KEY = '__gm-extensions_guanmai_show';
var KEYQUICKLOGIN = '__gm-extensions_quick_login';

// 简单判断是否station
var isStation = window.g_user && window.g_user.station_id || window.location.host.includes('station')
var isBShop = window.g_cms_config && window.g_cms_config.key || window.location.host.includes('bshop')

var QuickLogin = function (_React$Component) {
  _inherits(QuickLogin, _React$Component)

  function QuickLogin (props) {
    _classCallCheck(this, QuickLogin)

    var _this = _possibleConstructorReturn(this, (QuickLogin.__proto__ || Object.getPrototypeOf(QuickLogin)).call(this, props))

    _this.handleLogin = function (_ref) {
      var username = _ref.username,
        password = _ref.password;

      doLogin(username, password).then(function () {
        window.location.href = '/'
      });
    };

    var platform = void 0
    if (isStation) {
      platform = 'station'
    } else if (isBShop) {
      platform = 'bshop'
    }

    _this.state = {
      platform: platform,
      accounts: []
    };
    return _this
  }

  _createClass(QuickLogin, [{
    key: 'componentDidMount',
    value: function componentDidMount () {
      var _this2 = this

      getLoginData().then(function (res) {
        if (_this2.state.platform) {
          _this2.setState({
            accounts: res[_this2.state.platform]
          })
        }
      })
    }
  }, {
    key: 'render',
    value: function render () {
      var _this3 = this

      var accounts = this.state.accounts

      if (accounts.length === 0) {
        return null
      }

      return React.createElement(
        'div',
        {style: {borderBottom: '1px solid black'}},
        React.createElement(
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
                  onClick: _this3.handleLogin.bind(_this3, account)
                },
                account.desc || account.username
              )
            );
          })
        ),
        React.createElement(
          'div',
          {style: {textAlign: 'right'}},
          React.createElement(
            'span',
            {
              style: {cursor: 'pointer'}
            },
            'quick login'
          )
        )
      );
    }
  }]);

  return QuickLogin
}(React.Component);

var Info = function (_React$Component2) {
  _inherits(Info, _React$Component2)

  function Info (props) {
    _classCallCheck(this, Info)

    var _this4 = _possibleConstructorReturn(this, (Info.__proto__ || Object.getPrototypeOf(Info)).call(this, props))

    _this4.state = {
      groupId: getGroupId(),
      stationId: getStationId(),
      cmsKey: getCmsKey(),
      branch: window.____fe_branch,
      commit: window.____git_commit
    };
    return _this4
  }

  _createClass(Info, [{
    key: 'render',
    value: function render () {
      var _state = this.state,
        groupId = _state.groupId,
        stationId = _state.stationId,
        cmsKey = _state.cmsKey,
        branch = _state.branch,
        commit = _state.commit;

      return React.createElement(
        'div',
        {style: {borderBottom: '1px solid black'}},
        React.createElement(
          'div',
          null,
          groupId && React.createElement(
          'div',
          null,
          'groupId ',
          groupId
          ),
          stationId && React.createElement(
          'div',
          null,
          'stationId ',
          stationId
          ),
          cmsKey && React.createElement(
          'div',
          null,
          'cmsKey ',
          cmsKey
          ),
          React.createElement(
            'div',
            null,
            'branch ',
            branch,
            '(',
            commit,
            ')'
          )
        )
      );
    }
  }]);

  return Info
}(React.Component);

var App = function (_React$Component3) {
  _inherits(App, _React$Component3)

  function App (props) {
    _classCallCheck(this, App)

    var _this5 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props))

    _this5.handleShow = function () {
      localStorage.setItem(KEY, !_this5.state.show ? '1' : '0')
      _this5.setState({
        show: !_this5.state.show
      })
    }

    _this5.state = {
      show: localStorage.getItem(KEY) === '1' || false,
      hasUpdate: false,
      version: getVersion()
    };
    return _this5
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount () {
      var _this6 = this

      // 更新
      getNextVersion().then(function (newVersion) {
        var diff = versionDiff(_this6.state.version, newVersion)
        if (diff) {
          _this6.setState({
            hasUpdate: true
          });
        }
      });
    }
  }, {
    key: 'render',
    value: function render () {
      var _state2 = this.state,
        show = _state2.show,
        hasUpdate = _state2.hasUpdate,
        version = _state2.version;


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
            '\u6709\u65B0\u7248\u672C\uFF0C\u70B9\u51FB\u8BF7\u524D\u5F80\u66F4\u65B0'
          )
          ),
          React.createElement(
            'div',
            {style: {textAlign: 'right', cursor: 'pointer'}, onClick: this.handleShow},
            'assistant v',
            version
          )
        )
      );
    }
  }]);

  return App
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
      return res.json()
    }
  });
}

function getLoginData () {
  return window.fetch('//static.dev.guanmai.cn/build/json/login.json?' + Math.random()).then(function (res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject('fetch manifest.json error')
  })
}

function getGroupId() {
  var groupId = void 0
  if (window.g_group_id !== undefined) {
    groupId = window.g_group_id
  }
  if (window.g_partner_id !== undefined) {
    groupId = window.g_partner_id
  }
  return groupId
}

function getStationId () {
  var stationId = void 0
  if (window.g_user && window.g_user.station_id) {
    stationId = window.g_user.station_id
  }
  return stationId
}

function getCmsKey() {
  if (window.g_cms_config) {
    return window.g_cms_config.key
  }
}

// 更新逻辑
function getNextVersion() {
  return fetch('https://raw.githubusercontent.com/gmfe/gm-extensions/master/gm-extensions/manifest.json?' + Math.random()).then(function (res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject('fetch manifest.json error')
  }).then(function (json) {
    return json.version
  });
}

function getVersion() {
  var script = document.getElementById('__gm-extensions_script_inject')
  return script.src.split('?')[1]
}

function versionDiff(version, newVersion) {
  var vArr = version.split('.')
  var nArr = newVersion.split('.')

  if (nArr[0] > vArr[0]) {
    return 'major'
  } else if (nArr[1] > vArr[1]) {
    return 'minor'
  } else if (nArr[2] > vArr[2]) {
    return 'patch'
  }

  return null
}