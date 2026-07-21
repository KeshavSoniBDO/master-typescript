// Module 7: Architecture Patterns - Solutions

export {};

type TicketState =
  | { kind: "open"; createdAt: Date }
  | { kind: "in-progress"; assignedTo: string }
  | { kind: "resolved"; resolvedAt: Date; resolution: string }
  | { kind: "closed"; closedAt: Date };

function describeTicketState(state: TicketState): string {
  switch (state.kind) {
    case "open":
      return `Open since ${state.createdAt.toISOString()}`;
    case "in-progress":
      return `In progress by ${state.assignedTo}`;
    case "resolved":
      return `Resolved: ${state.resolution}`;
    case "closed":
      return `Closed at ${state.closedAt.toISOString()}`;
  }
}

function startProgress(state: TicketState, assignee: string): TicketState {
  if (state.kind !== "open") return state;
  return { kind: "in-progress", assignedTo: assignee };
}

type ServiceResult<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

type CreateTicketError =
  | { kind: "validation"; message: string }
  | { kind: "duplicate"; title: string };

function createTicket(title: string): ServiceResult<{ id: string; title: string }, CreateTicketError> {
  if (title.trim().length < 3) {
    return { ok: false, error: { kind: "validation", message: "title too short" } };
  }
  if (title.toLowerCase() === "duplicate") {
    return { ok: false, error: { kind: "duplicate", title } };
  }

  return {
    ok: true,
    value: { id: `t_${Date.now()}`, title }
  };
}

type Ticket = { id: string; title: string; state: TicketState };

type TicketRepository = {
  findById(id: string): Promise<Ticket | null>;
  save(ticket: Ticket): Promise<void>;
};

class InMemoryTicketRepository implements TicketRepository {
  private store = new Map<string, Ticket>();

  async findById(id: string): Promise<Ticket | null> {
    return this.store.get(id) ?? null;
  }

  async save(ticket: Ticket): Promise<void> {
    this.store.set(ticket.id, ticket);
  }
}

type TicketDto = {
  ticket_id: string;
  ticket_title: string;
  status: "open" | "in_progress" | "resolved" | "closed";
};

function mapTicketDto(dto: TicketDto): Ticket {
  switch (dto.status) {
    case "open":
      return {
        id: dto.ticket_id,
        title: dto.ticket_title,
        state: { kind: "open", createdAt: new Date() }
      };
    case "in_progress":
      return {
        id: dto.ticket_id,
        title: dto.ticket_title,
        state: { kind: "in-progress", assignedTo: "unassigned" }
      };
    case "resolved":
      return {
        id: dto.ticket_id,
        title: dto.ticket_title,
        state: { kind: "resolved", resolvedAt: new Date(), resolution: "external" }
      };
    case "closed":
      return {
        id: dto.ticket_id,
        title: dto.ticket_title,
        state: { kind: "closed", closedAt: new Date() }
      };
  }
}

class TicketService {
  constructor(private readonly repository: TicketRepository) {}

  async resolveTicket(id: string, resolution: string): Promise<ServiceResult<Ticket, { kind: "not-found" }>> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return { ok: false, error: { kind: "not-found" } };
    }

    const updated: Ticket = {
      ...existing,
      state: {
        kind: "resolved",
        resolvedAt: new Date(),
        resolution
      }
    };

    await this.repository.save(updated);
    return { ok: true, value: updated };
  }
}

type RequireKind<T extends { kind: string }, K extends T["kind"]> = Extract<T, { kind: K }>;
type ResolvedTicketState = RequireKind<TicketState, "resolved">;

function getResolutionSummary(state: ResolvedTicketState): string {
  return `${state.resolution} at ${state.resolvedAt.toISOString()}`;
}

type PolicyResult = { allowed: true } | { allowed: false; reason: string };

function canCloseTicket(state: TicketState): PolicyResult {
  if (state.kind === "resolved") {
    return { allowed: true };
  }
  return { allowed: false, reason: "ticket must be resolved before close" };
}

type ExternalTicketClient = {
  fetchTicket(externalId: string): Promise<unknown>;
};

async function fetchAndDecodeTicket(
  client: ExternalTicketClient,
  externalId: string
): Promise<ServiceResult<Ticket, { kind: "decode-failed"; message: string }>> {
  const raw = await client.fetchTicket(externalId);

  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: { kind: "decode-failed", message: "payload must be object" } };
  }

  const record = raw as Record<string, unknown>;
  if (
    typeof record["ticket_id"] !== "string" ||
    typeof record["ticket_title"] !== "string" ||
    (record["status"] !== "open" &&
      record["status"] !== "in_progress" &&
      record["status"] !== "resolved" &&
      record["status"] !== "closed")
  ) {
    return { ok: false, error: { kind: "decode-failed", message: "invalid ticket payload" } };
  }

  const dto: TicketDto = {
    ticket_id: record["ticket_id"],
    ticket_title: record["ticket_title"],
    status: record["status"]
  };

  return { ok: true, value: mapTicketDto(dto) };
}

function detectArchitectureSmells(sourceText: string): string[] {
  const smells: string[] = [];

  if (sourceText.includes(" as any")) {
    smells.push("Uses 'as any' which may hide boundary/contract issues.");
  }

  if (sourceText.includes("ticket_id") && sourceText.includes("domain")) {
    smells.push("Possible DTO naming leakage into domain layer.");
  }

  if (sourceText.includes("success") && sourceText.includes("error") && !sourceText.includes("ok:")) {
    smells.push("Inconsistent result envelope shape detected.");
  }

  return smells;
}

console.log(describeTicketState({ kind: "open", createdAt: new Date() }));
void startProgress;
void createTicket;
void canCloseTicket;
void getResolutionSummary;
void detectArchitectureSmells;
void fetchAndDecodeTicket;
void TicketService;
void InMemoryTicketRepository;
