/**
 * Centralised offer constants.
 *
 * Single source of truth for guarantee periods, shipping thresholds,
 * and other offer terms that appear across multiple components.
 * Update here — not in individual components.
 */

import { SUPPORT_EMAIL } from "@/app/lib/supportEmail";

export const GUARANTEE_DAYS = 100;
export const GUARANTEE_LABEL = `${GUARANTEE_DAYS}-Day Guarantee`;
export const GUARANTEE_LABEL_FULL = `${GUARANTEE_DAYS}-day money-back guarantee`;
export const GUARANTEE_COPY_REFUND = `Contact ${SUPPORT_EMAIL} for a full refund within ${GUARANTEE_DAYS} days of your first order`;
export const GUARANTEE_COPY_TRIAL = `Try CONKA for up to ${GUARANTEE_DAYS} days`;
