import { provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing-module';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { CoreModule } from './core/core-module';
import { Body } from './layout/body/body';

@NgModule({
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
  declarations: [
    Body,
    Header,
    Footer,
  ],
  imports: [
    CoreModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
  ],
  bootstrap: [Body]
})
export class AppModule { }
