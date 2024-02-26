// password-strength.validator.ts

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(minimumStrength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // No validation error if the field is empty (handled by required validator)
    }

    const hasUpperCase = /[A-Z]/.test(control.value);
    const hasLowerCase = /[a-z]/.test(control.value);
    const hasNumbers = /\d/.test(control.value);
    const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);

    const strength = (hasUpperCase ? 1 : 0) +
                     (hasLowerCase ? 1 : 0) +
                     (hasNumbers ? 1 : 0) +
                     (hasSpecialCharacters ? 1 : 0);

    return strength >= minimumStrength ? null : { weakPassword: true };
  };
}
