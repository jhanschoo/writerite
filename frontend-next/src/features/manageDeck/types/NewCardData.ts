import Delta from 'quill-delta';

export interface NewCardData {
  prompt: Delta,
  fullAnswer: Delta,
  answers: string[],
}
