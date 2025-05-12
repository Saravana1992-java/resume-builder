import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { ResumeService } from '../services/resume-service.service';
import { HttpClient } from '@angular/common/http';
import { ResumeValidators } from './resume-validators';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePicker } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface Experience {
  company: string;
  role: string;
  fromDate: Date;
  toDate: Date;
}
@Component({
  standalone: true,
  selector: 'app-resume-builder',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    FloatLabelModule,
    DatePicker,
    StepperModule,
    CardModule,
    ButtonModule,
    FileUpload,
    RatingModule,
    TagModule,
    TimelineModule

  ],
  templateUrl: './resume-builder.component.html',
  styleUrl: './resume-builder.component.css'
})
export class ResumeBuilderComponent {

  profileForm!: FormGroup;
  profilePictureForm!: FormGroup;
  // skillsForm!: FormGroup;
  // awardsForm!: FormGroup;
  // certificationsForm!: FormGroup;
  // innovationsForm!: FormGroup;
  profileHighlightsForm!: FormGroup;
  experienceDetailsForm!: FormGroup;
  educationalQualificationsForm!: FormGroup;
  professionalSummaryForm!: FormGroup;
  selectedFile: File | null = null;
  resumeData: ResumeData = new ResumeData;
  activeStep: number = 1;
  experiences: Experience[] = [];

