const { test, expect } = require('@playwright/test');
const { login } = require('./helpers');

test.describe('회원 / 인증', () => {
  // TC-001: 정상 로그인
  test('정상 로그인 시 메인 페이지로 이동하고 로그아웃 버튼이 보인다', async ({ page }) => {
    await login(page, 'user');

    await expect(page).toHaveURL('http://localhost:3000/');
    await expect(page.getByText('로그아웃')).toBeVisible();
  });

  // TC-002: 잘못된 비밀번호 로그인
  test('잘못된 비밀번호로 로그인하면 안내 알림이 뜬다', async ({ page }) => {
    await page.goto('/member/login');
    await page.getByPlaceholder('name@email.com').fill('test2@test.com');
    await page.getByPlaceholder('비밀번호 입력').fill('wrong_password');

    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: '로그인', exact: true }).click();
    const dialog = await dialogPromise;

    expect(dialog.message()).toContain('이메일과 패스워드를 다시 확인하세요');
    await dialog.accept();

    // 로그인 실패했으니 여전히 로그인 페이지에 있어야 함
    await expect(page).toHaveURL(/\/member\/login/);
  });
});
