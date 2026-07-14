package com.healthapi.service;

import java.util.LinkedHashMap;
import java.util.Optional;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.healthapi.domain.Member;
import com.healthapi.domain.MemberRole;
import com.healthapi.dto.MemberDTO;
import com.healthapi.dto.MemberJoinDTO;
import com.healthapi.dto.MemberModifyDTO;
import com.healthapi.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class MemberServiceImpl implements MemberService {

  private final MemberRepository memberRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void join(MemberJoinDTO memberJoinDTO) {
    Optional<Member> result = memberRepository.findById(memberJoinDTO.getEmail());
    if (result.isPresent()) {
      throw new RuntimeException("이미 사용중인 이메일입니다.");
    }

    Member member = Member.builder()
        .email(memberJoinDTO.getEmail())
        .pw(passwordEncoder.encode(memberJoinDTO.getPw()))
        .nickname(memberJoinDTO.getNickname())
        .social(false)
        .build();

    member.addRole(MemberRole.USER);
    memberRepository.save(member);
    log.info("join member: " + member);
  }

  @Override
  public MemberDTO getKakaoMember(String accessToken) {
    String email = getEmailFromKakaoAccessToken(accessToken);
    log.info("email: " + email);

    Optional<Member> result = memberRepository.findById(email);
    if (result.isPresent()) {
      return entityToDTO(result.get());
    }

    Member socialMember = makeSocialMember(email);
    memberRepository.save(socialMember);
    return entityToDTO(socialMember);
  }

  private String getEmailFromKakaoAccessToken(String accessToken) {
    String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";
    if (accessToken == null) {
      throw new RuntimeException("Access Token is null");
    }
    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.add("Authorization", "Bearer " + accessToken);
    headers.add("Content-Type", "application/x-www-form-urlencoded");
    HttpEntity<String> entity = new HttpEntity<>(headers);
    UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();
    ResponseEntity<LinkedHashMap> response = restTemplate.exchange(
        uriBuilder.toString(), HttpMethod.GET, entity, LinkedHashMap.class);
    log.info(response);
    LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();
    LinkedHashMap<String, String> kakaoAccount = bodyMap.get("kakao_account");
    return kakaoAccount.get("email");
  }

  private String makeTempPassword() {
    StringBuffer buffer = new StringBuffer();
    for (int i = 0; i < 10; i++) {
      buffer.append((char) ((int) (Math.random() * 55) + 65));
    }
    return buffer.toString();
  }

  private Member makeSocialMember(String email) {
    String tempPassword = makeTempPassword();
    log.info("tempPassword: " + tempPassword);
    Member member = Member.builder()
        .email(email)
        .pw(passwordEncoder.encode(tempPassword))
        .nickname("소셜회원")
        .social(true)
        .build();
    member.addRole(MemberRole.USER);
    return member;
  }

  @Override
  public void modifyMember(MemberModifyDTO memberModifyDTO) {
    Optional<Member> result = memberRepository.findById(memberModifyDTO.getEmail());
    Member member = result.orElseThrow();
    member.changePw(passwordEncoder.encode(memberModifyDTO.getPw()));
    member.changeSocial(false);
    member.changeNickname(memberModifyDTO.getNickname());
    memberRepository.save(member);
  }
}