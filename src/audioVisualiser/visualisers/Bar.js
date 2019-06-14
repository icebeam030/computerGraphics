/**
 * Bar visualiser
 */
function Bar () {
  this.name = 'Bar'

  // size of Fast Fourier Transform to convert data from time to frequency domain
  // the larger the more accurate, but more resource consuming
  this.fftSize = 2048
  this.numOfBars = 64

  this.spectrum = null

  this.dataArray = []
  this.visualArray = []
}

// generate the bars for rendering
Bar.prototype.make = function (audioAnalyser, view) {
  view.objGroup = new THREE.Object3D()
  this.spectrum = new Spectrum()

  audioAnalyser.analyser.fftSize = this.fftSize
  // create empty dataArray
  // size will be half of fftSize
  this.dataArray = new Uint8Array(audioAnalyser.analyser.frequencyBinCount)

  view.camera.position.set(0, 0, 500)

  // start making scene
  let vertexShader = document.getElementById('vertexShader').textContent
  let fragmentShader = document.getElementById('fragmentShaderBar').textContent

  let positionX = -20 * (this.numOfBars / 2)

  for (let i = 0; i < this.numOfBars; i++) {
    let geometry = new THREE.PlaneBufferGeometry(18, 5, 1)
    let uniforms = {}
    let material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })
    let plane = new THREE.Mesh(geometry, material)
    plane.position.x = positionX
    positionX += 20

    view.objGroup.add(plane)
  }

  view.scene.add(view.objGroup)
}

// remove elements from the scene
Bar.prototype.destroy = function (view) {
  view.scene.remove(view.objGroup)
  view.objGroup = null
  view.visualiser = null
}

// render the bars to the scene
Bar.prototype.render = function (audioAnalyser, view) {
  // dataArray will be updated with real-time sound data
  audioAnalyser.analyser.getByteFrequencyData(this.dataArray)

  // process raw sound data with Spectrum's mathematical transform
  this.visualArray = this.spectrum.getVisualBins(this.dataArray, this.numOfBars, 4, 1300)

  // update each bar according to visualArray
  if (view.objGroup) {
    for (let i = 0; i < this.visualArray.length; i++) {
      view.objGroup.children[i].geometry.attributes.position.array[1] = this.visualArray[i]
      view.objGroup.children[i].geometry.attributes.position.array[4] = this.visualArray[i]
      view.objGroup.children[i].geometry.attributes.position.needsUpdate = true
    }
  }
}
