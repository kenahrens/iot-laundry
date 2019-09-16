package com.adg.service.ingest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TrackResult {

  String result;

  public TrackResult() {
  }

  public String getResult() {
    return result;
  }
}