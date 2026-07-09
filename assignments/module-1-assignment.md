# Module 1 Assignment: Build a Typed Settings Parser

## Objective

You will build a small runtime-safe settings parser that demonstrates:

1. Type inference
2. Unions and literals
3. Type guards
4. Control flow narrowing
5. External data validation
6. Exhaustiveness checking

## Scenario

Your app has a settings object that can come from a config file, environment variables, or defaults. You need to:

1. Define what valid settings look like.
2. Validate that the data matches before using it.
3. Provide type-safe access to settings in your app.

## Part 1: Define the Types

Create a file: `assignments/module-1-settings.ts`

Define these types:

```ts
type Theme = "light" | "dark" | "auto";
type LogLevel = "debug" | "info" | "warn" | "error";

type AppSettings = {
  appName: string;
  theme: Theme;
  logLevel: LogLevel;
  maxRetries: number;
  enableNotifications?: boolean;  // optional
};
```

## Part 2: Write a Validator

Write a function that validates unknown data and narrows it to `AppSettings`:

```ts
function isValidTheme(value: unknown): value is Theme {
  // TODO: Check if value is "light", "dark", or "auto"
}

function isValidLogLevel(value: unknown): value is LogLevel {
  // TODO: Check if value is a valid log level
}

function isAppSettings(value: unknown): value is AppSettings {
  // TODO: Check all required properties and optional properties
  // Use the isValidTheme and isValidLogLevel helpers
}
```

## Part 3: Simulate Loading Settings

Write a function that loads settings from an external source:

```ts
function loadSettingsFromFile(): unknown {
  // Simulate reading from a config file
  return {
    appName: "My App",
    theme: "dark",
    logLevel: "info",
    maxRetries: 3,
    enableNotifications: true
  };
}
```

## Part 4: Use Settings Safely

Write a function that uses the settings:

```ts
function initializeApp(): void {
  const rawSettings = loadSettingsFromFile();

  // TODO: Validate the settings
  // If invalid, throw an error
  // If valid, use them

  if (isAppSettings(rawSettings)) {
    // Now TypeScript knows rawSettings is AppSettings
    const settings = rawSettings;

    console.log(`App: ${settings.appName}`);
    console.log(`Theme: ${settings.theme}`);
    console.log(`Log Level: ${settings.logLevel}`);
    console.log(`Max Retries: ${settings.maxRetries}`);

    // Handle optional property
    if (settings.enableNotifications !== undefined) {
      console.log(`Notifications: ${settings.enableNotifications}`);
    }
  } else {
    throw new Error("Invalid settings");
  }
}
```

## Part 5: Add Exhaustiveness Check

Add a function that handles all log levels:

```ts
function getLogLevelPriority(level: LogLevel): number {
  // Return a priority number for each log level
  // Use exhaustiveness check with never
  if (level === "debug") {
    return 0;
  } else if (level === "info") {
    return 1;
  } else if (level === "warn") {
    return 2;
  } else if (level === "error") {
    return 3;
  } else {
    // This ensures you handle all cases
    const impossible: never = level;
    return impossible;
  }
}
```

## Part 6: Test Edge Cases

Create test cases that should fail validation:

```ts
function testInvalidSettings(): void {
  // Test 1: Missing required property
  const missing = { appName: "Test" };
  console.log("Missing property:", isAppSettings(missing));  // false

  // Test 2: Invalid theme
  const badTheme = {
    appName: "Test",
    theme: "bright",  // not valid
    logLevel: "info",
    maxRetries: 3
  };
  console.log("Bad theme:", isAppSettings(badTheme));  // false

  // Test 3: Wrong type for maxRetries
  const wrongType = {
    appName: "Test",
    theme: "light",
    logLevel: "info",
    maxRetries: "3"  // should be number
  };
  console.log("Wrong type:", isAppSettings(wrongType));  // false

  // Test 4: Extra properties (should still pass, structural typing)
  const extra = {
    appName: "Test",
    theme: "light",
    logLevel: "info",
    maxRetries: 3,
    unknownProp: "ignored"
  };
  console.log("Extra properties:", isAppSettings(extra));  // true
}
```

## Checklist

- [ ] Types are defined with strict literals
- [ ] Optional properties are handled
- [ ] Type guards narrow the type correctly
- [ ] Validation checks all required properties
- [ ] External data is treated as `unknown` first
- [ ] Exhaustiveness checking with `never` prevents missing cases
- [ ] Code runs without errors: `npm run typecheck`
- [ ] All test cases pass

## Reflection

After completing this assignment, write answers to these in a comment at the end of the file:

1. **Why did we use `unknown` instead of `any`?**
2. **What would happen if we skipped validation?**
3. **Why does TypeScript allow extra properties in objects?**
4. **When would this pattern be useful in a real app?**
5. **What would you do differently if the settings came from a database instead of a file?**
"