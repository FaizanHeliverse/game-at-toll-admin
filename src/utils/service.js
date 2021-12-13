import AWS from "aws-sdk";
import * as KVSWebRTC from "amazon-kinesis-video-streams-webrtc";

const credentials = {
  region: "us-east-2",
  accessKeyId: "AKIATZ6B4KZG2K37YTAD",
  secretAccessKey: "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",
  sessionToken: "",
  endpoint: "https://kinesisvideo.us-east-2.amazonaws.com",
  sendVideo: true,
  clientId: "PSKDFJDSLA",
};

async function  startMaster(localStream,channelName) {
  const master = {
    signalingClient: null,
    localStream: localStream,
    peerConnectionByClientId: {},
    peerConnectionStatsInterval: null,
    channelName: channelName,
  };

  console.log("SAMPLE STARTED");
  const kinesisVideoClient = new AWS.KinesisVideo({
    region: credentials.region,
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
    endpoint: credentials.endpoint,
    correctClockSkew: true,
  });

  const describeSignalingChannelResponseMaster = await kinesisVideoClient
    .describeSignalingChannel({
      ChannelName: master.channelName,
    })
    .promise();

  const channelARNMaster =
    describeSignalingChannelResponseMaster.ChannelInfo.ChannelARN;
  
  const getSignalingChannelEndpointResponseMaster = await kinesisVideoClient
    .getSignalingChannelEndpoint({
      ChannelARN: channelARNMaster,
      SingleMasterChannelEndpointConfiguration: {
        Protocols: ["WSS", "HTTPS"],
        // Role: KVSWebRTC.Role.MASTER,
        Role: "MASTER",
      },
    })
    .promise();

  const endpointsByProtocolMaster =
    getSignalingChannelEndpointResponseMaster.ResourceEndpointList.reduce(
      (endpoints, endpoint) => {
        endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
        return endpoints;
      },
      {}
    );
  console.log("[MASTER] Endpoints: ", endpointsByProtocolMaster);

  const kinesisVideoSignalingChannelsClientMaster =
    new AWS.KinesisVideoSignalingChannels({
      region: credentials.region,
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
      endpoint: endpointsByProtocolMaster.HTTPS,
      correctClockSkew: true,
    });

  
  const getIceServerConfigResponseMaster =
    await kinesisVideoSignalingChannelsClientMaster
      .getIceServerConfig({
        ChannelARN: channelARNMaster,
      })
      .promise();


  const iceServersMaster = [];
  
  iceServersMaster.push({
    urls: `stun:stun.kinesisvideo.${credentials.region}.amazonaws.com:443`,
  });

  getIceServerConfigResponseMaster.IceServerList.forEach((iceServer) =>
    iceServersMaster.push({
      urls: iceServer.Uris,
      username: iceServer.Username,
      credential: iceServer.Password,
    })
  );
  console.log("[MASTER] ICE servers: ", iceServersMaster);

  master.signalingClient = new KVSWebRTC.SignalingClient({
    channelARN: channelARNMaster,
    channelEndpoint: endpointsByProtocolMaster.WSS,
    role: KVSWebRTC.Role.MASTER,
    region: credentials.region,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
    },
    systemClockOffset: kinesisVideoClient.config.systemClockOffset,
  });

  const configurationMaster = {
    iceServersMaster,
    iceTransportPolicy: "all",
  };
  const resolution = { width: { ideal: 1280 }, height: { ideal: 720 } };

  // try {
  //   if (props.type == "camera") {
  //     master.localStream = localStream ?? await navigator.mediaDevices.getUserMedia({
  //       video: resolution,
  //       audio: true,
  //     });
  //   } else if (props.type == "screen") {
  //     master.localStream = localStream ?? await navigator.mediaDevices.getDisplayMedia();
  //   }
  // } catch (e) {
  //   console.error("[MASTER] Could not find webcam");
  // }
  master.localStream = localStream;
  console.log(master.localStream)
  master.signalingClient.on("open", async (offer, remoteClientId) => {
    console.log("[MASTER] Connected to signaling service");
  });

  master.signalingClient.on("sdpOffer", async (offer, remoteClientId) => {
    console.log("[MASTER] Received SDP offer from client: " + remoteClientId);
    const peerConnectionMaster = new RTCPeerConnection(configurationMaster);
    master.peerConnectionByClientId[remoteClientId] = peerConnectionMaster;

    if (!master.peerConnectionStatsInterval) {
      master.peerConnectionStatsInterval = setInterval(
        () => peerConnectionMaster.getStats().then(() => {}),
        1000
      );
    }

    peerConnectionMaster.addEventListener("icecandidate", ({ candidate }) => {
      if (candidate) {
        console.log(
          "[MASTER] Generated ICE candidate for client: " + remoteClientId
        );
        master.signalingClient.sendIceCandidate(candidate, remoteClientId);
        console.log(
          "[MASTER] Sending ICE candidate to client: " + remoteClientId
        );
      }
    });

    if (master.localStream) {
      master.localStream
        .getTracks()
        .forEach((track) =>
          peerConnectionMaster.addTrack(track, master.localStream)
        );
    }

    await peerConnectionMaster.setRemoteDescription(offer);
    console.log("[MASTER] Creating SDP answer for client: " + remoteClientId);
    await peerConnectionMaster.setLocalDescription(
      await peerConnectionMaster.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
    );
    console.log("[MASTER] Sending SDP answer to client: " + remoteClientId);
    master.signalingClient.sendSdpAnswer(
      peerConnectionMaster.localDescription,
      remoteClientId
    );
    console.log(
      "[MASTER] Generating ICE candidates for client: " + remoteClientId
    );
  });

  master.signalingClient.on(
    "iceCandidate",
    async (candidate, remoteClientId) => {
      console.log(
        "[MASTER] Received ICE candidate from client: " + remoteClientId
      );
      const peerConnection = master.peerConnectionByClientId[remoteClientId];
      peerConnection.addIceCandidate(candidate);
    }
  );

  master.signalingClient.on("close", () => {
    console.log("[MASTER] Disconnected from signaling channel");
  });

  master.signalingClient.on("error", () => {
    console.error("[MASTER] Signaling client error");
  });

  console.log("[MASTER] Starting master connection");
  master.signalingClient.open();
}

export { startMaster };
