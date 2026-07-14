package com.healthapi.service;

import com.google.gson.Gson;
import lombok.extern.log4j.Log4j2;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Log4j2
public class AIService {

  @Value("${anthropic.api.key}")
  private String apiKey;

  private final OkHttpClient client = new OkHttpClient();
  private final Gson gson = new Gson();

  public String generateProductDescription(String pname, String pdesc, String category) {
    String prompt = String.format(
        "다음 건강기능식품에 대해 분석해주세요.\n\n" +
        "상품명: %s\n" +
        "카테고리: %s\n" +
        "상품설명: %s\n\n" +
        "아래 형식으로 분석해주세요:\n" +
        "✅ 주요 효능\n" +
        "👥 이런 분께 추천해요\n" +
        "⚠️ 복용 시 주의사항\n\n" +
        "각 항목은 2-3줄로 간결하게 작성해주세요.",
        pname, category != null ? category : "기타", pdesc
    );

    Map<String, Object> body = Map.of(
        "model", "claude-haiku-4-5-20251001",
        "max_tokens", 1024,
        "messages", List.of(Map.of("role", "user", "content", prompt))
    );

    String jsonBody = gson.toJson(body);

    RequestBody requestBody = RequestBody.create(
        jsonBody,
        MediaType.parse("application/json")
    );

    Request httpRequest = new Request.Builder()
        .url("https://api.anthropic.com/v1/messages")
        .addHeader("x-api-key", apiKey)
        .addHeader("anthropic-version", "2023-06-01")
        .addHeader("content-type", "application/json")
        .post(requestBody)
        .build();

    try {
      Response response = client.newCall(httpRequest).execute();
      String responseBody = response.body().string();
      log.info("AI response: " + responseBody);

      Map<String, Object> responseMap = gson.fromJson(responseBody, Map.class);

      if (responseMap.containsKey("error")) {
        log.error("API 오류: " + responseMap.get("error"));
        return null;
      }

      List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");
      if (content == null || content.isEmpty()) {
        return null;
      }

      return (String) content.get(0).get("text");

    } catch (Exception e) {
      log.error("AI 설명 생성 오류: " + e.getMessage());
      return null;
    }
  }
}