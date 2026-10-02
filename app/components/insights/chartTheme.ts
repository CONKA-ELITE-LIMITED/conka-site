/* ============================================================================
 * Light chart theme shared by the three /app-insights charts (SCRUM-1522).
 * Navy ink on white, the site's sans for labels, a soft rounded tooltip.
 * Animation is recharts' own draw-in, configured per chart, not here.
 * ========================================================================== */

export const NAVY = "#1b2757";
export const NAVY_MUTED = "rgba(27, 39, 87, 0.28)";
export const NAVY_FAINT = "rgba(27, 39, 87, 0.12)";

export const GRID_STROKE = "rgba(0, 0, 0, 0.07)";
export const AXIS_STROKE = "rgba(0, 0, 0, 0.12)";
export const ZERO_LINE_STROKE = "rgba(27, 39, 87, 0.35)";

export const TICK_STYLE = {
  fill: "rgba(0, 0, 0, 0.55)",
  fontSize: 11,
};

export const ZERO_LINE_LABEL_STYLE = {
  fontSize: 10,
  fontWeight: 600,
  fill: "rgba(27, 39, 87, 0.6)",
};

export const TOOLTIP_STYLE = {
  backgroundColor: "#ffffff",
  border: "none",
  borderRadius: 12,
  boxShadow: "0 8px 24px rgb(27 39 87 / 0.14)",
  fontSize: 12,
  color: "rgba(0, 0, 0, 0.8)",
};

export const TOOLTIP_LABEL_STYLE = {
  color: "rgba(0, 0, 0, 0.5)",
  fontSize: 11,
  fontWeight: 600,
  marginBottom: 4,
};

export const TOOLTIP_ITEM_STYLE = { color: NAVY };

/** Small caption above a chart naming its y-axis. */
export const Y_LABEL_CLASS = "mb-2 text-xs font-medium text-black/50";
