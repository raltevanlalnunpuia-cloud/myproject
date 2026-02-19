
export type ProjectStatus = 'Not started' | 'Ongoing' | 'Completed' | 'Delay';

export type SectorType = 'Water Supply' | 'Sewerage & Septage' | 'Waterbody Rejuvenation' | 'Green Spaces & Parks' | 'All';

export interface Project {
  slNo: string;
  name: string;
  ulb: string;
  approvedCost: number;
  receivedAmount: number;
  commencementDate: string;
  targetCompletionDate: string;
  physicalProgress: number;
  financialProgress: number;
  remarks: string;
  sector: SectorType;
  status: ProjectStatus;
}

export interface DashboardStats {
  totalProjects: number;
  totalApprovedCost: number;
  totalReceived: number;
  totalSpent: number;
  statusCounts: Record<ProjectStatus, number>;
  sectorStats: Record<string, { allocated: number; spent: number }>;
}
