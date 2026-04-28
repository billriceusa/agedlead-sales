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

export interface PublishedArticle {
  title: string;
  slug: string;
  publishDate: string;
  primaryKeyword: string;
  pillar: string;
}

export interface SkippedArticle {
  title: string;
  slug: string;
  reason: string;
}

export interface FailedArticle {
  title: string;
  reason: string;
}

export interface ImageOutcomeReport {
  title: string;
  status: "created" | "rate-limited" | "no-results" | "no-key" | "upload-failed";
  photographer?: string;
  detail?: string;
}

export interface WeeklyReport {
  runDate: string;
  weekStartDate: string;
  analysis: SEOAnalysis | null;
  articlesCreated: PublishedArticle[];
  articlesSkipped: SkippedArticle[];
  articlesFailed: FailedArticle[];
  imageOutcomes?: ImageOutcomeReport[];
  newBriefs: WeeklyBrief[];
  nextWeekPlan: string;
  errors: string[];
  fatalError?: string;
}

// ── SEO Audit Types ──────────────────────────────────────────

export interface GoogleUpdateSummary {
  updateName: string;
  dateRange: string;
  impactSummary: string;
  relevanceToUs: string;
  actionRequired: boolean;
}

export type AuditSeverity = "critical" | "high" | "medium" | "low" | "info";
export type AuditCategory =
  | "technical-seo"
  | "content-quality"
  | "structured-data"
  | "eeat"
  | "affiliate-compliance"
  | "core-web-vitals"
  | "indexing"
  | "internal-linking"
  | "mobile"
  | "security";

export interface AuditFinding {
  id: string;
  category: AuditCategory;
  severity: AuditSeverity;
  title: string;
  description: string;
  currentState: string;
  recommendation: string;
  effort: "trivial" | "small" | "medium" | "large";
  affectedPages?: string[];
}

export interface BacklogItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "open" | "in-progress" | "completed" | "dismissed";
  priority: number;
  category: AuditCategory;
  severity: AuditSeverity;
  title: string;
  description: string;
  recommendation: string;
  effort: "trivial" | "small" | "medium" | "large";
  affectedPages?: string[];
  sourceAudit: string;
  notes?: string;
}

export interface SEOAuditReport {
  runDate: string;
  googleUpdates: GoogleUpdateSummary[];
  overallScore: number;
  findings: AuditFinding[];
  strategyRecommendations: string[];
  contentStrategyUpdates: string[];
  backlogItemsCreated: number;
  backlogItemsResolved: number;
  summary: string;
}

export interface SEOBacklog {
  lastUpdated: string;
  items: BacklogItem[];
}
