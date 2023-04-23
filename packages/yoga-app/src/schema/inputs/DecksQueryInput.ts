import { builder } from '../../builder';
import { DecksQueryScope } from '../enums';

export const DecksQueryInput = builder.inputType('DecksQueryInput', {
  fields: (t) => ({
    scope: t.field({ type: DecksQueryScope }),
    titleContains: t.string(),
    stoplist: t.idList(),
  }),
});
