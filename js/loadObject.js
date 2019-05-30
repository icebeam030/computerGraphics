function loadObjects() {
    loadCharactoer();
    loadBowlingPin();
}

function loadCharactoer() {
    var configOgro = {

        baseUrl: "models/md2/ogro/",

        body: "ogro.md2",
        skins: ["grok.jpg", "ogrobase.png", "arboshak.png", "ctf_r.png", "ctf_b.png", "darkam.png", "freedom.png",
            "gib.png", "gordogh.png", "igdosh.png", "khorne.png", "nabogro.png",
            "sharokh.png"],
        weapons: [["weapon.md2", "weapon.jpg"]],
        animations: {
            move: "run",
            idle: "stand",
            jump: "jump",
            attack: "attack",
            crouchMove: "cwalk",
            crouchIdle: "cstand",
            crouchAttach: "crattack"
        },

        walkSpeed: 3,
        crouchSpeed: 175
    };

    var nRows = 1;
    var nSkins = configOgro.skins.length;

    nCharacters = nSkins * nRows;
    for (var i = 0; i < nCharacters; i++) {

        var character = new THREE.MD2CharacterComplex();
        character.scale = 0.05;
        character.controls = controls;
        characters.push(character);
    }

    var baseCharacter = new THREE.MD2CharacterComplex();
    baseCharacter.scale = 0.05;
    baseCharacter.onLoadComplete = function () {

        var cloneCharacter = characters[0];
        cloneCharacter.shareParts(baseCharacter);
        cloneCharacter.enableShadows(true);
        cloneCharacter.setWeapon(0);
        cloneCharacter.setSkin(5);

        humanObject = cloneCharacter.root;
        humanObject.translateZ(-15);
        humanObject.translateY(-0.4);

        scene.add(cloneCharacter.root);
    };

    baseCharacter.loadParts(configOgro);

}

function loadBowlingPin() {
    var loader = new THREE.FBXLoader();
    loader.load('models/pin.fbx', function (bowlingPin) {

        var i = 1;
        bowlingPin.traverse(function (child) {

            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

            }
        });

        for (var i = 0; i < 10; i++) {
            var clone = bowlingPin.clone();

            clone.scale.set(9, 9, 9);
            clone.translateX(i * 2);
            clone.translateZ(15);

            var pinBoundingBox = new THREE.Box3().setFromObject(clone);;

            var wpVector = new THREE.Vector3();
            clone.getWorldPosition(wpVector);

            pos.copy(wpVector);
            quat.set(0, 0, 0, 1);

            var size = new THREE.Vector3();
            pinBoundingBox.getSize(size);

            var boxShape = new Ammo.btBoxShape(new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.y * 0.5));
            boxShape.setMargin(margin);
            createRigidBody(clone, boxShape, pinMass, pos, quat);

            scene.add(clone);
        }

    });
}
