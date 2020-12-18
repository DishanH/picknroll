import { Order } from './order.model';

export interface Roles {
  admin: boolean;
}

export class User {
  public email: string;
  public roles?: Roles;
  public firstName?: string;
  public lastName?: string;
  public password?: string;
  public orders?: object;
  public confirmPassword?: string;
  public uid?: string;
  public phone?: string;
  public dateOfBirth?: string;
  public address: string;
  public photoURL?: string;

  constructor(authData) {
    this.email = authData.email;
    this.firstName = authData.firstName ? authData.firstName : '';
    this.lastName = authData.lastName ? authData.lastName : '';
    this.phone = authData.phone ? authData.phone : '';
    this.dateOfBirth = authData.dateOfBirth ? authData.dateOfBirth : new Date().toISOString().split('T')[0];
    this.address = authData.address ? authData.address : '';
    this.photoURL = authData.photoURL ? authData.photoURL : '';//default image
    this.roles = {
      admin: false
    };
  }
}
