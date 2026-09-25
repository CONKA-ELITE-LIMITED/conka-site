/**
 * Portable web cognition test. Nothing under engine/ imports from outside it,
 * so the folder (plus public/cognica/) can be lifted into a package as is.
 */
export { default as CognitiveTestEngine } from "./CognitiveTestEngine";
export type { CognitiveTestEngineProps, EngineResult, EngineTheme } from "./types";
