// Module 3: Generics - New Exercises Solutions

export {};

class GenericCache<T> {
  private store: Map<string, T> = new Map();

  set(key: string, value: T): void {
    this.store.set(key, value);
  }

  get(key: string): T | undefined {
    return this.store.get(key);
  }

  getOrDefault(key: string, defaultValue: T): T {
    return this.store.get(key) ?? defaultValue;
  }
}

type EventMap = {
  login: { userId: string };
  logout: { userId: string };
  error: { code: number; message: string };
  dataSync: { count: number };
};

class EventEmitter<T extends Record<string, any>> {
  private handlers: Map<string, Array<(data: any) => void>> = new Map();

  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    const key = String(event);
    const list = this.handlers.get(key) ?? [];
    list.push(handler as (data: any) => void);
    this.handlers.set(key, list);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const list = this.handlers.get(String(event)) ?? [];
    for (const handler of list) {
      handler(data);
    }
  }

  once<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    const wrapper = (data: T[K]) => {
      this.off(event, wrapper);
      handler(data);
    };
    this.on(event, wrapper);
  }

  private off<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
    const key = String(event);
    const list = this.handlers.get(key);
    if (!list) return;
    this.handlers.set(
      key,
      list.filter((h) => h !== (handler as (data: any) => void))
    );
  }
}

class SafeArray<T> {
  constructor(private items: T[]) {}

  get length(): number {
    return this.items.length;
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  map<U>(fn: (item: T) => U): SafeArray<U> {
    return new SafeArray(this.items.map(fn));
  }

  filter(fn: (item: T) => boolean): SafeArray<T> {
    return new SafeArray(this.items.filter(fn));
  }
}

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

  setHost(host: string): ConfigBuilder<T & { host: string }> {
    return new ConfigBuilder({ ...this.config, host } as T & { host: string });
  }

  setPort(port: number): ConfigBuilder<T & { port: number }> {
    return new ConfigBuilder({ ...this.config, port } as T & { port: number });
  }

  setSSL(ssl: boolean): ConfigBuilder<T & { ssl: boolean }> {
    return new ConfigBuilder({ ...this.config, ssl } as T & { ssl: boolean });
  }

  build(): T {
    return this.config;
  }
}

type RecursiveTransform<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends object
      ? { [K in keyof T]: RecursiveTransform<T[K]> }
      : T;

function transform<T>(obj: T, transformer: (val: any) => any): RecursiveTransform<T> {
  if (Array.isArray(obj)) {
    return obj.map((item) => transform(item, transformer)) as RecursiveTransform<T>;
  }

  if (obj !== null && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      out[key] = transform(value, transformer);
    }
    return out as RecursiveTransform<T>;
  }

  return transformer(obj) as RecursiveTransform<T>;
}

interface PluginDefinition<T> {
  name: string;
  handler: (input: T) => string;
}

class PluginRegistry<T> {
  private plugins: PluginDefinition<T>[] = [];

  register(plugin: PluginDefinition<T>): void {
    this.plugins.push(plugin);
  }

  execute(input: T): string[] {
    return this.plugins.map((p) => p.handler(input));
  }

  count(): number {
    return this.plugins.length;
  }
}

function updateObject<T extends object>(obj: T, updates: Partial<T>): T {
  return { ...obj, ...updates };
}

function promiseAll<T extends readonly Promise<any>[]>(
  promises: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  return Promise.all(promises) as Promise<{ [K in keyof T]: Awaited<T[K]> }>;
}

type AccumulatorMap = {
  count: number[];
  messages: string[];
  flags: boolean[];
};

class Accumulator<T extends Record<string, any[]>> {
  private data: Partial<T> = {};

  add<K extends keyof T>(key: K, value: T[K][0]): void {
    const current = this.data[key] ?? [];
    this.data[key] = [...current, value] as T[K];
  }

  get<K extends keyof T>(key: K): T[K] {
    return (this.data[key] ?? []) as T[K];
  }

  getByIndex<K extends keyof T>(key: K, index: number): T[K][0] | undefined {
    return this.get(key)[index] as T[K][0] | undefined;
  }
}

const stringCache = new GenericCache<string>();
stringCache.set("name", "Sonik");

const emitter = new EventEmitter<EventMap>();
emitter.on("login", (d) => console.log(d.userId));
emitter.emit("login", { userId: "u1" });

const safe = new SafeArray([1, 2, 3]).map((n) => n * 2).filter((n) => n > 2);

const cfg = new ConfigBuilder().setHost("localhost").setPort(3000).setSSL(true).build();

const transformed = transform(
  { id: 1, profile: { name: "sonik", bio: "dev" } },
  (v) => (typeof v === "string" ? v.toUpperCase() : v)
);

const registry = new PluginRegistry<string>();
registry.register({ name: "upper", handler: (s) => s.toUpperCase() });

const updated = updateObject({ id: "1", name: "Sonik" }, { name: "John" });

const acc = new Accumulator<AccumulatorMap>();
acc.add("count", 1);
acc.add("messages", "hello");

void promiseAll([Promise.resolve("a"), Promise.resolve(2)] as const).then((v) => console.log(v[0], v[1]));
console.log(
  stringCache.getOrDefault("missing", "fallback"),
  safe.length,
  cfg.host,
  transformed.profile.name,
  registry.execute("test")[0],
  updated.name,
  acc.getByIndex("count", 0)
);
