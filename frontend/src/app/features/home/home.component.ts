import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeroComponent } from "./components/hero/hero.component";
import { AllPostsComponent } from "./components/all-posts/all-posts.component";
import { HowItWorksComponent } from "./components/how-it-work/how-it-work.component";
import { CtaSectionComponent } from './components/cta-section/cta-section.component';
import { AuthService } from '../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    HeroComponent,
    AllPostsComponent,
    HowItWorksComponent,
    CtaSectionComponent,
    NgIf,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <app-hero></app-hero>

      <ng-container *ngIf="isLoggedIn()">
        <div class="container-responsive section-padding-sm">
          <app-all-posts></app-all-posts>
        </div>
      </ng-container>

      <div class="container-responsive section-padding-sm">
        <app-how-it-works></app-how-it-works>
      </div>
      
      <div class="container-responsive section-padding-sm">
        <app-cta-section></app-cta-section>
      </div>
    </div>
  `,
})
export class HomeComponent {
  private authService = inject(AuthService);

  handleSearch({ query, category, location }: { query: string, category: string, location: string }) {
    console.log('Search Triggered:', query, category, location);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
