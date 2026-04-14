export type Vertical = "mortgage" | "insurance" | "home-services";

export interface CourseEmail {
  day: 0 | 2 | 4 | 7 | 10;
  subject: string;
  preheader: string;
  buildHtml: (ctx: EmailContext) => string;
  buildText: (ctx: EmailContext) => string;
}

export interface EmailContext {
  recipientEmail: string;
  firstName?: string;
  playbookUrl: string;
  workbookUrl: string;
  unsubscribeUrl: string;
  vertical: Vertical;
}

export interface CourseModule {
  vertical: Vertical;
  verticalLabel: string;
  emails: [CourseEmail, CourseEmail, CourseEmail, CourseEmail, CourseEmail];
}
