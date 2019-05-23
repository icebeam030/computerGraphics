/**
 * Creating a THREE.js view for actual rendering
 */
function View () {
  this.container = null
  this.camera = null
  this.scene = null
  this.controls = null
  this.renderer = null
  this.visualiser = null
  this.objGroup = {}
}

// initialisation
View.prototype.init = function () {
  this.container = document.createElement('div')
  this.container.width = '100%'
  this.container.height = '100%'
  document.body.appendChild(this.container)

  this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 2000)
  this.camera.position.z = 500

  this.scene = new THREE.Scene()

  this.controls = new THREE.OrbitControls(this.camera)

  this.renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true })
  this.renderer.setPixelRatio(window.devicePixelRatio)
  this.renderer.setSize(window.innerWidth, window.innerHeight)
  this.container.appendChild(this.renderer.domElement)

  let that = this

  function onWindowResize () {
    that.camera.aspect = window.innerWidth / window.innerHeight
    that.camera.updateProjectionMatrix()
    that.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize, false)

  function onKeyDown (e) {
    switch (e.which) {
      // press space to play/pause
      case 32:
        // if (app.play) {
        //   app.audio.pause()
        //   app.play = false
        // } else {
        //   app.audio.play()
        //   app.play = true
        // }
        break
    }
  }

  document.addEventListener('keydown', onKeyDown, false)
}

View.prototype.render = function (audioAnalyser, view) {
  let that = this

  function myUpdateLoop () {
    // if the visualiser has been initialised
    if (that.visualiser) {
      // render the chosen visualiser
      that.visualiser.render(audioAnalyser, view)
    }

    that.controls.update()
    that.renderer.render(that.scene, that.camera)

    requestAnimationFrame(myUpdateLoop)
  }

  myUpdateLoop()
}
