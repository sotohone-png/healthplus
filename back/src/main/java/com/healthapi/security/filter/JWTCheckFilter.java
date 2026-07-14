package com.healthapi.security.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.google.gson.Gson;
import com.healthapi.dto.MemberDTO;
import com.healthapi.util.JWTUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter{
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException{
        if(request.getMethod().equals("OPTIONS")){
            return true;
        }

        String path = request.getRequestURI();
        log.info("check uri......................."+path);

        // 회원 관련 경로 제외
        if(path.startsWith("/api/member/")) {
            return true;
        }

        // 상품 관련 경로 제외
        if(path.startsWith("/api/products/list")){
            return true;
        }
        if(path.startsWith("/api/products/search")){
            return true;
        }
        if(path.startsWith("/api/products/view/")){
            return true;
        }
        if(path.startsWith("/api/products/category")){
            return true;
        }
        if(path.matches("/api/products/\\d+$") && request.getMethod().equals("GET")){
            return true;
        }

        // 리뷰 목록 제외
        if(path.startsWith("/api/review/list/")){
            return true;
        }

        // 공지사항 조회 제외 (GET만 - PUT/DELETE는 인증 필요)
        if(path.startsWith("/api/notice/list") && request.getMethod().equals("GET")){
            return true;
        }
        if(path.matches("/api/notice/\\d+$") && request.getMethod().equals("GET")){
            return true;
        }

        // 게시판 조회 제외 (GET만 - PUT/DELETE는 인증 필요)
        if(path.startsWith("/api/board/list") && request.getMethod().equals("GET")){
            return true;
        }
        if(path.matches("/api/board/\\d+$") && request.getMethod().equals("GET")){
            return true;
        }
        if(path.equals("/api/products/") && request.getMethod().equals("POST")){
    return true;
}


        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
    throws ServletException, IOException{

        log.info("------------------------JWTCheckFilter------------------");

        String authHeaderStr = request.getHeader("Authorization");

        try {
            String accessToken = authHeaderStr.substring(7);
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);
            log.info("JWT claims: " + claims);

            String email = (String) claims.get("email");
            String pw = (String) claims.get("pw");
            String nickname = (String) claims.get("nickname");
            Boolean social = (Boolean) claims.get("social");

            Object roleNamesObj = claims.get("roleNames");
            List<String> roleNames = ((List<?>) roleNamesObj).stream()
                    .map(Object::toString)
                    .collect(Collectors.toList());

            log.info("roleNames parsed: " + roleNames);

            MemberDTO memberDTO = new MemberDTO(email, pw, nickname, social.booleanValue(), roleNames);

            log.info("-----------------------------------");
            log.info(memberDTO);
            log.info(memberDTO.getAuthorities());

            UsernamePasswordAuthenticationToken authenticationToken
                = new UsernamePasswordAuthenticationToken(memberDTO, pw, memberDTO.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        } catch(Exception e){
            log.error("JWT Check Error..............");
            log.error(e.getMessage());

            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
            return; // JWT 검증 실패 시 여기서 응답을 끝내고, 필터 체인을 더 이상 진행하지 않음
        }

        // JWT 검증이 끝난 뒤 컨트롤러/서비스에서 발생하는 예외는
        // 이 try-catch에 걸리지 않고 Spring의 정상적인 예외 처리로 흘러가야 하므로
        // filterChain.doFilter는 try 블록 밖으로 뺌
        filterChain.doFilter(request, response);
    }
}