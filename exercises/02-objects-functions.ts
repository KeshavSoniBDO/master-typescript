// Module 2: Objects and Functions - Exercises
// Different from lesson examples. Real-world scenarios combining structural typing concepts.
// Run: npm run typecheck

// ============================================================================
// EXERCISE 1: Plugin System - Accept Any Plugin Shape
// ============================================================================

// A plugin system that accepts objects with specific properties
type Plugin = {
  name: string;
  version: string;
  hooks?: {
    onInit?: () => void;
    onLoad?: (data: unknown) => void;
  };
};

// TODO: Write a function registerPlugin<T extends Plugin>(plugin: T): void
// that accepts any object with at least the Plugin shape
// Hint: Function body can just console.log(plugin.name)

function registerPlugin<T extends Plugin>(plugin: T): void {
  // TODO
}

// Test:
// registerPlugin({ name: "auth", version: "1.0" });
// registerPlugin({ name: "logging", version: "2.0", hooks: { onInit: () => {} } });
// registerPlugin({ name: "database", version: "3.0", extra: "field" });  // Should work

// ============================================================================
// EXERCISE 2: Configuration Merger
// ============================================================================

// Merge two configuration objects while preserving types
type BaseConfig = {
  host: string;
  port: number;
};

type ExtendedConfig = BaseConfig & {
  username: string;
  password: string;
};

// TODO: Write mergeConfigs<T extends BaseConfig>(base: T, override: Partial<T>): T
// that merges override into base, keeping the base type
// Hint: Use spread operator or Object.assign

function mergeConfigs<T extends BaseConfig>(base: T, override: Partial<T>): T {
  // TODO: Return merged object with base type preserved
  return base;
}

// Test:
// const db: ExtendedConfig = { host: "localhost", port: 5432, username: "admin", password: "secret" };
// const merged = mergeConfigs(db, { port: 3306 });
// merged should have type ExtendedConfig
// merged.username should still be accessible

// ============================================================================
// EXERCISE 3: Type-Safe Event Handler Registry
// ============================================================================

// Different events have different payload shapes
type EventMap = {
  click: { x: number; y: number };
  submit: { data: Record<string, unknown> };
  error: { message: string };
};

// TODO: Write registerHandler<K extends keyof EventMap>(event: K, handler: (payload: EventMap[K]) => void): void
// that ensures the handler receives the correct payload type for the event

function registerHandler<K extends keyof EventMap>(
  event: K,
  handler: (payload: EventMap[K]) => void
): void {
  // TODO: Just store or call the handler
  console.log(`Registered handler for ${String(event)}`);
}

// Test:
// registerHandler("click", (payload) => {
//   console.log(payload.x, payload.y);  // payload should be typed as { x: number; y: number }
// });
//
// registerHandler("error", (payload) => {
//   console.log(payload.message);  // payload should be typed as { message: string }
// });
//
// registerHandler("click", (payload) => {
//   console.log(payload.message);  // ERROR: click payload has no message
// });

// ============================================================================
// EXERCISE 4: Adapter Pattern - Convert One Shape to Another
// ============================================================================

// External API returns this shape
type ApiUser = {
  user_id: string;
  user_name: string;
  user_email: string;
};

// Our app uses this shape
type AppUser = {
  id: string;
  name: string;
  email: string;
};

// TODO: Write an adapter function adaptUser(apiUser: ApiUser): AppUser
// that converts snake_case API shape to camelCase app shape
// Hint: Manual property mapping: { id: apiUser.user_id, ... }

function adaptUser(apiUser: ApiUser): AppUser {
  // TODO
  return {} as AppUser;
}

// Test:
// const apiData: ApiUser = { user_id: "1", user_name: "Sonik", user_email: "test@example.com" };
// const appData = adaptUser(apiData);
// console.log(appData.name);  // Should work

// ============================================================================
// EXERCISE 5: Conditional Field Requirements
// ============================================================================

// Different user types have different required fields
type BaseUser = {
  id: string;
  email: string;
};

type AdminUser = BaseUser & {
  adminLevel: number;
};

type GuestUser = BaseUser & {
  sessionId: string;
};

type AnyUser = AdminUser | GuestUser;

// TODO: Write validateUser<T extends AnyUser>(user: T): boolean
// that checks if the user has all required fields for their type
// Hint: For AdminUser, check adminLevel; for GuestUser, check sessionId

function validateUser<T extends AnyUser>(user: T): boolean {
  // TODO
  return true;
}

// Test:
// const admin: AdminUser = { id: "1", email: "admin@example.com", adminLevel: 1 };
// const guest: GuestUser = { id: "2", email: "guest@example.com", sessionId: "xyz" };
// console.log(validateUser(admin));   // true
// console.log(validateUser(guest));   // true

// ============================================================================
// EXERCISE 6: Deep Object Update with Type Safety
// ============================================================================

// A settings object with nested properties
type Settings = {
  display: {
    theme: "light" | "dark";
    fontSize: number;
  };
  notifications: {
    email: boolean;
    push: boolean;
  };
};

// TODO: Write updateSetting<
//   K1 extends keyof Settings,
//   K2 extends keyof Settings[K1]
// >(key1: K1, key2: K2, value: Settings[K1][K2]): void
//
// that ensures value type matches the nested field type

function updateSetting<K1 extends keyof Settings, K2 extends keyof Settings[K1]>(
  key1: K1,
  key2: K2,
  value: Settings[K1][K2]
): void {
  // TODO
  console.log(`Updated ${String(key1)}.${String(key2)}`);
}

