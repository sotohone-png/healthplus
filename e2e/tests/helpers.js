// 여러 테스트에서 반복되는 "로그인" 동작을 함수로 묶어놓은 헬퍼입니다.
// 계정 정보는 실제 테스트 계정에 맞게 필요시 바꿔서 쓰세요.

const ACCOUNTS = {
  user: { email: 'test2@test.com', pw: '1111' },
  manager: { email: 'test@test.com', pw: '1111' },
};

/**
 * @param {import('@playwright/test').Page} page
 * @param {'user' | 'manager'} role
 */
async function login(page, role = 'user') {
  const { email, pw } = ACCOUNTS[role];

  await page.goto('/member/login');
  await page.getByPlaceholder('name@email.com').fill(email);
  await page.getByPlaceholder('비밀번호 입력').fill(pw);

  // alert("로그인 성공") 팝업을 자동으로 확인 처리
  page.once('dialog', (dialog) => dialog.accept());

  await page.getByRole('button', { name: '로그인', exact: true }).click();

  // 로그인 성공 후 메인으로 이동할 때까지 대기
  await page.waitForURL('**/');
}

module.exports = { login, ACCOUNTS };
