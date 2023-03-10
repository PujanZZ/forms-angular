import { AbstractControl } from '@angular/forms';

export class CustomValidators {
  //closures - function inside another function(inner fn has access to outer fn parameters and var in addition to its own)
  static emailDomain(domainName: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email: string = control.value;
      const domain = email.substring(email.lastIndexOf('@') + 1);

      if (email === '' || domain.toLowerCase() === domainName.toLowerCase()) {
        return null;
      } else {
        return {
          emailDomain: true,
        };
      }
    };
  }
}
