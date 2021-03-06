/* global describe, it, before */

const Brave = require('../lib/brave')
const {urlInput, clearBrowsingDataPanel} = require('../lib/selectors')
const {getTargetAboutUrl} = require('../../js/lib/appUrlUtil')

describe('Clear Browsing Panel', function () {
  function * setup (client) {
    yield client
      .waitUntilWindowLoaded()
      .waitForUrl(Brave.newTabUrl)
      .waitForBrowserWindow()
      .waitForVisible('#window')
      .waitForVisible(urlInput)
  }

  describe('General', function () {
    Brave.beforeAll(this)
    before(function * () {
      yield setup(this.app.client)
    })
    it('shows clearing options', function * () {
      const page1Url = 'about:preferences'
      const clearBrowsingDataButton = '.clearBrowsingDataButton'
      const securityTab = '[data-l10n-id="security"]'
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(page1Url)
        .url(getTargetAboutUrl(page1Url))
        .waitForVisible(securityTab)
        .click(securityTab)
        .waitForVisible(clearBrowsingDataButton)
        .click(clearBrowsingDataButton)
        .windowByUrl(Brave.browserWindowUrl)
        .waitForVisible(clearBrowsingDataPanel)
    })
    it('can clear browsing history', function * () {
      const page1Url = Brave.server.url('page1.html')
      yield this.app.client
        .windowByUrl(Brave.browserWindowUrl)
        .tabByIndex(0)
        .loadUrl(page1Url)
        .url(getTargetAboutUrl(page1Url))
        .windowByUrl(Brave.browserWindowUrl)
        .waitForVisible(clearBrowsingDataPanel)
        .waitUntil(function () {
          return this.getAppState().then((val) => {
            return val.value.sites.length === 1
          })
        })
        .click('.browserHistorySwitch .switchBackground')
        .click('.clearDataButton')
        .waitUntil(function () {
          return this.getAppState().then((val) => {
            return val.value.sites.length === 0
          })
        })
    })
  })
})
