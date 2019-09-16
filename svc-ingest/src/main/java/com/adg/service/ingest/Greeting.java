package com.adg.service.ingest;

import java.util.Date;

public class Greeting {
  private final Date date;

  public Greeting() {
    this.date = new Date();
  }

  public Date getDate() {
    return date;
  }
}