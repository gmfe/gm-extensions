const Root = document.createElement('div')

Root.style.position = 'fixed'
Root.style.right = '30px'
Root.style.bottom = '10px'
document.body.appendChild(Root)

const KEY = '__gm-extensions_guanmai_show'

class QuickLogin extends React.Component {
  constructor (props) {
    super(props)

    let platform
    // 优先 bshop，因为 bshop 也有 station_id
    if (window.g_cms_config && window.g_cms_config.key || window.location.host.includes('bshop')) {
      platform = 'bshop'
    } else if (window.g_user && window.g_user.station_id || window.location.host.includes('station')) {
      platform = 'station'
    }

    this.state = {
      platform,
      accounts: []
    }
  }

  componentDidMount () {
    getLoginData().then(res => {
      if (this.state.platform) {
        this.setState({
          accounts: res[this.state.platform] || []
        })
      }
    })
  }

  handleLogin = ({username, password}) => {
    const {platform} = this.state

    if (platform === 'station') {
      doStationLogin(username, password).then(() => {
        window.location.href = '/'
      })
    } else if (platform === 'bshop') {
      doBShopLogin(username, password).then(() => {
        window.location.href = '/v587/'
      })
    }
  }

  render () {
    const {accounts} = this.state

    if (accounts.length === 0) {
      return null
    }

    return (
      <div style={{borderBottom: '1px solid black'}}>
        <div>
          {accounts.map((account, i) => (
            <div key={i}>
                <span
                  style={{cursor: 'pointer', position: 'relative'}}
                  onClick={this.handleLogin.bind(this, account)}
                >{account.desc || account.username}</span>
            </div>
          ))}
        </div>
        <div style={{textAlign: 'right'}}>
          <span
            style={{cursor: 'pointer'}}
          >quick login</span>
        </div>
      </div>
    )
  }
}

class Info extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      groupId: getGroupId(),
      stationId: getStationId(),
      cmsKey: getCmsKey(),
      branch: window.____fe_branch,
      commit: window.____git_commit
    }
  }

  render () {
    const {
      groupId, stationId, cmsKey,
      branch, commit
    } = this.state
    return (
      <div style={{borderBottom: '1px solid black'}}>
        <div>
          {groupId && <div>groupId {groupId}</div>}
          {stationId && <div>stationId {stationId}</div>}
          {cmsKey && <div>cmsKey {cmsKey}</div>}
          <div>branch {branch}({commit})</div>
        </div>
      </div>
    )
  }
}

class App extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      show: localStorage.getItem(KEY) === '1' || false,
      hasUpdate: false,
      version: getVersion()
    }
  }

  componentDidMount () {
    // 更新
    getNextVersion().then(newVersion => {
      const diff = versionDiff(this.state.version, newVersion)
      if (diff) {
        this.setState({
          hasUpdate: true
        })
      }
    })
  }

  handleShow = () => {
    localStorage.setItem(KEY, !this.state.show ? '1' : '0')
    this.setState({
      show: !this.state.show
    })
  }

  render () {
    const {
      show, hasUpdate, version
    } = this.state

    return (
      <div>
        {show && (
          <div>
            <QuickLogin/>
            <Info/>
          </div>
        )}
        <div>
          {hasUpdate && (
            <div style={{textAlign: 'right'}}>
              <a target="_blank" href="https://github.com/gmfe/gm-extensions">有新版本，点击请前往更新</a>
            </div>
          )}
          <div style={{textAlign: 'right', cursor: 'pointer'}} onClick={this.handleShow}>assistant v{version}</div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, Root)

function doStationLogin (username, password) {
  return window.fetch('/station/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include',
    body: `username=${username}&password=${password}`
  }).then(res => {
    if (res.ok) {
      return res.json()
    }
  })
}

function doBShopLogin (username, password) {
  return window.fetch('/v587/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include',
    body: `username=${username}&password=${password}`
  }).then(res => {
    if (res.ok) {
      return res.json()
    }
  })
}

function getLoginData () {
  return window.fetch('//static.dev.guanmai.cn/build/json/login.json?' + Math.random()).then(res => {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject('fetch manifest.json error')
  })
}

function getGroupId () {
  let groupId
  if (window.g_group_id !== undefined) {
    groupId = window.g_group_id
  }
  if (window.g_partner_id !== undefined) {
    groupId = window.g_partner_id
  }
  return groupId
}

function getStationId () {
  let stationId
  if (window.g_user && window.g_user.station_id) {
    stationId = window.g_user.station_id
  }
  return stationId
}

function getCmsKey () {
  if (window.g_cms_config) {
    return window.g_cms_config.key
  }
}

// 更新逻辑
function getNextVersion () {
  return fetch('https://raw.githubusercontent.com/gmfe/gm-extensions/master/gm-extensions/manifest.json?' + Math.random()).then(res => {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject('fetch manifest.json error')
  }).then(json => {
    return json.version
  })
}

function getVersion () {
  const script = document.getElementById('__gm-extensions_script_inject')
  return script.src.split('?')[1]
}

function versionDiff (version, newVersion) {
  const vArr = version.split('.')
  const nArr = newVersion.split('.')

  if (nArr[0] > vArr[0]) {
    return 'major'
  } else if (nArr[1] > vArr[1]) {
    return 'minor'
  } else if (nArr[2] > vArr[2]) {
    return 'patch'
  }

  return null
}
