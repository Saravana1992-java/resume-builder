import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';



@Component({
  standalone: true,
  selector: 'app-resume-builder',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './resume-builder.component.html',
  styleUrl: './resume-builder.component.css'
})
export class ResumeBuilderComponent {
  resumeData = {
    name: '',
    email: '',
    phone: '',
    summary: '',
    skills: [] as string[],
    experience: [] as { company: string; role: string; duration: string }[]
  };

  addSkill(skill: string) {
    if (skill) {
      this.resumeData.skills.push(skill);
    }
  }

  addExperience(exp: { company: string; role: string; duration: string }) {
    this.resumeData.experience.push(exp);
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
