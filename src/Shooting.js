/**
 * The shooting game
 */

// Detects webgl
if (WEBGL.isWebGLAvailable() === false) {
  document.body.appendChild(WEBGL.getWebGLErrorMessage())
  document.getElementById('container').innerHTML = ''
}

var bar1 = new ldBar('#energy-bar')

// - Global variables -
var characters = []
var nCharacters = 0

// Graphics variables
var container, stats
var camera, cameraControls, scene, renderer
var arrowHelper

var clock = new THREE.Clock()

// Physics variables
var gravityConstant = 7.8
var collisionConfiguration
var dispatcher
var broadphase
var solver
var physicsWorld
var margin = 0.01
var convexBreaker = new THREE.ConvexObjectBreaker()

// Rigid bodies include all movable objects
var rigidBodies = []

var pos = new THREE.Vector3()
var quat = new THREE.Quaternion()
var transformAux1 = new Ammo.btTransform()
var tempBtVec3_1 = new Ammo.btVector3(0, 0, 0)

var time = 0

var objectsToRemove = []
for (var i = 0; i < 500; i++) {
  objectsToRemove[i] = null
}
var numObjectsToRemove = 0

var impactPoint = new THREE.Vector3()
var impactNormal = new THREE.Vector3()

// Character
var controls = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false
}

var prevTime = performance.now()
var velocity = new THREE.Vector3()
var direction = new THREE.Vector3()
var humanObject = new THREE.Object3D()
var cameraOffset = new THREE.Vector3(-3, 9, -25)

// GUI Variables
var ballVelocitySpeed = 10
var ballRadius = 0.127
var ballMaterial = new THREE.MeshPhongMaterial({ color: 0x202020 })
var textureLoader
var ground

var ballMass = 1
var minBallMass = 1
var maxBallMass = 20
var maxVelocity = 50
var maxEk = kineticEnergy(maxBallMass, maxVelocity)

var pinMass = 10

// Control Panel
var path = 'hardwood2_diffuse.jpg'
var u = 15
var v = 15

// - Main code -
init()
animate()

// - Functions -
function init () {
  initGraphics()
  initPhysics()
  createObjects()

  loadObjects()
  initInput()
  initControlPanel()
}

function initGraphics () {
  container = document.getElementById('shooting-container')
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    2000
  )
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x101010)
  camera.position.set(-3, 9, -30)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(container.offsetWidth / container.offsetHeight)
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  renderer.shadowMap.enabled = true

  cameraControls = new THREE.OrbitControls(camera, renderer.domElement)
  cameraControls.update()

  textureLoader = new THREE.TextureLoader()
  addLight(scene)

  container.innerHTML = ''
  container.appendChild(renderer.domElement)

  stats = new Stats()
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.top = '0px'
  container.appendChild(stats.domElement)

  window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize () {
  let container = document.getElementById('shooting-container')
  camera.aspect = container.offsetWidth / container.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.offsetWidth, container.offsetHeight)
}

function animate () {
  requestAnimationFrame(animate)
  render()
  stats.update()
}

function render () {
  var deltaTime = clock.getDelta()
  for (var i = 0; i < nCharacters; i++) {
    characters[i].update(deltaTime)
  }
  updatePhysics(deltaTime)

  renderer.render(scene, camera)
  time += deltaTime
}
