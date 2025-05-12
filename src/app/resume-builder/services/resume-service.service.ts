import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private readonly apiUrl = 'https://your-api.com/save-form';

  constructor(private readonly http: HttpClient) { }


  // profile form
  savePersonalDetails(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }

  getPersonalDetails() {
    return this.http.get(this.apiUrl);
  }

  updatePersonalDetails(formData: any) {
    return this.http.put(this.apiUrl, formData);
  }

  deletePersonalDetails(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // profile picture form
  saveProfilePicture(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }

  getProfilePicture() {
    return this.http.get(this.apiUrl);
  }

  updateProfilePicture(formData: any) {
    return this.http.put(this.apiUrl, formData);
  }

  deleteProfilePicture(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // skills form
  saveSkills(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }

  getSkills() {
    return this.http.get(this.apiUrl);
  }

  updateSkills(formData: any) {
    return this.http.put(this.apiUrl, formData);
  }

  deleteSkills(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // experiences form 
  saveExperienceDetails(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }

  getExperienceDetails() {
    return this.http.get(this.apiUrl);
  }

  updateExperienceDetails(formData: any) {
    return this.http.put(this.apiUrl, formData);
  }

  deleteExperienceDetails(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // educational qualifications form
  saveEducationalQualifications(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }

  getEducationalQualifications() {
    return this.http.get(this.apiUrl);
  }

  updateEducationalQualifications(formData: any) {
    return this.http.put(this.apiUrl, formData);
  }

  deleteEducationalQualifications(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // professional summary form
  saveProfessionalSummary(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }

  getProfessionalSummary() {
    return this.http.get(this.apiUrl);
  }

  updateProfessionalSummary(formData: any) {
    return this.http.put(this.apiUrl, formData);
  }

  deleteProfessionalSummary(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
