import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { Resume } from '../models/resume-data';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  private readonly apiUrl = 'http://localhost:8080/api/resume';

  constructor(private readonly http: HttpClient) { }


  // Resume Data
  getResumeData(): Observable<Resume> {
    return this.http.get<Resume>(this.apiUrl).pipe(shareReplay(1)); // Share the result across subscribers
  }


  // profile form
  saveProfileData(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }

  getProfileData() {
    // return this.http.get(this.apiUrl);
    console.warn('getProfileData API not implemented yet.');
    return of(null); // Return null as the API is not implemented
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
    // return this.http.get(this.apiUrl);
    console.warn('getProfilePicture API not implemented yet.');
    return of({ profilePicture: null }); // Return null as the API is not implemented
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
    // return this.http.get(this.apiUrl);
    console.warn('getProfileHighlights API not implemented yet.');
    return of({
      skills: [{ skillName: null, skillRating: null }],
      awards: [{ awardName: null, awardedDate: null }],
      certifications: [{ certificate: null, certificateExpiryDate: null }]
    }); // Return a properly structured object as the API is not implemented
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
    // return this.http.get(this.apiUrl);
    console.warn('getProfessionalHistory API not implemented yet.');
    return of(null); // Return null as the API is not implemented
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
    // return this.http.get(this.apiUrl);
    console.warn('getProfessionalSummary API not implemented yet.');
    return of(null); // Return null as the API is not implemented
  }

  updateProfessionalSummary(formData: any) {
    return this.http.put(this.apiUrl, formData);
  }

  deleteProfessionalSummary(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
