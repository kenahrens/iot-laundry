package com.adg.service.ingest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {

  @RequestMapping("/")
  public Greeting greeting() {
    return new Greeting();
  }
}