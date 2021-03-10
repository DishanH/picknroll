import { NullVisitor } from "@angular/compiler/src/render3/r3_ast";
import { Component, OnInit, ViewChild, OnChanges } from "@angular/core";
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MessageService } from "../../messages/message.service";
import { User } from "../../models/user.model";
import { AuthService } from "../shared/auth.service";

@Component({
  selector: "app-register-login",
  templateUrl: "./register-login.component.html",
  styleUrls: ["./register-login.component.scss"],
})
export class RegisterLoginComponent implements OnInit {
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public registerErrors: string;
  public loginErrors: string;
  @ViewChild('userPhoto',{ static:true }) userPhoto;
  public photoUrl:string;
  constructor(
    private authenticationService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initLoginForm();
    this.initRegisterForm();
  }

  private initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }

  private initRegisterForm() {
    this.registerForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      photoURL: new FormControl(null),
      address: new FormControl(null),
      dateOfBirth: new FormControl(null, Validators.required),
    });
  }

  public onRegister() {
    this.registerErrors = "";
    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmPassword
    ) {
      this.registerErrors = "Passwords don't match!";
      this.registerForm.controls.password.setErrors({ password: true });
      this.registerForm.controls.confirmPassword.setErrors({
        confirmPassword: true,
      });
    } else {
      const files : File = this.userPhoto.nativeElement.files;
      const user : User = this.registerForm.value;
      this.authenticationService
        .emailSignUp(
          this.registerForm.value.email,
          this.registerForm.value.password,
          { user , files }
        )
        .then(
          () => {
            this.messageService.add(
              "Account created successfully. Please login with your new credentials!"
            );
            this.loginForm.setValue({
              email: this.registerForm.value.email,
              password: "",
            });
            this.initRegisterForm();
          },
          (error) => {
            this.registerErrors = error.message;
            if (error.code === "auth/weak-password") {
              this.registerForm.controls.password.setErrors({ password: true });
              this.registerForm.controls.confirmPassword.setErrors({
                confirmPassword: true,
              });
            }
            if (error.code === "auth/email-already-in-use") {
              this.registerForm.controls.email.setErrors({ email: true });
            }
          }
        );
    }
  }

  public onLogin() {
    this.loginErrors = "";
    this.authenticationService
      .emailLogin(this.loginForm.value.email, this.loginForm.value.password)
      .then(
        () => {
          this.messageService.add("Login successful!");
          this.router.navigate(["/home"]);
        },
        (error) => {
          if (error.code === "auth/user-not-found") {
            this.loginForm.controls.email.setErrors({ email: true });
          }
          if (error.code === "auth/wrong-password") {
            this.loginForm.controls.password.setErrors({ password: true });
          }
          if (error.code === "auth/user-disabled") {
            this.loginErrors = "User account disabled.";
          }
        }
      );
  }

  public onChange(event){
    this.photoUrl = event.target.files[0].name;
  }
}
