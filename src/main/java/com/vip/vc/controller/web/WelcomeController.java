package com.vip.vc.controller.web;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WelcomeController {

	@RequestMapping(value = "/meet/{roomId}")
	public String getWelcome(@PathVariable String roomId,Model model) {
		model.addAttribute("roomId", roomId);
		return "/jsp/index.jsp";
	}
	
	@RequestMapping(value = "/")
	public String getCam() {
		return "/jsp/home.jsp";
	}
	@RequestMapping(value = "/camera")
	public String getCame() {
		//return "redirect:/meet/jjssjj";
		return "redirect:/";
	}
	@RequestMapping(value = "/add-user")
	public String addUser(@RequestParam String username,HttpSession session) {
		session.setAttribute("username", username);
		return "/jsp/option.jsp";
	}
	
}
