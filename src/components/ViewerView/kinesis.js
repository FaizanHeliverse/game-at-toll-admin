import { SignalingClient } from 'amazon-kinesis-video-streams-webrtc';
import KinesisVideo from 'aws-sdk/clients/kinesisvideo';
const KinesisVideoSignalingChannels = require('aws-sdk/clients/kinesisvideosignalingchannels');

const ERROR_CODE = {
  OK: 0,
  NO_WEBCAM: 1,
  NOT_MASTER: 2,
  VIEWER_NOT_FOUND: 3,
  LOCAL_STREAM_NOT_FOUND: 4,
  NOT_FOUND_ANY: 5,
  ERROR: 6,
  UNKNOWN_ERROR: 7
};

/**
 * CustomSigner class takes the url in constructor with a getSignedUrl method which returns the signedURL
 */
class CustomSigner {
  constructor (_url) {
    this.url = _url;
  }

  getSignedURL () {
    return this.url;
  }
}

class KinesisUtil {
  constructor (remoteView) {
    this.remoteView = remoteView;
    this.viewer = {}
  }

  /**
   * 
   * @param {*} kinesisInfo Kinesis data retrieved from the backend 
   * 
   * @param {*} clientId this should be a unique ID either user id or any unique id
   * @returns 
   */


   async startViewer(formValues,callback) {
    this.viewer.remoteView = this.remoteView;

    const kinesisVideoClient = new KinesisVideo({
        region: formValues.region,
        accessKeyId: formValues.accessKeyId,
        secretAccessKey: formValues.secretAccessKey,
        sessionToken: formValues.sessionToken,
        endpoint: formValues.endpoint,
        correctClockSkew: true,
    });

    // Get signaling channel ARN
    const describeSignalingChannelResponse = await kinesisVideoClient
        .describeSignalingChannel({
            ChannelName: formValues.channelName,
        })
        .promise();
    const channelARN = describeSignalingChannelResponse.ChannelInfo.ChannelARN;
    console.log('[VIEWER] Channel ARN: ', channelARN);

    // Get signaling channel endpoints
    const getSignalingChannelEndpointResponse = await kinesisVideoClient
        .getSignalingChannelEndpoint({
            ChannelARN: channelARN,
            SingleMasterChannelEndpointConfiguration: {
                Protocols: ['WSS', 'HTTPS'],
                Role: 'VIEWER',
            },
        })
        .promise();
    const endpointsByProtocol = getSignalingChannelEndpointResponse.ResourceEndpointList.reduce((endpoints, endpoint) => {
        endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
        return endpoints;
    }, {});
    console.log('[VIEWER] Endpoints: ', endpointsByProtocol);

    const kinesisVideoSignalingChannelsClient = new KinesisVideoSignalingChannels({
        region: formValues.region,
        accessKeyId: formValues.accessKeyId,
        secretAccessKey: formValues.secretAccessKey,
        sessionToken: formValues.sessionToken,
        endpoint: endpointsByProtocol.HTTPS,
        correctClockSkew: true,
    });

    // Get ICE server configuration
    const getIceServerConfigResponse = await kinesisVideoSignalingChannelsClient
        .getIceServerConfig({
            ChannelARN: channelARN,
        })
        .promise();
    const iceServers = [];
    if (!formValues.natTraversalDisabled && !formValues.forceTURN) {
        iceServers.push({ urls: `stun:stun.kinesisvideo.${formValues.region}.amazonaws.com:443` });
    }
    if (!formValues.natTraversalDisabled) {
        getIceServerConfigResponse.IceServerList.forEach(iceServer =>
            iceServers.push({
                urls: iceServer.Uris,
                username: iceServer.Username,
                credential: iceServer.Password,
            }),
        );
    }
    console.log('[VIEWER] ICE servers: ', iceServers);

    // Create Signaling Client
    this.viewer.signalingClient = new SignalingClient({
        channelARN,
        channelEndpoint: endpointsByProtocol.WSS,
        clientId: formValues.clientId,
        role: 'VIEWER',
        region: formValues.region,
        credentials: {
            accessKeyId: formValues.accessKeyId,
            secretAccessKey: formValues.secretAccessKey,
            sessionToken: formValues.sessionToken,
        },
        systemClockOffset: kinesisVideoClient.config.systemClockOffset,
    });

    const resolution = formValues.widescreen ? { width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 640 }, height: { ideal: 480 } };
    const constraints = {
        video: formValues.sendVideo ? resolution : false,
        audio: formValues.sendAudio,
    };
    const configuration = {
        iceServers,
        iceTransportPolicy: formValues.forceTURN ? 'relay' : 'all',
    };
    this.viewer.peerConnection = new RTCPeerConnection(configuration);

