import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthService } from '../../../account/shared/auth.service';

import { User } from '../../../models/user.model';
import { OffcanvasService } from '../../shared/offcanvas.service';

@Component({
  selector: 'app-navigation-main',
  templateUrl: './navigation-main.component.html',
  styleUrls: ['./navigation-main.component.scss']
})
export class NavigationMainComponent implements OnInit, OnDestroy {
  public user: User;
  public authSubscription: Subscription;

  constructor(public authService: AuthService,
    private offcanvasService: OffcanvasService) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }
  public onMenuToggle(e: Event) {
    console.log(e)
    this.offcanvasService.openOffcanvasNavigation();
    e.preventDefault();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
