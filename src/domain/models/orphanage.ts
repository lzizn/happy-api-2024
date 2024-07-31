import { FileUploaded } from "@/domain/models";

export interface OrphanageModel {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images?: FileUploaded[];
}
