import type { OrphanageModel } from "@/domain/models";

export type OrphanageValidationError = {
  [key in keyof OrphanageModel]: string[];
};
