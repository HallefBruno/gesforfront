package com.gesforfront.controller;

import com.gesforfront.entity.FlashUrl;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller("/")
public class IndexController {

    @Autowired
    private FlashUrl flashUrlFront;
    
    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView pageIndex() {
        return new ModelAndView("Index.html");
    }
    
    @ResponseBody
    @GetMapping(path = {"urlAtual"})
    public String getUrls(HttpServletRequest request) {
        return request.getRequestURL().toString();
    }
    
    @ResponseBody
    @GetMapping(path = {"urls"})
    public FlashUrl getUrls() {
        return flashUrlFront;
    }

}
