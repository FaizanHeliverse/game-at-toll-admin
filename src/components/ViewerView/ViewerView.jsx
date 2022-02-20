import React,{ useRef, useEffect } from "react";
import { KinesisUtil } from "./kinesis";

function uid() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default function ViewerView({channel,batch,adminCamera,adminMic}) {
  const videoRef = useRef(null);
    useEffect(async ()=>{
        try {
            const clientId = uid();
            // const kinesisInfoViewer = await (await fetch(`${process.env.REACT_APP_PROXY}/kinesis-util?role=VIEWER&channelName=${channel+'-batch-'+batch}&clientId=${clientId}`,{method:'GET'})).json();
            // const kinesisUtilViewer = new KinesisUtil();
            // await kinesisUtilViewer.initializeViewer(kinesisInfoViewer,clientId,videoRef.current)
            const kinesisUtilViewer = new KinesisUtil(videoRef.current);
            await kinesisUtilViewer.startViewer({
                region: 'us-east-2',
                accessKeyId: 'AKIATZ6B4KZG2K37YTAD',
                secretAccessKey: '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',
                sessionToken: null,
                endpoint: null,
                channelName: channel+'-batch-'+batch,
                natTraversalDisabled: false,
                forceTURN: false,
                clientId: clientId,
                widescreen: true,
                sendVideo: true,
                sendAudio: false,
                openDataChannel: false,
                useTrickleICE: true,
                fullscreen: false
            },()=>{})
        } catch (err) {
            console.log(err)
        }
    },[])
    return <>
        <video ref={videoRef} autoPlay playsInline muted/>
    </>
}

// import React,{ useRef, useEffect } from "react";
// import AWS from "aws-sdk";
// import * as KVSWebRTC from "amazon-kinesis-video-streams-webrtc"

// function uid() {
//     return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
// }
// export default function ViewerView({channel,batch}) {
//   const videoRef = useRef(null);

//   const viewer = {
//     signalingClient: null,
//     remoteStreams: [],
//     remoteView:null,
//     channelName: channel + "-batch-" + batch,
//     peerConnectionStatsInterval: null,
// }

// const credentials = {
//   region: "us-east-2",
//   accessKeyId: "AKIATZ6B4KZG2K37YTAD",
//   secretAccessKey: "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",
//   sessionToken: "",
//   endpoint: "https://kinesisvideo.us-east-2.amazonaws.com",
//   sendVideo: true,
//   clientId: uid()
// }

//   async function startViewer() {
//     credentials.clientId = uid()
//     viewer.remoteView = videoRef.current;

//     // Create KVS client
//     const kinesisVideoClient = new AWS.KinesisVideo({
//       region: credentials.region,
//       accessKeyId: credentials.accessKeyId,
//       secretAccessKey: credentials.secretAccessKey,
//       sessionToken: credentials.sessionToken,
//       endpoint: credentials.endpoint,
//       correctClockSkew: true,
//     });

//     // Get signaling channel ARN
//     const describeSignalingChannelResponseViewer = await kinesisVideoClient
//         .describeSignalingChannel({
//             ChannelName: viewer.channelName,
//         })
//         .promise();
//     const channelARNViewer = describeSignalingChannelResponseViewer.ChannelInfo.ChannelARN;
//     console.log("[VIEWER] Channel ARN: ", channelARNViewer);

//     // Get signaling channel endpoints
//     const getSignalingChannelEndpointResponseViewer = await kinesisVideoClient
//     .getSignalingChannelEndpoint({
//         ChannelARN: channelARNViewer,
//         SingleMasterChannelEndpointConfiguration: {
//             Protocols: ["WSS", "HTTPS"],
//             // Role: KVSWebRTC.Role.VIEWER,
//             Role: "VIEWER",
//         },
//     })
//     .promise();

