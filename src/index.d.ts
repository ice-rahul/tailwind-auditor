/**
 * Type definitions for `tailwind-auditor`.
 *
 * The runtime is CommonJS JavaScript; this declaration only adds types for TypeScript
 * consumers and does not require a build step.
 */

/** Configuration shape read from `tailwind-auditor.json`. */
export interface Config {
  /** Maximum inline Tailwind classes allowed on a single element (default 4). */
  maxAllowedInlineClass: number;
  /** Glob patterns of the files to audit. */
  filesToAudit: string[];
  /** Exact class names that never count toward the limit. */
  ignoredClasses: string[];
  /** When set, the findings are also written to this text file. Empty means console-only. */
  reportFile: string;
}

/** Result of {@link loadConfig}. */
export interface LoadConfigResult {
  /** Deep-merged config, always populated with defaults. */
  config: Config;
  /** Resolved absolute path of the config file. */
  configPath: string;
  /** Whether a config file was found on disk. */
  exists: boolean;
}

/** A `class`/`className` attribute found in a source string. */
export interface ClassAttribute {
  /** Whether the attribute was `class` or `className`. */
  attr: 'class' | 'className';
  /** 1-indexed line number in the source. */
  line: number;
  /** Whitespace-separated class tokens, after dropping `${...}` expressions. */
  tokens: string[];
}

/** A single element flagged for exceeding the allowed number of inline classes. */
export interface Violation {
  /** 1-indexed line number of the element. */
  line: number;
  /** Number of counted classes after applying `ignoredClasses`. */
  count: number;
  /** The `maxAllowedInlineClass` limit at the time of the audit. */
  allowed: number;
  /** The class tokens that were counted. */
  tokens: string[];
}

/** The audit result for one file. */
export interface Finding {
  /** The audited file path (as passed to the audit function). */
  file: string;
  /** Elements that exceeded the limit. */
  violations: Violation[];
  /** Populated when the file could not be read. */
  error?: string;
}

/** Result of {@link checkTailwind}. */
export interface PreflightInfo {
  /** Whether `tailwindcss` appears in the project's package.json. */
  usingTailwind: boolean;
  /** Detected tailwind config file name, or `null`. */
  tailwindConfigFile: string | null;
  /** Human-readable warnings, empty when nothing looks wrong. */
  notes: string[];
}

export interface GetAuditFileNamesOptions {
  /** Directory to scan (defaults to `process.cwd()`). */
  baseDir?: string;
  /** Config used to determine which files to audit. */
  config?: Partial<Config>;
}

export interface LoadConfigOptions {
  /** Directory to look for the config in (defaults to `process.cwd()`). */
  baseDir?: string;
  /** Override the config file name (defaults to `tailwind-auditor.json`). */
  configFileName?: string;
}

export function loadConfig(options?: LoadConfigOptions): LoadConfigResult;
export function resolveConfigPath(baseDir?: string, configFileName?: string): string;
export const defaultConfig: Config;
export function getAuditFileNames(options?: GetAuditFileNamesOptions): Promise<string[]>;
export function extractClassAttributes(source: string): ClassAttribute[];
export function effectiveTokens(tokens: string[], ignoredClasses?: string[]): string[];
export function auditFile(filePath: string, config?: Partial<Config>, baseDir?: string): Finding;
export function auditFiles(
  files: string[],
  config?: Partial<Config>,
  baseDir?: string
): Finding[];
export function formatViolation(file: string, violation: Violation): string;
export function formatReport(findings: Finding[]): string;
export function writeReport(findings: Finding[], reportPath: string): string;
export function checkTailwind(baseDir?: string): PreflightInfo;