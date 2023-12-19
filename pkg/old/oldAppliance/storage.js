export const getOptions = () => {
  let options = '';
  const length = localStorage.length;
  const keys = [];
  for (let i=0; i<length; i++) {
    keys.push(localStorage.key(i));
  }
  keys.sort();
  for (let i=0; i<length; i++) {
    const key = keys[i];
    const parts = key.split('$graphs.');
    if (parts.length > 1) {
      const name = parts.pop();
      options += `<option>${name}</option>`;
    }
  }
  return options;
};

export const loadLayout = key => {
  const json = localStorage.getItem(key);
  const data = json && JSON.parse(json);
  return data;
};

export const saveLayout = (key, data) => {
  const json = JSON.stringify(data);
  localStorage.setItem(key, json);
};

//console.log(grid.save());

// const stack = {};

// export const add = thing => {
//   const id = Math.floor((Math.random()*9+1)*1e4);
//   stack[id] = {thing};
// };

