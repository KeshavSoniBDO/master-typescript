# Module 4 Assignment: Build a Type-Safe Form Schema

## Scenario

You are building a form library. Developers write a **schema** that describes the form. From that schema, you automatically generate:

1. **TypeScript type** for the form values
2. **Validation functions** that check runtime values
3. **Form component API** that is type-safe

The schema looks like:

```ts
const userForm = {
  name: { type: "text"; required: true; minLength: 2 },
  email: { type: "email"; required: true },
  age: { type: "number"; required: false; min: 0; max: 120 },
  newsletter: { type: "checkbox"; required: false },
};
```

From this schema, TypeScript should automatically infer:

```ts
type UserFormValues = {
  name: string;        // required
  email: string;       // required
  age?: number;        // optional
  newsletter?: boolean; // optional
};
```

And you should be able to validate and use the form type-safely.

## Part 1: Define the Field Types

Create types for each field kind. Each field has:

- `type`: The field type ("text", "email", "number", "checkbox")
- `required`: Whether the field is required
- Optional constraints (minLength, min, max, pattern, etc.)

```ts
type TextField = {
  type: "text";
  required: boolean;
  minLength?: number;
  maxLength?: number;
};

type EmailField = {
  type: "email";
  required: boolean;
};

type NumberField = {
  type: "number";
  required: boolean;
  min?: number;
  max?: number;
};

type CheckboxField = {
  type: "checkbox";
  required: boolean;
};

type AnyField = TextField | EmailField | NumberField | CheckboxField;
```

**Your task**: Create these types. They should be strict so only valid combinations are allowed.

## Part 2: Write the Schema Type

A schema is an object where each property is a field.

```ts
type FormSchema = Record<string, AnyField>;
```

Test it:

```ts
const schema: FormSchema = {
  name: { type: "text"; required: true },
  email: { type: "email"; required: false },
  // ok so far
};
```

## Part 3: Extract Form Values from Schema

Write a type `ExtractFormValues<S extends FormSchema>` that:

- For each field in schema S
- If `required: true`, the value type is (string | number | boolean)
- If `required: false`, the value type is (string | number | boolean | undefined)
- Map the field type to TypeScript type:
  - `"text"` → `string`
  - `"email"` → `string`
  - `"number"` → `number`
  - `"checkbox"` → `boolean`

```ts
// Example:
const mySchema: FormSchema = {
  name: { type: "text"; required: true },
  email: { type: "email"; required: false },
  age: { type: "number"; required: true },
};

type MyFormValues = ExtractFormValues<typeof mySchema>;

// Should be:
// {
//   name: string;
//   email?: string;
//   age: number;
// }
```

**Hints**:
- Use mapped types `[K in keyof S]`
- Use conditional types to check `required`
- Use nested conditional to map field type to TypeScript type

## Part 4: Create a Form Validator

Write a function `createValidator<S extends FormSchema>(schema: S)` that:

- Takes a schema
- Returns a validation function `(values: unknown) => ExtractFormValues<S> | ValidationError`

```ts
const validator = createValidator(mySchema);

const result = validator({ name: "Sonik", email: "test@example.com", age: 24 });

if (result.ok) {
  // result.value has type ExtractFormValues<typeof mySchema>
  console.log(result.value.name);  // string, fully typed
} else {
  // result.error explains what went wrong
  console.log(result.error);
}
```

**Hints**:
- Return `{ ok: true; value: ExtractFormValues<S> } | { ok: false; error: string }`
- Check that all required fields are present
- Validate type constraints (minLength, min, max)
- Handle optional fields gracefully

## Part 5: Create a Form Builder Component

Write a component builder function that creates a type-safe form:

```ts
const form = createForm(mySchema, {
  onSubmit: (values) => {
    // values type is ExtractFormValues<typeof mySchema>
    // TypeScript knows which properties exist
    console.log(values.name); // OK
    console.log(values.age);  // OK
    // console.log(values.unknown);  // ERROR
  }
});
```

