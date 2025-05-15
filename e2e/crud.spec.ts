import {test, expect, Page} from "@playwright/test";
import {TEST_BASE_URL} from "./global-setup";
import {ModelType} from "../lib/types";

// --- Helpers ---
export async function loginToAdmin(page: Page) {
    await page.goto(`${TEST_BASE_URL}/login`);
    const loginButton = page.getByTestId("admin-login-button");
    await expect(loginButton).toBeVisible({timeout: 10000});
    await loginButton.click();
    await expect(page).toHaveURL(/\/admin$/);
}

export async function navigateToAdminModel(page: Page, model: ModelType) {
    const navButton = page.getByTestId(`admin-nav-${model}`);
    await navButton.click();
    await expect(page).toHaveURL(new RegExp(`/admin/${model}`));
    await expect(page.getByTestId("ag-table")).toBeVisible({timeout: 5000});
}

export async function getRowCount(page: Page): Promise<number> {
    const countText = await page.getByTestId("admin-row-count").textContent();
    return parseInt(countText || "0", 10);
}

export async function assertRowCountIncreasedByOne(page: Page, previousCount: number) {
    const expected = (previousCount + 1).toString();
    await expect(page.getByTestId("admin-row-count")).toHaveText(expected, {timeout: 5000});
}

export async function deleteFirstRowFromModel(page: Page, model: ModelType) {
    await navigateToAdminModel(page, model);
    const rowCountBefore = await getRowCount(page);
    const deleteButtons = page.locator('[data-testid="action-delete-button"]');
    await expect(deleteButtons.first()).toBeVisible();
    await deleteButtons.first().click();
    await page.getByTestId("confirm-delete-button").click();
    await page.waitForLoadState("networkidle");
    const rowCountAfter = await getRowCount(page);
    expect(rowCountAfter).toBe(rowCountBefore - 1);
}

export async function openFirstEditForm(page: Page, model: ModelType) {
    await loginToAdmin(page);
    await navigateToAdminModel(page, model);
    const editButtons = page.locator('[data-testid="action-edit-button"]');
    await expect(editButtons.first()).toBeVisible();
    await editButtons.first().click();
    await expect(page.getByTestId("form-title")).toBeVisible();
}

export async function submitForm(page: Page, model: ModelType) {
    const submitButton = page.getByTestId("form-submit-button");
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    await expect(page).toHaveURL(`${TEST_BASE_URL}/admin/${model}`);
}

export async function fillBasicProductForm(
    page: Page,
    options?: Partial<{
        title: string;
        price: string;
        description: string;
        category: string;
        withImage: boolean;
    }>
) {
    const title = options?.title ?? `product ${Date.now()}`;
    const price = options?.price ?? (Math.random() * 100).toFixed(2);
    const description = options?.description ?? `description ${Date.now()}`;

    await page.getByTestId("form-input-title").locator("input").fill(title);
    await page.getByTestId("form-input-price").locator("input").fill(price);
    await page.getByTestId("form-input-description").locator("textarea").first().fill(description);


    const catInput = page.getByTestId("form-input-category").locator("input");
    await catInput.click();
    await catInput.type(" ");
    await page.waitForSelector('[role="option"]');
    await page.locator('[role="option"]').first().click();

    const checkbox = page.getByTestId("form-input-available").locator('input[type="checkbox"]').first();
    const checked = await checkbox.isChecked();
    await checkbox.setChecked(!checked);

    if (options?.withImage) {
        await page.getByTestId("form-toggle-images").click();
        const imageUrl = page.getByTestId("form-input-images").locator('input[type="text"]').first();
        await imageUrl.fill("https://example.com/test.jpg");
        const imageAlt = page.getByTestId("form-input-images").locator('input[type="text"]').nth(1);
        await imageAlt.fill("Test image");
    }
}

export async function fillBasicCategoryForm(page: Page) {
    const title = `category ${Date.now()}`;
    const pos = Math.floor(Math.random() * 101);

    await page.getByTestId("form-input-title").locator("input").fill(title);
    await page.getByTestId("form-input-position").locator("input").fill(pos.toString());
}

// --- Tests ---

test("view first order details page", async ({page}) => {
    await loginToAdmin(page);
    await navigateToAdminModel(page, ModelType.order);

    const viewButtons = page.locator('[data-testid="action-view-button"]');
    await expect(viewButtons.first()).toBeVisible();
    await viewButtons.first().click();

    await expect(page).toHaveURL(/\/admin\/order\/\d+$/);
    await expect(page.getByTestId("admin-order-detail")).toBeVisible();
});
test("navigate through admin pages and check tables render", async ({page}) => {
    await loginToAdmin(page);
    for (const model of Object.values(ModelType)) {
        await navigateToAdminModel(page, model as ModelType);
    }
});

test("delete first product/category", async ({page}) => {
    await loginToAdmin(page);
    await deleteFirstRowFromModel(page, ModelType.product);
    await deleteFirstRowFromModel(page, ModelType.category);
});

