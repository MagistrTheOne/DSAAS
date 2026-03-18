export interface Employee {
  id: string;
  name: string;
  profession: string;
  department?: string;
  skills: string[];
  avatarUrl: string;
  economicSwarm: number;
  timeWorked: number;
  tasksCompleted: number;
  incomeGenerated: number;
  voiceName: string;
  complianceMode?: boolean;
  knowledgeBase?: string[];
  instructions?: string;
  budgetLimit?: number;
}

export type ViewState = 'dashboard' | 'analytics' | 'create' | 'settings' | 'premium' | 'interaction';
