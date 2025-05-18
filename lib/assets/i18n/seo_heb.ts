import { SITE_NAME } from "../../config";

export const metadata_site_title = `${SITE_NAME} - מקום לצמוח`;
export const metadata_site_description =
  "צמחים ושתילים מרהיבים – הכל באהבה ובמבחר משתנה";

export const metadata_keywords = [
  "עציצים",
  "צמחים",
  "צמחי בית",
  "קדרון",
  "מקום לצמוח",
  "שתילים",
  SITE_NAME ?? "המשתלה החברתית",
];

export function getCategoryTitle(
  categoryTitle: string,
  query?: string,
): string {
  return query
    ? `תוצאות חיפוש עבור "${query}" בקטגוריית ${categoryTitle} | ${SITE_NAME}`
    : `${categoryTitle} | ${SITE_NAME}`;
}

export function getCategoryDescription(
  categoryTitle: string,
  query?: string,
): string {
  return query
    ? `מוצרים תואמים ל"${query}" בקטגוריית ${categoryTitle}`
    : `קטגוריית ${categoryTitle} - מבחר מוצרים ייחודיים`;
}
