/**
 * Using Web Audio API to extract sound data
*/
function AudioAnalyser () {
  this.audioCtx = null
  this.analyser = null
  // this.audio = null
  this.source = null
  this.gainNode = null
  // resets the Silk effect if this is set to true
  this.hasNewSong = false
}

AudioAnalyser.prototype.init = function () {
  // fit different browsers
  this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  this.analyser = this.audioCtx.createAnalyser()

  // set volume level
  this.gainNode = this.audioCtx.createGain()
  this.gainNode.gain.value = 0.4
}

// play the audio
AudioAnalyser.prototype.playAudio = function () {
  this.source.connect(this.analyser)
  this.source.connect(this.gainNode)
  this.gainNode.connect(this.audioCtx.destination)
  this.source.start(0)
  this.hasNewSong = false
}

// prepare audio data for play
AudioAnalyser.prototype.makeAudio = function (data) {
  // stop current song
  if (this.source) {
    this.source.stop(0)
  }

  // create new buffer from newly loaded song
  // this.audio = document.createElement('audio') // creates an html audio element
  // this.audio.src = URL.createObjectURL(data) // sets the audio source to the dropped file
  // this.audio.autoplay = true
  // this.audio.crossOrigin = 'anonymous'
  // document.body.appendChild(this.audio)
  // this.source = this.audioCtx.createMediaElementSource(this.audio)

  this.source = this.audioCtx.createBufferSource()

  let that = this

  this.audioCtx.decodeAudioData(data, function (buffer) {
    that.source.buffer = buffer
    that.playAudio()
  })

  this.hasNewSong = true
}
