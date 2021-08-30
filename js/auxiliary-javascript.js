export {
  config,
  quit_direction,
  inicialize_square_matrix,
  getJson
  
}

var config = await getJson("../config/config.json");

function printError(error, path, explicit) {
  console.log(`[${explicit ? 'EXPLICIT' : 'INEXPLICIT'}] ${error.name}: ${error.message}, JSON Path: ${path}. This error probably occurs because JSON file has a syntax error or does not exist`);
}


async function getJson(path){
  try {
      let response = await fetch(path);
      var data = await response.json()
  } catch(err){
    if (err instanceof SyntaxError) {
      printError(err, path, true);
    } else {
      printError(err, path, false);
    }
  }
  
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