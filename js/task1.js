function pow(x, n) {
    if (n < 0) {
      return "Только натуральные значения n";
    }
    let result = 1;
    for (let i = 0; i < n; i++) {
      result *= x;
    }
    return result;
  }
  

  console.log(pow(2, 7)); 
  console.log(pow(3, 5)); 
  console.log(pow(4, 3)); 
  console.log(pow(5, 2)); 
  console.log(pow(10, 0)); 
  console.log(pow(2, -1)); 
  