export interface OrphanageModel {
  _id?: string;
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
}
