import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  showSuccess(message: string, duration: number = 3000): void {
    this.addNotification('success', message, duration);
  }

  showError(message: string, duration: number = 5000): void {
    this.addNotification('error', message, duration);
  }

  showWarning(message: string, duration: number = 4000): void {
    this.addNotification('warning', message, duration);
  }

  showInfo(message: string, duration: number = 3000): void {
    this.addNotification('info', message, duration);
  }

  remove(id: string): void {
    const current = this.notificationsSubject.value;
    const updated = current.filter(notification => notification.id !== id);
    this.notificationsSubject.next(updated);
  }

  private addNotification(type: Notification['type'], message: string, duration: number): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      duration
    };

    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([...current, notification]);

    // Auto-remover después del duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
