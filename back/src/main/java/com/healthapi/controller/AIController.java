package com.healthapi.controller;

import com.google.gson.Gson;
import com.healthapi.domain.Product;
import com.healthapi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@Log4j2
@RequiredArgsConstructor
@RequestMapping("/api/ai")
public class AIController {

  @Value("${anthropic.api.key}")
  private String apiKey;

  private final ProductRepository productRepository;

  private final OkHttpClient client = new OkHttpClient();
  private final Gson gson = new Gson();

  @PostMapping("/consult")
  public Map<String, String> consult(@org.springframework.web.bind.annotation.RequestBody Map<String, String> request) {
    String userMessage = request.get("message");

    // 판매중인 상품 목록 가져오기
    List<Product> products = productRepository.findAll();
    String productListText = products.stream()
        .filter(p -> !p.isDelFlag())
        .map(p -> String.format("- %s (가격: %d원, 설명: %s)", p.getPname(), p.getPrice(), p.getPdesc()))
        .collect(Collectors.joining("\n"));

        log.info("상품 목록: " + productListText);

    String systemPrompt = "당신은 HealthPlus 건강기능식품 쇼핑몰의 전문 상담사입니다. " +
        "사용자의 건강 고민을 듣고, 아래 [판매중인 상품 목록]에 있는 제품 중에서만 추천해주세요. " +
        "목록에 없는 제품은 절대 추천하지 마세요. " +
        "추천할 때는 반드시 상품명을 정확히 언급하고, 추천 이유를 간단히 설명해주세요. " +
        "답변은 친절하고 간결하게 한국어로 해주세요.\n\n" +
        "[판매중인 상품 목록]\n" + productListText;

    Map<String, Object> body = Map.of(
        "model", "claude-haiku-4-5-20251001",
        "max_tokens", 1024,
        "system", systemPrompt,
        "messages", List.of(Map.of("role", "user", "content", userMessage))
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
        return Map.of("message", "API 오류가 발생했습니다.");
      }

      List<Map<String, Object>> content = (List<Map<String, Object>>) responseMap.get("content");

      if (content == null || content.isEmpty()) {
        return Map.of("message", "AI 응답을 받지 못했습니다.");
      }

      String aiText = (String) content.get(0).get("text");
      return Map.of("message", aiText);

    } catch (Exception e) {
      log.error("AI 상담 오류: " + e.getMessage());
      return Map.of("message", "AI 상담 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }
}