    this.viewer.signalingClient.on('open', async () => {
        console.log('[VIEWER] Connected to signaling service');

        // Get a stream from the webcam, add it to the peer connection, and display it in the local view.
        // If no video/audio needed, no need to request for the sources. 
        // Otherwise, the browser will throw an error saying that either video or audio has to be enabled.
        if (formValues.sendVideo || formValues.sendAudio) {
            try {
                // this.viewer.localStream = await navigator.mediaDevices.getUserMedia(constraints);
                // this.viewer.localStream.getTracks().forEach(track => this.viewer.peerConnection.addTrack(track, this.viewer.localStream));
            } catch (e) {
                console.error('[VIEWER] Could not find webcam',e);
                return;
            }
        }

        // Create an SDP offer to send to the master
        console.log('[VIEWER] Creating SDP offer');
        await this.viewer.peerConnection.setLocalDescription(
            await this.viewer.peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            }),
        );

        // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
        if (formValues.useTrickleICE) {
            console.log('[VIEWER] Sending SDP offer');
            this.viewer.signalingClient.sendSdpOffer(this.viewer.peerConnection.localDescription);
        }
        console.log('[VIEWER] Generating ICE candidates');
    });

    this.viewer.signalingClient.on('sdpAnswer', async answer => {
        // Add the SDP answer to the peer connection
        console.log('[VIEWER] Received SDP answer');
        await this.viewer.peerConnection.setRemoteDescription(answer);
    });

    this.viewer.signalingClient.on('iceCandidate', candidate => {
        // Add the ICE candidate received from the MASTER to the peer connection
        console.log('[VIEWER] Received ICE candidate');
        this.viewer.peerConnection.addIceCandidate(candidate);
    });

    this.viewer.signalingClient.on('close', () => {
        console.log('[VIEWER] Disconnected from signaling channel');
    });

    this.viewer.signalingClient.on('error', error => {
        console.error('[VIEWER] Signaling client error: ', error);
    });

    // Send any ICE candidates to the other peer
    this.viewer.peerConnection.addEventListener('icecandidate', ({ candidate }) => {
        if (candidate) {
            console.log('[VIEWER] Generated ICE candidate');

            // When trickle ICE is enabled, send the ICE candidates as they are generated.
            if (formValues.useTrickleICE) {
                console.log('[VIEWER] Sending ICE candidate');
                this.viewer.signalingClient.sendIceCandidate(candidate);
            }
        } else {
            console.log('[VIEWER] All ICE candidates have been generated');

            // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
            if (!formValues.useTrickleICE) {
                console.log('[VIEWER] Sending SDP offer');
                this.viewer.signalingClient.sendSdpOffer(this.viewer.peerConnection.localDescription);
            }
        }
    });

    // As remote tracks are received, add them to the remote view
    this.viewer.peerConnection.addEventListener('track', event => {
        console.log('[VIEWER] Received remote track');
        if(!this.remoteView) return;
        if (this.remoteView.srcObject) {
            callback();
            return;
        }
        this.viewer.remoteStream = event.streams[0];
        this.remoteView.srcObject = this.viewer.remoteStream;
    });

    console.log('[VIEWER] Starting viewer connection');
    this.viewer.signalingClient.open();
  }



  // async initializeViewer (kinesisInfo, clientId,remoteView) {
  //   const result = { errorCode: ERROR_CODE.UNKNOWN_ERROR }; /* IF THIS FUNCTION CANNOT REACH FINAL OK STATE -> ERROR */
  //   const role = 'VIEWER';
  //   this.clientId = clientId;
  //   this.role = role;

  //   const configuration = kinesisInfo.configuration;

  //   if (this.signalingClient) {
  //     console.log("VIEWER CLOSE SIGNALING CLIENT")
  //     this.signalingClient.close();
  //     this.signalingClient = null;
  //   }

  //   this.signalingClient = new SignalingClient({
  //     requestSigner: new CustomSigner(kinesisInfo.url), /** Use the customSigner to return the signed url, so we can ignore aws credentials
  //     and regions, channelARN and channelEndpoint can be any text */
  //     region: 'default region, (any text) as region is already part of signedurl',
  //     role,
  //     clientId,
  //     channelARN: 'default channel, (any text) as channelARN is already part of signedurl',
  //     channelEndpoint: 'default endpoint (any text) as endpoint is already part of signedurl'
  //   });

  //   this.peerConnection = new RTCPeerConnection(configuration);
    
  //   this.signalingClient.on('open', async () => {
  //     // code to run for open event
  //     console.log('[VIEWER] Creating SDP offer');
  //     await this.peerConnection.setLocalDescription(
  //       await this.peerConnection.createOffer({
  //         offerToReceiveAudio:true,
  //         offerToReceiveVideo:true,
  //       })
  //     )
  //     this.signalingClient.sendSdpOffer(this.peerConnection.localDescription);
  //     console.log("VIEWER done")
  //   });

  //   this.signalingClient.on('sdpAnswer',async answer => {
  //     console.log('VIEWER REceived SDP answer', answer);
  //     await this.peerConnection.setRemoteDescription(answer);
  //   })

  //   this.signalingClient.on('iceCandidate',(candidate,remoteClientId)=>{
  //     this.peerConnection.addIceCandidate(candidate)
  //   })

  //   this.peerConnection.addEventListener('track',event=>{
  //     console.log('VIEWER RECEIVED REMOTE TRACK');
  //     if(remoteView.srcObject) return;
  //     remoteView.srcObject = event.streams[0];
  //   })

  //   this.signalingClient.on('close', () => {
  //     console.warn('VIEWER Current signaling closed');
  //   });

  //   this.signalingClient.on('error', (e) => {
  //     console.error('VIEWER SignalingClient error:', e);
  //   });

  //   this.signalingClient.on('sdpOffer', async (offer, remoteClientId) => {
  //     const peerConnection = new RTCPeerConnection(configuration);
  //     this.peerConnectionByClientId[remoteClientId] = peerConnection;
  //     // Other code to run
  //     console.log('VIEWER sdpoffer')
  //   });

  //   this.signalingClient.open();

  //   result.errorCode = ERROR_CODE.OK;
  //   return result;
  // }

  // async initializeMaster (kinesisInfo, localView, videoSize) {
  //   const result = { errorCode: ERROR_CODE.UNKNOWN_ERROR }; /* IF THIS FUNCTION CANNOT REACH FINAL OK STATE -> ERROR */
  //   const role = 'MASTER';
  //   this.clientId = 'MASTER_ID';
  //   this.role = role;
  //   this.peerConnectionByClientId = {};

  //   const configuration = kinesisInfo.configuration;

  //   /** Custom Signer class with get signed url
  //    * method to return the signed url from backend
  //    *  so other credentials can be left as default
  //    * */ 
  //   console.log('MASTER '+kinesisInfo.url)
  //   this.signalingClient = new SignalingClient({
  //     requestSigner: new CustomSigner(kinesisInfo.url),
  //     role,
  //     region: 'default region, (any text) as region is already part of signedurl',
  //     channelARN: 'default channel, (any text) as channelARN is already part of signedurl',
  //     channelEndpoint: 'default endpoint (any text) as endpoint is already part of signedurl'
  //   });
  //   console.log(this.signalingClient)
  //   this.signalingClient.on('open', async () => {
  //     // code to run on connection open
  //     console.log("MASTER Signalingclient open")
  //   });

  //   this.signalingClient.on('sdpOffer', async (offer, remoteClientId) => {
  //     const peerConnection = new RTCPeerConnection(configuration);
  //     this.peerConnectionByClientId[remoteClientId] = peerConnection;
  //     // Other code to run
  //     peerConnection.addEventListener('icecandidate',({candidate}) => {
  //       if(candidate) {
  //         console.log('MASTER Generated ICE candidate for client: '+remoteClientId)
  //         this.signalingClient.sendIceCandidate(candidate,remoteClientId)
  //         console.log('MASTER Sending ICE candidate to client: '+ remoteClientId);
  //       } else {
  //         console.log('MASTER SDP ANSWER TO CLIENT')
  //         this.signalingClient.sendSdpAnswer(peerConnection.localDescription,remoteClientId)
  //       }
  //     })
      
  //     if(localView) {
  //       localView.getTracks().forEach((track)=> peerConnection.addTrack(track,localView));
  //     }
  //     await peerConnection.setRemoteDescription(offer);
  //     console.log('MASTER Creating SDP answer for client ' + remoteClientId);
  //     await peerConnection.setLocalDescription(
  //       await peerConnection.createAnswer({
  //         offerToReceiveAudio: true,
  //         offerToReceiveVideo: true,
  //       })
  //     )
  //     console.log("[MASTER] Sending SDP answer to client: " + remoteClientId);
  //     this.signalingClient.sendSdpAnswer(
  //       peerConnection.localDescription,
  //       remoteClientId
  //     )
  //     this.signalingClient.sendSdpAnswer(peerConnection.localDescription,remoteClientId)
  //     console.log("MASTER signalingClient sdpoffer")
  //   });

  //   this.signalingClient.on('iceCandidate',async (candidate, remoteClientId)=>{
  //     console.log("MASTER RECEIVED ICE CANDIDATE FROM CLIENT");
  //     const peerConnection = this.peerConnectionByClientId[remoteClientId];
  //     peerConnection.addIceCandidate(candidate);
  //   })

  //   this.signalingClient.on('close', () => {
  //     // code to run on connection close
  //     console.log('MASTER signaling client close')
  //   });

  //   this.signalingClient.on('error', (e) => {
  //     // code to run on error
  //     console.log('MASTER signaling client error',e)
  //   });

  //   this.signalingClient.open();
  //   /* LAST */
  //   // if (this.signalingClient) {
  //   //   console.log('MASTER close signaling client')
  //   //   this.signalingClient.close();
  //   //   this.signalingClient = null;
  //   // }
  //   result.errorCode = ERROR_CODE.OK;
  //   return result;
  // }
}

export {
  KinesisUtil
};