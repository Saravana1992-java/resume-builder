import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ResumeValidators {
    static nameValidator(control: AbstractControl): ValidationErrors | null {
        const namePattern = /^[a-zA-Z\s]+$/; // ✅ Allow only letters and spaces
        return namePattern.test(control.value) ? null : { invalidName: true };
    }

    static phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
        const phonePattern = /^\d{10}$/; // ✅ Ensure exactly 10 digits
        return phonePattern.test(control.value) ? null : { invalidPhoneNumber: true };
    }

    static linkedInUrlValidator(control: AbstractControl): ValidationErrors | null {
        const linkedInPattern = /^https:\/\/(www\.)?linkedin\.com\/.*$/; // ✅ Validate LinkedIn URL format
        return linkedInPattern.test(control.value) ? null : { invalidLinkedInUrl: true };
    }

    static gitHubUrlValidator(control: AbstractControl): ValidationErrors | null {
        const gitHubPattern = /^https:\/\/(www\.)?github\.com\/.*$/; // ✅ Validate GitHub URL format
        return gitHubPattern.test(control.value) ? null : { invalidGitHubUrl: true };
    }
}