import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HeaderSignComponent } from '../header-sign/header-sign.component';
import { confirmPasswordReset, getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    HeaderSignComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent {
  fb = inject(NonNullableFormBuilder);
  router = inject(Router);

  resetPasswordForm = this.fb.group({
    firstPassword: this.fb.control('', { validators: [Validators.required, Validators.minLength(6)] }),
    verifyPassword: this.fb.control('', { validators: [Validators.required, Validators.minLength(6), this.validateSamePassword] })
  });


  onSubmit() {
    this.resetPassword();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }


  async resetPassword(): Promise<void> {
    const auth = getAuth();
    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get('oobCode');
    let changedPassword = this.resetPasswordForm.get('firstPassword')?.value;

    if(oobCode && changedPassword) {
      try {
        await confirmPasswordReset(auth, oobCode, changedPassword);
        console.log("Passwort erfolgreich zurückgesetzt.");
      } catch (error) {
        console.error("Fehler beim Zurücksetzen des Passworts:", error);
        throw error;
      }
    }
  }


  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('firstPassword');
    const confirmPassword = control.parent?.get('verifyPassword');
    return password?.value == confirmPassword?.value ? null : { 'notSame': true };
  }
}
