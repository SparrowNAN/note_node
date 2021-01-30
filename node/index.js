const Libp2p = require('libp2p')
const WebSockets = require('libp2p-websockets')
const { NOISE } = require('libp2p-noise')
const MPLEX = require('libp2p-mplex')

const Bootstrap = require('libp2p-bootstrap')

// Known peers addresses
// const bootstrapMultiaddrs = [
//   '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
//   '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
// ]
async function run_p2p() {
    const node = await Libp2p.create({
        modules: {
            transport: [WebSockets],
            connEncryption: [NOISE],
            streamMuxer: [MPLEX]
            // peerDiscovery: [Bootstrap]
        },
        config: {
            // peerDiscovery: {
            //   autoDial: true, // Auto connect to discovered peers (limited by ConnectionManager minConnections)
            //   // The `tag` property will be searched when creating the instance of your Peer Discovery service.
            //   // The associated object, will be passed to the service when it is instantiated.
            //   [Bootstrap.tag]: {
            //     enabled: true,
            //     list: bootstrapMultiaddrs // provide array of multiaddrs
            //   }
            // }
        }
    })

    node.on('peer:discovery', (peer) => {
        console.log('Discovered %s', peer.id.toB58String()) // Log discovered peer
    })

    node.connectionManager.on('peer:connect', (connection) => {
        console.log('Connected to %s', connection.remotePeer.toB58String()) // Log connected peer
    })

    // start libp2p
    await node.start();
}
run_p2p();