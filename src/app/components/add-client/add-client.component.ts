import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { IClient } from '../clients';
import { ClientService } from 'src/app/services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {

  @ViewChild('d') datePicker: NgbDatepicker;

  formAddClient: FormGroup;
  submit = false;
  age: number;

  constructor(
    public formBuild: FormBuilder,
    public clientService: ClientService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.datePicker.minDate = { year: 1900, month: 1, day: 1};
    this.datePicker.maxDate = { year: 2000, month: 1, day: 1};
    this._initForm();
  }
  sendForm(): void {
    this.submit = true;
    if (this._checkFieldsErrors().length) {
      alert('Complete all the fields');

      return;
    }
    const body: IClient = this.formAddClient.value;
    body.age = String(this.age);

    if (typeof body.birthdate !== 'string') { this.dateHandler(body.birthdate); }

    this.clientService.addClient(body);
    alert('Client saved succesfully!');
    this.router.navigateByUrl('/list-clients');
  }

  dateHandler(ev): void {
    this._getAge(`${ev.year}-${ev.month}-${ev.day}`);
    const birthDate = `${ev.year}-${this._setLeadingZero(ev.month)}-${this._setLeadingZero(ev.day)}`;
    this.formAddClient.value.birthdate = birthDate;
  }
  private _setLeadingZero(value): string {
    return value < 9 ? `0${value}` : value;
  }
  private _getAge(dateString): void {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    this.age = age;
  }

  private _checkFieldsErrors(): Array<{ field: string; error: any }> {
    const errors = [];
    const controls = this.formAddClient.controls;
    Object.keys(controls).forEach(item => {
      if (controls[item].errors) {
        errors.push({
          field: item,
          error: controls[item].errors
        });
      }
    });

    return errors;
  }

  private _initForm(): void {
    this.formAddClient = this.formBuild.group({
      name: [null, Validators.required],
      lastname: [null, Validators.required],
      birthdate: [null, Validators.required]
    });
  }

}
