import { Injectable } from "@angular/core";
// import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireDatabase } from "@angular/fire/database";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
// import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuth } from "@angular/fire/auth";
// import * as firebase from 'firebase/app';
import { auth } from "firebase";

import { Observable, of } from "rxjs";
import { take, takeUntil, switchMap, map } from "rxjs/operators";

import { MessageService } from "../../messages/message.service";
import { User, Roles } from "../../models/user.model";
import {  Router } from "@angular/router";
import { FileUploadService } from "../../products/shared/file-upload.service";

@Injectable()
export class AuthService {
  public user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    // private db: AngularFireDatabase,
    private fireStoreDb: AngularFirestore,
    private messageService: MessageService,
    private uploadService: FileUploadService,
    private router: Router
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap((auth) => {
        if (auth) {
          // return this.db
          return (
            this.fireStoreDb
              .collection("users")
              .doc(auth.uid)
              // .object("users/" + auth.uid)
              .valueChanges()
              .pipe(
                map((user: User) => {
                  return {
                    ...user,
                    uid: auth.uid,
                  };
                })
              )
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

  public emailSignUp(email: string, password: string,data : { user: User, files : File}) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(
      (user: auth.UserCredential) => {
        data.user.uid = user?.user?.uid;
        return data;
        //this.updateNewUser(data);
      })
      .then((userWithId) =>{
        this.uploadService.startUpload(data,'user')
        .then((task) => {
          console.log(task);
          userWithId.user.photoIdURL = task.ref.fullPath;
          this.updateNewUser(userWithId.user);
        });
      })
      .catch((error) => {
        throw error;
      }
    );
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(
      (user) => {
        // this.updateNewUser(user);
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
    // const ref = this.db.object("users/" + authData.uid);
    this.fireStoreDb
      .collection("users")
      .doc(authData.uid)
      .set(Object.assign({}, userData));
    // ref
    //   .valueChanges()
    //   .pipe(take(1))
    //   .subscribe((user) => {
    //     if (!user) {
    //       console.log(userData);
    //       console.log(authData.uid);
    //       // ref.update(userData);
    //       ref.set(userData);
    //     }
    //   });
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
