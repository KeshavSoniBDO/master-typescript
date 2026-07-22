// Module 3: Generics - Exercises
// Different scenarios from lesson. Real-world patterns.
// Try to solve without looking at solutions.
// Run: npm run typecheck

// ============================================================================
// EXERCISE 1: Cache with Generic Types
// ============================================================================

// Build a simple generic cache that stores and retrieves values by key.
// Must be type-safe: the value type must match what was stored.

class GenericCache<T> {
  private store: Map<string, T> = new Map();

  // TODO: Implement set and get methods
  // set(key: string, value: T): void
  // get(key: string): T | undefined
  // getOrDefault(key: string, defaultValue: T): T

  set(key: string, value: T): void {
    // TODO
  }

  get(key: string): T | undefined {
    // TODO
    return undefined;
  }

  getOrDefault(key: string, defaultValue: T): T {
    // TODO
    return defaultValue;
  }
}

// Tests (should type-check):
// const stringCache = new GenericCache<string>();
// stringCache.set("name", "Sonik");
// const name: string = stringCache.get("name") ?? "unknown";  // string
//
// const numberCache = new GenericCache<number>();
// numberCache.set("age", 24);
// const age: number = numberCache.get("age") ?? 0;  // number

// ============================================================================
// EXERCISE 2: Event Emitter with Typed Events
// ============================================================================

// Create a generic event handler system.
// Each event type has a specific payload type.

type EventMap = {
  login: { userId: string };
  logout: { userId: string };
  error: { code: number; message: string };
  dataSync: { count: number };
};

// TODO: Create a class EventEmitter<T extends Record<string, any>>
// with methods:
// - on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void
// - emit<K extends keyof T>(event: K, data: T[K]): void
// - once<K extends keyof T>(event: K, handler: (data: T[K]) => void): void

class EventEmitter<T extends Record<string, any>> {
  private handlers: Map<string, Function[]> = new Map();

  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    // TODO: register handler for event K with payload T[K]
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    // TODO: call all handlers for event K with data
  }

  once<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    // TODO: register handler that only runs once
  }
}

// Tests (should type-check):
// type AppEvents = EventMap;
// const emitter = new EventEmitter<AppEvents>();
//
// emitter.on("login", (data) => {
//   data.userId;  // string, type-safe
// });
//
// emitter.on("error", (data) => {
//   data.code;      // number, type-safe
//   data.message;   // string, type-safe
// });
//
// emitter.emit("login", { userId: "user1" });  // OK
// emitter.emit("login", { userId: 123 });      // ERROR: userId must be string

// ============================================================================
// EXERCISE 3: Array-Like Accessor with Generics
// ============================================================================

// Create a wrapper around array-like objects that only allows safe access.
// Users should not be able to access out-of-bounds indices at compile time.

class SafeArray<T> {
  constructor(private items: T[]) {}

  // TODO: Implement:
  // - length property (return number)
  // - get(index: number): T | undefined
  // - map<U>(fn: (item: T) => U): SafeArray<U>
  // - filter(fn: (item: T) => boolean): SafeArray<T>

  get length(): number {
    // TODO
    return 0;
  }

  get(index: number): T | undefined {
    // TODO
    return undefined;
  }

  map<U>(fn: (item: T) => U): SafeArray<U> {
    // TODO
    return new SafeArray([]);
  }

  filter(fn: (item: T) => boolean): SafeArray<T> {
    // TODO
    return new SafeArray([]);
  }
}

// Tests:
// const array = new SafeArray([1, 2, 3, 4, 5]);
// array.length;           // 5
// array.get(0);           // 1 (T = number)
// array.get(10);          // undefined
// array.map(n => n * 2);  // SafeArray<number>
// array.filter(n => n > 2); // SafeArray<number> with [3,4,5]

// ============================================================================
// EXERCISE 4: Builder Pattern with Generics
// ============================================================================

// Implement a generic builder that accumulates properties and returns typed result.
// At each step, the type should reflect what's been set.

interface ConfigOptions {
  host?: string;
  port?: number;
  ssl?: boolean;
  timeout?: number;
}

class ConfigBuilder<T extends Partial<ConfigOptions>> {
  private config: T;

  constructor(initial: T = {} as T) {
    this.config = initial;
  }

  // TODO: Implement:
  // - setHost(host: string): ConfigBuilder<T & { host: string }>
  // - setPort(port: number): ConfigBuilder<T & { port: number }>
  // - setSSL(ssl: boolean): ConfigBuilder<T & { ssl: boolean }>
  // - build(): T

  setHost(host: string): ConfigBuilder<T & { host: string }> {
    // TODO: merge host into config
    return new ConfigBuilder({ ...this.config, host } as T & { host: string });
  }

  setPort(port: number): ConfigBuilder<T & { port: number }> {
    // TODO
    return new ConfigBuilder({ ...this.config, port } as T & { port: number });
  }

  build(): T {
    // TODO
    return this.config;
  }
}

// Tests:
// const config = new ConfigBuilder()
//   .setHost("localhost")
//   .setPort(3000)
//   .build();
//
// config.host;    // "localhost"
// config.port;    // 3000
// config.ssl;     // ERROR: not set (strict type checking)

// ============================================================================
// EXERCISE 5: Transforming Nested Objects
// ============================================================================

// Create a mapper that transforms nested objects keeping structure.
// Input: { id: number; user: { name: string } }
// Output: Transform all strings to uppercase, keep numbers

type RecursiveTransform<T> = T extends string ? string : T extends number ? number : T extends object ? {
  [K in keyof T]: RecursiveTransform<T[K]>;
} : T;

// TODO: Implement a function:
// function transform<T>(obj: T, transformer: (val: any) => any): RecursiveTransform<T>

