import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null; // No validation error if the field is empty (handled by required validator)
  }

  // Modify the regular expression based on your phone number validation rules
  const isValidPhoneNumber = /^[0-9]{10}$/.test(String(control.value)); // Check if the value is a 10-digit number
  return isValidPhoneNumber ? null : { invalidPhoneNumber: true };
}
