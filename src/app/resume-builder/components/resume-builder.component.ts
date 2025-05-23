import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { Award, Certification, Experience, Project, Qualification, Resume, Skill } from '../models/resume-data';
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
import { Subject, takeUntil } from 'rxjs';


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

  resume: Resume = new Resume();
  skill: Skill = new Skill();
  award: Award = new Award();
  certification: Certification = new Certification();
  experience: Experience = new Experience();
  qualification: Qualification = new Qualification();
  project: Project = new Project();

  activeStep: number = 1;
  awardList: Award[] = [];
  certificationList: Certification[] = [];
  qualificationList: Qualification[] = [];
  experienceList: Experience[] = [];
  imagePreview: string | ArrayBuffer | null = null;

  today: Date = new Date();

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly fb: FormBuilder, private readonly http: HttpClient, private readonly resumeService: ResumeService) {
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

  /* ngOnInit(): void {
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
  } */

  ngOnInit(): void {
    this.resumeService.getResumeData().pipe(takeUntil(this.destroy$)).subscribe({
      next: (resumeData: Resume) => {
        // Set Profile Form
        this.profileForm.patchValue(resumeData.profile);

        // Set Profile Picture Form
        this.profilePictureForm.patchValue(resumeData.profilePicture);

        // Set Profile Highlights Form
        this.profileHighlightsForm.patchValue({
          skills: resumeData.profileHighlights.skills || [],
          awards: resumeData.profileHighlights.awards || [],
          certifications: resumeData.profileHighlights.certifications || []
        });

        // Populate Skills, Awards, and Certifications FormArrays
        this.setFormArray(this.skills, resumeData.profileHighlights.skills, this.createSkillGroup);
        this.setFormArray(this.awards, resumeData.profileHighlights.awards, this.createAwardGroup);
        this.setFormArray(this.certifications, resumeData.profileHighlights.certifications, this.createCertificationGroup);

        // Set Professional History Form
        this.professionalHistoryForm.patchValue({
          experiences: resumeData.professionalHistory.experiences || [],
          qualifications: resumeData.professionalHistory.qualifications || []
        });

        // Populate Experiences and Qualifications FormArrays
        this.setFormArray(this.experienceDetails, resumeData.professionalHistory.experiences, this.createExperienceGroup);
        this.setFormArray(this.educationalQualifications, resumeData.professionalHistory.qualifications, this.createQualificationGroup);

        this.loadLists(resumeData);

      },
      error: (error) => {
        console.error('Error fetching resume data:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLists(resumeData: Resume): void {
    if (resumeData.profileHighlights) {
      this.awardList = resumeData.profileHighlights.awards || [];
      this.certificationList = resumeData.profileHighlights.certifications || [];
    }
    if (resumeData.professionalHistory) {
      this.experienceList = resumeData.professionalHistory.experiences || [];
      this.qualificationList = resumeData.professionalHistory.qualifications || [];
    }
  }


  // Helper Method to Populate FormArrays
  private setFormArray<T>(
    formArray: FormArray,
    items: T[] | undefined,
    createGroupFn: (item: T) => FormGroup
  ): void {
    formArray.clear();
    if (items) {
      items.forEach((item) => formArray.push(createGroupFn(item)));
    }
  }

  createSkillGroup(skill: Skill): FormGroup {
    return this.fb.group({
      skillName: [skill.skillName],
      skillRating: [skill.skillRating],
      skillLastModified: [skill.skillLastModified]
    });
  }

  createAwardGroup(award: Award): FormGroup {
    return this.fb.group({
      awardTitle: [award.awardTitle],
      awardedDate: [award.awardedDate],
      awardLastModified: [award.awardLastModified]
    });
  }

  createCertificationGroup(cert: Certification): FormGroup {
    return this.fb.group({
      certificate: [cert.certificate],
      certificateExpiryDate: [cert.certificateExpiryDate],
      certificateLastModified: [cert.certificateLastModified]
    });
  }

  createExperienceGroup(exp: Experience): FormGroup {
    return this.fb.group({
      company: [exp.company],
      role: [exp.role],
      fromDate: [exp.fromDate],
      toDate: [exp.toDate],
      isCurrentJob: [exp.isCurrentJob],
      projects: this.fb.array(exp.projects?.map((proj) => this.createProjectGroup(proj)) || [])
    });
  }

  createQualificationGroup(qual: Qualification): FormGroup {
    return this.fb.group({
      qualification: [qual.qualification],
      grade: [qual.grade],
      yearOfPassing: [qual.yearOfPassing],
      institutionName: [qual.institutionName],
      placeOfStudy: [qual.placeOfStudy]
    });
  }

  createProjectGroup(proj: Project): FormGroup {
    return this.fb.group({
      projectName: [proj.projectName],
      projectDescription: [proj.projectDescription],
      techStack: [proj.techStack]
    });
  }
  onImageSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result ?? null;
        this.profilePictureForm.patchValue({
          profilePicture: e.target?.result, // Store the base64 string in the form
          profilePictureName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onImageClear(selectedFile: FileUpload): void {
    this.imagePreview = null;
    selectedFile.clear();
    this.profilePictureForm.patchValue({
      profilePicture: null,
      profilePictureName: ''
    });
  }

  get skills(): FormArray {
    return this.profileHighlightsForm.get('skills') as FormArray;
  }

  addSkill(skill: { skillName: string; skillRating: any }): void {
    const skillRating = Number(skill.skillRating);
    if (!isNaN(skillRating)) {
      const completeSkill: Skill = {
        ...skill,
        skillLastModified: null,
        skillLastModifiedBy: ''
      };
      this.skills.push(this.createSkillGroup(completeSkill));
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

  addAwards(award: { awardTitle: string; awardedDate: any; }): void {
    const completeAward: Award = {
      ...award,
      awardLastModified: null,
      awardLastModifiedBy: ''
    };
    this.awardList = [...this.awardList, completeAward];
    this.awards.push(this.createAwardGroup(completeAward));
  }

  getAwardsGroup(index: number): FormGroup {
    return this.awards.at(index) as FormGroup;
  }

  get certifications(): FormArray {
    return this.profileHighlightsForm.get('certifications') as FormArray;
  }

  addCertifications(certification: { certificate: string; certificateExpiryDate: any; }): void {
    const completeCertification: Certification = {
      ...certification,
      certificateLastModified: null,
      certificateLastModifiedBy: ''
    };
    this.certificationList = [...this.certificationList, completeCertification];
    this.certifications.push(this.createCertificationGroup(completeCertification));
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

  addExperience(experience: { company: string; role: string; fromDate: any; isCurrentJob: any; toDate: any; projects?: Project[] }): void {
    const completeExperience: Experience = {
      ...experience,
      experienceLastModified: null,
      experienceLastModifiedBy: ''
    };
    this.experienceList = [...this.experienceList, completeExperience];
    this.experienceDetails.push(this.createExperienceGroup(completeExperience));
  }

  get educationalQualifications(): FormArray {
    return this.professionalHistoryForm.get('educationalQualifications') as FormArray;
  }

  getEducationalQualificationGroup(index: number): FormGroup {
    return this.educationalQualifications.at(index) as FormGroup;
  }

  addEducationalQualifications(educationalDetail: { qualification: string; grade: string; yearOfPassing: any; institutionName: string; placeOfStudy: string }) {
    // this.qualifications = [...this.qualifications, educationalDetail];
    const completeEducationalDetail: Qualification = {
      ...educationalDetail,
      qualificationLastModified: null,
      qualificationLastModifiedBy: ''
    };
    this.educationalQualifications.push(this.createQualificationGroup(completeEducationalDetail));
  }

  getJobDuration(experience: Experience): string {
    const fromDate = experience.fromDate;
    const toDate = experience.isCurrentJob ? new Date() : experience.toDate;
    if (!fromDate || !toDate) {
      return 'N/A';
    }
    const duration = Math.abs(toDate.getTime() - fromDate.getTime());
    const years = Math.floor(duration / (1000 * 3600 * 24 * 365));
    const months = Math.floor((duration % (1000 * 3600 * 24 * 365)) / (1000 * 3600 * 24 * 30));
    return `${fromDate} - ${toDate} (${years} years ${months} months)`;
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