test("edit first category", async ({page}) => {
    await openFirstEditForm(page, ModelType.category);
    await fillBasicCategoryForm(page);

    await submitForm(page, ModelType.category);
});

test("add category and verify count increase", async ({page}) => {
    await loginToAdmin(page);
    await navigateToAdminModel(page, ModelType.category);
    const rowCountBefore = await getRowCount(page);
    await page.getByTestId("add-category-button").click();
    await expect(page).toHaveURL(`${TEST_BASE_URL}/admin/form/${ModelType.category}/add`);
    await expect(page.getByTestId("form-title")).toBeVisible();

    await fillBasicCategoryForm(page);

    await submitForm(page, ModelType.category);
    await assertRowCountIncreasedByOne(page, rowCountBefore);
});

test("edit first product", async ({page}) => {
    await openFirstEditForm(page, ModelType.product);

    await fillBasicProductForm(page);
    await submitForm(page, ModelType.product);
});

test("add product and verify count increase", async ({page}) => {

    await loginToAdmin(page);
    await navigateToAdminModel(page, ModelType.product);
    const rowCountBefore = await getRowCount(page);
    await page.getByTestId("add-product-button").click();
    await expect(page).toHaveURL(`${TEST_BASE_URL}/admin/form/${ModelType.product}/add`);

    await fillBasicProductForm(page, {withImage: true});

    await submitForm(page, ModelType.product);
    await assertRowCountIncreasedByOne(page, rowCountBefore);
});


test("show errors when required product fields are missing", async ({page}) => {
    await loginToAdmin(page);
    await navigateToAdminModel(page, ModelType.product);

    const addButton = page.getByTestId("add-product-button");
    await expect(addButton).toBeVisible();
    await addButton.click();

    await expect(page).toHaveURL(`${TEST_BASE_URL}/admin/form/product/add`);
    const submitButton = page.getByTestId("form-submit-button");


    // Test missing images
    await fillBasicProductForm(page, {withImage: false});
    await submitButton.click();
    await expect(
        page.getByTestId("form-error-message-form.error.required.images")
    ).toBeVisible();

    // Test missing category
    await fillBasicProductForm(page, {withImage: true});
    await page.getByTestId("form-input-category").locator("input").fill("");
    await submitButton.click();
    await expect(
        page.getByTestId("form-error-message-form.error.required.category_id")
    ).toBeVisible();

    const requiredFields: Array<keyof Parameters<typeof fillBasicProductForm>[1]> = ["price", "title", "description",];

    for (const field of requiredFields) {
        await fillBasicProductForm(page, {[field]: "", withImage: true});
        await submitButton.click();
        const errorId = `form-error-message-form.error.required.${field}`;
        await expect(page.getByTestId(errorId)).toBeVisible();
    }


});
test("show error when image has only URL or only altText", async ({page}) => {
    await loginToAdmin(page);
    await navigateToAdminModel(page, ModelType.product);

    const addButton = page.getByTestId("add-product-button");
    await expect(addButton).toBeVisible();
    await addButton.click();

    await expect(page).toHaveURL(`${TEST_BASE_URL}/admin/form/product/add`);

    // -------- Case 1: Only URL, no altText --------
    await fillBasicProductForm(page, {withImage: false});

    await page.getByTestId("form-toggle-images").click();

    const imageUrl = page
        .getByTestId("form-input-images")
        .locator('input[type="text"]')
        .first();
    await imageUrl.fill("https://example.com/incomplete.jpg");

    const submitButton = page.getByTestId("form-submit-button");
    await submitButton.click();

    await expect(
        page.getByTestId("form-error-message-form.error.required.imageFields")
    ).toBeVisible();

    // -------- Case 2: Only altText, no URL --------
    await fillBasicProductForm(page, {withImage: false});

    await page.getByTestId("form-toggle-images").click();

    const imageUrl2 = page
        .getByTestId("form-input-images")
        .locator('input[type="text"]')
        .first();
    await imageUrl2.fill("");

    const imageAlt = page
        .getByTestId("form-input-images")
        .locator('input[type="text"]')
        .nth(1);
    await imageAlt.fill("Only alt text");

    await submitButton.click();

    await expect(
        page.getByTestId("form-error-message-form.error.required.imageFields")
    ).toBeVisible();
});
test("show error when adding category with empty title", async ({page}) => {
    await loginToAdmin(page);
    await navigateToAdminModel(page, ModelType.category);

    const addButton = page.getByTestId("add-category-button");
    await expect(addButton).toBeVisible();
    await addButton.click();

    await expect(page).toHaveURL(`${TEST_BASE_URL}/admin/form/category/add`);

    const positionInput = page.getByTestId("form-input-position").locator("input");
    await positionInput.fill("42");

    const submitButton = page.getByTestId("form-submit-button");
    await submitButton.click();

    await expect(
        page.getByTestId("form-error-message-form.error.required.title"),
    ).toBeVisible();
});