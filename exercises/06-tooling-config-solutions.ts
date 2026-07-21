// Module 6: Tooling and Configuration - Solutions

export {};

type StrictPolicy = {
  strict: boolean;
  noUncheckedIndexedAccess: boolean;
  exactOptionalPropertyTypes: boolean;
  useUnknownInCatchVariables: boolean;
};

function isPolicyStrictEnough(policy: StrictPolicy): boolean {
  return (
    policy.strict &&
    policy.noUncheckedIndexedAccess &&
    policy.exactOptionalPropertyTypes &&
    policy.useUnknownInCatchVariables
  );
}

function hasRequiredCompilerKeys(value: unknown): value is { compilerOptions: Record<string, unknown> } {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  if (typeof record["compilerOptions"] !== "object" || record["compilerOptions"] === null) return false;
  return true;
}

function normalizeInclude(entries: string[]): string[] {
  const cleaned = entries.map((e) => e.trim()).filter((e) => e.length > 0);
  return Array.from(new Set(cleaned));
}

function countDangerousSuppressions(source: string): number {
  const matches = source.match(/@ts-ignore/g);
  return matches ? matches.length : 0;
}

type GateResult =
  | { ok: true; checks: string[] }
  | { ok: false; checks: string[]; failures: string[] };

function evaluateGate(checks: Array<{ name: string; passed: boolean }>): GateResult {
  const names = checks.map((c) => c.name);
  const failures = checks.filter((c) => !c.passed).map((c) => c.name);

  if (failures.length === 0) {
    return { ok: true, checks: names };
  }

  return { ok: false, checks: names, failures };
}

function readMapValue<T>(map: Record<string, T>, key: string, fallback: T): T {
  const value = map[key];
  return value === undefined ? fallback : value;
}

type EnvSpec = {
  NODE_ENV: "development" | "test" | "production";
  API_URL: string;
  RETRIES: number;
};

function readEnv(source: Record<string, string | undefined>): EnvSpec {
  const nodeEnvRaw = source["NODE_ENV"];
  const apiUrl = source["API_URL"];
  const retriesRaw = source["RETRIES"];

  const validEnv: EnvSpec["NODE_ENV"][] = ["development", "test", "production"];

  if (!nodeEnvRaw || !validEnv.includes(nodeEnvRaw as EnvSpec["NODE_ENV"])) {
    throw new Error("NODE_ENV must be development/test/production");
  }

  if (!apiUrl || apiUrl.trim().length === 0) {
    throw new Error("API_URL is required");
  }

  const retries = Number(retriesRaw);
  if (!Number.isInteger(retries) || retries < 0) {
    throw new Error("RETRIES must be a non-negative integer");
  }

  return {
    NODE_ENV: nodeEnvRaw as EnvSpec["NODE_ENV"],
    API_URL: apiUrl,
    RETRIES: retries
  };
}

type ResolutionIssue =
  | { kind: "missing-file"; importPath: string }
  | { kind: "exports-mismatch"; packageName: string }
  | { kind: "extension-mismatch"; importPath: string };

function summarizeResolutionIssues(issues: ResolutionIssue[]): string[] {
  return issues.map((issue) => {
    switch (issue.kind) {
      case "missing-file":
        return `Missing file for import: ${issue.importPath}`;
      case "exports-mismatch":
        return `Package exports mismatch: ${issue.packageName}`;
      case "extension-mismatch":
        return `Extension mismatch in import: ${issue.importPath}`;
    }
  });
}

type FileRisk = { path: string; risk: "high" | "medium" | "low"; errorCount: number };

function planMigration(files: FileRisk[]): { immediate: FileRisk[]; later: FileRisk[] } {
  const immediate = files.filter((f) => f.risk === "high" || f.errorCount >= 10);
  const later = files.filter((f) => !immediate.includes(f));

  immediate.sort((a, b) => b.errorCount - a.errorCount);
  later.sort((a, b) => b.errorCount - a.errorCount);

  return { immediate, later };
}

type RuleLevel = "off" | "warn" | "error";
type RulePolicy = Record<string, RuleLevel>;

function upgradePolicy(policy: RulePolicy, rulesToError: string[]): RulePolicy {
  const next: RulePolicy = { ...policy };
  for (const rule of rulesToError) {
    next[rule] = "error";
  }
  return next;
}

console.log(isPolicyStrictEnough({
  strict: true,
  noUncheckedIndexedAccess: true,
  exactOptionalPropertyTypes: true,
  useUnknownInCatchVariables: true
}));
