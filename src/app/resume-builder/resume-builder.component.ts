import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../resume-data';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  standalone: true,
  selector: 'app-resume-builder',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    StepperModule,
    ButtonModule

  ],
  templateUrl: './resume-builder.component.html',
  styleUrl: './resume-builder.component.css'
})
export class ResumeBuilderComponent {

  personalDetailsForm: FormGroup;
  professionalSummaryForm: FormGroup;
  skillsForm: FormGroup;
  experienceDetailsForm: FormGroup;
  educationalQualificationsForm: FormGroup;

  resumeData: ResumeData = new ResumeData;
  activeStep: number = 1;

  constructor(private fb: FormBuilder) {
    this.personalDetailsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      linkedInProfile: ['', Validators.required],
      gitHubProfile: ['', Validators.required]
    });
    this.professionalSummaryForm = this.fb.group({
      summary: ['', Validators.required],
    });
    this.skillsForm = this.fb.group({
      skills: this.fb.array([]),
    });
    this.experienceDetailsForm = this.fb.group({
      experienceDetails: this.fb.array([
        new FormGroup({
          company: new FormControl(''),
          role: new FormControl(''),
          duration: new FormControl('')
        })
      ]),
    });
    this.educationalQualificationsForm = this.fb.group({
      educationalQualifications: this.fb.array([
        new FormGroup({
          qualification: new FormControl(''),
          grade: new FormControl(''),
          monthYearOfPassing: new FormControl(''),
          institutionName: new FormControl(''),
          placeOfStudy: new FormControl('')
        })
      ]),
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.personalDetailsForm.valid) {
      // Handle form submission (e.g., save data, generate resume)
      console.log(this.personalDetailsForm.value);
    }
  }

  get skills(): FormArray {
    return this.skillsForm.get('skills') as FormArray;
  }

  addSkill(skill: string) {
    if (skill) {
      this.skills.push(new FormControl(skill));
    }
  }


  get experienceDetails(): FormArray {
    return this.experienceDetailsForm.get('experienceDetails') as FormArray;
  }

  getExperienceGroup(index: number): FormGroup {
    return this.experienceDetails.at(index) as FormGroup;
  }


  addExperience(experience: { company: string; role: string; duration: string }) {
    const experienceGroup = new FormGroup({
      company: new FormControl(experience.company),
      role: new FormControl(experience.role),
      duration: new FormControl(experience.duration)
    });

    this.experienceDetails.push(experienceGroup);
  }


  get educationalQualifications(): FormArray {
    return this.educationalQualificationsForm.get('educationalQualifications') as FormArray;
  }

  getEducationalQualificationGroup(index: number): FormGroup {
    return this.educationalQualifications.at(index) as FormGroup;
  }


  addEducationalQualifications(educationalDetail: { qualification: string; grade: string; monthYearOfPassing: string; institutionName: string; placeOfStudy: string }) {
    const educationalQualification = new FormGroup({
      qualification: new FormControl(educationalDetail.qualification),
      grade: new FormControl(educationalDetail.grade),
      monthYearOfPassing: new FormControl(educationalDetail.monthYearOfPassing),
      institutionName: new FormControl(educationalDetail.institutionName),
      placeOfStudy: new FormControl(educationalDetail.placeOfStudy)
    });

    this.educationalQualifications.push(educationalQualification);
  }


  generatePDF() {
    const DATA = document.getElementById('resumePreview');
    if (DATA) {
      html2canvas(DATA).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
        pdf.save('resume.pdf');
      });
    }
  }

}
