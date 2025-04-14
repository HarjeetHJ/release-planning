export interface Release {
  id: string;
  title: string;
  project: string;
  em: string;
  date: string;
  repo: string;
  status: 'Done' | 'On Track' | 'At Risk' | 'Cancelled';
  priority: 'High' | 'Medium' | 'Low';
  businessCommitment: boolean;
  businessCommitmentDate: string;
  businessCommitmentJustification?: string;
  isLastWeek: boolean;
}