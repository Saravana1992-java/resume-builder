import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../models/resume-data';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { ResumeService } from '../services/resume-service.service';
import { HttpClient } from '@angular/common/http';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePicker } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { FileUpload } from 'primeng/fileupload';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface Project {
  projectName: string;
  projectDescription: string;
  techStack: string;
}

interface Award {
  awardTitle: string;
  awardedDate: Date;
}

interface Certification {
  certificate: string;
  certificateExpiryDate: Date;
}

interface Experience {
  company: string;
  role: string;
  fromDate: Date;
  toDate: Date;
  isCurrentJob: boolean;
  projects?: Project[];
}

interface Qualification {
  qualification: string;
  grade: string;
  yearOfPassing: Date;
  institutionName: string;
  placeOfStudy: string;
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
    TimelineModule,
    ToggleSwitchModule
  ],
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.css']
})
export class ResumeBuilderComponent {

  profileForm!: FormGroup;
  profilePictureForm!: FormGroup;
  profileHighlightsForm!: FormGroup;
  professionalHistoryForm!: FormGroup;
  professionalSummaryForm!: FormGroup;
  selectedFile: File | null = null;
  resumeData: ResumeData = new ResumeData;
  activeStep: number = 1;
  awardsList: Award[] = [];
  certificationsList: Certification[] = [];
  qualifications: Qualification[] = [];
  experiences: Experience[] = [];
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private readonly fb: FormBuilder, private readonly http: HttpClient, private readonly resumeService: ResumeService) {

  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      currentJobTitle: ['', Validators.required],
      specializedSkillTiTle: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      linkedInProfile: [''],
      personalWebsite: [''],
      gitHubProfile: ['']
    });
    this.profilePictureForm = this.fb.group({
      profilePicture: [null, Validators.required]
    });
    this.profileHighlightsForm = this.fb.group({
      skills: this.fb.array([]),
      awards: this.fb.array([]),
      certifications: this.fb.array([])
    });
    this.professionalHistoryForm = this.fb.group({
      educationalQualifications: this.fb.array([]),
      experienceDetails: this.fb.array([])
    });
    this.professionalSummaryForm = this.fb.group({
      summary: ['', Validators.required],
    });
  }

  onImageSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result ?? null;
        this.profilePictureForm.patchValue({
          profilePicture: e.target?.result // Store the base64 string in the form
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onImageClear(fileUpload: FileUpload): void {
    this.imagePreview = null;
    fileUpload.clear();
    this.profilePictureForm.patchValue({
      profilePicture: null // Store the base64 string in the form
    });
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
    if (!isNaN(skillRating)) {
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
    this.awardsList = [...this.awardsList, award];
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
    this.certificationsList = [...this.certificationsList, certification];
    this.certifications.push(this.createCertificationsGroup(
      certification.certificate,
      certification.certificateExpiryDate
    ));
  }

  getCertificationsGroup(index: number): FormGroup {
    return this.certifications.at(index) as FormGroup;
  }

  get experienceDetails(): FormArray {
    return this.professionalHistoryForm.get('experienceDetails') as FormArray;
  }

  getExperienceGroup(index: number): FormGroup {
    return this.experienceDetails.at(index) as FormGroup;
  }

  private createExperiencesGroup(company: string = '', role: string = '', fromDate: any = null, isCurrentJob: any = null, toDate: any = null, projects: Project[] = []): FormGroup {
    return this.fb.group({
      company: [company, Validators.required],
      role: [role, Validators.required],
      fromDate: [new Date(fromDate), Validators.required],
      isCurrentJob: [isCurrentJob, Validators.required],
      toDate: [toDate ? new Date(toDate) : null],
      projects: [projects]
    });
  }

  addExperience(experience: { company: string; role: string; fromDate: any; isCurrentJob: any; toDate: any; projects?: Project[] }): void {
    this.experiences = [...this.experiences, experience];
    this.experienceDetails.push(this.createExperiencesGroup(
      experience.company,
      experience.role,
      experience.fromDate,
      experience.isCurrentJob,
      experience.toDate,
      experience.projects));
  }

  get educationalQualifications(): FormArray {
    return this.professionalHistoryForm.get('educationalQualifications') as FormArray;
  }

  getEducationalQualificationGroup(index: number): FormGroup {
    return this.educationalQualifications.at(index) as FormGroup;
  }

  private createEduQualificationsGroup(qualification: string = '', grade: string = '', yearOfPassing: any = null, institutionName: string = '', placeOfStudy: string = ''): FormGroup {
    return this.fb.group({
      qualification: [qualification, Validators.required],
      grade: [grade, Validators.required],
      yearOfPassing: [new Date(yearOfPassing), Validators.required],
      institutionName: [institutionName, Validators.required],
      placeOfStudy: [placeOfStudy, Validators.required]
    });
  }

  addEducationalQualifications(educationalDetail: { qualification: string; grade: string; yearOfPassing: any; institutionName: string; placeOfStudy: string }) {
    this.qualifications = [...this.qualifications, educationalDetail];
    this.educationalQualifications.push(this.createEduQualificationsGroup(
      educationalDetail.qualification,
      educationalDetail.grade,
      educationalDetail.yearOfPassing,
      educationalDetail.institutionName,
      educationalDetail.placeOfStudy
    ));
  }

  onSubmitProfileForm(activateCallback: (step: number) => void): void {
    if (this.profileForm.valid) {
      const profileData = this.profileForm.value;
      console.log('Profile Data:', profileData);

      // Send the profile data to the server
      this.resumeService.saveProfileData(profileData).subscribe(() => {
        console.log('Profile Data Saved Successfully');
        activateCallback(2); // ✅ Move to the next step
      });
    } else {
      console.error('Profile form is invalid');
      this.profileForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }

  onSubmitProfilePicture(activateCallback: (step: number) => void): void {
    if (this.profilePictureForm.valid) {
      const profilePictureData = this.profilePictureForm.value;

      // Send the base64-encoded image to the server
      this.resumeService.saveProfilePicture(profilePictureData).subscribe(() => {
        console.log('Profile Picture Saved Successfully');
        activateCallback(3); // ✅ Move to the next step
      });
    } else {
      console.error('Profile picture form is invalid');
    }
  }

  onSubmitProfileHighlightsForm(activateCallback: (step: number) => void): void {
    if (this.profileHighlightsForm.valid) {
      const profileHighlightsData = this.profileHighlightsForm.value;

      // Send the profile highlights data to the server
      this.resumeService.saveProfileHighlights(profileHighlightsData).subscribe(() => {
        console.log('Profile Highlights Saved Successfully');
        activateCallback(4); // ✅ Move to the next step
      });
    } else {
      console.error('Profile Highlights form is invalid');
      this.profileHighlightsForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }

  onSubmitProfessionalHistoryForm(activateCallback: (step: number) => void): void {
    if (this.professionalHistoryForm.valid) {
      const professionalHistoryData = this.professionalHistoryForm.value;

      // Send the professional history data to the server
      this.resumeService.saveProfessionalHistory(professionalHistoryData).subscribe(() => {
        console.log('Professional History Saved Successfully');
        activateCallback(5); // ✅ Move to the next step
      });
    } else {
      console.error('Professional History form is invalid');
      this.professionalHistoryForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }

  onSubmitProfessionalSummaryForm(activateCallback: (step: number) => void): void {
    if (this.professionalSummaryForm.valid) {
      const professionalSummaryData = this.professionalSummaryForm.value;

      // Send the professional summary data to the server
      this.resumeService.saveProfessionalSummary(professionalSummaryData).subscribe(() => {
        console.log('Professional Summary Saved Successfully');
        activateCallback(6); // ✅ Move to the next step
      });
    } else {
      console.error('Professional Summary form is invalid');
      this.professionalSummaryForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
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