  constructor(private readonly fb: FormBuilder, private readonly http: HttpClient, private readonly resumeService: ResumeService) {

  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required, ResumeValidators.nameValidator],
      currentJobTitle: ['', Validators.required],
      specilalizedSkillTitle: [''],
      dateOfBirth: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required, ResumeValidators.phoneNumberValidator],
      address: ['', Validators.required],
      linkedInProfile: ['', ResumeValidators.linkedInUrlValidator],
      personalWebsite: [''],
      gitHubProfile: ['', ResumeValidators.gitHubUrlValidator]
    });
    this.profilePictureForm = this.fb.group({
      profilePicture: [null]
    });
    this.profileHighlightsForm = this.fb.group({
      skills: this.fb.array([]),
      awards: this.fb.array([]),
      certifications: this.fb.array([])
    });
    this.experienceDetailsForm = this.fb.group({
      experienceDetails: this.fb.array([]),
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
    this.professionalSummaryForm = this.fb.group({
      summary: ['', Validators.required],
    });
  }

  onUpload(event: FileUploadEvent) {
    this.selectedFile = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.profilePictureForm.patchValue({
        profilePicture: e.target?.result
      });
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onFileSelect(event: FileUploadEvent) {
    this.selectedFile = event.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.profilePictureForm.patchValue({
        profilePicture: e.target?.result
      });
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onFileRemove(event: FileUploadEvent) {
    this.profilePictureForm.patchValue({
      profilePicture: null
    });
  }

  onSubmit(activateCallback: (step: number) => void) {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profilePicture', this.selectedFile);
      this.resumeService.saveProfilePicture(formData).subscribe(() => {
        console.log('Profile Picture Saved Successfully');
        activateCallback(2); // ✅ Move to the next step
      });
    }
    else if (this.activeStep === 1 && this.profileForm.valid) {
      this.resumeService.savePersonalDetails(this.profileForm.value).subscribe(() => {
        console.log('Saved Successfully');
        activateCallback(3); // ✅ Move to the next step
      });
    }
  }

  get skills(): FormArray {
    return this.profileHighlightsForm.get('skills') as FormArray;
  }

  private createSkillGroup(skillName: string = '', skillRating: number = 0): FormGroup {
    return this.fb.group({
      skillName: [skillName, Validators.required],
      skillRating: [skillRating, Validators.required]
    });
  }

  addSkill(skill: { skillName: string; skillRating: any }): void {
    const skillRating = Number(skill.skillRating);
    if (!isNaN(skillRating)) { // Ensure the conversion is valid
      this.skills.push(this.createSkillGroup(skill.skillName, skillRating));
    } else {
      console.error('Invalid skillRating value:', skill.skillRating);
    }
  }

  getSkillGroup(index: number): FormGroup {
    return this.skills.at(index) as FormGroup;
  }

  get awards(): FormArray {
    return this.profileHighlightsForm.get('awards') as FormArray;
  }

  private createAwardsGroup(awardTitle: string = '', awardedDate: any = null): FormGroup {
    return this.fb.group({
      awardTitle: [awardTitle],
      awardedDate: [awardedDate ? new Date(awardedDate) : null],
    });
  }

  addAwards(award: { awardTitle: string; awardedDate: any; }): void {
    this.awards.push(this.createAwardsGroup(
      award.awardTitle,
      award.awardedDate
    ));
  }

  getAwardsGroup(index: number): FormGroup {
    return this.awards.at(index) as FormGroup;
  }

  get certifications(): FormArray {
    return this.profileHighlightsForm.get('certifications') as FormArray;
  }

  private createCertificationsGroup(certificate: string = '', certificateExpiryDate: any = null): FormGroup {
    return this.fb.group({
      certificate: [certificate],
      certificateExpiryDate: [certificateExpiryDate ? new Date(certificateExpiryDate) : null]
    });
  }

  addCertifications(certification: { certificate: string; certificateExpiryDate: any; }): void {
    this.certifications.push(this.createCertificationsGroup(
      certification.certificate,
      certification.certificateExpiryDate
    ));
  }

  getCertificationsGroup(index: number): FormGroup {
    return this.certifications.at(index) as FormGroup;
  }

  /* get innovations(): FormArray {
    return this.profileHighlightsForm.get('innovations') as FormArray;
  }

  private createInnovationsGroup(innovation: string = '', innovationDescription: string = ''): FormGroup {
    return this.fb.group({
      innovation: [innovation],
      innovationDescription: [innovationDescription]
    });
  }

  addInnovations(innovation: { innovation: string; innovationDescription: string }): void {
    this.innovations.push(this.createInnovationsGroup(
      innovation.innovation,
      innovation.innovationDescription
    ));
  }

  getInnovationsGroup(index: number): FormGroup {
    return this.innovations.at(index) as FormGroup;
  } */

  get experienceDetails(): FormArray {
    return this.experienceDetailsForm.get('experienceDetails') as FormArray;
  }

  getExperienceGroup(index: number): FormGroup {
    return this.experienceDetails.at(index) as FormGroup;
  }

  private createExperiencesGroup(company: string = '', role: string = '', fromDate: any = null, toDate: any = null): FormGroup {
    return this.fb.group({
      company: [company, Validators.required],
      role: [role, Validators.required],
      fromDate: [new Date(fromDate), Validators.required],
      toDate: [toDate ? new Date(toDate) : null]
    });
  }

  addExperience(experience: { company: string; role: string; fromDate: any; toDate: any }) {
    this.experiences = [...this.experiences, experience];
    this.experienceDetails.push(this.createExperiencesGroup(
      experience.company,
      experience.role,
      experience.fromDate,
      experience.toDate));
  }

  get educationalQualifications(): FormArray {
    return this.educationalQualificationsForm.get('educationalQualifications') as FormArray;
  }

  getEducationalQualificationGroup(index: number): FormGroup {
    return this.educationalQualifications.at(index) as FormGroup;
  }

  private createEduQualificationsGroup(qualification: string = '', grade: string = '', monthYearOfPassing: string = '', institutionName: string = '', placeOfStudy: string = ''): FormGroup {
    return this.fb.group({
      qualification: [qualification, Validators.required],
      grade: [grade, Validators.required],
      monthYearOfPassing: [monthYearOfPassing, Validators.required],
      institutionName: [institutionName, Validators.required],
      placeOfStudy: [placeOfStudy, Validators.required]
    });
  }

  addEducationalQualifications(educationalDetail: { qualification: string; grade: string; monthYearOfPassing: string; institutionName: string; placeOfStudy: string }) {
    this.educationalQualifications.push(this.createEduQualificationsGroup(
      educationalDetail.qualification,
      educationalDetail.grade,
      educationalDetail.monthYearOfPassing,
      educationalDetail.institutionName,
      educationalDetail.placeOfStudy
    ));
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
