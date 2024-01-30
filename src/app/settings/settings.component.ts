import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  settingsForm = new FormGroup({
    warmupIntervalMin: new FormControl (''),
    warmupIntervalSec: new FormControl (''),
    exerciseIntervalMin: new FormControl (''),
    exerciseIntervalSec: new FormControl (''),
    restIntervalMin: new FormControl (''),
    restIntervalSec: new FormControl (''),
    numberOfSets: new FormControl (''),
    numberOfCycles: new FormControl (''),
    cooldownIntervalMin: new FormControl (''),
    cooldownIntervalSec: new FormControl (''),
  })

  isFormWorking() {
    console.log(this.settingsForm.value.numberOfCycles);
    console.log(this.settingsForm.value.numberOfSets);
  }
}
