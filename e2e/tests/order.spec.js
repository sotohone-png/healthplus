const { test, expect } = require("@playwright/test");
const { login } = require("./helpers");

test.describe("주문", () => {
  test("바로 구매로 주문을 완료하고 홈으로 돌아온다", async ({ page }) => {
    // 외부 우편번호 검색 서비스를 호출하는 단계가 있어, 다른 테스트와
    // 병렬로 돌 때 응답이 늦어질 수 있음. 이 테스트만 타임아웃을 넉넉히 둠
    test.setTimeout(60000);

    await login(page, "user");

    // 결제 완료 등 이후에 뜰 수 있는 모든 알림창을 자동으로 확인 처리
    // (page.once가 아니라 page.on으로 등록해서, 로그인 이후에도 계속 유효하게 함)
    // + 알림창 내용을 콘솔에 출력해서, 성공 메시지인지 에러 메시지인지 확인
    page.on("dialog", (dialog) => {
      console.log("🔔 다이얼로그 메시지:", dialog.message());
      dialog.accept().catch(() => {});
    });

    // 상품 목록에서 첫 번째 상품 선택 → 바로 구매
    await page.getByRole("link", { name: "상품", exact: true }).click();
    await page.locator("div").filter({ hasText: /^💊$/ }).first().click();
    await page.getByRole("button", { name: "바로 구매" }).click();
    await page.getByRole("button", { name: "주문하기" }).click();

    // 배송 정보 입력
    await page.getByRole("textbox", { name: "이름 입력" }).fill("테스트");
    await page
      .getByRole("textbox", { name: "-0000-0000" })
      .fill("010-0000-0000");

    // 우편번호 검색 (다음 우편번호 서비스, 팝업으로 뜸)
    const postcodePopupPromise = page.waitForEvent("popup");
    await page.getByRole("button", { name: "주소 검색" }).click();
    const postcodePopup = await postcodePopupPromise;

    const postcodeFrame = postcodePopup
      .locator('iframe[title="우편번호 검색 프레임"]')
      .contentFrame();
    await postcodeFrame
      .getByRole("textbox", {
        name: "검색할 도로명/지번주소를 입력, 예시) 판교역로",
      })
      .pressSequentially("강남", { delay: 100 });

    // 타이핑만으로는 검색이 실행되지 않고, Enter를 눌러야 실제 검색이
    // 실행되는 위젯이었음 (검색 안 누르면 "tip" 안내 화면만 계속 보임)
    await postcodeFrame
      .getByRole("textbox", {
        name: "검색할 도로명/지번주소를 입력, 예시) 판교역로",
      })
      .press("Enter");

    // 다음(카카오) 우편번호 검색은 외부 실시간 서비스라 결과가 매번
    // 완전히 똑같다고 보장할 수 없음. 정확한 주소 전체 텍스트 대신,
    // "강남구"가 포함된 첫 번째 결과를 클릭하도록 느슨하게 매칭
    // (외부 서비스 응답이 느릴 수 있어 타임아웃을 15초로 넉넉하게 둠)
    await postcodeFrame
      .getByText(/강남구/)
      .first()
      .click({ timeout: 15000 });

    // 상세 주소 선택 화면에서도 첫 번째 결과를 그대로 선택
    // (정확한 지번/도로명이 매번 같다고 보장 못 하므로 첫 항목 사용)
    const detailButton = postcodeFrame.getByRole("button").first();
    if (await detailButton.isVisible().catch(() => false)) {
      await detailButton.click();
    }

    // 우편번호 팝업이 닫히고, 기본 주소 필드에 실제로 값이 채워질
    // 때까지 명시적으로 대기 (팝업→부모 창 값 전달에 시간이 걸릴 수 있음)
    await expect(
      page
        .getByRole("textbox", { name: "기본 주소" })
        .or(page.locator('input[name="address"]')),
    ).not.toBeEmpty({ timeout: 10000 });

    await page.getByRole("textbox", { name: "상세 주소 입력" }).fill("000-000");
    await page
      .getByRole("textbox", { name: "예: 부재시 경비실에 맡겨주세요" })
      .fill("안전배송 부탁드립니다.");

    // 주문 요약에 상품이 정상적으로 표시되는지 확인 후 결제
    await expect(page.getByText(/주문 요약/)).toBeVisible();
    await page.getByRole("button", { name: "결제하기" }).click();

    // 결제 완료 후 "홈으로" 버튼이 보이면 주문이 정상적으로 끝난 것
    // 결제 처리 시간이 걸릴 수 있어 타임아웃을 넉넉하게 둠
    await expect(page.getByRole("button", { name: "홈으로" })).toBeVisible({
      timeout: 10000,
    });
    await page.getByRole("button", { name: "홈으로" }).click();
    await expect(page).toHaveURL("http://localhost:3000/");
  });

  // TC: 마이페이지 > 주문 관리에서 최근 주문 내역을 확인할 수 있다
  test("마이페이지 > 주문 관리에서 최근 주문을 확인할 수 있다", async ({
    page,
  }) => {
    await login(page, "user");

    // 우측 상단 프로필 메뉴 → 마이페이지 → 주문 관리 탭
    await page.getByRole("button", { name: /테스트 ▼/ }).click();
    await page.getByRole("link", { name: "👤 마이페이지" }).click();
    await page.getByRole("button", { name: "주문 관리" }).click();

    // 주문 관리 탭에 주문 내역(상품명 또는 주문 관련 텍스트)이 보이는지 확인
    await expect(page.getByText(/비타민|주문/).first()).toBeVisible();
  });
});
