import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  crewUrl: string = './assets/whiteJustCrew.png'
  githubUrl: string = './assets/github.png'
  linkedinUrl: string = './assets/linkedin.png'

}
