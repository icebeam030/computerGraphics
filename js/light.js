function addLight(scene) {
    var ambientLight = new THREE.AmbientLight(0x707070);
    scene.add(ambientLight);

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-10, 18, 5);
    light.castShadow = true;
    var d = 14;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;

    light.shadow.camera.near = 2;
    light.shadow.camera.far = 50;

    light.shadow.mapSize.x = 1024;
    light.shadow.mapSize.y = 1024;

    scene.add(light);
}

