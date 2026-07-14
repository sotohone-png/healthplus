package com.healthapi.service;

import com.healthapi.domain.Member;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;
import com.healthapi.dto.MemberDTO;
import com.healthapi.dto.MemberJoinDTO;
import com.healthapi.dto.MemberModifyDTO;

@Transactional
public interface MemberService {
    
  MemberDTO getKakaoMember(String accessToken);
  void modifyMember(MemberModifyDTO memberModifyDTO);
  void join(MemberJoinDTO memberJoinDTO);

  default MemberDTO entityToDTO(Member member){
    MemberDTO dto = new MemberDTO(
        member.getEmail(),
        member.getPw(), 
        member.getNickname(), 
        member.isSocial(), 
        member.getMemberRoleList().stream()
        .map(memberRole -> memberRole.name()).collect(Collectors.toList()));
    return dto;
  }
}