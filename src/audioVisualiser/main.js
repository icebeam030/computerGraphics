/**
 * Main script to run the audio visualiser
 */

// user interaction is needed before audio can be played
$('#instructions').on('click', function () {
  this.innerHTML = 'Drop a sound file here'

  let audioAnalyser = new AudioAnalyser()
  audioAnalyser.init()

  let view = new View()
  view.init()

  let controller = new Controller()
  controller.init(audioAnalyser, view)
})
