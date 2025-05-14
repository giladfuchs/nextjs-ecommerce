import { test, expect, Page } from "@playwright/test";
import { TEST_BASE_URL } from "./global-setup";

const getProductLink = (page: Page, index: number) =>
  page.locator('[data-testid="product-list"] a').nth(index);

const fillCheckoutForm = async (
  page: Page,
  data: {
    name: string;
    email: string;
    phone: string;
    agree: boolean;
  },
) => {
  await page.getByTestId("checkout-input-name").fill(data.name);
  await page.getByTestId("checkout-input-email").fill(data.email);
  await page.getByTestId("checkout-input-phone").fill(data.phone);
  if (data.agree) await page.getByTestId("checkout-agree").check();
};

async function addTwoProductsAndProceedToCheckout(page: Page) {
  await page.goto(`${TEST_BASE_URL}/`);
  await page.waitForSelector('[data-testid="product-list"]');

  await getProductLink(page, 1).click();
  await page.getByTestId("add-to-cart-button").click();
  await page.getByLabel("Close cart").click();

  await page.getByTestId("site-logo").click();

  await getProductLink(page, 2).click();
  await page.getByTestId("add-to-cart-button").click();
  await page.waitForSelector("[data-testid='cart']");

  await page.getByTestId("cart-checkout-desktop").locator("button").click();

  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByTestId("checkout-page")).toBeVisible();
}

test("add product to cart and update quantity", async ({ page }) => {
  await page.goto(`${TEST_BASE_URL}/`);
  await page.waitForSelector('[data-testid="product-list"]');

  await getProductLink(page, 0).click();
  await page.getByTestId("add-to-cart-button").click();

  const cart = page.locator("[data-testid='cart']");
  await expect(cart).toBeVisible();

  const plus = cart.getByTestId("cart-qty-plus");
  const minus = cart.getByTestId("cart-qty-minus");
  const qty = cart.getByTestId("cart-item-qty");

  await plus.click();
  await plus.click();
  await minus.click();

  await expect(qty).toHaveText("2");
});

test("complete checkout after adding products", async ({ page }) => {
  await addTwoProductsAndProceedToCheckout(page);

  await fillCheckoutForm(page, {
    name: "name",
    email: "name@example.com",
    phone: "0520000000",
    agree: true,
  });

  await page.getByTestId("checkout-submit").click();
  await expect(page.getByTestId("checkout-success")).toBeVisible();
});

test("show validation errors when required checkout fields are missing", async ({
  page,
}) => {
  await addTwoProductsAndProceedToCheckout(page);
  await page.getByTestId("checkout-submit").click();

  await expect(page.getByTestId("checkout-error-name")).toBeVisible();
  await expect(page.getByTestId("checkout-error-email")).toBeVisible();
  await expect(page.getByTestId("checkout-error-phone")).toBeVisible();
  await expect(page.getByTestId("checkout-error-agreed")).toBeVisible();
});
