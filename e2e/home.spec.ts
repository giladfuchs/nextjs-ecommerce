import { test, expect } from "@playwright/test";
import { TEST_BASE_URL } from "./global-setup";

test("homepage renders category list and product grid", async ({ page }) => {
    await page.goto(`${TEST_BASE_URL}/`);

    await page.waitForSelector("main");
    await page.waitForSelector('[data-testid="product-list"], [data-testid="no-products"]', {
        timeout: 10000,
    });

    const productList = page.locator('[data-testid="product-list"]');
    const noProducts = page.locator('[data-testid="no-products"]');
    await expect(productList.or(noProducts)).toBeVisible();

    const navList = page.getByTestId("category-nav");
    await expect(navList).toBeVisible();

    const images = page.locator("img");
    await expect(images.first()).toBeVisible();
});

test("navigate to second visible category dynamically and verify products or no-products", async ({ page }) => {
    await page.goto(`${TEST_BASE_URL}/`);
    await page.waitForSelector("main");

    const categoryLinks = page.locator('[data-testid="category-link"]');
    await expect(categoryLinks.first()).toBeVisible();
    await categoryLinks.nth(1).click();

    await page.waitForLoadState("networkidle");

    const productList = page.locator('[data-testid="product-list"]');
    const noProducts = page.locator('[data-testid="no-products"]');

    await Promise.race([
        expect(productList).toBeVisible({ timeout: 5000 }),
        expect(noProducts).toBeVisible({ timeout: 5000 }),
    ]);
});

test("navigate to product page from grid and verify product title matches", async ({ page }) => {
    await page.goto(`${TEST_BASE_URL}/`);

    const productList = page.locator('[data-testid="product-list"]');
    await productList.first().waitFor({ state: "visible", timeout: 7000 });

    const firstProductCard = productList.locator('[data-testid="product-card-title"]').first();
    const expectedTitle = (await firstProductCard.textContent())?.trim();

    const firstProductLink = productList.locator("a").first();
    await firstProductLink.click();

    await page.waitForLoadState("networkidle");

    const productTitle = page.getByTestId("product-title");
    await expect(productTitle).toBeVisible({ timeout: 7000 });
    await expect(productTitle).toHaveText(expectedTitle || "");
});

test("navigate to product page and add item to cart", async ({ page }) => {
    await page.goto(`${TEST_BASE_URL}/`);

    await page.waitForSelector('[data-testid="product-list"]', { timeout: 7000 });

    const productList = page.locator('[data-testid="product-list"]');
    const firstProduct = productList.locator("a").first();
    await firstProduct.click();

    const productTitle = page.getByTestId("product-title");
    await expect(productTitle).toBeVisible();

    const addToCartButton = page.getByTestId("add-to-cart-button");
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    const cartModal = page.locator("[data-testid='cart'], #cart-modal, .cart-badge");
    await expect(cartModal.first()).toBeVisible({ timeout: 5000 });
});