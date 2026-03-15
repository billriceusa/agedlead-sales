export interface WeeklyBrief {
  day: "Mon" | "Wed" | "Fri";
  publishDate: string;
  slug: string;
  title: string;
  pillar: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  targetLeadTypes: string[];
  wordCount: string;
  competitiveAngle: string;
  outline: string[];
  internalLinks: string[];
}

export interface SEOAnalysis {
  strategyReview: string;
  competitiveInsights: string;
  newOpportunities: string[];
  trendingTopics: string[];
  recommendedUpdates: string[];
}

export interface ContentPlan {
  analysis: SEOAnalysis;
  briefs: WeeklyBrief[];
  calendarNotes: string;
}

export interface ArticleSection {
  text: string;
  style: "normal" | "h2" | "h3" | "h4" | "blockquote";
}

export interface GeneratedArticle {
  brief: WeeklyBrief;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  sections: ArticleSection[];
  contentType: "pillar" | "cluster";
}

export interface WeeklyReport {
  runDate: string;
  weekStartDate: string;
  analysis: SEOAnalysis;
  articlesPublished: {
    title: string;
    slug: string;
    publishDate: string;
    primaryKeyword: string;
    pillar: string;
  }[];
  newBriefs: WeeklyBrief[];
  nextWeekPlan: string;
  errors: string[];
}
