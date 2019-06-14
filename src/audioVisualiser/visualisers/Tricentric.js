/**
 * Tricentric visualiser
 * see Bar.js for more comments
 */
function Tricentric () {
  this.name = 'Tricentric'

  this.fftSize = 2048
  this.numOfBars = 32

  this.spectrum = null

  this.dataArray = []
  this.visualArray = []
}

Tricentric.prototype.make = function (audioAnalyser, view) {
  view.objGroup = new THREE.Object3D()
  this.spectrum = new Spectrum()

  audioAnalyser.analyser.fftSize = this.fftSize
  this.dataArray = new Uint8Array(audioAnalyser.analyser.frequencyBinCount)

  view.camera.position.set(0, 0, 500)

  // start creating elements
  let vertexShader = document.getElementById('vertexShader').textContent
  let fragmentShader = document.getElementById('fragmentShaderTricentric').textContent

  let positionZ = 493

  for (let i = 0; i < this.numOfBars; i++) {
    let uniforms = {
      col: {
        type: 'c',
        value: new THREE.Color('hsl(250, 100%, 70%)')
      },
      alpha: {
        type: 'f',
        value: 1
      }
    }

    let geometry = new THREE.CylinderBufferGeometry(20, 20, 2, 3, 1, true)
    let material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide
    })

    let cylinder = new THREE.Mesh(geometry, material)
    cylinder.position.z = positionZ
    cylinder.rotation.x = Math.PI / 2

    positionZ -= 5

    view.objGroup.add(cylinder)
  }

  view.scene.add(view.objGroup)
}

Tricentric.prototype.destroy = function (view) {
  view.scene.remove(view.objGroup)
  view.objGroup = null
  view.visualiser = null
}

Tricentric.prototype.render = function (audioAnalyser, view) {
  audioAnalyser.analyser.getByteFrequencyData(this.dataArray)
  this.visualArray = this.spectrum.getVisualBins(this.dataArray, this.numOfBars, 0, 1300)

  let avg = this.getArrayAverage(this.visualArray)

  if (view.objGroup) {
    for (let i = 0; i < this.visualArray.length; i++) {
      // change object colour by setting the col and alpha value in uniform
      this.setUniformColor(
        view,
        i,
        308 - (this.visualArray[i]),
        parseInt(avg / 255 * 40) + 60,
        parseInt(this.visualArray[i] / 255 * 25) + 45
      )
      view.objGroup.children[i].scale.x = ((this.visualArray[i] / 255) * (avg / 255)) + 0.25
      view.objGroup.children[i].scale.y = ((this.visualArray[i] / 255) * (avg / 255)) + 0.25
      view.objGroup.children[i].scale.z = ((this.visualArray[i] / 255) * (avg / 255)) + 0.25
    }
  }
}

Tricentric.prototype.setUniformColor = function (view, i, h, s, l) {
  view.objGroup.children[i].material.uniforms.col.value = new THREE.Color('hsl(' + h + ', ' + s + '%, ' + l + '%)')
  view.objGroup.children[i].material.uniforms.alpha.value = s / 100
}

Tricentric.prototype.getArrayAverage = function (arr) {
  let sum = 0
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]
  }
  return sum / arr.length
}
