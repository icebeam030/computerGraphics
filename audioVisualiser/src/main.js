/**
 * main script to run the app
 */
if (!Detector.webgl) {
  Detector.addGetWebGLMessage()
} else {
  let audioAnalyser = new AudioAnalyser()
  audioAnalyser.init()

  let view = new View()
  view.init(audioAnalyser)

  let controller = new Controller()
  controller.init(audioAnalyser, view)
}
