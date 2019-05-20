
// This file is for loading outside objects

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
        // cast and receive shadows
        cloneCharacter.enableShadows(true);
        cloneCharacter.setWeapon(0);
        cloneCharacter.setSkin(3);

        humanObject = cloneCharacter.root;
        humanObject.translateZ(-15);

        characterBoundingBoxHelper = new THREE.BoxHelper(cloneCharacter.root, 0xff00f0);
        scene.add(characterBoundingBoxHelper);

        scene.add(cloneCharacter.root);
    };

    baseCharacter.loadParts(configOgro);

}

function loadBowlingPin() {
    var loader = new THREE.FBXLoader();
    loader.load('models/pin.fbx', function (bowlingPin) {

        bowlingPin.traverse(function (child) {

            if (child.isMesh) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        bowlingPin.scale.set(9, 9, 9);

        var pinBoundingBox = new THREE.Box3().setFromObject(bowlingPin);;

        var wpVector = new THREE.Vector3();
        bowlingPin.getWorldPosition(wpVector);

        pos.copy(wpVector);
        quat.set(0, 0, 0, 1);

        var size = new THREE.Vector3();
        pinBoundingBox.getSize(size);

        var boxShape = new Ammo.btBoxShape(new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5));
        boxShape.setMargin(margin);
        var pinMass = 1.5;
        var rigidBody = createRigidBody(bowlingPin, boxShape, pinMass, pos, quat);

        pinBoundingBoxHelper = new THREE.BoxHelper(bowlingPin, 0xff00f0);
        scene.add(pinBoundingBoxHelper);
        scene.add(bowlingPin);

    });
}