function initControlPanel() {
    var setting = {
        BulletColor: ballMaterial.color.getHex(),
        BulletSpeed: ballVelocitySpeed,
        BulletSize: ballRadius,
        CharacterSkin: "grok",
        BulletMass: ballMass

    };
    var character = ["grok", "ogrobase", "arboshak", "ctf_r", "ctf_b", "darkam", "freedom",
        "gib", "gordogh", "igdosh", "khorne", "nabogro",
        "sharokh"];
    character.sort();
    var gui = new dat.GUI();

    var characterfolder = gui.addFolder('Character Folder');
    var ballcolor = characterfolder.addColor(setting, 'BulletColor').onChange(function (val) {
        ballMaterial.color.setHex(val);
    });
    var bulletspeed = characterfolder.add(setting, "BulletSpeed", 1, maxVelocity).onChange(function (val) {
        ballVelocitySpeed = val;
        var energy = kineticEnergy(ballMass, ballVelocitySpeed) / maxEk * 100;
        setEnergyBar(energy);
    });
    var ballmasscon = characterfolder.add(setting, 'BulletMass', 10, maxMass).onChange(function (val) {
        ballMass = val;
        var energy = kineticEnergy(ballMass, ballVelocitySpeed) / maxEk * 100;
        setEnergyBar(energy);
    });
    var bulletsize = characterfolder.add(setting, "BulletSize", 0.001, 1).onChange(function (val) {
        ballRadius = val;
    });
    var characterskin = characterfolder.add(setting, 'CharacterSkin').options(character).onChange(function (val) {
        characters[0].setSkin(character.indexOf(val));
    });


    characterfolder.open();

    var texture = ['brick_roughness.jpg', 'crate.gif', 'disturb.jpg', 'perlin-512.png', 'roughness_map.jpg',
        'tri_pattern.jpg', 'UV_Grid_Sm.jpg', 'grasslight-big.jpg', 'waterdudv.jpg', 'hardwood2_diffuse.jpg',
        'water.jpg', 'hardwood2_bump.jpg', 'hardwood2_roughness.jpg'
    ];
    texturemap = { FloorTexture: "brick_roughness.jpg", RepeatU: 15, RepeatV: 15 };

    var texturefolder = gui.addFolder('Texture Folder');
    var texturedropdwon = texturefolder.add(texturemap, 'FloorTexture').options(texture);
    var texturerepeatU = texturefolder.add(texturemap, 'RepeatU', 1, 50);
    var texturerepeatV = texturefolder.add(texturemap, 'RepeatV', 1, 50);

    texturedropdwon.onChange(function (val) {
        path = val;
        TextureChange();
    });

    texturerepeatU.onChange(function (val) {
        u = val;
        TextureChange();
    });

    texturerepeatV.onChange(function (val) {
        v = val;
        TextureChange();
    });

    texturefolder.open();
}

function TextureChange() {
    var tpath = "textures/" + path;
    textureLoader.load(tpath, function (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(u, v);
        ground.material.map = texture;
        ground.material.needsUpdate = true;
    })
};

function setEnergyBar(val) {
    var bar2 = document.getElementById('myItem1').ldBar;
    bar1.set(val);
}