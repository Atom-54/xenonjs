import * as libp2p from 'libp2p/bundle.min.js';

console.log(Object.keys(libp2p));

const {
  createLibp2p,
  identifyService,
  webRTC,
  webSockets, filters,
  mplex,
  noise,
  // bootstrap,
  // yamux,
  multiaddr, protocols,
  circuitRelayTransport,
  pushable,
  pipe,
  fromString, toString
} = libp2p;

const WEBRTC_CODE = protocols('webrtc').code

const output = document.getElementById("output")
const sendSection = document.getElementById("send-section")
const appendOutput = (line) => {
  const div = document.createElement("div")
  div.appendChild(document.createTextNode(line))
  output.append(div)
}
const clean = (line) => line.replaceAll("\n", "")
const sender = pushable()

const node = await createLibp2p({
  addresses: {
    listen: [
      '/webrtc'
    ]
  },
  transports: [
    webSockets({
      filter: filters.all,
    }),
    webRTC(),
    circuitRelayTransport({
      discoverRelays: 1,
    }),
  ],
  connectionEncryption: [noise()],
  streamMuxers: [mplex()],
  connectionGater: {
    denyDialMultiaddr: () => {
      // by default we refuse to dial local addresses from the browser since they
      // are usually sent by remote peers broadcasting undialable multiaddrs but
      // here we are explicitly connecting to a local node so do not deny dialing
      // any discovered address
      return false
    }
  },
  services: {
    identify: identifyService()
  }
})

await node.start()

// handle the echo protocol
await node.handle("/echo/1.0.0", ({ stream }) => {
  pipe(
    stream,
    async function* (source) {
      for await (const buf of source) {
        const incoming = toString(buf.subarray())
        appendOutput(`Received message '${clean(incoming)}'`)
        yield buf
      }
    },
    stream
  )
})

function updateConnList() {
  console.group('updateConnList');
  // Update connections list
  const connListEls = node.getConnections()
    .map((connection) => {
      console.log(connection.remoteAddr.protoCodes().map(c => protocols(c).name));
      if (isWebrtc(connection.remoteAddr)) {
        sendSection.style.display = "block"
      }
      const el = document.createElement("li")
      el.textContent = connection.remoteAddr.toString()
      return el
    });
  document.getElementById("connections").replaceChildren(...connListEls)
  console.groupEnd('updateConnList');
}

node.addEventListener("connection:open", (event) => {
  updateConnList()
})
node.addEventListener("connection:close", (event) => {
  updateConnList()
})

node.addEventListener("self:peer:update", (event) => {
  // Update multiaddrs list
  const multiaddrs = node.getMultiaddrs()
    .map((ma) => {
      const el = document.createElement("li")
      el.textContent = ma.toString()
      return el
    })
  document.getElementById("multiaddrs").replaceChildren(...multiaddrs)
})

const isWebrtc = (ma) => {
  const codes = ma.protoCodes();
  return codes.includes(WEBRTC_CODE);
}

window.connect.onclick = async () => {
  const ma = multiaddr(window.peer.value)
  console.log(ma.protoCodes().map(c => protocols(c).name));
  appendOutput(`Dialing '${ma}'`)
  const connection = await node.dial(ma)
  if (isWebrtc(ma)) {
    const outgoing_stream = await connection.newStream(["/echo/1.0.0"])
    pipe(sender, outgoing_stream, async (src) => {
      for await (const buf of src) {
        const response = toString(buf.subarray())
        appendOutput(`Received message '${clean(response)}'`)
      }
    })
  }
  appendOutput(`Connected to '${ma}'`)
}

window.send.onclick = async () => {
  const message = `${window.message.value}\n`
  appendOutput(`Sending message '${clean(message)}'`)
  sender.push(fromString(message))
}
