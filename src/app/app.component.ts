import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
import { appConfig } from './app.config';
import { ResumeBuilderComponent } from './resume-builder/resume-builder.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'resume-builder';
}

bootstrapApplication(AppComponent, appConfig);

