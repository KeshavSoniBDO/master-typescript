// Module 1: Foundations - New Exercises Solutions

export {};

interface Validator<T> {
  validate(data: unknown): { ok: true; value: T } | { ok: false; reason: string };
}

type User = { id: string; name: string; email: string };

class UserValidator implements Validator<User> {
  validate(data: unknown): { ok: true; value: User } | { ok: false; reason: string } {
    if (typeof data !== "object" || data === null) {
      return { ok: false, reason: "User must be an object" };
    }

    const record = data as Record<string, unknown>;
    if (typeof record["id"] !== "string") return { ok: false, reason: "id must be string" };
    if (typeof record["name"] !== "string") return { ok: false, reason: "name must be string" };
    if (typeof record["email"] !== "string") return { ok: false, reason: "email must be string" };

    return {
      ok: true,
      value: {
        id: record["id"],
        name: record["name"],
        email: record["email"]
      }
    };
  }
}

type ClickEvent = { type: "click"; x: number; y: number };
type SubmitEvent = { type: "submit"; formData: Record<string, unknown> };
type TimerEvent = { type: "timer"; duration: number };
type AppEvent = ClickEvent | SubmitEvent | TimerEvent;

function handleEvent(event: AppEvent): void {
  switch (event.type) {
    case "click":
      console.log(`Clicked at (${event.x}, ${event.y})`);
      break;
    case "submit":
      console.log(`Submit fields: ${Object.keys(event.formData).join(", ")}`);
      break;
    case "timer":
      console.log(`Timer duration: ${event.duration}`);
      break;
  }
}

function getEventData(event: AppEvent): unknown {
  switch (event.type) {
    case "click":
      return { x: event.x, y: event.y };
    case "submit":
      return event.formData;
    case "timer":
      return event.duration;
  }
}

function getEventType(event: AppEvent): string {
  return event.type;
}

function isError(value: unknown): value is Error {
  return value instanceof Error;
}

function isApiError(value: unknown): value is { code: number; message: string } {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record["code"] === "number" && typeof record["message"] === "string";
}

function handleError(error: unknown): void {
  if (isError(error)) {
    console.error(`Error: ${error.message}`);
    return;
  }

  if (isApiError(error)) {
    console.error(`API ${error.code}: ${error.message}`);
    return;
  }

  console.error("Unknown error");
}

function parseConfig(configString: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(configString);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
}

type Response<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function handleResponse<T>(response: Response<T>): string {
  if (response.status === "loading") {
    return "Loading...";
  }

  if (response.status === "success") {
    return String(response.data);
  }

  return response.error;
}

function fetchUserFromExternalAPI(): unknown {
  return { id: "1", name: "Sonik", email: "sonik@example.com" };
}

type UserForWrapping = { id: string; name: string; email: string };

function getTypedUser(): UserForWrapping {
  const validator = new UserValidator();
  const raw = fetchUserFromExternalAPI();
  const validated = validator.validate(raw);
  if (!validated.ok) {
    throw new Error(validated.reason);
  }
  return validated.value;
}

type AppConfig = {
  readonly apiUrl: string;
  readonly timeout: number;
  readonly retries: number;
};

function createAppConfig(config: AppConfig): AppConfig {
  return Object.freeze({ ...config });
}

function processInput(value: unknown): string {
  if (typeof value === "string") return value.toUpperCase();
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "yes" : "no";
  return "unsupported type";
}

function assertNever(value: never): never {
  throw new Error(`Unreachable code reached: ${String(value)}`);
}

type Animal = "dog" | "cat" | "bird";

function greet(animal: Animal): string {
  if (animal === "dog") return "Woof";
  if (animal === "cat") return "Meow";
  if (animal === "bird") return "Tweet";
  return assertNever(animal);
}

function getPath(obj: unknown, path: string): unknown {
  if (typeof obj !== "object" || obj === null) return undefined;
  const parts = path.split(".").filter((p) => p.length > 0);

  let current: unknown = obj;

  for (const part of parts) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function inferSchema(obj: unknown): Record<string, string> {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = Array.isArray(value) ? "array" : typeof value;
  }
  return result;
}

console.log(
  getEventType({ type: "click", x: 1, y: 2 }),
  handleResponse({ status: "success", data: 42 }),
  processInput(true),
  greet("dog"),
  createAppConfig({ apiUrl: "x", timeout: 1000, retries: 2 }).apiUrl,
  getPath({ user: { profile: { name: "A" } } }, "user.profile.name"),
  inferSchema({ id: "1", age: 24, active: true })["active"],
  getTypedUser().id
);
