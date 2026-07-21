// Module 5: Runtime Boundaries - Gotchas
// Focus: runtime failures that static typing alone cannot prevent.

export {};

// GOTCHA 1: Assertion is not validation
// const user = JSON.parse('{"id":123}') as { id: string };
// user.id.toUpperCase(); // runtime crash

// GOTCHA 2: "object" does not mean object shape
function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

const maybeUser: unknown = { id: "u1" };
if (isObject(maybeUser)) {
  // Still not safe to read maybeUser.id without further checks.
}

// GOTCHA 3: Optional properties hide missing required domain fields
type UserDto = { id?: string; email?: string };
type User = { id: string; email: string };

function toUser(dto: UserDto): User {
  if (!dto.id || !dto.email) {
    throw new Error("invalid dto");
  }
  return { id: dto.id, email: dto.email };
}

// GOTCHA 4: Catch variable is unknown (strict mode)
function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof Error) {
      return { parseError: error.message };
    }
    return { parseError: "unknown parse failure" };
  }
}

// GOTCHA 5: Narrowing too late leaks unsafe values
function unsafeFlow(value: unknown): string {
  // Bad pattern would be casting first, narrowing later.
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return "fallback";
}

// GOTCHA 6: Boundary errors without structure are hard to handle
type BoundaryError =
  | { kind: "network"; message: string }
  | { kind: "validation"; issues: string[] }
  | { kind: "unexpected"; message: string };

function describeError(error: BoundaryError): string {
  switch (error.kind) {
    case "network":
      return `Network: ${error.message}`;
    case "validation":
      return `Validation: ${error.issues.join(", ")}`;
    case "unexpected":
      return `Unexpected: ${error.message}`;
  }
}

// GOTCHA 7: DTO dates are strings, domain dates should be Date
type InvoiceDto = { id: string; issued_at: string };
type Invoice = { id: string; issuedAt: Date };

function mapInvoice(dto: InvoiceDto): Invoice {
  return {
    id: dto.id,
    issuedAt: new Date(dto.issued_at)
  };
}

// GOTCHA 8: Decoder functions should compose
type DecodeResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: string[] };

function decodeString(value: unknown, field: string): DecodeResult<string> {
  if (typeof value === "string") {
    return { ok: true, value };
  }
  return { ok: false, issues: [`${field} must be string`] };
}

// GOTCHA 9: localStorage-like values are always strings (or null)
function readConfig(raw: string | null): DecodeResult<{ retries: number }> {
  if (!raw) return { ok: false, issues: ["missing config"] };
  const parsed = parseJson(raw);
  if (!isObject(parsed)) return { ok: false, issues: ["config must be object"] };

  const record = parsed as Record<string, unknown>;
  if (typeof record["retries"] !== "number") {
    return { ok: false, issues: ["retries must be number"] };
  }

  return { ok: true, value: { retries: record["retries"] } };
}

// GOTCHA 10: "works in tests" can still fail on malformed production payloads
const valid = readConfig('{"retries":3}');
const invalid = readConfig('{"retries":"three"}');

console.log(valid.ok, invalid.ok);
