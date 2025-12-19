// ID生成ユーティリティ

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateTaskId(): string {
  return generateId("task");
}

export function generateScheduleId(): string {
  return generateId("schedule");
}

export function generateLogId(): string {
  return generateId("log");
}

export function generateTimelineId(role: "user" | "ai"): string {
  return generateId(role);
}

