# Module 2 Assignment: Build a Type-Safe Configuration Manager

## Scenario

You are building a **configuration manager** for an application. It needs to:

1. **Define configurations** with nested properties (database, server, logging)
2. **Validate configurations** at runtime
3. **Safely merge** configurations (dev config + prod overrides)
4. **Provide type-safe access** to configuration values
5. **Support plugins** that add custom validation rules
6. **Preserve immutability** (configurations should not change accidentally)

## Part 1: Define Configuration Schema

Create types for your application configuration:

```ts
type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  readonly ssl: boolean;
  readonly maxConnections?: number;
};

type ServerConfig = {
  host: string;
  port: number;
  readonly debug: boolean;
};

type LoggingConfig = {
  level: "debug" | "info" | "warn" | "error";
  readonly format: "json" | "text";
};

type AppConfig = {
  readonly database: DatabaseConfig;
  readonly server: ServerConfig;
  readonly logging: LoggingConfig;
};
```

**Your task:**

Define these three configuration types. Make appropriate fields readonly where they should not change after initialization.

---

## Part 2: Create a Configuration Validator Plugin System

Not all configurations are valid. For example:

- Database port should be 1–65535
- Server port should not conflict with database port
- Logging level must be one of the allowed values

Create a plugin system that allows adding custom validators:

```ts
type ValidationRule<T> = {
  name: string;
  validate: (config: T) => { ok: true } | { ok: false; error: string };
};

type ConfigValidator<T> = {
  rules: ValidationRule<T>[];
  validate: (config: T) => ValidationError[];
};
```

**Your task:**

1. Define ValidationRule and ConfigValidator types
2. Write a function `createValidator<T>(rules: ValidationRule<T>[]): ConfigValidator<T>`
3. Implement validation:
   - Check that database port is 1–65535
   - Check that server port is not the same as database port
   - Check that logging level is valid

Example:

```ts
const dbValidator: ValidationRule<DatabaseConfig> = {
  name: "valid_port",
  validate: (config) => {
    if (config.port < 1 || config.port > 65535) {
      return { ok: false, error: "Port must be 1-65535" };
    }
    return { ok: true };
  }
};
```

---

## Part 3: Configuration Merger

You need to merge base configuration with overrides:

```ts
function mergeConfig<T extends AppConfig>(
  base: T,
  overrides: Partial<T>
): T {
  // TODO: Merge with overrides taking precedence
  // Return type should be same as base
}
```

**Your task:**

1. Implement mergeConfig that deep-merges configurations
2. Preserve the input type (if base is AppConfig, return AppConfig)
3. Ensure readonly properties cannot be overridden

---

## Part 4: Type-Safe Configuration Access

Accessing nested properties should be type-safe:

```ts
type GetConfigValue<T, K extends keyof T> = T[K];

const db: DatabaseConfig = { /* ... */ };
const port: number = getConfig(db, "port");  // Should be number, not unknown
const host: string = getConfig(db, "host");  // Should be string
// getConfig(db, "invalidField");  // Should be ERROR
```

**Your task:**

1. Create a `getConfig<T, K extends keyof T>(config: T, key: K): T[K]` function
2. Use keyof and indexed access to ensure type safety
3. Test it with nested access: `getConfig(appConfig, "database")` returns DatabaseConfig

---

## Part 5: Configuration Loader

Create a loader that reads configuration from environment variables or defaults:

```ts
type ConfigSource = "env" | "file" | "defaults";

type ConfigLoader = {
  load: (source: ConfigSource) => AppConfig | null;
  validate: (config: AppConfig) => boolean;
  merge: (base: AppConfig, overrides: Partial<AppConfig>) => AppConfig;
};
```

**Your task:**

1. Implement a ConfigLoader
2. `load("env")` reads from environment variables or returns defaults
3. `validate(config)` uses your validator plugin system
4. `merge(base, overrides)` uses your merge function
5. Ensure the config is readonly before returning

---

## Part 6: Extension—Conditional Properties

Some configurations might be optional depending on other settings:

- If `logging.format` is "json", add a `pretty` property (boolean)
- If `server.debug` is true, add `debugPort` (number)

This requires a more advanced type that conditionally adds properties.

```ts
type ExtendedLoggingConfig = LoggingConfig & (
  LoggingConfig["format"] extends "json"
    ? { pretty: boolean }
    : {}
);
```

**Your task** (Stretch):

1. Create ExtendedLoggingConfig that adds `pretty` only if `format: "json"`
2. Create ExtendedServerConfig that adds `debugPort` only if `debug: true`
3. Use these in AppConfig instead of the base types
4. Update validators to check the new fields

---

## Part 7: Stretch Goal—Multi-Level Validation

Create a validation system that reports errors at the right level:

```ts
type ValidationResult =
  | { ok: true; config: AppConfig }
  | {
      ok: false;
      errors: {
        database?: string[];
        server?: string[];
        logging?: string[];
      };
    };

function validateConfig(config: Partial<AppConfig>): ValidationResult {
  // Validate each section separately
  // Return field-level errors
}
```

**Your task** (Stretch):

1. Implement field-level validation that reports which sections failed
2. Allow partial configs and only validate provided sections
3. Return a structured error object with field names as keys

---

## Testing Checklist

Before submitting:

- [ ] DatabaseConfig, ServerConfig, LoggingConfig compile
- [ ] AppConfig brings them together
- [ ] ValidationRule and ConfigValidator work
- [ ] At least 3 validation rules are implemented
- [ ] mergeConfig preserves the input type
- [ ] getConfig is fully type-safe (no any)
- [ ] ConfigLoader loads, validates, and merges
- [ ] Readonly properties cannot be reassigned
- [ ] npm run typecheck passes with 0 errors
- [ ] No `as any` or `as const` unless absolutely necessary

---

## Key Patterns Used

1. **Structural typing**: Merge accepts objects with matching shape
2. **Keyof + indexed access**: Type-safe property retrieval
3. **Union types**: ValidationResult is success OR error
4. **Plugin system**: Validators are pluggable
5. **Readonly**: Immutability contract for config
6. **Deep merging**: Handling nested objects safely
7. **Conditional types** (stretch): Adding properties based on other fields

---

## Why This Matters

Configuration management is critical in production:

- **Node.js apps**: dotenv, config modules use similar patterns
- **Docker/Kubernetes**: Config maps and secrets follow these principles
- **Cloud platforms**: AWS uses configuration objects with validation
- **Type safety**: Prevents configuration errors at compile time, not runtime

You're not just learning types—you're learning a pattern used in every production application.

---

## Hints If Stuck

**Merging nested objects:**

```ts
function mergeConfig<T extends AppConfig>(base: T, overrides: Partial<T>): T {
  const result = { ...base } as T;
  
  for (const key in overrides) {
    const override = overrides[key as keyof T];
    if (typeof override === "object" && override !== null) {
      result[key as keyof T] = { ...result[key as keyof T], ...override } as any;
    } else {
      result[key as keyof T] = override as any;
    }
  }
  
  return result;
}
```

**Type-safe access:**

```ts
function getConfig<T, K extends keyof T>(config: T, key: K): T[K] {
  return config[key];
}
```

**Field-level validation:**

```ts
type ValidationResult =
  | { ok: true; config: AppConfig }
  | { ok: false; errors: Partial<Record<keyof AppConfig, string[]>> };
```

---

## Final Validation

```bash
npm run typecheck
```

Should return: **0 errors**

No `any` types unless absolutely necessary. Full type safety from config creation to access.
