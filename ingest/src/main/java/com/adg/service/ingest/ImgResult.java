package com.adg.service.ingest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ImgResult {

  String result;
  int predict;
  double confidence;
  String filename;
  int size;

  public ImgResult(PredictResult predictResult, TrackResult trackResult, StoreFileResult storeFileResult) {
    this.result = trackResult.getResult();
    this.predict = predictResult.getPredict();
    this.confidence = predictResult.getConfidence();
    this.filename = storeFileResult.getFilename();
    this.size = storeFileResult.getSize();
  }

  public String getResult() {
    return result;
  }

  public int getPredict() {
    return predict;
  }

  public double getConfidence() {
    return confidence;
  }

  public String getFilename() {
    return filename;
  }

  public int getSize() {
    return size;
  }
}