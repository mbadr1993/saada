import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, AppUser } from '../../services/user.service';
import {
  browserLocalPersistence,
  browserSessionPersistence,
} from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth';
interface Group1 {
  field1: string;
  field2: string;
}

interface Group2 {
  field3: string;
  field4: string;
}

interface Group3 {
  field5: string;
  field6: string;
}

interface Group4 {
  field7: string;
  field8: string;
}

interface MyFormModel {
  group1: Group1;
  group2: Group2;
  group3: Group3;
  group4: Group4;
}

@Component({
  imports: [CommonModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  form: FormGroup;
  loading = false;
  loginError = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private ngAuth: Auth
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  async signIn() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.loginError = false;
    const { username, password, rememberMe } = this.form.value;
    try {
      // Set persistence based on rememberMe
      // If rememberMe is false, use browserSessionPersistence so user is signed out when browser is closed
      await this.ngAuth.setPersistence(
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      const userCredential = await this.authService.loginWithUsername(
        username,
        password
      );
      // Set user data in UserService
      const user = userCredential.user;
      this.userService.setUser(
        {
          uid: user.uid,
          username: username,
          email: user.email || undefined,
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
        },
        rememberMe
      );
      // Set auto sign out for 60 minutes (example)
      this.userService.setAutoSignOut(60, () => {
        this.userService.clearUser();
        this.router.navigate(['/']);
      });
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.loginError = true;
      console.error(error.message || error);
    } finally {
      this.loading = false;
    }
  }
}
