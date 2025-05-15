import {expect, Locator, Page} from "@playwright/test";
import {TEST_BASE_URL} from "./global-setup";

// ---shop
export async function fillCheckoutForm(
    page: Page,
    data: {
        name: string;
        email: string;
        phone: string;
        agree: boolean;
    },
) {
    await page.getByTestId("checkout-input-name").fill(data.name);
    await page.getByTestId("checkout-input-email").fill(data.email);
    await page.getByTestId("checkout-input-phone").fill(data.phone);
    if (data.agree) {
        await page.getByTestId("checkout-agree").check();
    }
}

export async function clickFirstAvailableProduct(page: Page) {
    const productCards = page.locator('[data-testid="product-list"] a');
    const count = await productCards.count();

    for (let i = 0; i < count; i++) {
        const productLink = productCards.nth(i);
        await productLink.click();
        await expect(page).toHaveURL(/\/product\//);

        const addToCart = page.getByTestId("add-to-cart-button");
        if (await isAddToCartEnabled(addToCart)) {
            await addToCart.click();
            return;
        }

        await page.goBack();
        await page.waitForSelector('[data-testid="product-list"]');
    }

    throw new Error("❌ No available product found to add to cart");
}

export async function findFirstAvailableProductUrl(
    page: Page,
    startIndex = 0,
): Promise<string> {
    const productLinks = page.locator('[data-testid="product-list"] a');
    const count = await productLinks.count();

    for (let i = startIndex; i < count; i++) {
        const link = productLinks.nth(i);
        const href = await link.getAttribute("href");
        if (!href) continue;

        await link.click();
        await expect(page).toHaveURL(/\/product\//);

        const addToCart = page.getByTestId("add-to-cart-button");
        if (await isAddToCartEnabled(addToCart)) {
            return href;
        }

        await page.goBack();
        await page.waitForSelector('[data-testid="product-list"]');
    }

    throw new Error("❌ No available product found");
}

export async function isAddToCartEnabled(button: ReturnType<Page["getByTestId"]>) {
    const visible = await button.isVisible().catch(() => false);
    const enabled = await button.isEnabled().catch(() => false);
    return visible && enabled;
}

export async function addProductToCart(page: Page, productUrl: string, closeCart = true) {
    const button = page.getByTestId("add-to-cart-button");
    if (await isAddToCartEnabled(button)) {
        await button.click();
        if (closeCart) {
            await page.getByTestId("close-cart-button").click();
        }
    } else {
        throw new Error(`🚫 Add-to-cart not available for ${productUrl}`);
    }
}

export async function checkoutAfterAddingProducts(page: Page) {
    await page.goto(`${TEST_BASE_URL}/`);
    await page.waitForSelector('[data-testid="product-list"]');

    const firstUrl = await findFirstAvailableProductUrl(page);
    await addProductToCart(page, firstUrl, true);

    await page.getByTestId("site-logo").click();
    await page.waitForSelector('[data-testid="product-list"]');

    const secondUrl = await findFirstAvailableProductUrl(page);
    await addProductToCart(page, secondUrl, false);

    await page.waitForSelector("[data-testid='cart']");
    await page.getByTestId("cart-checkout-desktop").locator("button").click();

    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByTestId("checkout-page")).toBeVisible();
}

//--home

export async function gotoHomeAndWait(page: Page) {
    await page.goto(`${TEST_BASE_URL}/`);
    await page.waitForSelector("main");
}

export function getByTestIdsOr(page: Page, ids: string[]): Locator {
    return ids
        .map((id) => page.getByTestId(id))
        .reduce((acc, curr) => acc.or(curr));
}