package com.adg.service.ingest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class StoreFileResult {

  String filename;
  int size;

  public StoreFileResult(String filename, int size) {
    this.filename = filename;
    this.size = size;
  }

  public StoreFileResult() {
    
  }

  public String getFilename() {
    return filename;
  }

  public int getSize() {
    return size;
  }
}