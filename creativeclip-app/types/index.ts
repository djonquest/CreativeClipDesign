export type PlanTier = "free" | "starter" | "pro";

export type AppUser = {
  id: string;
  email: string;
  plan: PlanTier;
  createdAt: string;
};

export type GenerationInput = {
  prompt: string;
  sourceImageName?: string;
};

export type GenerationResult = {
  id: string;
  imageUrl: string;
  prompt: string;
  model: string;
  createdAt: string;
};

export type CreationRecord = {
  id: string;
  prompt: string;
  imageUrl: string;
  sourceImageName?: string;
  createdAt: string;
  userEmail: string;
};

export type AuthResult = {
  user: AppUser | null;
  error: string | null;
};

export type UserStats = {
  totalCreations: number;
  creationsThisWeek: number;
  plan: PlanTier;
};
