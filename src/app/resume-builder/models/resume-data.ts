export class Profile {
    name: string = '';
    currentJobTitle: string = '';
    specializedSkillTiTle: string = '';
    dateOfBirth: Date | null = null;
    email: string = '';
    phone: string = '';
    address: string = '';
    linkedInProfile: string = '';
    personalWebsite: string = '';
    gitHubProfile: string = '';
    profileLastModified: Date | null = null;
    profileLastModifiedBy: string = '';
}

export class ProfilePicture {
    profilePicture: string = ''; // Base64 encoded string
    profilePictureName: string = '';
    profilePictureLastModified: Date | null = null;
    profilePictureLastModifiedBy: string = '';
}

export class Skill {
    skillName: string = '';
    skillRating: number = 0;
    skillLastModified: Date | null = null;
    skillLastModifiedBy: string = '';
}

export class Award {
    awardTitle: string = '';
    awardedDate: Date | null = null;
    awardLastModified: Date | null = null;
    awardLastModifiedBy: string = '';
}

export class Certification {
    certificate: string = '';
    certificateExpiryDate: Date | null = null;
    certificateLastModified: Date | null = null;
    certificateLastModifiedBy: string = '';
}

export class ProfileHighlights {
    skills: Skill[] = [];
    awards: Award[] = [];
    certifications: Certification[] = [];
    profileHighlightsLastModified: Date | null = null;
    profileHighlightsLastModifiedBy: string = '';
}

export class Project {
    projectName: string = '';
    projectDescription: string = '';
    techStack: string = '';
    projectLastModified: Date | null = null;
    projectLastModifiedBy: string = '';
}

export class Experience {
    company: string = '';
    role: string = '';
    fromDate: Date | null = null;
    isCurrentJob: boolean = false;
    toDate: Date | null = null;
    projects?: Project[];
    experienceLastModified: Date | null = null;
    experienceLastModifiedBy: string = '';
}

export class Qualification {
    qualification: string = '';
    grade: string = '';
    yearOfPassing: string = '';
    institutionName: string = '';
    placeOfStudy: string = '';
    qualificationLastModified: Date | null = null;
    qualificationLastModifiedBy: string = '';
}

export class ProfessionalHistory {
    experiences: Experience[] = [];
    qualifications: Qualification[] = [];
    professionalHistoryLastModified: Date | null = null;
    professionalHistoryLastModifiedBy: string = '';
}

export class Resume {
    id: number = 0;
    profile: Profile;
    profilePicture: ProfilePicture;
    profileHighlights: ProfileHighlights;
    professionalHistory: ProfessionalHistory;
    constructor() {
        this.profile = new Profile();
        this.profilePicture = new ProfilePicture();
        this.profileHighlights = new ProfileHighlights();
        this.professionalHistory = new ProfessionalHistory();
    }
}

