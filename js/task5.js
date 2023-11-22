function fibb(n) {
  if (n < 0 || n > 1000) {
    return "Ошибка: n должно быть в диапазоне от 0 до 1000";
  }

  if (n == 1) return 0;
  if (n == 2) return 1;
  var first = 0;
  var second = 1;
  for (var i = 3; i <= n; i++) {
    var temp = first;
    first = second;
    second = first + temp;
  }
  return second;
}


console.log(fibb(0));
console.log(fibb(1));
console.log(fibb(10));
console.log(fibb(100));
console.log(fibb(10000));
console.log(fibb(-99));
