function minumb(x) {
  if (x == 0) return 0;
  var min = 10;
  while (x > 0) {
      var digit = x % 10
      if (digit < min) {
          min = digit;
      }
      x = Math.floor(x / 10);
  }
  return min;
}
  
  
  console.log(minumb(123456789)); 
  console.log(minumb(102));   
  console.log(minumb(444));
  console.log(minumb(43555));
  console.log(minumb(2345));