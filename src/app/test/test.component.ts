import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CustomValidators } from '../shared/custom-validators';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  carForm: FormGroup;
  nameLength = 0;

  validationMessages = {
    name: {
      required: 'Name is required',
      minlength: 'Min length 2',
      maxlength: 'Max length 10',
    },
    email: {
      required: 'Email is required',
      email: '',
      emailDomain: 'Domain incorrect',
    },
    confirmEmail: {
      required: 'Confirm email is Required',
    },
    emailGroup: {
      emailMismatch: 'Email and Confirm email does not match',
    },
    phone: {
      required: 'Phone number is required',
    },
    skillName: {
      required: 'Skill name is required',
    },
    experienceInYears: {
      required: 'Experience is required',
    },
    level: {
      required: 'Select skill level',
    },
  };

  formErrors = {
    name: '',
    email: '',
    confirmEmail: '',
    emailGroup: '',
    phone: '',
    skillName: '',
    experienceInYears: '',
    level: '',
  };

  constructor(private fb: FormBuilder) {}

  // ngOnInit() {
  //   this.carForm = new FormGroup({
  //     name: new FormControl(),
  //     email: new FormControl(), //obj 2 form controls of form group
  //     skills: new FormGroup({
  //       skillName: new FormControl(),
  //       experienceInYears: new FormControl(),
  //       level: new FormControl(),
  //     }),
  //   });
  // }

  //using formbuilder class
  ngOnInit() {
    this.carForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(10),
        ],
      ],
      pref: ['email', []],
      emailGroup: this.fb.group(
        {
          email: [
            '',
            [
              Validators.required,
              Validators.email,
              CustomValidators.emailDomain('gmail.com'),
            ],
          ],
          confirmEmail: ['', [Validators.required]],
        },
        { validators: checkEmail }
      ),

      phone: [''],
      skills: this.fb.array([this.addSkill()]),
    });

    //this.carForm.valueChanges.subscribe(val=>this.carform.id === val.id)
    const sub = this.carForm.valueChanges.subscribe((val) => {
      this.logErrors(this.carForm);
    });
  }

  addSkill(): FormGroup {
    return this.fb.group({
      skillName: ['', [Validators.required]],
      experienceInYears: ['', [Validators.required]],
      level: ['', [Validators.required]],
    });
  }
  //
  addSkillButton(): void {
    (<FormArray>this.carForm.get('skills')).push(this.addSkill());
  }

  logErrors(grp: FormGroup): void {
    //console.log(Object.keys(grp.controls));
    Object.keys(grp.controls).forEach((key: string) => {
      const abstractControl = grp.get(key);
      this.formErrors[key] = '';
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)
      ) {
        const msg = this.validationMessages[key];

        //console.log(abstractControl.errors); //failed ones ,return true/false
        //console.log(msg);

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            //console.log(msg[errorKey]);
            this.formErrors[key] += msg[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        //to get nested formcontrol key, looping recursively
        this.logErrors(abstractControl);
      }
      if (abstractControl instanceof FormArray) {
        //to get nested formcontrol key, looping recursively
        for (const c of abstractControl.controls) {
          if (c instanceof FormGroup) {
            this.logErrors(c);
          }
        }
      }
    });
  }

  onSubmit(): void {
    //console.log(this.carForm);
    //console.log(this.carForm.controls.name.status);
    //console.log(this.carForm.get('email').touched);  //.value etc
    //console.log(this.carForm.get('skills').value.level);
    this.logErrors(this.carForm);
  }
  onKey(): void {
    this.logErrors(this.carForm);
    //console.log(this.formErrors);
  }

  //setvalue for all values,patchvalue to update subset
  onLoad(): void {
    // this.carForm.patchValue({
    //   name: 'xyz',
    //   email: 'xyz@gmail.com',
    //   skills: {
    //     skillName: 'Cricket',
    //     experienceInYears: '5',
    //     level: 'Hard',
    //   },
    // });

    const formArray = new FormArray([
      new FormControl('Busy', Validators.required),
      new FormGroup({
        country: new FormControl('', Validators.required),
      }),
      new FormArray([]),
    ]);
    formArray.push(new FormControl('pushed is added', Validators.required));
    console.log(formArray.at(3).value);
  }

  onContact(selectedValue: string) {
    const phoneControl = this.carForm.get('phone');
    if (selectedValue === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
}

function checkEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  if (
    emailControl.value === confirmEmailControl.value ||
    confirmEmailControl.pristine
  ) {
    return null;
  } else {
    return {
      emailMismatch: true,
    };
  }
}
