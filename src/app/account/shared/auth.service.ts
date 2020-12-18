import { Injectable } from "@angular/core";
// import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireDatabase } from "@angular/fire/database";
// import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuth } from "@angular/fire/auth";
// import * as firebase from 'firebase/app';
import { auth } from "firebase";

import { Observable, of } from "rxjs";
import { take, takeUntil, switchMap, map } from "rxjs/operators";

import { MessageService } from "../../messages/message.service";
import { User, Roles } from "../../models/user.model";

@Injectable()
export class AuthService {
  public user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private messageService: MessageService
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap((auth) => {
        if (auth) {
          return this.db
            .object("users/" + auth.uid)
            .valueChanges()
            .pipe(
              map((user: User) => {
                return {
                  ...user,
                  uid: auth.uid,
                };
              })
            );
        } else {
          return of(null);
        }
      })
    );
  }

  public async googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return await this.afAuth.signInWithPopup(provider).then(
      (credential) => {
        this.updateNewUser(credential.user);
      },
      (error) => {
        throw error;
      }
    );
  }

  public emailSignUp(email: string, password: string, userData: User) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then(
      (user:auth.UserCredential) => {
        userData.uid = user?.user?.uid;
        this.updateNewUser(userData);
      },
      (error) => {
        throw error;
      }
    );
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(
      (user) => {
        this.updateNewUser(user);
      },
      (error) => {
        throw error;
      }
    );
  }

  public signOut() {
    this.afAuth.signOut();
    this.messageService.add("You have been logged out.");
  }

  public updateProfile(userData: User) {
    this.updateExistingUser(userData);
    this.messageService.add("User profile has been updated!");
  }

  public updatePassword(password: string) {
    // return this.afAuth.currentUser
    //   .updatePassword(password)
    //   .then(() => {
    //     this.messageService.add('Password has been updated!');
    //   })
    //   .catch(function(error) {
    //     throw error;
    //   });
  }

  public updateEmail(email: string) {
    return this.afAuth.currentUser;
    // .updateEmail(email)
    // .then(() => {
    //   this.updateExistingUser({ email: email });
    //   this.messageService.add('User email have been updated!');
    // })
    // .catch(function(error) {
    //   throw error;
    // });
  }

  private updateNewUser(authData) {
    const userData = new User(authData);
    const ref = this.db.object("users/" + authData.uid);
    ref
      .valueChanges()
      .pipe(take(1))
      .subscribe((user) => {
        if (!user) {
          ref.update(userData);
        }
      });
  }

  private updateExistingUser(userData) {
    // const currentUser = this.afAuth.currentUser;
    // const ref = this.db.object('users/' + currentUser.uid);
    // ref
    //   .valueChanges()
    //   .pipe(
    //     take(1)
    //   )
    //   .subscribe((user) => {
    //     ref.update(userData);
    //   });
  }
}
