export class NotificationMessage {
     severity: string;
     title: string;
     detail: string;
     time ?: number;
}

enum NotificationSeverity {
    error,
    success,
    warn,
    info,
}