//     const endpointsByProtocolViewer = 
//     getSignalingChannelEndpointResponseViewer.ResourceEndpointList.reduce(
//         (endpoints,endpoint) => {
//             endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
//             return endpoints;
//         }, {}
//     )
//     console.log("[VIEWER] Endpoints: ", endpointsByProtocolViewer);

//     const kinesisVideoSignalingChannelsClientViewer = 
//     new AWS.KinesisVideoSignalingChannels({
//         region:credentials.region,
//         accessKeyId:credentials.accessKeyId,
//         secretAccessKey:credentials.secretAccessKey,
//         sessionToken: credentials.sessionToken,
//         endpoint: endpointsByProtocolViewer.HTTPS,
//         correctClockSkew: true,
//     })

//     // Get ICE server configuration
//     const getIceServerConfigResponseViewer = await kinesisVideoSignalingChannelsClientViewer
//     .getIceServerConfig({
//         ChannelARN: channelARNViewer,
//     })
//     .promise();
//     const iceServersViewer = [];
//     iceServersViewer.push({
//       urls: `stun:stun.kinesisvideo.${credentials.region}.amazonaws.com:443`,
//   })
    
//   getIceServerConfigResponseViewer.IceServerList.forEach((iceServer)=>
//   iceServersViewer.push({
//       urls: iceServer.Uris,
//       username: iceServer.Username,
//       credential: iceServer.Password,
//   })
// )
// console.log("[VIEWER] ICE servers: ", iceServersViewer);

//     // Create Signaling Client
//     viewer.signalingClient = new KVSWebRTC.SignalingClient({
//       channelARN: channelARNViewer,
//       channelEndpoint: endpointsByProtocolViewer.WSS,
//       clientId: credentials.clientId,
//       role: KVSWebRTC.Role.VIEWER,
//       region: credentials.region,
//       credentials: {
//         accessKeyId: credentials.accessKeyId,
//         secretAccessKey: credentials.secretAccessKey,
//         sessionToken: credentials.sessionToken,
//       },
//       systemClockOffset: kinesisVideoClient.config.systemClockOffset,
//   });

//     const resolution = { width: { ideal: 1280 }, height: { ideal: 720 } }
      
//     const constraints = {
//       video:  resolution ,
//       audio: true,
//     };
//     const configurationViewer = {
//       iceServersViewer,
//       iceTransportPolicy: "all",
//   }
//   viewer.peerConnection = new RTCPeerConnection(configurationViewer);
//     // Poll for connection stats
//     viewer.peerConnectionStatsInterval = setInterval(
//       () => viewer.peerConnection.getStats().then(()=>{}),1000
//   );

//     viewer.signalingClient.on("open", async () => {
//       console.log("[VIEWER] Connected to signaling service");
//       console.log("[VIEWER] Creating SDP offer");
//       await viewer.peerConnection.setLocalDescription(
//           await viewer.peerConnection.createOffer({
//             offerToReceiveAudio: true,
//             offerToReceiveVideo: true,
//           })
//       );
//       console.log("[VIEWER] Sending SDP offer");
//       viewer.signalingClient.sendSdpOffer(
//           viewer.peerConnection.localDescription
//       );
//       console.log("[VIEWER] Generating ICE candidates");
//   })

//   viewer.signalingClient.on("sdpAnswer", async (answer) => {
//     // Add the SDP answer to the peer connection
//     console.log("[VIEWER] Received SDP answer");
//     await viewer.peerConnection.setRemoteDescription(answer);
// });

// viewer.signalingClient.on("iceCandidate", (candidate) => {
//   // Add the ICE candidate received from the MASTER to the peer connection
//   console.log("[VIEWER] Received ICE candidate");
//   viewer.peerConnection.addIceCandidate(candidate);
// });

// viewer.signalingClient.on("close", () => {
//   console.log("[VIEWER] Disconnected from signaling channel");
// });
// viewer.signalingClient.on("error", (error) => {
//   console.error("[VIEWER] Signaling client error: ", error);
// });

