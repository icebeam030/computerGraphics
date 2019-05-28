/**
 * main script to run the app
 */

// add html to instruct user to drop a sound file
let instructions = $('<div></div>')
instructions.attr('id', 'instructions')
instructions.append('Click to activate sound')
$('body').append(instructions)

// this is required due to Chrome's autoplay policy
$('#instructions').on('click', function () {
  this.innerHTML = 'Drop a sound file to play'

  let audioAnalyser = new AudioAnalyser()
  audioAnalyser.init()

  let view = new View()
  view.init()

  let controller = new Controller()
  controller.init(audioAnalyser, view)
})
