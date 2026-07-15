/**
 * Environment Variable Validation
 *
 * This module validates required environment variables at startup
 * to fail fast with clear error messages instead of failing at runtime.
 */

// Required environment variables for core functionality
const requiredEnvVars = [
  "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN",
  "NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN",
] as const;

// Optional environment variables (warn if missing, don't fail)
const optionalEnvVars = [
  "LOOP_API_KEY",
  "SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID",
  "SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID",
  // Notion Blog Hub (SEO Phase 6). Optional: the blog surface degrades to empty
  // if unset rather than breaking the rest of the site.
  "NOTION_TOKEN",
  "NOTION_BLOG_DATABASE_ID",
] as const;

interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Validates that all required environment variables are set.
 * Returns validation result with details about missing variables.
 */
export function validateEnv(): EnvValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check optional variables
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Validates environment variables and throws if critical ones are missing.
 * Call this early in your application lifecycle.
 */
export function assertEnv(): void {
  const result = validateEnv();

  if (!result.isValid) {
    const errorMessage = [
      "Missing required environment variables:",
      ...result.missing.map((v) => `  - ${v}`),
      "",
      "Please ensure these variables are set in your .env.local file or environment.",
    ].join("\n");

    throw new Error(errorMessage);
  }

  // Log warnings for optional missing variables (only in development)
  if (result.warnings.length > 0 && process.env.NODE_ENV === "development") {
    console.warn(
      "Warning: Optional environment variables not configured:",
      result.warnings.join(", "),
    );
  }
}

/**
 * Type-safe access to environment variables.
 * These will be validated at runtime.
 */
export const env = {
  get shopifyStoreDomain(): string {
    const value = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    if (!value)
      throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not configured");
    return value;
  },

  get shopifyStorefrontAccessToken(): string {
    const value = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!value)
      throw new Error(
        "NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured",
      );
    return value;
  },

  get loopApiKey(): string | undefined {
    return process.env.LOOP_API_KEY;
  },

  // Customer Account API (OAuth) configuration
  get customerAccountClientId(): string {
    const value = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
    if (!value)
      throw new Error("SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID is not configured");
    return value;
  },

  get customerAccountShopId(): string {
    const value = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;
    if (!value)
      throw new Error("SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID is not configured");
    return value;
  },

  get customerAccountAuthUrl(): string {
    return `https://shopify.com/authentication/${this.customerAccountShopId}/oauth/authorize`;
  },

  get customerAccountTokenUrl(): string {
    return `https://shopify.com/authentication/${this.customerAccountShopId}/oauth/token`;
  },

  get customerAccountLogoutUrl(): string {
    return `https://shopify.com/authentication/${this.customerAccountShopId}/logout`;
  },

  get customerAccountApiUrl(): string {
    return `https://shopify.com/${this.customerAccountShopId}/account/customer/api/2025-01/graphql`;
  },

  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  },

  get isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  },

  // Klaviyo configuration
  get klaviyoPublicKey(): string | undefined {
    return process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY;
  },

  get klaviyoPrivateKey(): string | undefined {
    return process.env.KLAVIYO_PRIVATE_KEY;
  },

  // Notion Blog Hub (SEO Phase 6). Server-only, read-only. Optional: when either
  // is unset the blog surface degrades to empty rather than throwing.
  get notionToken(): string | undefined {
    return process.env.NOTION_TOKEN;
  },

  get notionBlogDatabaseId(): string | undefined {
    return process.env.NOTION_BLOG_DATABASE_ID;
  },

  get isBlogConfigured(): boolean {
    return Boolean(process.env.NOTION_TOKEN && process.env.NOTION_BLOG_DATABASE_ID);
  },
} as const;
