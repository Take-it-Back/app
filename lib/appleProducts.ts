export const APPLE_PRODUCTS = {
  monthly: process.env.NEXT_PUBLIC_APPLE_PRODUCT_MONTHLY || "app.takeitback.premium.monthly",
  yearly: process.env.NEXT_PUBLIC_APPLE_PRODUCT_YEARLY || "app.takeitback.premium.yearly",
};
/** Consumable: unlocks one case for 60 days. */
export const APPLE_CASE_PASS = process.env.NEXT_PUBLIC_APPLE_PRODUCT_CASE_PASS || "app.takeitback.casepass";
/** Google Play: one subscription with base plans "monthly" and "yearly", and a consumable case pass. */
export const GOOGLE_PREMIUM = process.env.NEXT_PUBLIC_GOOGLE_PRODUCT_PREMIUM || "app.takeitback.premium";
export const GOOGLE_CASE_PASS = process.env.NEXT_PUBLIC_GOOGLE_PRODUCT_CASE_PASS || "app.takeitback.casepass";
