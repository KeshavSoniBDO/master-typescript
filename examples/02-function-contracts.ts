// Module 2 - Topic 1: Function Contracts

type User = {
  id: string;
  name: string;
  email: string;
};

const db: Record<string, User> = {
  "u1": { id: "u1", name: "Sonik", email: "sonik@example.com" }
};

// Weak contract: anything can be passed for field and value.
function updateUserWeak(id: string, field: string, value: unknown): void {
  const user = db[id];
  if (!user) return;

  // Runtime-only safety. TypeScript cannot protect this properly.
  if (field in user) {
    (user as Record<string, unknown>)[field] = value;
  }
}

// Strong contract: separate operations with precise parameters.
function renameUser(id: string, name: string): void {
  const user = db[id];
  if (!user) return;
  user.name = name;
}

function changeUserEmail(id: string, email: string): void {
  const user = db[id];
  if (!user) return;
  user.email = email;
}

renameUser("u1", "Keshav");
changeUserEmail("u1", "keshav@example.com");

// These compile with weak contract but may be wrong at runtime.
updateUserWeak("u1", "name", 42);
updateUserWeak("u1", "unknownField", "x");

console.log(db["u1"]);