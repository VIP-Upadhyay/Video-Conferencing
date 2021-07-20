let myUserId;
let webs;
let constraints = {
    audio: true,
    video:{
        facingMode : 'user'
    },
    options:{
        mirror:true
    }
}
let camfacingMode = 'user';
let audios=true;
let videos=true;
let localStream;
var otherId;
let peers = {};
const peer = new Peer();
const videoGrid = document.getElementById('video-grid');
const msglist = document.querySelector(".msg_list");
const pinedVid = document.querySelector(".pvid");
var myPinnedVid = true;
pinedVid.muted = true;
const myVideo = document.createElement('video');
myVideo.setAttribute("class","myVid");
myVideo.muted = true;
//var ss = document.getElementById("status");
var webUri = location.host+"/vc";
webs = new WebSocket("wss://"+webUri);
webs.onopen = function(event){
    //ss.textContent = "Connected Succesfully";
};
webs.onclose = function(e){
    // ss.textContent = "Connected Closed";
}
function connectToNewUser(userId, stream) {
    var options = {metadata :{"id":myUserId}}
    const call = peer.call(userId, stream,options);
    const video = document.createElement('video');
    video.setAttribute('id',userId);
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        // alert("left");
        video.remove();
    });
    peers[userId] = call;
}
peer.on("error",error=>{
    alert(error);
})
peer.on('open', function(id) {
    myUserId = id;
    myVideo.setAttribute("id",myUserId);
    webs.send(JSON.stringify({
        type: "join-room",
        roomId : rid,
        userId : id,
        username : userName
    }));
});
function sendMsg(){
    var x = document.querySelector("#msg");
    if(x.value!=""){
        webs.send(JSON.stringify({
            type: "message",
            roomId : rid,
            userId : myUserId,
            username : userName,
            message : x.value
        }));
        x.value = "";
    }
}
        
navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    localStream = stream;
    addPinnedVideo(stream,myUserId);
    addVideoStream(myVideo,stream);
    peer.on('call', call => {
        call.answer(localStream);
        const video = document.createElement('video');
        video.setAttribute("id",call.metadata.id);
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
        peers[call.metadata.id] = call;
    });
    webs.onmessage = function(event){
        var msg =  JSON.parse(event.data) || {};
        console.log(msg);
        if(msg.type=="disconnect"){
            const video = document.getElementById(msg.userId);
            videoGrid.removeChild(video);
            if (peers[msg.userId]) peers[msg.userId].close()
        }
        if(msg.userId!=null){
            if(msg.type=="join-room"){
                if(myUserId!=msg.userId){
                    connectToNewUser(msg.userId,localStream);
                }
            }
        }
        if(msg.type=="message"){
            var msgbx = document.createElement("div");
            var ubx = document.createElement("div");
            var rmsg = document.createElement("div");
            msgbx.setAttribute("class","msgbox");
            ubx.setAttribute("class","uname");
            rmsg.setAttribute("class","rmsg");
            ubx.textContent = msg.username;
            rmsg.textContent = msg.message;
            msgbx.appendChild(ubx);
            msgbx.appendChild(rmsg);
            msglist.appendChild(msgbx);
            msglist.scrollTop = msglist.scrollHeight;
        }
    }
});        
function addPinnedVideo(stream,userId){
    pinedVid.srcObject = stream;
    pinedVid.stream;
    pinedVid.addEventListener('loadedmetadata', () => {
        pinedVid.play();
    });
    var mtb = document.querySelector(".mtb");
    if (userId !== undefined){
        if(userId == myUserId){
            myPinnedVid = true;
            mtb.style.display = "none";
        }else{
            myPinnedVid = false;
            mtb.style.display = "block";
            mtb.setAttribute("data-item",userId);
        }
    }else{
        myPinnedVid = true;
        mtb.style.display = "none";
    }
}
function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.poster = "/img/video_open.png";
        video.play();
    });
    video.addEventListener('click',function(){
        myPinnedVid = false;
        this.play();
        var x = this.getAttribute("id");
        addPinnedVideo(this.captureStream(),x);
    });
    videoGrid.appendChild(video);
}

