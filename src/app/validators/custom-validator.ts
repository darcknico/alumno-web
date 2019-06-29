import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export class CustomValidator{
    public static emailValidator(control: AbstractControl): ValidationErrors {
        if (!control.value) {
            return null;
        }

        return Validators.email(control);
    }
}