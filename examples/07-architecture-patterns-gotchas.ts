// Module 7: Architecture Patterns - Gotchas

export {};

// GOTCHA 1: boolean flag soup for state
// This is hard to reason about and allows invalid combinations.
type BadOrderState = {
  isDraft: boolean;
  isApproved: boolean;
  isShipped: boolean;
};

const impossibleBadState: BadOrderState = {
  isDraft: true,
  isApproved: true,
  isShipped: true
};

void impossibleBadState;

// Better: discriminated union
type GoodOrderState =
  | { kind: "draft" }
  | { kind: "approved"; approvedAt: Date }
  | { kind: "shipped"; trackingId: string };

// GOTCHA 2: leaking external DTOs into domain
type PaymentDto = { payment_id: string; amount_cents: number };
type Payment = { id: string; amount: number };

function mapPayment(dto: PaymentDto): Payment {
  return { id: dto.payment_id, amount: dto.amount_cents / 100 };
}

// GOTCHA 3: broad service return types lose intent
async function badCreateUser(): Promise<any> {
  return { success: true, data: { id: "u1" } };
}

// Better: explicit result union
type ServiceResult<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

type CreateUserError =
  | { kind: "duplicate-email"; email: string }
  | { kind: "validation"; message: string };

async function goodCreateUser(email: string): Promise<ServiceResult<{ id: string }, CreateUserError>> {
  if (!email.includes("@")) {
    return { ok: false, error: { kind: "validation", message: "invalid email" } };
  }
  return { ok: true, value: { id: "u1" } };
}

// GOTCHA 4: adapter boundaries should isolate transport types
type UserRepository = {
  findById(id: string): Promise<{ id: string; email: string } | null>;
};

class InMemoryUserRepo implements UserRepository {
  private store = new Map<string, { id: string; email: string }>();

  async findById(id: string): Promise<{ id: string; email: string } | null> {
    return this.store.get(id) ?? null;
  }
}

// GOTCHA 5: non-exhaustive workflow handlers
function describeState(state: GoodOrderState): string {
  switch (state.kind) {
    case "draft":
      return "Draft";
    case "approved":
      return `Approved at ${state.approvedAt.toISOString()}`;
    case "shipped":
      return `Shipped: ${state.trackingId}`;
  }
}

// GOTCHA 6: using optional-heavy domain models hides rules
type BadProfile = {
  id?: string;
  email?: string;
  role?: "admin" | "member";
};

// Better: split variants
type GoodProfile =
  | { kind: "incomplete"; id: string }
  | { kind: "complete"; id: string; email: string; role: "admin" | "member" };

console.log(Boolean(badCreateUser), describeState({ kind: "draft" }), Boolean(mapPayment));
void goodCreateUser;
