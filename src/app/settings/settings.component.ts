import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
    warmupIntervalMin: new FormControl (0),
    warmupIntervalSec: new FormControl (0),
    exerciseIntervalMin: new FormControl (0),
    exerciseIntervalSec: new FormControl (0),
    restIntervalMin: new FormControl (0),
    restIntervalSec: new FormControl (0),
    numberOfSets: new FormControl (0),
    numberOfCycles: new FormControl (0),
    cooldownIntervalMin: new FormControl (0),
    cooldownIntervalSec: new FormControl (0),
  })

  sendForm() {
    this.sendFormEvent.emit(this.settingsForm)
  }

}
