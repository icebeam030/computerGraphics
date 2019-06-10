/**
 * Creating a THREE.js view for actual rendering
 */
function View () {
  this.camera = null
  this.scene = null
  this.controls = null
  this.renderer = null
  this.visualiser = null
  this.objGroup = {}
}

// initialisation
View.prototype.init = function () {
  this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
  this.camera.position.z = 500

  this.scene = new THREE.Scene()

  this.controls = new THREE.OrbitControls(this.camera)

  this.renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: true,
    antialias: true
  })
  this.renderer.setPixelRatio(window.devicePixelRatio)
  this.renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(this.renderer.domElement)

  let that = this

  function onWindowResize () {
    that.camera.aspect = window.innerWidth / window.innerHeight
    that.camera.updateProjectionMatrix()
    that.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize, false)
}

View.prototype.render = function (audioAnalyser, view) {
  let that = this

  function animate () {
    // if the visualiser has been initialised
    if (that.visualiser) {
      // render the chosen visualiser
      that.visualiser.render(audioAnalyser, view)
    }

    that.controls.update()
    that.renderer.render(that.scene, that.camera)

    requestAnimationFrame(animate)
  }

  animate()
}
