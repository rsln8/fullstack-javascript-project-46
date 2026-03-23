// Форматер json - возвращает результат в машиночитаемом формате
function json(diffTree) {
  return JSON.stringify(diffTree, null, 2);
}

module.exports = json;