function getMessageCont(){
    var x = document.querySelector(".msg_cont");
    x.style.transform='translateY(0)';
}
function closeMessage(){
    var x = document.querySelector(".msg_cont");
    x.style.transform='translateY(-100%)';
}
function changeCamTofrnt(y){
    var x = document.querySelector(".rear");
    y.style.display= "none";
    x.style.display= "block";
    if (localStream) {
        localStream.getTracks().forEach(function (track) {
          track.stop();
        });
    }
    camfacingMode ='environment';
    if(videos){
        var constraints = {
            audio: audios,
            video: {
                facingMode: camfacingMode
            }
        };
    }else{
        var constraints = {
            audio: audios,
            video: videos
        };
    }
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        localStream = stream;

        var vid = document.querySelector(".myVid");
        vid.srcObject = stream;
        vid.addEventListener('loadedmetadata', () => {
            video.play();
        });
        if(myPinnedVid){
            addPinnedVideo(stream,myUserId);
        }
        if(audios&&videos){
            changeStreamWithAudioVideo();
        }else{
            if(audios){
                changeStreamWithAudio();
            }else{
                if(videos){
                    changeStreamWithVideo();
                }
            }
        }
    }).catch(handleError);
    function handleError(error) {
        alert("error "+error)
        console.error('getUserMedia() error: ', error);
    }

}
function changeCamTorear(y){
    var x = document.querySelector(".frnt");
    y.style.display= "none";
    x.style.display= "block";
    if (localStream) {
        localStream.getTracks().forEach(function (track) {
          track.stop();
        });
    }
    camfacingMode = 'user';
    if(videos){
        var constraints = {
            audio: audios,
            video: {
                facingMode: camfacingMode
            }
        };
    }else{
        var constraints = {
            audio: audios,
            video: videos
        };
    }
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        localStream = stream;

        var vid = document.querySelector(".myVid");
        vid.srcObject = stream;
        vid.addEventListener('loadedmetadata', () => {
            video.play();
        });
        if(myPinnedVid){
            addPinnedVideo(stream,myUserId);
        }
        if(audios&&videos){
            changeStreamWithAudioVideo();
        }else{
            if(audios){
                changeStreamWithAudio();
            }else{
                if(videos){
                    changeStreamWithVideo();
                }
            }
        }
    }).catch(handleError);
    function handleError(error) {
        alert("error "+error)
        console.error('getUserMedia() error: ', error);
    }
}

function onVid(y){
    var x = document.querySelector(".vid");
    y.style.display= "none";
    x.style.display= "block";
    if (localStream) {
        localStream.getTracks().forEach(function (track) {
          track.stop();
        });
    }
    videos = true;
    var constraints = {
        audio: audios,
        video: {
            facingMode: camfacingMode
        }
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        localStream = stream;

        var vid = document.querySelector(".myVid");
        vid.srcObject = stream;
        vid.addEventListener('loadedmetadata', () => {
            video.play();
        });
        if(myPinnedVid){
            addPinnedVideo(stream,myUserId);
        }
        if(audios&&videos){
            changeStreamWithAudioVideo();
        }else{
            if(audios){
                changeStreamWithAudio();
            }else{
                if(videos){
                    changeStreamWithVideo();
                }
            }
        }
    }).catch(handleError);
    function handleError(error) {
        alert("error "+error)
        console.error('getUserMedia() error: ', error);
    }
}
function endCall(){
    window.history.back();
}
function offVid(y){
    var x = document.querySelector(".mvid");
    y.style.display= "none";
    x.style.display= "block";
    if (localStream) {
        localStream.getTracks().forEach(function (track) {
          track.stop();
        });
    }
    videos = false;
    var constraints = {
        audio: audios,
        video: videos
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        localStream = stream;

        var vid = document.querySelector(".myVid");
        vid.srcObject = stream;
        vid.addEventListener('loadedmetadata', () => {
            video.play();
        });
        if(myPinnedVid){
            addPinnedVideo(stream,myUserId);
        }
        if(audios&&videos){
            changeStreamWithAudioVideo();
        }else{
            if(audios){
                changeStreamWithAudio();
            }else{
                if(videos){
                    changeStreamWithVideo();
                }
            }
        }
    }).catch(handleError);
    function handleError(error) {
        //alert("error "+error)
        console.error('getUserMedia() error: ', error);
    }
}

