// Module 1 Examples: Runtime vs Static

// ============================================================================
// PART 1: WHAT GETS ERASED
// ============================================================================

// Compile this with: npx tsc --noEmit
// Then look at the generated .js file. All type annotations are gone.

const userId: string = "user-123";
const age: number = 30;
const isActive: boolean = true;

function greet(name: string): void {
  console.log(`Hello, ${name}`);
}

// When JavaScript runs, this is just:
// const userId = "user-123";
// const age = 30;
// const isActive = true;
// function greet(name) { console.log(`Hello, ${name}`); }

// TypeScript checked these at compile time, but they are not in the runtime.

// ============================================================================
// PART 2: TYPE INFERENCE
// ============================================================================

// TypeScript infers the type from the value.

const language = "TypeScript";  // Inferred: literal type "TypeScript"
let framework = "React";         // Inferred: string (mutable, so broader)
const year = 2026;               // Inferred: literal type 2026
let count = 0;                   // Inferred: number (mutable)

// Hover over these variables in VS Code to see what TypeScript inferred.
// You will notice const gets literal types, let gets broader types.

function add(a: number, b: number) {
  return a + b;  // TypeScript infers return type is number
}

const result = add(2, 3);  // Inferred: number

// ============================================================================
// PART 3: `any` - ESCAPE HATCH
// ============================================================================

// any turns off type checking. Dangerous but sometimes necessary.

function fetchData(): any {
  return { userId: "123", name: "Sonik", permissions: ["read", "write"] };
}

const data = fetchData();
data.userId;          // OK, no error
data.doSomething();   // OK, no error - but will crash at runtime
data.foo.bar.baz;     // OK, no error - but will crash at runtime

// The problem: TypeScript stopped helping. You have to debug at runtime.

// ============================================================================
// PART 4: `unknown` - SAFE UNKNOWN
// ============================================================================

function fetchSafeData(): unknown {
  return { userId: "123", name: "Sonik" };
}

const unknownData = fetchSafeData();

// ERROR: Object is of type 'unknown'.
// unknownData.userId;

// You must narrow first.
if (typeof unknownData === "object" && unknownData !== null) {
  // Now TypeScript knows it is an object, but not what properties it has.
  // You still need to be careful.

  const obj = unknownData as Record<string, unknown>;
  console.log(obj["userId"]);
}

// Better approach: write a type guard
function isUserData(value: unknown): value is { userId: string; name: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "userId" in value &&
    "name" in value &&
    typeof (value as any).userId === "string" &&
    typeof (value as any).name === "string"
  );
}

const maybeUser = fetchSafeData();
if (isUserData(maybeUser)) {
  // Now TypeScript knows it is a user with userId and name
  console.log(maybeUser.userId, maybeUser.name);
}

// ============================================================================
// PART 5: `never` - IMPOSSIBLE VALUE
// ============================================================================

type UserStatus = "pending" | "active" | "suspended";

function handleStatus(status: UserStatus): string {
  if (status === "pending") {
    return "Waiting for activation";
  } else if (status === "active") {
    return "User is active";
  } else if (status === "suspended") {
    return "User is suspended";
  } else {
    // If you forget to handle a case above, this branch would have a value.
    // TypeScript uses never to catch this.
    const impossible: never = status;
    return impossible;  // ERROR if you missed a case
  }
}

// If you add a new status like "deleted" to the union,
// TypeScript will show an error here until you handle it.

// ============================================================================
// PART 6: UNIONS AND LITERALS
// ============================================================================

// Weak contract: any string is allowed
function updateStatusWeak(status: string) {
  console.log(`Status is now ${status}`);
}

updateStatusWeak("pending");  // OK
updateStatusWeak("foo");      // OK at compile time, but wrong at runtime
updateStatusWeak("xyz");      // OK at compile time, but wrong at runtime

// Strong contract: only specific strings allowed
function updateStatusStrong(status: "pending" | "active" | "error") {
  console.log(`Status is now ${status}`);
}

updateStatusStrong("pending");  // OK
updateStatusStrong("active");   // OK
// updateStatusStrong("foo");    // ERROR: Argument of type '"foo"' is not assignable

// The compiler catches mistakes before runtime. This is the goal.

// ============================================================================
// PART 7: CONTROL FLOW NARROWING
// ============================================================================

function process(value: string | number | boolean) {
  // Outside the if, value could be any of the three types.

  if (typeof value === "string") {
    // Inside here, TypeScript narrows to string
    console.log(value.toUpperCase());
  } else if (typeof value === "number") {
    // Inside here, TypeScript narrows to number
    console.log(value.toFixed(2));
  } else {
    // Inside here, TypeScript narrows to boolean
    console.log(value ? "true" : "false");
  }
}

// Narrowing happens with:
// - typeof checks
// - instanceof checks
// - Property checks (in, instanceof, hasOwnProperty)
// - Discriminated unions (we will see this in architecture)
// - Custom type guards

// ============================================================================
// PART 8: OPTIONAL PROPERTIES
// ============================================================================

type User = {
  id: string;
  name: string;
  email?: string;  // optional property
};

const user1: User = { id: "1", name: "Sonik" };  // OK, email is optional
const user2: User = { id: "2", name: "Asha", email: "asha@example.com" };  // OK

// But accessing optional properties requires narrowing
function sendEmail(user: User) {
  // ERROR: Object is possibly 'undefined'.
  // console.log(user.email.length);

  // Must narrow first
  if (user.email !== undefined) {
    console.log(user.email.length);
  }

  // Or use optional chaining
  console.log(user.email?.length);
}

// ============================================================================
// PART 9: THE RUNTIME/STATIC SPLIT IN ACTION
// ============================================================================

// Scenario: You fetch user data from an API

type ApiUserResponse = {
  id: string;
  name: string;
  age: number;
};

// This function fetches from an API and returns a typed response.
async function fetchUser(userId: string): Promise<ApiUserResponse> {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();

  // At this point:
  // - JavaScript has a plain object from JSON
  // - TypeScript assumes it has the shape ApiUserResponse
  // - But TypeScript CANNOT PROVE this. The API might return garbage.

  return data as ApiUserResponse;  // Lying to TypeScript
}

// Better approach: validate before trusting
async function fetchUserSafe(userId: string): Promise<ApiUserResponse> {
  const response = await fetch(`/api/users/${userId}`);
  const data: unknown = await response.json();

  // Now you must prove it matches ApiUserResponse before using it
  if (isApiUserResponse(data)) {
    return data;
  }

  throw new Error("API returned invalid data");
}

function isApiUserResponse(value: unknown): value is ApiUserResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as any).id === "string" &&
    typeof (value as any).name === "string" &&
    typeof (value as any).age === "number"
  );
}

// ============================================================================
// SUMMARY
// ============================================================================

// Key takeaways:
// 1. Types vanish at runtime. JavaScript does not know about them.
// 2. TypeScript can only prove things about code you control.
// 3. External data (APIs, user input) is always unknown or any.
// 4. Use unknown instead of any. It forces you to validate.
// 5. Use unions and literals instead of loose types.
// 6. Narrowing is how you tell TypeScript more about a value.
// 7. Exhaustiveness checks with never catch missing cases.