// viewer.peerConnection.addEventListener("icecandidate", ({ candidate }) => {
//   if (candidate) {
//       console.log("[VIEWER] Generated ICE candidate");
//       console.log("[VIEWER] Sending ICE candidate");
//       viewer.signalingClient.sendIceCandidate(candidate);
//   }
// });
//     // As remote tracks are received, add them to the remote view
//     viewer.peerConnection.addEventListener("track", (event) => {
//       console.log("[VIEWER] Received remote track");
//       if (viewer.remoteView.srcObject) {
//         console.log("RETURNING....")
//         return;
//       }
//       viewer.remoteStream = event.streams[0];
//       viewer.remoteView.srcObject = event.streams[0];
//     });
//     console.log("[VIEWER] Starting viewer connection");
//     viewer.signalingClient.open();
//   }

//   useEffect(() => {
//     startViewer();
//   }, []);

//   return (
//     <>
//       <video ref={videoRef} autoPlay playsInline />
//     </>
//   );
// }


// import React from 'react';
// import AWS from "aws-sdk";

// const viewer = {};

// function uid() {
//   return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
// }

// class ViewerView extends React.Component {
//   constructor(props) {
//     super(props);
//     this.videoRef = React.createRef()
//   }

// //   componentWillUnmount() {
// //     console.log('[VIEWER] Stopping viewer connection');
// //     if (viewer.signalingClient) {
// //         viewer.signalingClient.close();
// //         viewer.signalingClient = null;
// //     }

// //     if (viewer.peerConnection) {
// //         viewer.peerConnection.close();
// //         viewer.peerConnection = null;
// //     }

// //     if (viewer.remoteStream) {
// //         viewer.remoteStream.getTracks().forEach(track => track.stop());
// //         viewer.remoteStream = null;
// //     }

// //     if (viewer.peerConnectionStatsInterval) {
// //         clearInterval(viewer.peerConnectionStatsInterval);
// //         viewer.peerConnectionStatsInterval = null;
// //     }

// //     if (viewer.remoteView) {
// //         viewer.remoteView.srcObject = null;
// //     }

// //     if (viewer.dataChannel) {
// //         viewer.dataChannel = null;
// //     }
// // }

// async componentDidMount() {
//     // Create KVS client
//     const kinesisVideoClient = new AWS.KinesisVideo({
//         region: "us-east-2",
//         accessKeyId: "AKIATZ6B4KZG2K37YTAD",
//         secretAccessKey: "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",
//         sessionToken: "",
//         endpoint: "https://kinesisvideo.us-east-2.amazonaws.com",
//     });

//     // Get signaling channel ARN
//     const describeSignalingChannelResponse = await kinesisVideoClient.describeSignalingChannel({ ChannelName: this.props.channel + "-batch-" + this.props.batch}).promise();
//     console.log(this.props.channel + "-batch-" + this.props.batch,"CHANNEL NAME")
//     const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN;
//     console.log('[VIEWER] Channel ARN: ', channelARN);

//     // Get signaling channel endpoints
//     const getSignalingChannelEndpointResponse = await kinesisVideoClient.getSignalingChannelEndpoint({ ChannelARN: channelARN,
//             SingleMasterChannelEndpointConfiguration: {
//                 Protocols: ['WSS', 'HTTPS'],
//                 Role: "VIEWER",
//             },
//         }).promise();

//     const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
//         endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
//         return endpoints;
//     }, {});
//     console.log('[VIEWER] Endpoints: ', endpointsByProtocol);

//     const kinesisVideoSignalingChannelsClient = new AWS.KinesisVideoSignalingChannels({
//         region: "us-east-2",
//         accessKeyId: "AKIATZ6B4KZG2K37YTAD",
//         secretAccessKey: "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",
//         sessionToken: "",
//         endpoint: "https://kinesisvideo.us-east-2.amazonaws.com",
//     });

//     // Get ICE server configuration
//     const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient.getIceServerConfig({
//             ChannelARN: channelARN,
//         }).promise();

