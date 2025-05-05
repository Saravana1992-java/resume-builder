export class Experience {
    company = '';
    role = '';
    duration = '';
}

export class ResumeData {
    name = '';
    email = '';
    phone = '';
    summary = '';
    skills: string[] = [];
    experience: Experience[] = [];
}