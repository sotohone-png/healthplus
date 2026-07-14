-- CI 환경에서 매번 동일한 테스트 계정/상품을 만들어주는 시드 데이터입니다.
-- 백엔드가 기동되면서 JPA(ddl-auto=update)가 테이블을 먼저 만들어 놓은
-- 뒤에 실행되어야 하므로, 워크플로우에서 "Seed test data" 단계는
-- 반드시 백엔드 기동 확인 이후에 위치합니다.
--
-- 비밀번호는 둘 다 평문 "1111" 이며, 아래는 그 bcrypt 해시값입니다.
-- (실제 서비스 계정이 아니라 로컬/CI 전용 테스트 계정입니다.)

INSERT INTO member (email, pw, nickname, social) VALUES
  ('test2@test.com', '$2a$10$ZsPyoHUPV0byBidbV5LWLO1q8kvvS5OjX.y6y5qn3MWirVEtpHUT.', '테스트유저', false),
  ('test@test.com',  '$2a$10$gVNfFNnIfqsc4e4yyjuLFOSMllHrllydBZCgJtn0FbtpoWu4DNyHW', '관리자 테스트', false);

-- 주의: Member.memberRoleList는 @Enumerated(EnumType.STRING) 없이
-- @ElementCollection만 붙어있어, JPA가 기본값인 EnumType.ORDINAL(정수)로
-- 저장합니다. MemberRole enum 선언 순서(USER=0, MANAGER=1, ADMIN=2)에
-- 맞춰 문자열이 아닌 정수로 넣어야 합니다.
INSERT INTO member_member_role_list (member_email, member_role_list) VALUES
  ('test2@test.com', 0),  -- USER
  ('test@test.com',  0),  -- USER
  ('test@test.com',  1);  -- MANAGER

-- Playwright/Postman 테스트가 pno=1 상품을 기준으로 동작하므로,
-- 빈 DB에 첫 상품으로 등록해 pno가 1이 되도록 합니다.
INSERT INTO tbl_product (pname, pdesc, price, category, del_flag) VALUES
  ('테스트 종합비타민', 'CI 테스트용으로 등록된 상품입니다.', 10000, '비타민', false);