// Test:
// updateSetting("display", "theme", "dark");       // OK
// updateSetting("display", "fontSize", 16);        // OK
// updateSetting("notifications", "email", true);   // OK
// updateSetting("display", "theme", "invalid");    // ERROR: not "light" | "dark"
// updateSetting("display", "fontSize", "16");      // ERROR: must be number

// ============================================================================
// EXERCISE 7: Readonly Configuration with Safe Mutations
// ============================================================================

// Configuration that should not be directly mutated
type ReadonlyDBConfig = {
  readonly host: string;
  readonly port: number;
  readonly credentials: {
    readonly username: string;
    readonly password: string;
  };
};

// TODO: Write withConfig<T extends ReadonlyDBConfig>(config: T, changes: Partial<Omit<T, "credentials">>): T
// that returns a new config with some fields updated (credentials cannot be changed)
// Hint: Use spread operator to create new object

function withConfig<T extends ReadonlyDBConfig>(
  config: T,
  changes: Partial<Omit<T, "credentials">>
): T {
  // TODO
  return config;
}

// Test:
// const config: ReadonlyDBConfig = {
//   host: "localhost",
//   port: 5432,
//   credentials: { username: "admin", password: "secret" }
// };
// const newConfig = withConfig(config, { host: "prod.example.com", port: 3306 });
// newConfig should have new host/port but same credentials

// ============================================================================
// EXERCISE 8: Hard - API Response Handler
// ============================================================================

// Different API endpoints return different shapes
type ApiResponse<T> =
  | { status: 200; data: T }
  | { status: 400; error: { message: string } }
  | { status: 500; error: { message: string; details: unknown } };

// TODO: Write handleResponse<T>(response: ApiResponse<T>, onSuccess: (data: T) => void, onError: (error: { message: string; details?: unknown }) => void): void
// that calls the correct handler based on status
// The type of error should be different for 400 vs 500

function handleResponse<T>(
  response: ApiResponse<T>,
  onSuccess: (data: T) => void,
  onError: (error: { message: string; details?: unknown }) => void
): void {
  // TODO
  // Hint: Check response.status and call appropriate handler
}

// Test:
// const resp1: ApiResponse<string> = { status: 200, data: "success" };
// handleResponse(resp1, (data) => console.log(data), () => {});
//
// const resp2: ApiResponse<string> = { status: 400, error: { message: "Bad request" } };
// handleResponse(resp2, () => {}, (error) => console.log(error.details));  // ERROR: 400 has no details

// ============================================================================
// EXERCISE 9: Hard - Form Builder with Type-Safe Fields
// ============================================================================

// Form field definitions
type FormField = {
  label: string;
  required: boolean;
};

type TextField = FormField & {
  type: "text";
  maxLength?: number;
};

type NumberField = FormField & {
  type: "number";
  min?: number;
  max?: number;
};

type AnyField = TextField | NumberField;
type FormSchema = Record<string, AnyField>;

// TODO: Write buildForm<S extends FormSchema>(schema: S, onSubmit: (values: ExtractFormValues<S>) => void): void
// where ExtractFormValues extracts TypeScript types from the schema
// This requires a helper type

// First, write the helper type:
// type ExtractFormValues<S extends FormSchema> = {
//   [K in keyof S]: S[K] extends TextField
//     ? string
//     : S[K] extends NumberField
//     ? number
//     : never;
// };

function buildForm<S extends FormSchema>(
  schema: S,
  onSubmit: (values: any) => void  // TODO: Replace 'any' with ExtractFormValues<S>
): void {
  // TODO
  console.log("Form built");
}

// Test:
// const schema = {
//   name: { label: "Name", required: true, type: "text" as const },
//   age: { label: "Age", required: true, type: "number" as const, min: 0, max: 120 }
// };
// buildForm(schema, (values) => {
//   console.log(values.name);  // string
//   console.log(values.age);   // number
// });

// ============================================================================
// EXERCISE 10: Very Hard - Recursive Object Mapper
// ============================================================================

// Map deeply nested objects while preserving structure
type NestedObject = {
  a: number;
  b: {
    c: string;
    d: {
      e: boolean;
    };
  };
};

// TODO: Write mapDeep<T extends object>(obj: T, fn: (value: any) => any): T
// that applies a function to all leaf values while keeping structure
// Hint: Check if value is object, recurse if so, otherwise apply fn

function mapDeep<T extends object>(obj: T, fn: (value: any) => any): T {
  // TODO
  return obj;
}

// Test:
// const nested: NestedObject = { a: 1, b: { c: "x", d: { e: true } } };
// const doubled = mapDeep(nested, (v) => typeof v === "number" ? v * 2 : v);
// doubled.a should be 2
// doubled.b.c should still be "x"

// ============================================================================
// BONUS: Very Hard - Type-Safe Object Merge
// ============================================================================

// Merge two objects and ensure no conflicting types
type Obj1 = {
  x: number;
  y: string;
};

type Obj2 = {
  z: boolean;
  w: number;
};

// TODO: Write safeMerge<T extends object, U extends object>(a: T, b: U): T & U
// TypeScript should automatically create the intersection type

function safeMerge<T extends object, U extends object>(a: T, b: U): T & U {
  // TODO
  return { ...a, ...b } as T & U;
}

// Test:
// const a: Obj1 = { x: 1, y: "hello" };
// const b: Obj2 = { z: true, w: 2 };
// const merged = safeMerge(a, b);
// merged.x, merged.y, merged.z, merged.w should all be accessible
