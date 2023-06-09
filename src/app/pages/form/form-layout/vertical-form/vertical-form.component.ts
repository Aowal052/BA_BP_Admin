import { Component } from '@angular/core';
import { DValidateRules, FormLayout } from 'ng-devui/form';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'da-vertical-form',
  templateUrl: './vertical-form.component.html',
  styleUrls: ['../form-layout.component.scss'],
})
export class VerticalFormComponent {
  verticalLayout: FormLayout = FormLayout.Vertical;

  existUsernames = ['Lily', 'Goffy', 'Nancy'];

  formData = {
    userName: '',
    password: '',
    confirmPassword: '',
  };

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    usernameRules: {
      validators: [
        { required: true },
        { minlength: 3 },
        { maxlength: 128 },
        {
          pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/,
          message: {
            'zh-cn': 'The user name cannot contain characters except uppercase, lowercase letters or numbers.',
            'en-us': 'The user name cannot contain characters except uppercase, lowercase letters or numbers.',
          },
        },
      ],
      asyncValidators: [
        {
          sameName: this.checkName.bind(this),
          message: {
            'zh-cn': 'Duplicate name.',
            'en-us': 'Duplicate name.',
          },
        },
      ],
    },
    passwordRules: {
      validators: [{ required: true }, { minlength: 6 }, { maxlength: 15 }, { pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/ }],
      message: {
        'zh-cn': 'Enter a password that contains 6 to 15 digits and letters.',
        'en-us': 'Enter a password that contains 6 to 15 digits and letters.',
      },
    },
    confirmPasswordRules: [
      { required: true },
      {
        sameToPassWord: this.sameToPassWord.bind(this),
        message: {
          'zh-cn': 'Ensure that the two passwords are the same.',
          'en-us': 'Ensure that the two passwords are the same.',
        },
      },
      { minlength: 6 },
      { maxlength: 15 },
      {
        pattern: /^[a-zA-Z0-9]+(\s+[a-zA-Z0-9]+)*$/,
        message: {
          'zh-cn': 'The password must contain only letters and digits.',
          'en-us': 'The password must contain only letters and digits.',
        },
      },
    ],
  };

  checkName(value: string) {
    let res = true;
    if (this.existUsernames.indexOf(value) !== -1) {
      res = false;
    }
    return of(res).pipe(delay(500));
  }

  sameToPassWord(value: string) {
    return value === this.formData.password;
  }
}
