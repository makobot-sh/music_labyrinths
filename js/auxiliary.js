export var ninetyDeg = '+1.5707963267948966';
export var rotSpeed = 250;
export function deg2rad(deg)
{
  var pi = Math.PI;
  return deg * pi/180;
};

export function rad2deg(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
};

export function createPlane(scene, dimentions, color, pos, deg)
{
  const geometry = new THREE.PlaneGeometry( dimentions[0], dimentions[1]);
  const material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
  const plane = new THREE.Mesh( geometry, material );
  plane.position.set(pos[0],pos[1],pos[2]);
  //const rot = new THREE.Vector3(deg2rad(deg[0]),deg2rad(deg[1]),deg2rad(deg[2]));
  const rot = new THREE.Vector3(0, Math.PI /2, 0);
  plane.rotation.x = deg2rad(deg[0]);
  plane.rotation.y = deg2rad(deg[1]);
  plane.rotation.z = deg2rad(deg[2]);
  scene.add(plane);
};