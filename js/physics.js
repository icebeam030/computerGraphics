
// This file is for loading outside objects

function initPhysics() {
    // Physics configuration
    collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    broadphase = new Ammo.btDbvtBroadphase();
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, - gravityConstant, 0));

}

function createObject(mass, halfExtents, pos, quat, material) {

    var object = new THREE.Mesh(new THREE.BoxBufferGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2), material);
    object.position.copy(pos);
    object.quaternion.copy(quat);
    convexBreaker.prepareBreakableObject(object, mass, new THREE.Vector3(), new THREE.Vector3(), true);
    createDebrisFromBreakableObject(object);
}

function createObjects() {
    // Ground
    pos.set(0, - 0.5, 0);
    quat.set(0, 0, 0, 1);
    ground = createParalellepipedWithPhysics(40, 1, 40, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
    ground.receiveShadow = true;
    textureLoader.load("textures/hardwood2_diffuse.jpg", function (texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(15, 15);
        ground.material.map = texture;
        ground.material.needsUpdate = true;
    });


    // Tower 1
    var towerMass = 1000;
    var towerHalfExtents = new THREE.Vector3(2, 5, 2);
    pos.set(-8, 5, 0);
    quat.set(0, 0, 0, 1);
    createObject(towerMass, towerHalfExtents, pos, quat, createMaterial(0xB03014));

    // Tower 2
    pos.set(8, 5, 0);
    quat.set(0, 0, 0, 1);
    createObject(towerMass, towerHalfExtents, pos, quat, createMaterial(0xB03214));

    //Bridge
    var bridgeMass = 100;
    var bridgeHalfExtents = new THREE.Vector3(7, 0.2, 1.5);
    pos.set(0, 10.2, 0);
    quat.set(0, 0, 0, 1);
    createObject(bridgeMass, bridgeHalfExtents, pos, quat, createMaterial(0xB3B865));

    //Stones
    var stoneMass = 120;
    var stoneHalfExtents = new THREE.Vector3(1, 2, 0.15);
    var numStones = 8;
    quat.set(0, 0, 0, 1);
    for (var i = 0; i < numStones; i++) {

        pos.set(0, 2, 15 * (0.5 - i / (numStones + 1)));
        createObject(stoneMass, stoneHalfExtents, pos, quat, createMaterial(0xB0B0B0));

    }

    // Mountain
    var mountainMass = 860;
    var mountainHalfExtents = new THREE.Vector3(4, 5, 4);
    pos.set(5, mountainHalfExtents.y * 0.5, - 7);
    quat.set(0, 0, 0, 1);
    var mountainPoints = [];
    mountainPoints.push(new THREE.Vector3(mountainHalfExtents.x, - mountainHalfExtents.y, mountainHalfExtents.z));
    mountainPoints.push(new THREE.Vector3(- mountainHalfExtents.x, - mountainHalfExtents.y, mountainHalfExtents.z));
    mountainPoints.push(new THREE.Vector3(mountainHalfExtents.x, - mountainHalfExtents.y, - mountainHalfExtents.z));
    mountainPoints.push(new THREE.Vector3(- mountainHalfExtents.x, - mountainHalfExtents.y, - mountainHalfExtents.z));
    mountainPoints.push(new THREE.Vector3(0, mountainHalfExtents.y, 0));
    var mountain = new THREE.Mesh(new THREE.ConvexBufferGeometry(mountainPoints), createMaterial(0xB03814));
    mountain.position.copy(pos);
    mountain.quaternion.copy(quat);
    convexBreaker.prepareBreakableObject(mountain, mountainMass, new THREE.Vector3(), new THREE.Vector3(), true);
    createDebrisFromBreakableObject(mountain);

}

function createParalellepipedWithPhysics(sx, sy, sz, mass, pos, quat, material) {

    var object = new THREE.Mesh(new THREE.BoxBufferGeometry(sx, sy, sz, 1, 1, 1), material);
    var shape = new Ammo.btBoxShape(new Ammo.btVector3(sx * 0.5, sy * 0.5, sz * 0.5));
    shape.setMargin(margin);

    createRigidBody(object, shape, mass, pos, quat);

    return object;

}

function createDebrisFromBreakableObject(object) {

    object.castShadow = true;
    object.receiveShadow = true;

    var shape = createConvexHullPhysicsShape(object.geometry.attributes.position.array);
    shape.setMargin(margin);

    var body = createRigidBody(object, shape, object.userData.mass, null, null, object.userData.velocity, object.userData.angularVelocity);

    // Set pointer back to the three object only in the debris objects
    var btVecUserData = new Ammo.btVector3(0, 0, 0);
    btVecUserData.threeObject = object;
    body.setUserPointer(btVecUserData);

}

function removeDebris(object) {
    scene.remove(object);
    physicsWorld.removeRigidBody(object.userData.physicsBody);
}

function createConvexHullPhysicsShape(coords) {

    var shape = new Ammo.btConvexHullShape();
    for (var i = 0, il = coords.length; i < il; i += 3) {
        tempBtVec3_1.setValue(coords[i], coords[i + 1], coords[i + 2]);
        var lastOne = (i >= (il - 3));
        shape.addPoint(tempBtVec3_1, lastOne);
    }

    return shape;
}

function createRigidBody(object, physicsShape, mass, pos, quat, vel, angVel) {

    if (pos) {
        object.position.copy(pos);
    }
    else {
        pos = object.position;
    }
    if (quat) {
        object.quaternion.copy(quat);
    }
    else {
        quat = object.quaternion;
    }

    var transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    var motionState = new Ammo.btDefaultMotionState(transform);

    var localInertia = new Ammo.btVector3(0, 0, 0);
    physicsShape.calculateLocalInertia(mass, localInertia);

    var rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
    var body = new Ammo.btRigidBody(rbInfo);

    body.setFriction(0.5);

    if (vel) {
        body.setLinearVelocity(new Ammo.btVector3(vel.x, vel.y, vel.z));
    }
    if (angVel) {
        body.setAngularVelocity(new Ammo.btVector3(angVel.x, angVel.y, angVel.z));
    }

    object.userData.physicsBody = body;
    object.userData.collided = false;

    scene.add(object);

    if (mass > 0) {
        rigidBodies.push(object);
        // Disable deactivation
        body.setActivationState(4);
    }

    physicsWorld.addRigidBody(body);

    return body;
}


// Creates a ball and throws it	
function generateBullet() {

    var ball = new THREE.Mesh(new THREE.SphereBufferGeometry(ballRadius, 14, 10), ballMaterial);
    ball.castShadow = true;
    ball.receiveShadow = true;
    var ballShape = new Ammo.btSphereShape(ballRadius);
    ballShape.setMargin(0.05);

    var direction = new THREE.Vector3();
    humanObject.getWorldDirection(direction);
    var b = direction;
    b = new THREE.Vector3(b.x, b.y, b.z);
    pos.copy(b);
    var wpVector = new THREE.Vector3();
    humanObject.getWorldPosition(wpVector);
    wpVector.add(new THREE.Vector3(0, 1, 0));

    pos.add(wpVector);
    quat.set(0, 0, 0, 1);
    var ballBody = createRigidBody(ball, ballShape, ballMass, pos, quat);

    var direction = new THREE.Vector3();
    humanObject.getWorldDirection(direction);
    pos.copy(direction);
    pos.multiplyScalar(ballVelocitySpeed);
    ballBody.setLinearVelocity(new Ammo.btVector3(pos.x, pos.y, pos.z));

}

function createRandomColor() {
    return Math.floor(Math.random() * (1 << 24));
}

function createMaterial(color) {
    color = color || createRandomColor();
    return new THREE.MeshPhongMaterial({ color: color });
}

function updatePhysics(deltaTime) {

    // Step world
    physicsWorld.stepSimulation(deltaTime, 10);

    // Update rigid bodies
    for (var i = 0, il = rigidBodies.length; i < il; i++) {
        var objThree = rigidBodies[i];
        var objPhys = objThree.userData.physicsBody;
        var ms = objPhys.getMotionState();
        if (ms) {

            ms.getWorldTransform(transformAux1);
            var p = transformAux1.getOrigin();
            var q = transformAux1.getRotation();
            objThree.position.set(p.x(), p.y(), p.z());
            objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());

            objThree.userData.collided = false;
        }
    }

    for (var i = 0, il = dispatcher.getNumManifolds(); i < il; i++) {

        var contactManifold = dispatcher.getManifoldByIndexInternal(i);
        var rb0 = contactManifold.getBody0();
        var rb1 = contactManifold.getBody1();

        var threeObject0 = Ammo.castObject(rb0.getUserPointer(), Ammo.btVector3).threeObject;
        var threeObject1 = Ammo.castObject(rb1.getUserPointer(), Ammo.btVector3).threeObject;

        if (!threeObject0 && !threeObject1) {
            continue;
        }

        var userData0 = threeObject0 ? threeObject0.userData : null;
        var userData1 = threeObject1 ? threeObject1.userData : null;

        var breakable0 = userData0 ? userData0.breakable : false;
        var breakable1 = userData1 ? userData1.breakable : false;

        var collided0 = userData0 ? userData0.collided : false;
        var collided1 = userData1 ? userData1.collided : false;

        if ((!breakable0 && !breakable1) || (collided0 && collided1)) {
            continue;
        }

        var contact = false;
        var maxImpulse = 0;
        for (var j = 0, jl = contactManifold.getNumContacts(); j < jl; j++) {
            var contactPoint = contactManifold.getContactPoint(j);
            if (contactPoint.getDistance() < 0) {
                contact = true;
                var impulse = contactPoint.getAppliedImpulse();
                if (impulse > maxImpulse) {
                    maxImpulse = impulse;
                    var pos = contactPoint.get_m_positionWorldOnB();
                    var normal = contactPoint.get_m_normalWorldOnB();
                    impactPoint.set(pos.x(), pos.y(), pos.z());
                    impactNormal.set(normal.x(), normal.y(), normal.z());
                }
                break;
            }
        }

        // If no point has contact, abort
        if (!contact) {
            continue;
        }

        // Subdivision
        var fractureImpulse = 250;

        if (breakable0 && !collided0 && maxImpulse > fractureImpulse) {

            var debris = convexBreaker.subdivideByImpact(threeObject0, impactPoint, impactNormal, 1, 2, 1.5);

            var numObjects = debris.length;
            for (var j = 0; j < numObjects; j++) {
                createDebrisFromBreakableObject(debris[j]);
            }

            objectsToRemove[numObjectsToRemove++] = threeObject0;
            userData0.collided = true;

        }

        if (breakable1 && !collided1 && maxImpulse > fractureImpulse) {

            var debris = convexBreaker.subdivideByImpact(threeObject1, impactPoint, impactNormal, 1, 2, 1.5);
            var numObjects = debris.length;
            for (var j = 0; j < numObjects; j++) {
                createDebrisFromBreakableObject(debris[j]);
            }
            objectsToRemove[numObjectsToRemove++] = threeObject1;
            userData1.collided = true;
        }
    }
    for (var i = 0; i < numObjectsToRemove; i++) {
        removeDebris(objectsToRemove[i]);
    }
    numObjectsToRemove = 0;
}
function kineticEnergy(mass, velocity) {
    return 0.5 * mass * velocity * velocity;
}
