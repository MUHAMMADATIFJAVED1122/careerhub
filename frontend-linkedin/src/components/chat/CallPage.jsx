// src/components/chat/CallPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  joinCallSocket,
  callUser,
  answerCall,
  sendIceCandidate,
  onIncomingCall,
  onCallAnswered,
  onIceCandidate,
  onCallEnded,
  endCall as socketEndCall,
} from "../../services/callService";
import CallModal from "./CallModal";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  PhoneCall,
} from "lucide-react";
import "./call.css";

const CallPage = ({ callType, receiverId, senderId, receiverName }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);

  const [inCall, setInCall] = useState(false);
  const [incomingCallData, setIncomingCallData] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  const navigate = useNavigate();
  const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  // ⚡ Setup socket listeners
  useEffect(() => {
    joinCallSocket(senderId);

    onIncomingCall((data) => setIncomingCallData(data));
    onCallAnswered(async ({ answer }) => {
      if (pcRef.current) {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        setInCall(true);
      }
    });

    onIceCandidate(async ({ candidate }) => {
      if (candidate && pcRef.current) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    onCallEnded(() => {
      cleanupMedia();
      pcRef.current?.close();
      setInCall(false);
      setIncomingCallData(null);
    });

    return () => {
      cleanupMedia();
      pcRef.current?.close();
    };
  }, []);

  // ⚡ Helpers
  const cleanupMedia = () => {
    [localVideoRef, remoteVideoRef].forEach((ref) => {
      const obj = ref.current?.srcObject;
      if (obj) obj.getTracks().forEach((t) => t.stop());
      if (ref.current) ref.current.srcObject = null;
    });
  };

  const createPeerConnection = async () => {
    if (pcRef.current) return pcRef.current;

    const pc = new RTCPeerConnection(servers);
    pcRef.current = pc;

    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callType === "video",
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
    }

    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

    pc.ontrack = (event) => {
      if (remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendIceCandidate({ receiverId, candidate: event.candidate });
      }
    };

    return pc;
  };

  // ⚡ Call actions
  const startCall = async () => {
    const pc = await createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    callUser({ senderId, receiverId, offer, callType });
    setInCall(true);
  };

  const acceptCall = async () => {
    const { senderId: callerId, offer, callType: incomingType } =
      incomingCallData;
    const pc = await createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    answerCall({ senderId, receiverId: callerId, answer });
    setInCall(true);
    setIncomingCallData(null);
  };

  const rejectCall = () => setIncomingCallData(null);

  const endCallHandler = () => {
    cleanupMedia();
    pcRef.current?.close();
    socketEndCall({ senderId, receiverId });
    setInCall(false);
    navigate(-1);
  };

  return (
    <div className="call-page">
      <h2 className="call-heading">{receiverName}</h2>

      <div className="video-section">
        {callType === "video" ? (
          <video ref={localVideoRef} autoPlay playsInline muted className="video-box" />
        ) : (
          <audio ref={localVideoRef} autoPlay muted />
        )}
        {callType === "video" ? (
          <video ref={remoteVideoRef} autoPlay playsInline className="video-box" />
        ) : (
          <audio ref={remoteVideoRef} autoPlay controls />
        )}
      </div>

      <div className="controls">
        {!inCall && !incomingCallData && (
          <button onClick={startCall} className="btn btn-green">
            <PhoneCall size={20} /> Start {callType} Call
          </button>
        )}
        {inCall && (
          <>
            <button onClick={() => setIsMicOn(!isMicOn)} className="btn btn-blue">
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            {callType === "video" && (
              <button onClick={() => setIsCamOn(!isCamOn)} className="btn btn-blue">
                {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
            )}
            <button onClick={endCallHandler} className="btn btn-red">
              <PhoneOff size={20} /> End
            </button>
          </>
        )}
      </div>

      <CallModal
        show={!!incomingCallData}
        callerName={receiverName}
        callType={incomingCallData?.callType}
        onAccept={acceptCall}
        onReject={rejectCall}
      />
    </div>
  );
};

export default CallPage;
