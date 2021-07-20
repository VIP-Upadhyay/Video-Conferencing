<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video</title>
    <script src="/js/peerjs.min.js"></script>
    <link rel="stylesheet" href="/css/style.css">
    <style>
        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .vlists{
            margin: 5px;
            overflow: auto;
            white-space: nowrap;
            height: 100%;
        }
        .vlists video{
            width: 33.33%;
            height: 100%;
            display: inline-block;
            color: white;
            text-align: center;
        }
    </style>
    <script>
        var userName = "${username}";
        var rid = "${roomId}";
    </script>
</head>
<body>
    <div class="frame">
        <div class="msg_cont">
            <div class="msg_m_cont">
                <div onclick="closeMessage()" class="msg_close"><img src="/img/close.png"></div>
                <div id="log" class="msg_viewer">
                    <div class="msg_list">
                    </div>
                </div>
                <div class="input_send">
                    <textarea id="msg"></textarea>
                    <button onclick="sendMsg()"><img src="/img/send.png"></button>
                </div>
            </div>
        </div>
        <div class="pinvid">
            <video class="pvid" poster="/img/video_open.png"></video>
            <div class="rot">
                <button onclick="changeCamTofrnt(this)" class="frnt"><img  src="/img/front_cam.png"></button>
                <button onclick="changeCamTorear(this)" class="rear" ><img  src="/img/rear_cam.png"></button>
            </div>
            <div class="mtb">
                <button onclick="muteThisVid(this)" class="umt"><img  src="/img/volume_open.png"></button>
                <button onclick="unMuteVid(this)" class="mt"><img  src="/img/volume_close.png"></button>
            </div>
        </div>
        <div class="listvid">
            <div id="video-grid" class="vlists">
            </div>
        </div>
        <div class="btm-ico">
            <div class="img-list">
                <button onclick="endCall()" class="end">
                    <img src="/img/call_end.png" alt="end call">
                </button>
                <button onclick="offVid(this)" class="vid">
                    <img src="/img/video_open.png" alt="end call">
                </button>
                <button onclick="onVid(this)" class="mvid">
                    <img src="/img/video_close.png" alt="end call">
                </button>
                <button onclick="offMic(this)" class="mute">
                    <img src="/img/mic_on.png" alt="end call">
                </button>
                <button onclick="onMic(this)" class="mmute">
                    <img src="/img/mic_off.png" alt="end call">
                </button>
                <button class="msg">
                    <img src="/img/message.png" onclick="getMessageCont()"alt="end call">
                </button>
            </div>
        </div>
    </div>
    <script defer >
        // (function () {
        //     var old = console.log;
        //     var logger = document.getElementById('log');
        //     console.log = function (message) {
        //         if (typeof message == 'object') {
        //             logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        //         } else {
        //             logger.innerHTML += message + '<br />';
        //         }
        //     }
        // })();    
    </script>
    <script src="/js/script.js"  defer>
        
    </script>
</body>
</html>
