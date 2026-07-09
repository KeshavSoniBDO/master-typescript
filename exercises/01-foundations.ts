// ============================================================================
// MODULE 1 EXERCISES: FOUNDATIONS
// ============================================================================
//
// Instructions:
// - Run: npm run typecheck
// - Fix the TypeScript errors WITHOUT changing the function logic.
// - The goal is to make the code type-safe while preserving runtime behavior.
//

// ============================================================================
// EXERCISE 1: INFERENCE
// ============================================================================
// Look at each variable and write down what type TypeScript inferred.
// Then hover over it in VS Code to check if you were right.

const language = "TypeScript";
let experience = "React and Angular";
const yearsOfExperience = 5;
const isMastering = true;
const goals = ["understand types", "master generics", "build cool stuff"];

// Write your predictions here (comment them out or keep them):
// language: ???
// experience: ???
// yearsOfExperience: ???
// isMastering: ???
// goals: ???

// ============================================================================
// EXERCISE 2: REPLACE `any` WITH `unknown`
// ============================================================================
// The function below accepts any value and tries to use it.
// Replace `any` with `unknown` and add proper narrowing so TypeScript is satisfied.

function printUppercase(value: any) {
  console.log(value.toUpperCase());
}

// Fix it:
function printUppercaseFixed(value: unknown) {
  // TODO: Add a type guard to narrow value to string before calling toUpperCase
  // Hint: use typeof or a type guard function
}

// ============================================================================
// EXERCISE 3: TYPE GUARDS
// ============================================================================
// Write a type guard function to check if a value is a valid status.

type OrderStatus = "pending" | "shipped" | "delivered";

// Skeleton:
function isOrderStatus(value: unknown): value is OrderStatus {
  // TODO: Check if value is one of the three valid statuses
  // Hint: return typeof value === "string" && [...]
  return false;  // Placeholder
}

// Test it:
const maybeStatus: unknown = "pending";
if (isOrderStatus(maybeStatus)) {
  console.log(`Order is ${maybeStatus}`);
} else {
  console.log("Invalid status");
}

// ============================================================================
// EXERCISE 4: UNIONS AND LITERALS
// ============================================================================
// Rewrite this function to use a union type instead of a loose string.

function updateUser(userId: string, field: string, value: unknown) {
  console.log(`Updated ${field} to ${value}`);
}

// Fix it:
// TODO: Create a type for valid fields (only "name", "email", "age")
// TODO: Rewrite the function to accept only those fields

type ValidUserField = "name" | "email" | "age";  // Example

function updateUserFixed(userId: string, field: ValidUserField, value: unknown) {
  console.log(`Updated ${field} to ${value}`);
}

// updateUserFixed("123", "name", "Sonik");  // OK
// updateUserFixed("123", "phone", "555-1234");  // ERROR: not a valid field

// ============================================================================
// EXERCISE 5: CONTROL FLOW NARROWING
// ============================================================================
// Complete the function so TypeScript narrows the type properly.

function process(value: string | number | null) {
  // TODO: Check if value is null and handle it
  if (value === null) {
    console.log("Value is null");
    // TODO: What type is value here?
  }
  // TODO: Check if value is a string and call toUpperCase()
  else if (typeof value === "string") {
    // TODO: Write the code
  }
  // TODO: Otherwise, it must be a number. Call toFixed(2)
  else {
    // TODO: Write the code
  }
}

process("hello");
process(42);
process(null);

// ============================================================================
// EXERCISE 6: OPTIONAL PROPERTIES
// ============================================================================
// Fix the type errors by handling optional properties correctly.

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
};

function displayProduct(product: Product) {
  console.log(`${product.name}: $${product.price}`);

  // ERROR: Object is possibly 'undefined'
  // console.log(`Description: ${product.description}`);

  // TODO: Fix this by narrowing or using optional chaining
}

// ============================================================================
// EXERCISE 7: EXHAUSTIVENESS WITH `never`
// ============================================================================
// Add a new status to the union, then see where TypeScript shows you a missing case.

type PaymentStatus = "pending" | "completed" | "failed";

function handlePayment(status: PaymentStatus): string {
  if (status === "pending") {
    return "Processing...";
  } else if (status === "completed") {
    return "Payment successful";
  } else if (status === "failed") {
    return "Payment failed";
  } else {
    // This catches any missing cases
    const impossible: never = status;
    return impossible;
  }
}

// TODO: Add "refunded" to the PaymentStatus union.
// You should see an error on the line with `never`.
// Fix it by adding a case for "refunded".

// ============================================================================
// EXERCISE 8: COMBINING CONCEPTS
// ============================================================================
// Write a function that fetches user data and validates it.

// Define the shape of user data from the API
type ApiUser = {
  id: string;
  name: string;
  email?: string;
};

// Write a type guard to validate if a value is an ApiUser
function isApiUser(value: unknown): value is ApiUser {
  // TODO: Check that value is an object with required properties
  // Hint: Check id (string), name (string), and optional email (string)
  return false;  // Placeholder
}

// Simulate an API response
function fetchUserFromAPI(): unknown {
  return {
    id: "user-1",
    name: "Sonik",
    email: "sonik@example.com"
  };
}

// Use the type guard
const apiResponse = fetchUserFromAPI();
if (isApiUser(apiResponse)) {
  console.log(`User ${apiResponse.name} has ID ${apiResponse.id}`);
} else {
  console.log("API returned invalid data");
}