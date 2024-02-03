import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  @Output() sendFormEvent = new EventEmitter<FormGroup>();
  reset: boolean = false;

  settingsForm = new FormGroup({
    warmupIntervalMin: new FormControl(0, Validators.required),
    warmupIntervalSec: new FormControl(0, Validators.required),
    exerciseIntervalMin: new FormControl(0, Validators.required),
    exerciseIntervalSec: new FormControl(0, Validators.required),
    restIntervalMin: new FormControl(0, Validators.required),
    restIntervalSec: new FormControl(0, Validators.required),
    numberOfSets: new FormControl(1, [Validators.required, Validators.min(1)]),
    numberOfCycles: new FormControl(1, [Validators.required, Validators.min(1)]),
    cooldownIntervalMin: new FormControl(0, Validators.required),
    cooldownIntervalSec: new FormControl(0, Validators.required),
  });

  sendForm() {
    this.reset = true;
    this.sendFormEvent.emit(this.settingsForm)
  }

  checkForm() {
    if (this.settingsForm.value.exerciseIntervalMin == 0 && this.settingsForm.value.exerciseIntervalSec == 0) {
        this.settingsForm.patchValue({
          exerciseIntervalMin: null,
          exerciseIntervalSec: null,
        });
    } else if (this.settingsForm.value.restIntervalMin == 0 && this.settingsForm.value.restIntervalSec == 0) {
      this.settingsForm.patchValue({
        restIntervalMin: null,
        restIntervalSec: null,
      });
    } else {
      this.sendForm()
    }
  }

  resetForm() {
    this.settingsForm.reset();
    this.settingsForm.markAsPristine();
    this.settingsForm.markAsUntouched();
    this.reset = false;
  }

}
