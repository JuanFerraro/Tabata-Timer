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
    this.sendFormEvent.emit(this.settingsForm)
  }

}
