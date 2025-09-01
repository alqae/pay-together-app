import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { NotificationService } from '@core/services/notification';
import { Auth } from '@core/services/auth';

import { ToastContainer } from '@core/components/toast-container/toast-container';
import { ErrorInterceptor } from '@core/interceptors/error-interceptor';
import { AuthInterceptor } from '@core/interceptors/auth-interceptor';
import { AuthGuard } from '@core/guards/auth-guard';

@NgModule({
  imports: [CommonModule],
  declarations: [ToastContainer],
  exports: [ToastContainer],
  providers: [
    Auth,
    NotificationService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only once in AppModule');
    }
  }
}
