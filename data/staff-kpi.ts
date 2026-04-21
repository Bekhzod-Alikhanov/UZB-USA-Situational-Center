export interface StaffMember {
  id: string;
  name: string;
  role: string;
  directionality: "visits" | "commitments" | "investments" | "trade" | "legal" | "protocol" | "analytics" | "comms";
  tasksAssigned: number;
  tasksCompleted: number;
  avgResponseHrs: number;
  overdueTasks: number;
  monthlyContribution: number;
  is_demo: boolean;
}

export const staff: StaffMember[] = [
  { id: "s-1", name: "Staff Member 1", role: "Project analyst", directionality: "investments", tasksAssigned: 32, tasksCompleted: 28, avgResponseHrs: 4.1, overdueTasks: 1, monthlyContribution: 14, is_demo: true },
  { id: "s-2", name: "Staff Member 2", role: "Trade analyst", directionality: "trade", tasksAssigned: 27, tasksCompleted: 22, avgResponseHrs: 6.2, overdueTasks: 2, monthlyContribution: 11, is_demo: true },
  { id: "s-3", name: "Staff Member 3", role: "Investment analyst", directionality: "investments", tasksAssigned: 41, tasksCompleted: 33, avgResponseHrs: 5.8, overdueTasks: 3, monthlyContribution: 16, is_demo: true },
  { id: "s-4", name: "Staff Member 4", role: "Protocol & scheduling", directionality: "protocol", tasksAssigned: 58, tasksCompleted: 54, avgResponseHrs: 2.3, overdueTasks: 0, monthlyContribution: 22, is_demo: true },
  { id: "s-5", name: "Staff Member 5", role: "Data & analytics", directionality: "analytics", tasksAssigned: 19, tasksCompleted: 17, avgResponseHrs: 7.4, overdueTasks: 0, monthlyContribution: 9, is_demo: true },
  { id: "s-6", name: "Staff Member 6", role: "Legal analyst", directionality: "legal", tasksAssigned: 14, tasksCompleted: 10, avgResponseHrs: 11.5, overdueTasks: 2, monthlyContribution: 6, is_demo: true },
  { id: "s-7", name: "Staff Member 7", role: "Visit preparation", directionality: "visits", tasksAssigned: 48, tasksCompleted: 45, avgResponseHrs: 3.7, overdueTasks: 1, monthlyContribution: 19, is_demo: true },
  { id: "s-8", name: "Staff Member 8", role: "Event management", directionality: "visits", tasksAssigned: 36, tasksCompleted: 31, avgResponseHrs: 4.9, overdueTasks: 1, monthlyContribution: 13, is_demo: true },
  { id: "s-9", name: "Staff Member 9", role: "Communications", directionality: "comms", tasksAssigned: 22, tasksCompleted: 19, avgResponseHrs: 5.4, overdueTasks: 0, monthlyContribution: 8, is_demo: true },
  { id: "s-10", name: "Staff Member 10", role: "Foreign affairs officer", directionality: "commitments", tasksAssigned: 30, tasksCompleted: 24, avgResponseHrs: 6.8, overdueTasks: 3, monthlyContribution: 12, is_demo: true },
];
