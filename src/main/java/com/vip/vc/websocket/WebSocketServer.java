package com.vip.vc.websocket;



import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.CloseReason.CloseCodes;
import javax.websocket.server.ServerEndpoint;

import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.vip.vc.model.Message;



@Component
@ServerEndpoint(value = "/vc")
public class WebSocketServer {
	
	

	@OnOpen
	public void onOpen(Session session) {
		System.out.println(session.getId());
	}
	
	@OnClose
    public void onClose(Session session,CloseReason closeReason) {
		System.out.println("colse "+session.getId());
    	String roomId = (String) session.getUserProperties().get("roomId");
    	String userId = (String)session.getUserProperties().get("userId");
    	session.getUserProperties().remove("roomId", roomId);
    	session.getUserProperties().remove("userId", userId);
    	Message message = new Message();
    	message.setType("disconnect");
    	message.setRoomId(roomId);
    	message.setUserId(userId);
    	sendMessage(session, message);
   }

	@OnMessage
	public void onMessage(Session session,String message) {
		Gson gson = new Gson();
		Message messages = gson.fromJson(message, Message.class);
		if (messages.getType().equals("join-room")) {
			session.getUserProperties().put("roomId", messages.getRoomId());
			session.getUserProperties().put("userId", messages.getUserId());
			session.getUserProperties().put("username", messages.getUsername());
			sendMessage(session, messages);
		}else {
			if(messages.getType().equals("message")) {
				sendMessage(session, messages);
			}
		}
	}
	
	public void sendMessage(Session session,Message message) {
		try { 
			for (Session s : session.getOpenSessions()) {
				if(s.isOpen() && message.getRoomId().equals(s.getUserProperties().get("roomId"))) {
					Gson gson = new Gson();
					s.getBasicRemote().sendText(gson.toJson(message));
				}
			}
		} catch (Exception e) {
			// TODO: handle exception 
			e.printStackTrace(); 
		}
	}
	

	@OnError
    public void onError(Session session, Throwable error) {
    	System.out.println("Error Occured");
        error.printStackTrace();
    }
    
    public void closeSession(Session session,String reason) {
    	try {
    		session.close(new CloseReason(CloseCodes.NORMAL_CLOSURE, reason));
		} catch (Exception e) {
			System.out.println("error in the close");
			e.printStackTrace();
		}
    }
  
}

