function cesar(str, shift, action) {
    const alphabet = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
    const alphabetLength = alphabet.length;
    const shiftedAlphabet = action === 'encode'
        ? alphabet.slice(shift) + alphabet.slice(0, shift)
        : alphabet.slice(-shift) + alphabet.slice(0, -shift);

    let result = '';

    for (let i = 0; i < str.length; i++) {
        const char = str[i].toLowerCase();
        const index = alphabet.indexOf(char);

        if (index === -1) {
            result += str[i];
        } else {
            const isUpperCase = str[i] === str[i].toUpperCase();
            const shiftedChar = isUpperCase
                ? shiftedAlphabet[index].toUpperCase()
                : shiftedAlphabet[index];
            result += shiftedChar;
        }
    }

    return result;
}

console.log(cesar("эзтыхз фзъзъз", 8, 'decode'));
// Получилось "хакуна матата"