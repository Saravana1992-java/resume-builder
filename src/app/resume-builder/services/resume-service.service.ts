import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private readonly apiUrl = 'https://your-api.com/save-form';

  constructor(private readonly http: HttpClient) { }


  // profile form
  saveProfileData(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }

  getProfileData() {
    return this.http.get(this.apiUrl);
  }

  updateProfileData(formData: any) {
    return this.http.put(this.apiUrl, formData);
  }

  deleteProfileData(id: number) {
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
  saveProfileHighlights(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }

  getProfileHighlights() {
    return this.http.get(this.apiUrl);
  }

  updateProfileHighlights(formData: any) {
    return this.http.put(this.apiUrl, formData);
  }

  deleteProfileHighlights(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // experiences form 
  saveProfessionalHistory(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }

  getProfessionalHistory() {
    return this.http.get(this.apiUrl);
  }

  updateProfessionalHistory(formData: any) {
    return this.http.put(this.apiUrl, formData);
  }

  deleteProfessionalHistory(id: number) {
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
