package com.adg.service.ingest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PredictResult {

  int predict;
  double confidence;

  public PredictResult() {
  }

  public int getPredict() {
    return predict;
  }

  public double getConfidence() {
    return confidence;
  }
}