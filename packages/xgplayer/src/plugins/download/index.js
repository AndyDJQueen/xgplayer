import downloadUtil from 'downloadjs'
import Plugin, {POSITIONS} from '../../plugin'
import DownloadSvg from '../assets/download.svg'

export default class Download extends Plugin {
  static get pluginName () {
    return 'downloadIcon'
  }

  static get defaultConfig () {
    return {
      position: POSITIONS.CONTROLS_RIGHT,
      index: 3,
      disable: true
    }
  }

  constructor (args) {
    super(args)
    this.timer = null
    this.isLock = false
  }

  beforeCreate (args) {
    if (typeof args.player.config.download === 'boolean') {
      args.config.disable = !args.player.config.download
    }
  }

  afterCreate () {
    if (this.config.disable) {
      return;
    }
    this.appendChild('.xgplayer-icon', this.icons.download)
    this.download = this.download.bind(this)
    this.bind(['click', 'touchend'], this.download)
  }

  registerIcons () {
    return {
      download: DownloadSvg
    }
  }

  download () {
    if (this.isLock) {
      return
    }
    const url = this.getAbsoluteURL(this.player.src)
    downloadUtil(url)
    this.isLock = true
    this.timer = window.setTimeout(() => {
      this.isLock = false
      window.clearTimeout(this.timer)
      this.timer = null
    }, 300)
  }

  getAbsoluteURL (url) {
    // Check if absolute URL
    if (!url.match(/^https?:\/\//)) {
      const div = document.createElement('div')
      div.innerHTML = `<a href="${url}">x</a>`
      url = div.firstChild.href
    }
    return url
  }

  destroy () {
    this.unbind(['click', 'touchend'], this.download)
    window.clearTimeout(this.timer)
    this.timer = null
  }

  render () {
    if (this.config.disable) {
      return;
    }
    return `<xg-icon class="xgplayer-download">
      <div class="xgplayer-icon">
      </div>
      <div class="xg-tips" lang-key="${this.i18nKeys.DOWNLOAD_TIPS}">${this.i18n.DOWNLOAD_TIPS}</div>
    </xg-icon>`
  }
}
