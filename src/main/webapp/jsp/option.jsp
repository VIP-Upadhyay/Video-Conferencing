<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="/css/home.css">
</head>
<body>
    <div class="n_room">
        <div class="nm_room">
            <div onclick="closeNM()" class="nm_close"><img src="/img/close.png"></div>
            <div class="n_room_cont">
                <div class="rnmsg">Enter new room name</div>
                <input type="text" name="room" id="nroomname">
                <button onclick="joinNewRoom()">Create</button>
            </div>
        </div>
    </div>
    <div class="j_room">
        <div class="jm_room">
            <div onclick="closeJM()" class="jm_close"><img src="/img/close.png"></div>
            <div class="j_room_cont">
                <div class="rjmsg">Enter room name</div>
                <input type="text" name="room" id="jroomname">
                <button onclick="joinRoom()">Join</button>
            </div>
        </div>
    </div>
    <div class="userCon">
        <div class="logo">
            <img src="/img/video_open.png">
        </div>
        <div class="uname">Username: ${username}</div>
        <button onclick="newMeet()" id="newmeet">Create a new meet</button>
        <button onclick="joinMeet()">Join Meeting</button>
    </div>
    <script>
       function newMeet(){
           var x = document.querySelector(".n_room");
           x.style.transform='translateY(0)';
       } 
       function closeNM(){
           var x = document.querySelector(".n_room");
           x.style.transform='translateY(-100%)';
       } 
       function joinMeet(){
           var x = document.querySelector(".j_room");
           x.style.transform='translateY(0)';
       } 
       function closeJM(){
           var x = document.querySelector(".j_room");
           x.style.transform='translateY(100%)';
       } 
       function joinRoom(){
            var x = document.querySelector("#jroomname")
            location.href = "/meet/"+x.value;
       }
       function joinNewRoom(){
            var x = document.querySelector("#nroomname")
            location.href = "/meet/"+x.value;
       }
    </script>
</body>
</html>