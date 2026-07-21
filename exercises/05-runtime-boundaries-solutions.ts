// Module 5: Runtime Boundaries - Solutions

export {};

type DecodeResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function decodeString(value: unknown, field: string): DecodeResult<string> {
  if (typeof value === "string") {
    return { ok: true, value };
  }
  return { ok: false, issues: [`${field} must be string`] };
}

function decodeNumber(value: unknown, field: string): DecodeResult<number> {
  if (typeof value === "number" && Number.isFinite(value)) {
    return { ok: true, value };
  }
  return { ok: false, issues: [`${field} must be a finite number`] };
}

type UserDto = { user_id: string; user_email: string; active: boolean };
type User = { id: string; email: string; isActive: boolean };

function decodeUserDto(value: unknown): DecodeResult<UserDto> {
  if (!isRecord(value)) {
    return { ok: false, issues: ["user must be object"] };
  }

  const id = decodeString(value["user_id"], "user_id");
  const email = decodeString(value["user_email"], "user_email");
  const active = value["active"];

  const issues: string[] = [];
  if (!id.ok) issues.push(...id.issues);
  if (!email.ok) issues.push(...email.issues);
  if (typeof active !== "boolean") issues.push("active must be boolean");

  if (issues.length > 0 || !id.ok || !email.ok || typeof active !== "boolean") {
    return { ok: false, issues };
  }

  return {
    ok: true,
    value: {
      user_id: id.value,
      user_email: email.value,
      active
    }
  };
}

function mapUser(dto: UserDto): User {
  return {
    id: dto.user_id,
    email: dto.user_email,
    isActive: dto.active
  };
}

function decodeUser(value: unknown): DecodeResult<User> {
  const dtoResult = decodeUserDto(value);
  if (!dtoResult.ok) return dtoResult;
  return { ok: true, value: mapUser(dtoResult.value) };
}

function decodeUsersList(value: unknown): DecodeResult<User[]> {
  if (!Array.isArray(value)) {
    return { ok: false, issues: ["payload must be array"] };
  }

  const users: User[] = [];
  const issues: string[] = [];

  value.forEach((item, index) => {
    const decoded = decodeUser(item);
    if (decoded.ok) {
      users.push(decoded.value);
    } else {
      for (const issue of decoded.issues) {
        issues.push(`index ${index}: ${issue}`);
      }
    }
  });

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, value: users };
}

function assertUser(value: unknown): asserts value is User {
  const decoded = decodeUser(value);
  if (!decoded.ok) {
    throw new Error(`Invalid user: ${decoded.issues.join(", ")}`);
  }
}

function parseStoredProfile(raw: string | null): DecodeResult<User> {
  if (!raw) return { ok: false, issues: ["missing profile"] };

  try {
    const parsed: unknown = JSON.parse(raw);
    return decodeUser(parsed);
  } catch {
    return { ok: false, issues: ["invalid JSON"] };
  }
}

type BoundaryError =
  | { kind: "network"; message: string }
  | { kind: "parse"; message: string }
  | { kind: "validation"; issues: string[] };

function toBoundaryError(error: unknown): BoundaryError {
  if (error instanceof Error) {
    return { kind: "parse", message: error.message };
  }

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    if (record["kind"] === "network" && typeof record["message"] === "string") {
      return { kind: "network", message: record["message"] };
    }
  }

  return { kind: "parse", message: "Unknown boundary error" };
}

function decodePositiveIntParam(value: string | null, field: string): DecodeResult<number> {
  if (value === null) return { ok: false, issues: [`${field} is required`] };
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return { ok: false, issues: [`${field} must be a positive integer`] };
  }
  return { ok: true, value: parsed };
}

type Decoder<T> = (value: unknown) => DecodeResult<T>;
type DecoderShape = Record<string, Decoder<unknown>>;

type InferDecoded<TShape extends DecoderShape> = {
  [K in keyof TShape]: TShape[K] extends Decoder<infer V> ? V : never;
};

function decodeObject<TShape extends DecoderShape>(
  value: unknown,
  shape: TShape
): DecodeResult<InferDecoded<TShape>> {
  if (!isRecord(value)) {
    return { ok: false, issues: ["object expected"] };
  }

  const output: Partial<InferDecoded<TShape>> = {};
  const issues: string[] = [];

  for (const key of Object.keys(shape) as (keyof TShape)[]) {
    const decoder = shape[key]!;
    const decoded = decoder(value[key as string]);
    if (decoded.ok) {
      output[key] = decoded.value as InferDecoded<TShape>[typeof key];
    } else {
      for (const issue of decoded.issues) {
        issues.push(`${String(key)}: ${issue}`);
      }
    }
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, value: output as InferDecoded<TShape> };
}

const demo = decodeObject(
  { id: "u1", retries: 3 },
  {
    id: (value) => decodeString(value, "id"),
    retries: (value) => decodeNumber(value, "retries")
  }
);

console.log(demo.ok);