function transform<T>(obj: T, transformer: (val: any) => any): RecursiveTransform<T> {
  // TODO: recursively apply transformer to all values in obj
  return obj as any;
}

// Tests:
// type User = { id: number; profile: { name: string; bio: string } };
// const user: User = { id: 1, profile: { name: "Sonik", bio: "Developer" } };
//
// const result = transform(user, (v) => {
//   return typeof v === "string" ? v.toUpperCase() : v;
// });
//
// result.id;                  // number
// result.profile.name;        // string (uppercase in runtime)

// ============================================================================
// EXERCISE 6: Plugin System with Generic Registration
// ============================================================================

// Create a plugin registry that enforces type-safe plugin definitions.
// Each plugin has a name and a handler function with specific signature.

interface PluginDefinition<T> {
  name: string;
  handler: (input: T) => string;  // All plugins transform input to string
}

// TODO: Implement PluginRegistry<T>:
// - register<U extends T>(plugin: PluginDefinition<U>): void
// - execute<U extends T>(input: U): string[]  // returns array of all handler results
// - count(): number

class PluginRegistry<T> {
  private plugins: PluginDefinition<T>[] = [];

  register(plugin: PluginDefinition<T>): void {
    // TODO
  }

  execute(input: T): string[] {
    // TODO
    return [];
  }

  count(): number {
    // TODO
    return 0;
  }
}

// Tests:
// const registry = new PluginRegistry<string>();
// registry.register({ name: "uppercase", handler: (s) => s.toUpperCase() });
// registry.register({ name: "reverse", handler: (s) => s.split("").reverse().join("") });
//
// const results = registry.execute("hello");
// results.length;  // 2
// results[0];      // "HELLO"
// results[1];      // "olleh"

// ============================================================================
// EXERCISE 7: Readonly Object Updater
// ============================================================================

// Create a function that safely updates a readonly object,
// returning a new object with the same type.

// TODO: Implement:
// function updateObject<T, K extends keyof T>(
//   obj: readonly T[] | T,
//   updates: Partial<T>
// ): T

function updateObject<T extends object, K extends keyof T>(
  obj: T,
  updates: Partial<T>
): T {
  // TODO: merge updates into obj without mutating
  return { ...obj, ...updates } as T;
}

// Tests:
// const user = { id: "1", name: "Sonik", age: 24 } as const;
// const updated = updateObject(user, { name: "John" });
//
// updated.name;  // "John"
// updated.id;    // "1"
// updated.age;   // 24

// ============================================================================
// EXERCISE 8: Promise All with Type Safety
// ============================================================================

// Create a type-safe wrapper around Promise.all that preserves types.
// Input: [Promise<string>, Promise<number>, Promise<boolean>]
// Output: Promise<[string, number, boolean]>

// TODO: Implement promiseAll<T>:
// function promiseAll<T extends readonly Promise<any>[]>(
//   promises: T
// ): Promise<...>  // What should this resolve to?

function promiseAll<T extends readonly Promise<any>[]>(
  promises: T
): Promise<any[]> {
  // TODO: return Promise.all(promises) with correct types
  return Promise.all(promises);
}

// Tests:
// const p1 = Promise.resolve("hello");
// const p2 = Promise.resolve(42);
// const p3 = Promise.resolve(true);
//
// const result = await promiseAll([p1, p2, p3]);
// result[0];  // string
// result[1];  // number
// result[2];  // boolean

// ============================================================================
// EXERCISE 9: Hard - Type-Safe Dictionary Accumulator
// ============================================================================

// Accumulate values by key, preserving type of each key's values.
// Different keys can have different value types.

type AccumulatorMap = {
  count: number[];
  messages: string[];
  flags: boolean[];
};

// TODO: Implement Accumulator<T>:
// class Accumulator<T extends Record<string, any[]>> {
//   add<K extends keyof T>(key: K, value: T[K][0]): void
//   get<K extends keyof T>(key: K): T[K]
//   getByIndex<K extends keyof T>(key: K, index: number): T[K][0] | undefined
// }

class Accumulator<T extends Record<string, any[]>> {
  private data: Partial<T> = {};

  add<K extends keyof T>(key: K, value: T[K][0]): void {
    // TODO
  }

  get<K extends keyof T>(key: K): T[K] {
    // TODO
    return [] as any;
  }

  getByIndex<K extends keyof T>(key: K, index: number): T[K][0] | undefined {
    // TODO
    return undefined;
  }
}

// Tests:
// const acc = new Accumulator<AccumulatorMap>();
// acc.add("count", 1);
// acc.add("count", 2);
// acc.add("messages", "hello");
// acc.add("messages", "world");
// acc.add("flags", true);
//
// acc.getByIndex("count", 0);      // 1 (number)
// acc.getByIndex("messages", 1);   // "world" (string)
// acc.get("count");                // [1, 2] (number[])

// ============================================================================
// BONUS: Very Hard - Function Argument Validator
// ============================================================================

// Create a generic validator that:
// 1. Takes a function type F
// 2. Takes a validator for each argument
// 3. Returns a new function with same signature but validated

// type ValidatedFunction<F> = ... ?
// function validate<F extends (...args: any[]) => any>(
//   fn: F,
//   validators: Validator<Parameters<F>[number]>[]
// ): F

// Hint: This requires understanding Parameters<F>, ReturnType<F>,
// and reconstructing a function signature from them.

// Bonus: Make the validators type-safe per argument position?

// ============================================================================
// Exports — used by verify/03-generics.test.ts. Leave these in place.
// ============================================================================
export { GenericCache, SafeArray, PluginRegistry, EventEmitter };
