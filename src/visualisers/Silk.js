/**
 * Silk visualiser
 */
function Silk () {
  this.name = 'Silk'

  this.fftSize = 2048
  this.numOfBars = 256
  this.barGap = 0.25

  this.group1 = {}
  this.group2 = {}
  this.group3 = {}
  this.group4 = {}
  this.bgPlane = {}

  this.spectrum = null

  this.dataArray = []
  this.visualArray = []

  this.loudness = 0
  this.lastLoudness = 0
}

Silk.prototype.make = function (audioAnalyser, view) {
  view.objGroup = new THREE.Object3D()
  this.group1 = new THREE.Object3D()
  this.spectrum = new Spectrum()

  audioAnalyser.fftSize = this.fftSize
  this.dataArray = new Uint8Array(audioAnalyser.analyser.frequencyBinCount)

  view.camera.position.set(0, 0, 1)

  view.renderer.setClearColor(new THREE.Color(0x101010), 0)
  view.renderer.clear()
  view.renderer.autoClearColor = false

  let uniforms = {}
  let vertexShader = document.getElementById('vertexShader').textContent
  let fragmentShader = document.getElementById('fragmentShaderSilk').textContent
  let bgfragmentShader = document.getElementById('bgFragmentShader').textContent

  // group1: top right
  let positionX = 3
  for (let i = 0; i < this.numOfBars; i++) {
    uniforms = {
      col: {
        type: 'c',
        value: new THREE.Color('hsl(240, 100%, 50%)')
      }
    }

    let geometry = new THREE.CircleBufferGeometry(10, 6)
    let material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide
    })

    let circle = new THREE.Mesh(geometry, material)
    circle.position.x = positionX
    circle.position.y = 0
    circle.position.z = -50

    positionX += this.barGap

    let pivot = new THREE.Object3D()
    pivot.add(circle)

    this.group1.add(pivot)
  }
  view.objGroup.add(this.group1)

  // group2: top left
  this.group2 = this.group1.clone()
  this.group2.rotation.z = Math.PI
  view.objGroup.add(this.group2)

  // group3: bottom left
  this.group3 = this.group1.clone()
  this.group3.rotation.z = Math.PI
  view.objGroup.add(this.group3)

  // group4: bottom right
  this.group4 = this.group1.clone()
  view.objGroup.add(this.group4)

  // bgPlane
  let geometry = new THREE.PlaneBufferGeometry(2000, 2000, 1, 1)
  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: bgfragmentShader,
    transparent: true,
    depthWrite: false
  })

  this.bgPlane = new THREE.Mesh(geometry, material)
  this.bgPlane.position.x = 0
  this.bgPlane.position.y = 0
  this.bgPlane.position.z = -60
  view.objGroup.add(this.bgPlane)

  view.scene.add(view.objGroup)
}

Silk.prototype.destroy = function (view) {
  view.scene.remove(view.objGroup)
  view.objGroup = null

  view.renderer.setClearColor(new THREE.Color(0x101010), 0)
  view.renderer.clear()
  view.renderer.autoClearColor = true

  view.visualiser = null
}

Silk.prototype.reset = function () {
  if (this.group1) {
    for (let i = 0; i < this.group1.children.length; i++) {
      this.group1.children[i].position.y = 0
      this.group2.children[i].position.y = 0
      this.group3.children[i].position.y = 0
      this.group4.children[i].position.y = 0
    }
  }
}

Silk.prototype.render = function (audioAnalyser, view) {
  if (audioAnalyser.hasNewSong) {
    // reset objects' position when a new song is played
    this.reset()
  }

  audioAnalyser.analyser.getByteFrequencyData(this.dataArray)
  this.visualArray = this.spectrum.getVisualBins(this.dataArray, this.numOfBars, 6, 1300)
  // this.visualArray.reverse()

  // smooth loudness
  this.loudness = this.getArrayAverage(this.dataArray)
  this.loudness = (this.loudness + this.lastLoudness) / 2

  if (this.group1) {
    for (let i = 0; i < this.visualArray.length; i++) {
      this.group1.children[i].children[0].scale.x = (this.visualArray[i] <= 1) ? 0.0001 : 4 * Math.log10(1 + (this.visualArray[i] / 255 / 7))
      this.group1.children[i].children[0].scale.y = (this.visualArray[i] <= 1) ? 0.0001 : 4 * Math.log10(1 + (this.visualArray[i] / 255 / 7))

      this.group2.children[i].children[0].scale.x = (this.visualArray[i] <= 1) ? 0.0001 : 4 * Math.log10(1 + (this.visualArray[i] / 255 / 7))
      this.group2.children[i].children[0].scale.y = (this.visualArray[i] <= 1) ? 0.0001 : 4 * Math.log10(1 + (this.visualArray[i] / 255 / 7))

      this.group3.children[i].children[0].scale.x = (this.visualArray[i] <= 1) ? 0.0001 : 4 * Math.log10(1 + (this.visualArray[i] / 255 / 7))
      this.group3.children[i].children[0].scale.y = (this.visualArray[i] <= 1) ? 0.0001 : 4 * Math.log10(1 + (this.visualArray[i] / 255 / 7))

      this.group4.children[i].children[0].scale.x = (this.visualArray[i] <= 1) ? 0.0001 : 4 * Math.log10(1 + (this.visualArray[i] / 255 / 7))
      this.group4.children[i].children[0].scale.y = (this.visualArray[i] <= 1) ? 0.0001 : 4 * Math.log10(1 + (this.visualArray[i] / 255 / 7))

      this.group1.children[i].position.y += (this.visualArray[i] <= 1) ? 0.0001 : 4 * Math.log10(1 + (this.visualArray[i] / 255 / 7))
      this.group2.children[i].position.y += (this.visualArray[i] <= 1) ? 0.0001 : 4 * Math.log10(1 + (this.visualArray[i] / 255 / 7))
      this.group3.children[i].position.y -= (this.visualArray[i] <= 1) ? 0.0001 : 4 * Math.log10(1 + (this.visualArray[i] / 255 / 7))
      this.group4.children[i].position.y -= (this.visualArray[i] <= 1) ? 0.0001 : 4 * Math.log10(1 + (this.visualArray[i] / 255 / 7))

      if (this.group1.children[i].position.y > 30 || this.loudness <= 1) {
        this.group1.children[i].position.y = 0
      }

      if (this.group2.children[i].position.y > 30 || this.loudness <= 1) {
        this.group2.children[i].position.y = 0
      }

      if (this.group3.children[i].position.y < -30 || this.loudness <= 1) {
        this.group3.children[i].position.y = 0
      }

      if (this.group4.children[i].position.y < -30 || this.loudness <= 1) {
        this.group4.children[i].position.y = 0
      }

      this.setUniformColor(i, this.visualArray[i])
    }
  }
  this.lastLoudness = this.loudness
}

Silk.prototype.getArrayAverage = function (arr) {
  let sum = 0
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]
  }
  return sum / arr.length
}

Silk.prototype.setUniformColor = function (i, loudness) {
  let h = (250 - (loudness * 0.9)) % 360
  // Just once since they share materials
  this.group1.children[i].children[0].material.uniforms.col.value = new THREE.Color('hsl(' + h + ', 90%, ' + (100 - Math.min(40, parseInt(loudness))) + '%)')
}
