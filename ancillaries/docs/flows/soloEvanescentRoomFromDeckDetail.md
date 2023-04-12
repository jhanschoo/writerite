# Solo evanescent test from deck

- User is tweaking a deck, on the deck detail page.
- User wants to experience what it is like for the deck to be served.
- User clicks a button, and immediately an evanescent room is created serving the deck.
- The evanescent room will serve the entire deck & descendents, with no configuration.
- The deck may be too large, or the user may have feedback they want to immediately act on before the deck is completed serving.
- To enable the user to act on this, feedback is asked in every round of the quiz, and the user may tweak the timing or content.
  - That is, when presenting results, also ask:
    - If the user wants the result to be recorded,
    - If the user wants to tweak the timing of the card served (assuming that they have deck edit permissions),
    - If the user wants to stop.
- In addition, if there is nobody in a room at the time of asking a question, the quiz should immediately terminate.
