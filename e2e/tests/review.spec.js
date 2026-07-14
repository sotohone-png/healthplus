const { test, expect } = require('@playwright/test');
const { login } = require('./helpers');

const TEST_PNO = 1;

test.describe('리뷰', () => {
  const reviewContent = `E2E 테스트 리뷰 ${Date.now()}`;

  // TC-011: 리뷰 작성
  test('본인 계정으로 리뷰를 작성하면 목록에 즉시 반영된다', async ({ page }) => {
    await login(page, 'user');
    await page.goto(`/products/read/${TEST_PNO}`);

    await page.getByPlaceholder('상품 사용 후기를 작성해주세요...').fill(reviewContent);
    await page.getByRole('button', { name: '리뷰 등록' }).click();

    await expect(page.getByText(reviewContent)).toBeVisible();
  });

  // TC-012: 타인 리뷰 삭제 불가 (BUG-021과 연결되는 UI 레벨 검증)
  test('다른 계정으로 보면 방금 쓴 리뷰에 삭제 버튼이 안 보인다', async ({ page }) => {
    await login(page, 'manager');
    await page.goto(`/products/read/${TEST_PNO}`);

    const reviewCard = page
      .locator('div', { hasText: reviewContent })
      .filter({ hasText: reviewContent })
      .last();

    await expect(reviewCard).toBeVisible();
    await expect(reviewCard.getByRole('button', { name: '삭제' })).toHaveCount(0);
  });

  // TC-013: 본인 리뷰 삭제
  test('본인 리뷰는 삭제 버튼을 눌러 즉시 삭제할 수 있다', async ({ page }) => {
    await login(page, 'user');
    await page.goto(`/products/read/${TEST_PNO}`);

    page.once('dialog', (dialog) => dialog.accept());

    const reviewCard = page.locator('div', { hasText: reviewContent }).last();
    await reviewCard.getByRole('button', { name: '삭제' }).click();

    await expect(page.getByText(reviewContent)).not.toBeVisible();
  });
});
