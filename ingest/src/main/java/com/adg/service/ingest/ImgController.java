package com.adg.service.ingest;

// import java.util.Date;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class ImgController {

  public static final String URL_PREDICT = "http://svc-predict:5000/predict";
  public static final String URL_TRACK = "http://svc-track:8889/storePredict";
  public static final String URL_STORE = "http://svc-store:8892/storeImg";

  @PostMapping("/img")
  public ImgResult img(@RequestBody() byte[] imgBytes) throws JSONException {

    // Send the byte[] to prediction service
    PredictResult predictResult = getPrediction(imgBytes);

    // Send the prediction to track service
    TrackResult trackResult = storePrediction(predictResult);

    // TODO: Send the file to the file storage service
    StoreFileResult storeFileResult = storeFile(imgBytes, predictResult);

    // Combine info into single payload
    ImgResult imgResult = new ImgResult(predictResult, trackResult, storeFileResult);

    return imgResult;
  }

  private PredictResult getPrediction(byte[] imgBytes) {
    RestTemplate restTemplate = new RestTemplate();

    // Create the request object
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.IMAGE_JPEG);
    HttpEntity<byte[]> entity = new HttpEntity<byte[]>(imgBytes, headers);

    // Call the endpoint
    PredictResult predictResult = restTemplate.postForObject(URL_PREDICT, entity, PredictResult.class);
    return predictResult;
  }


  private TrackResult storePrediction(PredictResult predictResult) throws JSONException {
    RestTemplate restTemplate = new RestTemplate();

    // Create the JSON
    JSONObject trackRequest = new JSONObject();
    trackRequest.put("predict", predictResult.getPredict());
    trackRequest.put("confidence", predictResult.getConfidence());
    
    // Create the request object
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    HttpEntity<String> entity = new HttpEntity<String>(trackRequest.toString(), headers);
    
    // Call the endpoint
    TrackResult trackResult = restTemplate.postForObject(URL_TRACK, entity, TrackResult.class);
    return trackResult;

  }

  private StoreFileResult storeFile(byte[] imgBytes, PredictResult predictResult) {
    RestTemplate restTemplate = new RestTemplate();

    // Create the filename
    // Date date = new Date();
    // String filename = "rpi-" + date.getTime() + "-" + predictResult.getPredict() + ".jpg";
    // int size = imgBytes.length;

    // // TODO: Store the file
    // StoreFileResult storeFileResult = new StoreFileResult(filename, size);
    // return storeFileResult;
    
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.IMAGE_JPEG);
    HttpEntity<byte[]> entity = new HttpEntity<byte[]>(imgBytes, headers);

    // Call the endpoint
    String url = URL_STORE + "/" + predictResult.getPredict();
    StoreFileResult storeFileResult = restTemplate.postForObject(url, entity, StoreFileResult.class);
    return storeFileResult;
  }
}