export {
  ninetyDeg,
  rotSpeed,
  deg2rad,
  rad2deg,
  createPlane,
  quit_direction,
  inicialize_square_matrix
}

var ninetyDeg = '1.5707963267948966';
var rotSpeed = 250;

function quit_direction(matrix, x_value, y_value, mask){
  matrix[y_value][x_value] = matrix[y_value][x_value] & mask;
}


function inicialize_square_matrix(dimension, value){
  var matrix = []
  for(var i = 0; i < dimension; i++){
      var aux = [];
      for(var j = 0; j < dimension; j++){
          aux.push(value);
      }
      matrix.push(aux);
  }
  return matrix;
}


function deg2rad(deg)
{
  var pi = Math.PI;
  return deg * pi/180;
};

function rad2deg(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
};

function createPlane(scene, dimentions, color, pos, deg)
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