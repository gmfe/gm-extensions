const Root = document.createElement('div')

Root.style.position = 'fixed'
Root.style.right = '30px'
Root.style.bottom = '10px'
document.body.appendChild(Root)

const KEY = '__gm-extensions_guanmai_show'
const KEYQUICKLOGIN = '__gm-extensions_quick_login'

// 简单判断是否station
const isStation = window.g_user && window.g_user.station_id

class QuickLogin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      accounts: this.getAccounts()
    }
  }

  getAccounts () {
    return JSON.parse(localStorage.getItem(KEYQUICKLOGIN)) || []
  }

  addAccounts (username, password, remark) {
    const accounts = this.getAccounts()
    accounts.push({
      username,
      password,
      remark
    })
    this.setState({
      accounts
    })
    localStorage.setItem(KEYQUICKLOGIN, JSON.stringify(accounts))
  }

  removeAccounts (username, password) {
    const accounts = this.getAccounts()
    const index = accounts.findIndex(v => v.username === username && v.password === password)
    if (index > -1) {
      accounts.splice(index, 1)
    }
    this.setState({
      accounts
    })
    localStorage.setItem(KEYQUICKLOGIN, JSON.stringify(accounts))
  }

  handleLogin = ({username, password}) => {
    doLogin(username, password).then(() => {
      window.location.href = '/'
    })
  }

  handleAdd = () => {
    const text = window.prompt('请输入 用户名 + 密码 + 备注(可选)，中间空格隔开')
    if (text) {
      const username = text.split(' ')[0]
      const password = text.split(' ')[1]
      const remark = text.split(' ')[2]

      this.addAccounts(username, password, remark)
    }
  }

  handleRemove = ({username, password}) => {
    if (window.confirm('确定移除？')) {
      this.removeAccounts(username, password)
    }
  }

  render () {
    const {accounts} = this.state
    if (!isStation) {
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
                >{account.username}{account.remark ? `(${account.remark})` : ''}</span>
              <span style={{cursor: 'pointer', position: 'absolute', right: 0}}
                    onClick={this.handleRemove.bind(this, account)}>&nbsp;-&nbsp;</span>
            </div>
          ))}
        </div>
        <div style={{textAlign: 'right'}}>
          <span style={{cursor: 'pointer'}} onClick={this.handleAdd}>&nbsp;+&nbsp;</span>
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

function doLogin (username, password) {
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
