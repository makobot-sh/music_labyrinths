export {
  config,
  quit_direction,
  inicialize_square_matrix,
  getJson
  
}

var config = await getJson("../config/config.json");


async function getJson(path){
  let response = await fetch(path);
  let data = await response.json()
  return data;
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

function quit_direction(matrix, x_value, y_value, mask){
  matrix[y_value][x_value] = matrix[y_value][x_value] & mask;
}