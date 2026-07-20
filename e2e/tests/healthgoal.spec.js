const { test, expect } = require("@playwright/test");
const { login } = require("./helpers");

test.describe("건강 목표", () => {
  test("건강 목표를 추가하면 목록에 즉시 반영된다", async ({ page }) => {
    await login(page, "user");

    const goalTitle = `E2E 테스트 목표 ${Date.now()}`;

    // 프로필 메뉴 → 건강 목표 페이지로 이동
    await page.getByRole("button", { name: /테스트 ▼/ }).click();
    await page.getByRole("link", { name: "🎯 건강 목표" }).click();

    // 목표 추가
    await page.getByRole("button", { name: "목표 추가" }).click();
    await page
      .getByRole("textbox", { name: "예: 매일 오메가3 먹기" })
      .fill(goalTitle);
    await page.locator('input[name="dueDate"]').fill("2026-07-27");
    await page.getByRole("button", { name: "추가" }).click();

    // 목표를 추가하면 마이페이지의 "내 프로필" 탭으로 자동 이동하기 때문에,
    // 방금 추가한 목표를 보려면 "건강 관리" 탭을 직접 클릭해야 함
    await page.getByRole("button", { name: "건강 관리" }).click();

    // 추가한 목표가 목록에 바로 보이는지 확인
    await expect(page.getByText(goalTitle)).toBeVisible();
  });
});
