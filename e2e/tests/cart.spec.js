const { test, expect } = require('@playwright/test');
const { login } = require('./helpers');

// 테스트에 사용할 상품 번호 (실제 DB에 존재하는 pno로 바꿔서 사용하세요)
const TEST_PNO = 1;

test.describe('장바구니', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'user');
  });

  // TC-006: 장바구니 담기
  test('상품 상세에서 장바구니 담기 클릭 시 정상적으로 담긴다', async ({ page }) => {
    await page.goto(`/products/read/${TEST_PNO}`);

    // 이미 담겨있는 상품이면 뜨는 "이미 추가된 상품입니다" 확인창까지 자동 승인
    page.on('dialog', (dialog) => dialog.accept());

    await page.getByRole('button', { name: '장바구니 담기' }).click();

    await expect(page).toHaveURL(/\/cart/);
  });

  // BUG-017 회귀: 장바구니에서 상품 삭제 시 cino 포함하여 정상 삭제되는지 확인
  test('장바구니에서 상품 삭제 시 목록에서 정상적으로 사라진다 (BUG-017 회귀)', async ({
    page,
  }) => {
    // 담아두기 (이미 있으면 확인창 자동 승인)
    page.on('dialog', (dialog) => dialog.accept());
    await page.goto(`/products/read/${TEST_PNO}`);
    await page.getByRole('button', { name: '장바구니 담기' }).click();

    await page.waitForURL(/\/cart/);

    // 장바구니 데이터는 페이지 이동 후 비동기로 로드되므로,
    // 삭제 버튼(✕)이 실제로 나타날 때까지 기다림
    await expect(page.locator('text=✕').first()).toBeVisible();

    // 삭제 전 장바구니에 아이템이 있는지 확인
    const itemCountBefore = await page.locator('text=✕').count();
    expect(itemCountBefore).toBeGreaterThan(0);

    // 첫 번째 상품 삭제 (다이얼로그는 위에서 이미 자동 승인 처리됨)
    await page.locator('text=✕').first().click();

    // 삭제 후 목록에서 사라졌는지 확인 (아이템 개수가 하나 줄어야 함)
    await expect(async () => {
      const itemCountAfter = await page.locator('text=✕').count();
      expect(itemCountAfter).toBe(itemCountBefore - 1);
    }).toPass();
  });
});
