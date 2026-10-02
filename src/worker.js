import {
  definePlugin,
  PluginEvents
} from '@starcyrene/cyrene-name-roller/plugin-sdk'

const DEFAULTS = {
  enabled: true,
  volume: 0.7,
  playbackMode: 'once',
  roller: null,
  card: null,
  lottery: null
}

const EVENT_AUDIO = {
  [PluginEvents.ROLLER_RESULT]: 'roller',
  [PluginEvents.CARD_RESULT]: 'card',
  [PluginEvents.LOTTERY_RESULT]: 'lottery',
  [PluginEvents.LOTTERY_ASSIGN_RESULT]: 'lottery'
}

const ITEM_EVENT_AUDIO = {
  [PluginEvents.ROLLER_ITEM_RESULT]: 'roller',
  [PluginEvents.CARD_ITEM_RESULT]: 'card',
  [PluginEvents.LOTTERY_ITEM_RESULT]: 'lottery'
}

let request
let settings = { ...DEFAULTS }

async function readSettings() {
  const saved = await request('storage.read', { key: 'settings' })
  settings = { ...DEFAULTS, ...(saved || {}) }
}

async function writeSettings(next) {
  settings = { ...DEFAULTS, ...settings, ...next }
  await request('storage.write', { key: 'settings', value: settings })
  return settings
}

async function chooseAudio(kind) {
  const selected = await request('audio.select', { accept: 'audio/*' })
  if (!selected) return null
  await writeSettings({ [kind]: selected })
  await request('notifications.show', { message: `已设置${kind}音效：${selected.name}`, type: 'success', duration: 3500 })
  return selected
}

async function play(kind) {
  if (!settings.enabled) return
  const audio = settings[kind]
  if (!audio?.dataUrl) return
  await request('audio.play', { source: audio.dataUrl, volume: settings.volume })
}

definePlugin({
  async activate(context) {
    request = context.request
    await readSettings()
  },

  async onEvent(event, payload) {
    if (event === PluginEvents.PLUGIN_STORAGE_CHANGED && payload?.key === 'settings') {
      await readSettings()
      return
    }
    const kind = settings.playbackMode === 'each' ? ITEM_EVENT_AUDIO[event] : EVENT_AUDIO[event]
    if (!kind || !settings.enabled || !settings[kind]?.dataUrl) return
    await play(kind)
    if (payload?.results?.length || payload?.result) {
      await writeSettings({ lastPlayedAt: Date.now() })
    }
  },

  async deactivate() {
    request = null
    settings = { ...DEFAULTS }
  }
})

globalThis.CyreneSoundEffects = Object.freeze({
  getSettings: () => ({ ...settings }),
  saveSettings: writeSettings,
  chooseAudio,
  play
})
