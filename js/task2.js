function gcd(a, b) {
    if (a < 0 || b < 0) {
      return "Оба аргумента должны быть неотрицательными числами";
    }
  
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
  
    return a;
  }
  
  
  console.log(gcd(25, 6025)); 
  console.log(gcd(23,46)); 
  console.log(gcd(72, 81));
  console.log(gcd(-5600, 123)); 
  