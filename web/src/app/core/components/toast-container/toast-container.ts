import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NotificationService, Notification } from '../../../core/services/notification';

@Component({
  selector: 'app-toast-container',
  standalone: false,
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css'
})
export class ToastContainer implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeNotification(id: string): void {
    this.notificationService.remove(id);
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success': return 'icon-success';
      case 'error': return 'icon-error';
      case 'warning': return 'icon-warning';
      case 'info': return 'icon-info';
      default: return 'icon-info';
    }
  }

  getColorScheme(type: string): string {
    switch (type) {
      case 'success': return 'bg-success';
      case 'error': return 'bg-danger';
      case 'warning': return 'bg-warning';
      case 'info': return 'bg-info';
      default: return 'bg-info';
    }
  }

  trackByFn(index: number, item: Notification): string {
    return item.id;
  }
}
