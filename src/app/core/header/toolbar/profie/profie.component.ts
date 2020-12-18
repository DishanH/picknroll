import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../../../account/shared/auth.service";
import { User } from "../../../../models/user.model";

@Component({
  selector: "app-toolbar-profie",
  templateUrl: "./profie.component.html",
  styleUrls: ["./profie.component.scss"],
})
export class ToolbarProfieComponent implements OnInit, OnDestroy {
  // @Input() public user: User;
  public user : User;
  private authSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
  public onLogOut(e: Event) {
    this.authService.signOut();
    this.router.navigate(["/register-login"]);
    e.preventDefault();
  }
}
