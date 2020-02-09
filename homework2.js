function duplicate(arr) {
  let result = [];

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        result.push(arr[i]);
      }
    }
  }

  if (result.length >= 2) {
    return result[1];
  } else if (result.length === 1) {
    return result[0];
  } else {
    return -1;
  }
}

let a = [2, 1, 4, 5, 3, 2];
let b = [2, 4, 5, 1, 3];
let c = [2, 1, 3, 5, 3, 2];

duplicate(a);
duplicate(b);
duplicate(c);
