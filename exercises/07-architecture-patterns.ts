// Module 7: Architecture Patterns - Exercises

export {};

// EXERCISE 1: Model workflow with discriminated union
type TicketState =
  | { kind: "open"; createdAt: Date }
  | { kind: "in-progress"; assignedTo: string }
  | { kind: "resolved"; resolvedAt: Date; resolution: string }
  | { kind: "closed"; closedAt: Date };

function describeTicketState(state: TicketState): string {
  // TODO
  return "";
}

// EXERCISE 2: Safe transition function
function startProgress(state: TicketState, assignee: string): TicketState {
  // TODO: only open -> in-progress should be valid
  return state;
}

// EXERCISE 3: Result envelope for service operations
type ServiceResult<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

type CreateTicketError =
  | { kind: "validation"; message: string }
  | { kind: "duplicate"; title: string };

function createTicket(title: string): ServiceResult<{ id: string; title: string }, CreateTicketError> {
  // TODO
  return { ok: false, error: { kind: "validation", message: "not implemented" } };
}

// EXERCISE 4: Port definition and in-memory adapter
type Ticket = { id: string; title: string; state: TicketState };

type TicketRepository = {
  findById(id: string): Promise<Ticket | null>;
  save(ticket: Ticket): Promise<void>;
};

class InMemoryTicketRepository implements TicketRepository {
  private store = new Map<string, Ticket>();

  async findById(id: string): Promise<Ticket | null> {
    // TODO
    return null;
  }

  async save(ticket: Ticket): Promise<void> {
    // TODO
  }
}

// EXERCISE 5: Adapter mapping from DTO to domain
type TicketDto = {
  ticket_id: string;
  ticket_title: string;
  status: "open" | "in_progress" | "resolved" | "closed";
};

function mapTicketDto(dto: TicketDto): Ticket {
  // TODO
  return {
    id: "",
    title: "",
    state: { kind: "open", createdAt: new Date(0) }
  };
}

// EXERCISE 6: Use-case service with repository dependency
class TicketService {
  constructor(private readonly repository: TicketRepository) {}

  async resolveTicket(id: string, resolution: string): Promise<ServiceResult<Ticket, { kind: "not-found" }>> {
    // TODO
    return { ok: false, error: { kind: "not-found" } };
  }
}

// EXERCISE 7: Guard invalid states with helper type
type RequireKind<T extends { kind: string }, K extends T["kind"]> = Extract<T, { kind: K }>;

type ResolvedTicketState = RequireKind<TicketState, "resolved">;

function getResolutionSummary(state: ResolvedTicketState): string {
  // TODO
  return "";
}

// EXERCISE 8: Hard - compose domain policies
type PolicyResult = { allowed: true } | { allowed: false; reason: string };

function canCloseTicket(state: TicketState): PolicyResult {
  // TODO: only resolved tickets can close
  return { allowed: false, reason: "not implemented" };
}

// EXERCISE 9: Hard - anti-corruption layer interface
type ExternalTicketClient = {
  fetchTicket(externalId: string): Promise<unknown>;
};

async function fetchAndDecodeTicket(
  client: ExternalTicketClient,
  externalId: string
): Promise<ServiceResult<Ticket, { kind: "decode-failed"; message: string }>> {
  // TODO
  return { ok: false, error: { kind: "decode-failed", message: "not implemented" } };
}

// EXERCISE 10: Hard - architecture smell detector
function detectArchitectureSmells(sourceText: string): string[] {
  // TODO: detect signs like "any" in service layer, direct DTO usage in domain, etc.
  return [];
}
