// Module 2: Objects and Functions - Exercise Solutions
// Full implementations with deep explanations
// Run: npm run typecheck

// ============================================================================
// EXERCISE 1 SOLUTION: Plugin System
// ============================================================================

type Plugin = {
  name: string;
  version: string;
  hooks?: {
    onInit?: () => void;
    onLoad?: (data: unknown) => void;
  };
};

function registerPlugin<T extends Plugin>(plugin: T): void {
  console.log(`✓ Registered plugin: ${plugin.name} (v${plugin.version})`);
  if (plugin.hooks?.onInit) {
    plugin.hooks.onInit();
  }
}

// TEST
registerPlugin({ name: "auth", version: "1.0" });
registerPlugin({ name: "logging", version: "2.0", hooks: { onInit: () => console.log("Logging started") } });
registerPlugin({
  name: "database",
  version: "3.0",
  hooks: { onLoad: (data: unknown) => console.log("DB loaded") },
  // extra fields are allowed due to structural typing
  author: "team"
} as any);

// KEY LEARNING: The generic T extends Plugin captures the full object type,
// preserving extra properties. The function is flexible but type-safe.

// ============================================================================
// EXERCISE 2 SOLUTION: Configuration Merger
// ============================================================================

type BaseConfig = {
  host: string;
  port: number;
};

type ExtendedConfig = BaseConfig & {
  username: string;
  password: string;
};

function mergeConfigs<T extends BaseConfig>(base: T, override: Partial<T>): T {
  return { ...base, ...override } as T;
}

// TEST
const db: ExtendedConfig = {
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "secret"
};
const mergedEx2 = mergeConfigs(db, { port: 3306 });
console.log("✓ Merged config:", mergedEx2.host, mergedEx2.port);
console.log("✓ Extended type preserved:", mergedEx2.username, mergedEx2.password);

// KEY LEARNING: Using Partial<T> allows partial updates while preserving
// the original type T. The spread operator creates a new object.

// ============================================================================
// EXERCISE 3 SOLUTION: Type-Safe Event Handler Registry
// ============================================================================

type EventMap = {
  click: { x: number; y: number };
  submit: { data: Record<string, unknown> };
  error: { message: string };
};

const handlers: Record<string, Set<Function>> = {};

function registerHandler<K extends keyof EventMap>(
  event: K,
  handler: (payload: EventMap[K]) => void
): void {
  if (!handlers[event as string]) {
    handlers[event as string] = new Set();
  }
  const handlerSet = handlers[event as string];
  if (handlerSet) {
    handlerSet.add(handler);
  }
  console.log(`✓ Registered handler for ${String(event)}`);
}

function emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
  handlers[event as string]?.forEach((handler) => handler(payload));
}

// TEST
registerHandler("click", (payload) => {
  console.log(`✓ Click at (${payload.x}, ${payload.y})`);
});

registerHandler("error", (payload) => {
  console.log(`✓ Error: ${payload.message}`);
});

// Calling emit:
emit("click", { x: 100, y: 200 });
emit("error", { message: "Something went wrong" });

// KEY LEARNING: keyof EventMap and EventMap[K] create a type-safe mapping.
// The handler receives exactly the payload shape for that event.

// ============================================================================
// EXERCISE 4 SOLUTION: Adapter Pattern
// ============================================================================

type ApiUser = {
  user_id: string;
  user_name: string;
  user_email: string;
};

type AppUser = {
  id: string;
  name: string;
  email: string;
};

function adaptUser(apiUser: ApiUser): AppUser {
  return {
    id: apiUser.user_id,
    name: apiUser.user_name,
    email: apiUser.user_email
  };
}

// TEST
const apiData: ApiUser = { user_id: "1", user_name: "Sonik", user_email: "test@example.com" };
const appData = adaptUser(apiData);
console.log("✓ Adapted user:", appData.name, appData.email);

// KEY LEARNING: Adapters bridge incompatible shapes. Structural typing
// doesn't help here—we need explicit mapping.

// ============================================================================
// EXERCISE 5 SOLUTION: Conditional Field Requirements
// ============================================================================

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

function validateUser<T extends AnyUser>(user: T): boolean {
  // Check for AdminUser:
  if ("adminLevel" in user) {
    return typeof (user as AdminUser).adminLevel === "number";
  }
  // Check for GuestUser:
  if ("sessionId" in user) {
    return typeof (user as GuestUser).sessionId === "string";
  }
  return false;
}

// TEST
const admin: AdminUser = { id: "1", email: "admin@example.com", adminLevel: 1 };
const guest: GuestUser = { id: "2", email: "guest@example.com", sessionId: "xyz" };
console.log("✓ Validated admin:", validateUser(admin));
console.log("✓ Validated guest:", validateUser(guest));

// KEY LEARNING: Discriminated unions or presence checking (using 'in')
// allow runtime narrowing of union types.

// ============================================================================
// EXERCISE 6 SOLUTION: Deep Object Update with Type Safety
// ============================================================================

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

const settings: Settings = {
  display: { theme: "light", fontSize: 14 },
  notifications: { email: true, push: false }
};

function updateSetting<K1 extends keyof Settings, K2 extends keyof Settings[K1]>(
  key1: K1,
  key2: K2,
  value: Settings[K1][K2]
): void {
  (settings[key1][key2] as any) = value;
  console.log(`✓ Updated ${String(key1)}.${String(key2)} = ${value}`);
}

// TEST
updateSetting("display", "theme", "dark");
updateSetting("display", "fontSize", 16);
updateSetting("notifications", "email", false);

