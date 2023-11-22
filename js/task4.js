function pluralizeRecords(n) {
  const teen = n >= 10 && n < 20;
  const endsWithOne = n % 10 === 1;

  if (!teen && endsWithOne) {
      return `В результате выполнения запроса была найдена ${n} запись`;
  }
  else if (!teen && n % 10 >= 2 && n % 10 <= 4) {
      return `В результате выполнения запроса были найдены ${n} записи`;
  }
  return `В результате выполнения запроса было найдено ${n} записей`;
}
  
  console.log(pluralizeRecords(1));    
  console.log(pluralizeRecords(3));    
  console.log(pluralizeRecords(5));     
  