The builder should:

- Accept the schema
- Accept options (onSubmit, etc.)
- Return a form object with fields
- Ensure onSubmit callback receives correctly-typed values

```ts
type FormBuilder<S extends FormSchema> = {
  schema: S;
  onSubmit: (values: ExtractFormValues<S>) => void | Promise<void>;
  // Add more properties as needed
};
```

## Part 6: Add Field-Level Validation

Extend the validator to provide per-field errors:

```ts
type ValidationResult<S extends FormSchema> = 
  | { ok: true; values: ExtractFormValues<S> }
  | { ok: false; errors: Partial<Record<keyof S, string>> };
```

Now invalid fields return a map of which fields failed and why:

```ts
const result = validator({ name: "" });  // name is too short

if (!result.ok) {
  result.errors.name  // "Name must be at least 2 characters"
  result.errors.email // "Email is required"
}
```

## Part 7: Stretch Goal - Dynamic Schema Building

Allow building schemas programmatically with full type inference:

```ts
function createTextField(opts: { required: boolean; minLength?: number }): TextField {
  return { type: "text"; ...opts };
}

function createNumberField(opts: { required: boolean; min?: number; max?: number }): NumberField {
  return { type: "number"; ...opts };
}

// Usage:
const dynamicSchema = {
  name: createTextField({ required: true; minLength: 2 }),
  age: createNumberField({ required: false; min: 0; max: 120 }),
};

type DynamicValues = ExtractFormValues<typeof dynamicSchema>;
// Should correctly infer types even though schema was built dynamically
```

## Testing Checklist

- [ ] Field types compile without `any`
- [ ] Schema accepts valid fields, rejects invalid combinations
- [ ] `ExtractFormValues<S>` correctly infers types:
  - Required text → string
  - Optional text → string | undefined
  - Number with constraints still → number
  - Checkbox → boolean
- [ ] Validator checks required fields
- [ ] Validator checks constraints (minLength, min, max)
- [ ] Form builder callback receives correctly-typed values
- [ ] Field-level errors work correctly
- [ ] `npm run typecheck` passes with zero errors
- [ ] Dynamic schema building maintains full type safety

## Key Patterns to Use

1. **Mapped types**: Transform schema keys to form values
2. **Conditional types**: Check `required` flag
3. **Nested conditionals**: Map field type to TypeScript type
4. **Discriminated unions**: `{ ok: true; ... } | { ok: false; ... }`
5. **Partial**: For error maps `Partial<Record<keyof S, string>>`
6. **`keyof`**: To iterate schema properties

## Why This Matters

This pattern is used in real libraries:

- **React Hook Form**: Uses similar type inference
- **Zod / Yup**: Schema → validation → types
- **Prisma**: Schema → ORM types
- **tRPC**: Schema → type-safe API

You are not just learning types—you are learning a pattern used in production.

## Hints If Stuck

**Mapping field type to TypeScript type**:

```ts
type MapFieldType<F extends AnyField> = 
  F extends { type: "text" } ? string :
  F extends { type: "email" } ? string :
  F extends { type: "number" } ? number :
  F extends { type: "checkbox" } ? boolean :
  never;
```

**Handling required**:

```ts
type ExtractFormValues<S> = {
  [K in keyof S]: S[K] extends { required: true }
    ? MapFieldType<S[K]>
    : MapFieldType<S[K]> | undefined;
};
```

**Validation function return type**:

```ts
type ValidatorReturn<S extends FormSchema> =
  | { ok: true; values: ExtractFormValues<S> }
  | { ok: false; errors: Partial<Record<keyof S, string>> };
```

## Final Validation

Before submitting:

```bash
npm run typecheck
```

Should return: **0 errors**

No `any` types. No `as` casts (unless absolutely necessary for validation logic). Full type safety from schema to form submission.
