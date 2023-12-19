const messages = [];

onmessage = async event => {
  messages.push(event);
  //console.log(messages.length);
  if (messages.length == 1) {
    //console.log('(re)start pump');
    pump();
  }
};

const pump = async () => {
  while (messages.length) {
    //console.log('pumping', messages.length);
    const message = messages[0];
    await domessage(message);
    messages.shift();
  }
};

const domessage = async message => {
  if (message.data) {
    const {name, data} = message.data;
    console.log(name, data);
  }
};

postMessage({name: 'hello'});