// KEY LEARNING: Nested keyof constraints ensure type safety two levels deep.
// Settings[K1] gets the nested object, Settings[K1][K2] gets the leaf value type.

// ============================================================================
// EXERCISE 7 SOLUTION: Readonly Configuration with Safe Mutations
// ============================================================================

type ReadonlyDBConfig = {
  readonly host: string;
  readonly port: number;
  readonly credentials: {
    readonly username: string;
    readonly password: string;
  };
};

function withConfig<T extends ReadonlyDBConfig>(
  config: T,
  changes: Partial<Omit<T, "credentials">>
): T {
  return { ...config, ...changes } as T;
}

// TEST
const config: ReadonlyDBConfig = {
  host: "localhost",
  port: 5432,
  credentials: { username: "admin", password: "secret" }
};

const newConfig = withConfig(config, { host: "prod.example.com", port: 3306 });
console.log("✓ New config:", newConfig.host, newConfig.port);
console.log("✓ Credentials preserved:", newConfig.credentials.password);

// KEY LEARNING: Omit<T, "credentials"> removes a field from the type,
// making it impossible to accidentally override credentials.

// ============================================================================
// EXERCISE 8 SOLUTION: API Response Handler
// ============================================================================

type ApiResponse<T> =
  | { status: 200; data: T }
  | { status: 400; error: { message: string } }
  | { status: 500; error: { message: string; details: unknown } };

function handleResponse<T>(
  response: ApiResponse<T>,
  onSuccess: (data: T) => void,
  onError: (error: { message: string; details?: unknown }) => void
): void {
  if (response.status === 200) {
    onSuccess(response.data);
  } else {
    onError(response.error);
  }
}

// TEST
const resp1: ApiResponse<string> = { status: 200, data: "success" };
handleResponse(
  resp1,
  (data) => console.log("✓ Success:", data),
  () => {}
);

const resp2: ApiResponse<string> = { status: 400, error: { message: "Bad request" } };
handleResponse(resp2, () => {}, (error) => console.log("✓ 400 Error:", error.message));

const resp3: ApiResponse<string> = { status: 500, error: { message: "Server error", details: "DB connection lost" } };
handleResponse(resp3, () => {}, (error) => console.log("✓ 500 Error:", error.details));

// KEY LEARNING: Discriminated unions allow TypeScript to narrow the
// error type based on status. 400 has different structure than 500.

// ============================================================================
// EXERCISE 9 SOLUTION: Form Builder with Type-Safe Fields
// ============================================================================

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

type ExtractFormValues<S extends FormSchema> = {
  [K in keyof S]: S[K] extends TextField
    ? string
    : S[K] extends NumberField
    ? number
    : never;
};

function buildForm<S extends FormSchema>(
  schema: S,
  onSubmit: (values: ExtractFormValues<S>) => void
): void {
  console.log("✓ Form built with fields:", Object.keys(schema).join(", "));
  
  // Simulate form submission:
  const values = {} as ExtractFormValues<S>;
  for (const key in schema) {
    const field = schema[key];
    if (field && field.type === "text") {
      (values as any)[key] = "sample";
    } else if (field && field.type === "number") {
      (values as any)[key] = 42;
    }
  }
  onSubmit(values);
}

// TEST
const schema = {
  name: { label: "Name", required: true, type: "text" as const },
  age: { label: "Age", required: true, type: "number" as const, min: 0, max: 120 }
};

buildForm(schema, (values) => {
  console.log("✓ Form submitted:", values.name, values.age);
  console.log("✓ name is string:", typeof values.name === "string");
  console.log("✓ age is number:", typeof values.age === "number");
});

// KEY LEARNING: Mapped types transform the schema into a TypeScript type.
// The form's onSubmit callback is now type-safe—it knows which fields exist and their types.

// ============================================================================
// EXERCISE 10 SOLUTION: Recursive Object Mapper
// ============================================================================

type NestedObject = {
  a: number;
  b: {
    c: string;
    d: {
      e: boolean;
    };
  };
};

function mapDeep<T extends object>(obj: T, fn: (value: any) => any): T {
  const result = {} as T;
  
  for (const key in obj) {
    const value = obj[key];
    
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively map nested objects
      (result as any)[key] = mapDeep(value, fn);
    } else {
      // Apply function to leaf values
      (result as any)[key] = fn(value);
    }
  }
  
  return result;
}

// TEST
const nested: NestedObject = { a: 1, b: { c: "x", d: { e: true } } };
const doubled = mapDeep(nested, (v) => {
  if (typeof v === "number") return v * 2;
  return v;
});

console.log("✓ Doubled nested.a:", doubled.a);
console.log("✓ Preserved nested.b.c:", doubled.b.c);
console.log("✓ Preserved nested.b.d.e:", doubled.b.d.e);

// KEY LEARNING: Recursive generic functions handle deeply nested structures.
// The function preserves type structure while transforming values.

// ============================================================================
// BONUS SOLUTION: Type-Safe Object Merge
// ============================================================================

type Obj1 = {
  x: number;
  y: string;
};

type Obj2 = {
  z: boolean;
  w: number;
};

function safeMerge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b } as T & U;
}

// TEST
const a: Obj1 = { x: 1, y: "hello" };
const b: Obj2 = { z: true, w: 2 };
const mergedEx = safeMerge(a, b);

console.log("✓ Merged object:", (mergedEx as any).x, (mergedEx as any).y, (mergedEx as any).z, (mergedEx as any).w);
console.log("✓ Type is intersection T & U");

// KEY LEARNING: The intersection T & U automatically includes all properties
// from both types. TypeScript's type system ensures no conflicts.
