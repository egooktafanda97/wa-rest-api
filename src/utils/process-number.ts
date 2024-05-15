export function processNumber(number: string): string {
  let finalNumber = number;
  if (!number.includes('@s.whatsapp.net')) number = number + '@s.whatsapp.net';
  if (number[0] === '6' && number[1] === '2') return number;
  if (number[0] === '+' && number[1] === '6' && number[2] === '2')
    return number.substring(1);
  if (number[0] === '0' && number[1] === '8') {
    let deleted = number.substring(1);
    finalNumber = '62' + deleted;
    return finalNumber;
  }
  if (number[0] === '8') return '62' + number;

  return number;
}

export function extractNumberAfterHash(input: string): string | null {
  const regex = /#(\d+)/;
  const match = input.match(regex);
  return match ? match[1] : null;
}