function offMic(y){
    var x = document.querySelector(".mmute");
    y.style.display= "none";
    x.style.display= "block";
    if (localStream) {
        localStream.getTracks().forEach(function (track) {
          track.stop();
        });
    }
    audios = false;
    if(videos){
        var constraints = {
            audio: audios,
            video: {
                facingMode: camfacingMode
            }
        };
    }else{
        var constraints = {
            audio: audios,
            video: videos
        };
    }
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        localStream = stream;

        var vid = document.querySelector(".myVid");
        vid.srcObject = stream;
        vid.addEventListener('loadedmetadata', () => {
            video.play();
        });
        if(myPinnedVid){
            addPinnedVideo(stream,myUserId);
        }
        if(audios&&videos){
            changeStreamWithAudioVideo();
        }else{
            if(audios){
                changeStreamWithAudio();
            }else{
                if(videos){
                    changeStreamWithVideo();
                }
            }
        }
    }).catch(handleError);
    function handleError(error) {
        alert("error "+error)
        console.error('getUserMedia() error: ', error);
    }
}
function onMic(y){
    var x = document.querySelector(".mute");
    y.style.display= "none";
    x.style.display= "block";
    if (localStream) {
        localStream.getTracks().forEach(function (track) {
          track.stop();
        });
    }
    audios = true;
    if(videos){
        var constraints = {
            audio: audios,
            video: {
                facingMode: camfacingMode
            }
        };
    }else{
        var constraints = {
            audio: audios,
            video: videos
        };
    }
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        localStream = stream;

        var vid = document.querySelector(".myVid");
        vid.srcObject = stream;
        vid.addEventListener('loadedmetadata', () => {
            video.play();
        });
        if(myPinnedVid){
            addPinnedVideo(stream,myUserId);
        }
        if(audios&&videos){
            changeStreamWithAudioVideo();
        }else{
            if(audios){
                changeStreamWithAudio();
            }else{
                if(videos){
                    changeStreamWithVideo();
                }
            }
        }
    }).catch(handleError);
    function handleError(error) {
        alert("error "+error)
        console.error('getUserMedia() error: ', error);
    }
}

function changeStreamWithAudioVideo(){
    // let videoTrack = localStream.getVideoTracks()[0];
    // let audioTrack = localStream.getAudioTracks()[0];
    // if(currentPeer!=null){
    //     let senderV = currentPeer.peerConnection.getSenders().find(function (s) {
    //         return s.track.kind == videoTrack.kind;
    //     })
    //     let senderA = currentPeer.peerConnection.getSenders().find(function (s) {
    //         return s.track.kind == audioTrack.kind;
    //     })
    //     senderV.replaceTrack(videoTrack);
    //     senderA.replaceTrack(audioTrack);
    // }
    var videoTrack = localStream.getVideoTracks()[0];
    var audioTrack = localStream.getAudioTracks()[0];
    if(peers){
        for(var userId in peers){
            let senderV = peers[userId].peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            })
            let senderA = peers[userId].peerConnection.getSenders().find(function (s) {
                return s.track.kind == audioTrack.kind;
            })
            senderV.replaceTrack(videoTrack);
            senderA.replaceTrack(audioTrack);
        }
    }
}
function changeStreamWithAudio(){
    let audioTrack = localStream.getAudioTracks()[0];
    if(peers){
        for(var userId in peers){
            let senderA = peers[userId].peerConnection.getSenders().find(function (s) {
                return s.track.kind == audioTrack.kind;
            })
            senderA.replaceTrack(audioTrack);
        }
    }
    // if(currentPeer!=null){
    //     let senderA = currentPeer.peerConnection.getSenders().find(function (s) {
    //         return s.track.kind == audioTrack.kind;
    //     })
    //     senderA.replaceTrack(audioTrack);
    // }
}
function changeStreamWithVideo(){
    let videoTrack = localStream.getVideoTracks()[0];
    if(peers){
        for(var userId in peers){
            let senderV = peers[userId].peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            })
            senderV.replaceTrack(videoTrack);
        }
    }
    // if(currentPeer!=null){
    //     let senderV = currentPeer.peerConnection.getSenders().find(function (s) {
    //         return s.track.kind == videoTrack.kind;
    //     })
    //     senderV.replaceTrack(videoTrack);
    // }
}

function muteThisVid(btn){
    var idEle = btn.parentNode;
    var x = document.querySelector(".mt");
    var xid = idEle.getAttribute("data-item");
    if(xid!=null){
        var vid = document.getElementById(xid);
        if(vid!=null){
            vid.muted = true;
            btn.style.display= "none";
            x.style.display= "block";
        }
    }
}
function unMuteVid(btn){
    var idEle = btn.parentNode;
    var x = document.querySelector(".umt");
    var xid = idEle.getAttribute("data-item");
    if(xid!=null){
        var vid = document.getElementById(xid);
        if(vid!=null){
            vid.muted = false;
            btn.style.display= "none";
            x.style.display= "block";
        }
    }
}