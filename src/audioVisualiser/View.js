/**
 * Setting up a THREE.js scene for actual rendering
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
  this.scene.background = new THREE.Color(0x000000)

  this.renderer = new THREE.WebGLRenderer({
    alpha: true,
    preserveDrawingBuffer: true,
    antialias: true
  })

  let container = document.getElementById('visualiser-container')
  this.renderer.setPixelRatio(container.offsetWidth / container.offsetHeight)
  this.renderer.setSize(container.offsetWidth, container.offsetHeight)
  container.appendChild(this.renderer.domElement)

  this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)

  let that = this

  function onWindowResize () {
    let container = document.getElementById('visualiser-container')
    that.camera.aspect = container.offsetWidth / container.offsetHeight
    that.camera.updateProjectionMatrix()
    that.renderer.setSize(container.offsetWidth, container.offsetHeight)
  }

  window.addEventListener('resize', onWindowResize, false)
}

View.prototype.render = function (audioAnalyser, view) {
  let that = this

  function animate () {
    // if any visualiser has been chosen
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
