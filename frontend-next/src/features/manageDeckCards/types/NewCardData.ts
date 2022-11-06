import { DeltaPojo } from '@/features/manageDeck/components/ManageDeckDescription';

export interface NewCardData {
  prompt: DeltaPojo;
  fullAnswer: DeltaPojo;
  answers: string[];
}
