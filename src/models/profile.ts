export enum ProfileActionType {
  Cmd = 'cmd',
  Copy = 'copy',
}
export interface ProfileAction {
  type: ProfileActionType;
  title: string;
  value: string;
  button: string;
}

export interface Profile {
  id?: string;
  description?: string;
  seriesActionIndex?: number;
  title: string;
  children: Profile[];
  actions: ProfileAction[];
  seriesActions: string;
  seriesRowSeparator: string;
  seriesColumnSeparator: string;
  createdAt: number;
  updatedAt: number;
}
