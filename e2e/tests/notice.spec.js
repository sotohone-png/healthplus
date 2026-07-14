const { test, expect } = require('@playwright/test');
const { login } = require('./helpers');

test.describe('공지사항 - 권한 (BUG-018 회귀)', () => {
  // BUG-018: JWTCheckFilter가 HTTP 메소드를 구분하지 않아
  // PUT/DELETE 요청까지 인증이 스킵되던 버그. 매니저가 실제로
  // 삭제까지 정상적으로 끝까지 완료되는지 E2E로 재검증한다.
  test('매니저는 공지사항을 등록하고 삭제까지 정상적으로 완료할 수 있다', async ({
    page,
  }) => {
    await login(page, 'manager');

    const title = `[E2E 테스트] ${Date.now()}`;

    // 1. 공지사항 등록
    await page.goto('/notice/add');
    await page.getByPlaceholder('제목 입력').fill(title);
    await page.getByPlaceholder('내용 입력').fill('Playwright 자동화 테스트로 생성된 공지입니다.');
    await page.getByRole('button', { name: '등록' }).click();

    await page.waitForURL('**/notice');
    await expect(page.getByText(title)).toBeVisible();

    // 2. 방금 등록한 공지 상세로 진입
    await page.getByText(title).click();
    await expect(page).toHaveURL(/\/notice\/\d+/);

    // 3. 매니저에게는 수정/삭제 버튼이 보여야 함
    await expect(page.getByRole('button', { name: '삭제' })).toBeVisible();

    // 4. 삭제 (BUG-018 수정 전에는 여기서 401/ERROR_ACCESS_TOKEN으로 실패했음)
    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: '삭제' }).click();

    // 5. 목록으로 돌아가고, 삭제한 공지가 더 이상 안 보여야 함
    await page.waitForURL('**/notice');
    await expect(page.getByText(title)).not.toBeVisible();
  });

  // 일반 유저는 애초에 공지 작성/삭제 버튼 자체가 안 보여야 함
  test('일반 유저에게는 공지 작성 버튼이 보이지 않는다', async ({ page }) => {
    await login(page, 'user');
    await page.goto('/notice');

    await expect(page.getByRole('button', { name: '공지 작성' })).toHaveCount(0);
  });
});
