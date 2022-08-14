import { Delta } from 'quill';

export interface NewCardData {
  prompt: Delta,
  fullAnswer: Delta,
  answers: string[],
}