//     const iceServers = [];
//     iceServers.push({ urls: `stun:stun.kinesisvideo.us-east-2.amazonaws.com:443` });
//     console.log(getIceServerConfigResponse.IceServerList,"SUHAIL")
//     //if (!formValues.natTraversalDisabled) {
//         // getIceServerConfigResponse.IceServerList.forEach(iceServer =>
//         //     iceServers.push({
//         //         urls: iceServer.Uris,
//         //         username: iceServer.Username,
//         //         credential: iceServer.Password,
//         //     }),
//         // );
//     //}
//     console.log('[VIEWER] ICE servers: ', iceServers);

//     // Create Signaling Client
//     viewer.signalingClient = new window.KVSWebRTC.SignalingClient({
//         channelARN,
//         channelEndpoint: endpointsByProtocol.WSS,
//         clientId: uid(),
//         role: "VIEWER",
//         region: "us-east-2",
//         credentials: {
//             accessKeyId: "AKIATZ6B4KZG2K37YTAD",
//             secretAccessKey: "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",
//         },
//     });

//     const configuration = {
//         iceServers,
//         iceTransportPolicy: 'all',
//     };
//     viewer.peerConnection = new RTCPeerConnection(configuration);
    
//     viewer.signalingClient.on('open', async () => {
//         console.log('[VIEWER] Connected to signaling service');

//         // Create an SDP offer to send to the master
//         console.log('[VIEWER] Creating SDP offer');
//         await viewer.peerConnection.setLocalDescription(
//             await viewer.peerConnection.createOffer({
//                 offerToReceiveAudio: true,
//                 offerToReceiveVideo: true,
//             }),
//         );

//         // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
//         console.log('[VIEWER] Sending SDP offer');
//         viewer.signalingClient.sendSdpOffer(viewer.peerConnection.localDescription);
//         console.log('[VIEWER] Generating ICE candidates');
//     });

//     viewer.signalingClient.on('sdpAnswer', async answer => {
//         // Add the SDP answer to the peer connection
//         console.log('[VIEWER] Received SDP answer');
//         await viewer.peerConnection.setRemoteDescription(answer);
//     });

//     viewer.signalingClient.on('iceCandidate', candidate => {
//         // Add the ICE candidate received from the MASTER to the peer connection
//         console.log('[VIEWER] Received ICE candidate');
//         viewer.peerConnection.addIceCandidate(candidate);
//     });

//     viewer.signalingClient.on('close', () => {
//         console.log('[VIEWER] Disconnected from signaling channel');
//     });

//     viewer.signalingClient.on('error', error => {
//         console.error('[VIEWER] Signaling client error: ', error);
//     });

//     // Send any ICE candidates to the other peer
//     viewer.peerConnection.addEventListener('icecandidate', ({ candidate }) => {
//         if (candidate) {
//             console.log('[VIEWER] Generated ICE candidate');

//             // When trickle ICE is enabled, send the ICE candidates as they are generated.
//             console.log('[VIEWER] Sending ICE candidate');
//             viewer.signalingClient.sendIceCandidate(candidate);
//         } else {
//             console.log('[VIEWER] All ICE candidates have been generated');
//         }
//     });

//     // As remote tracks are received, add them to the remote view
//     viewer.peerConnection.addEventListener('track', async (event) => {
//         console.log('[VIEWER] Received remote track');
//         // if (remoteView.srcObject) {
//         //     return;
//         // }
//         viewer.remoteStream = event.streams[0];
//         //this.setState({streamURL: event.streams[0]}); 
//         this.videoRef.current.srcObject = event.streams[0];
//     });

//     console.log('[VIEWER] Starting viewer connection');
//     viewer.signalingClient.open();
// }


//   render() {
//     return (
//       <video ref={this.videoRef} style={{width: '100%', minHeight: '500px', maxHeight: '100px', position: 'relative' }} autoPlay playsInline />
//     )
// }
// }

// export default ViewerView;

