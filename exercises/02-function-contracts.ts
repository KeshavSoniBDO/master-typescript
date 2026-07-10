// Module 2 - Topic 1 Exercise: Function Contract Design

type Profile = {
  id: string;
  displayName: string;
  age: number;
  isPublic: boolean;
};

const profiles: Record<string, Profile> = {
  p1: { id: "p1", displayName: "Sonik", age: 24, isPublic: true }
};

// Task 1:
// This weak API accepts almost anything.
// Replace it with strong, intention-revealing functions.
function updateProfileWeak(id: string, field: string, value: unknown): void {
  const p = profiles[id];
  if (!p) return;
  if (field in p) {
    (p as Record<string, unknown>)[field] = value;
  }
}

// Task 2:
// Implement these functions with strict parameter types.
function updateDisplayName(id: string, displayName: string): void {
  // TODO
}

function updateAge(id: string, age: number): void {
  // TODO
}

function setProfileVisibility(id: string, isPublic: boolean): void {
  // TODO
}

// Task 3:
// Create a union type for profile fields and a safe generic-style updater.
// Hints:
// - type ProfileField = "displayName" | "age" | "isPublic";
// - function updateProfileField<K extends ProfileField>(...)

type ProfileField = "displayName" | "age" | "isPublic";

function updateProfileField<K extends ProfileField>(
  id: string,
  field: K,
  value: Profile[K]
): void {
  // TODO
}

// Try these after implementation:
// updateProfileField("p1", "age", 30);          // should be OK
// updateProfileField("p1", "displayName", 30);  // should be type error
// updateProfileField("p1", "isPublic", false);  // should be OK
