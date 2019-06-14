/**
 * Main script to run the audio visualiser
 */
let initialised = false

// user interaction is needed before audio can be played
$('#instructions').on('click', function () {
  this.innerHTML = 'Drop a sound file here'

  if (!initialised) {
    // avoid creating multiple instances
    initialised = true

    let audioAnalyser = new AudioAnalyser()
    audioAnalyser.init()

    let view = new View()
    view.init()

    let controller = new Controller()
    controller.init(audioAnalyser, view)
  }
})
