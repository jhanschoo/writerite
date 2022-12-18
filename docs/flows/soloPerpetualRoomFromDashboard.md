# Solo perpetual room from dashboard

* User opens the app, and sees the dashboard.
* User sees a list of recently served decks.
* User spies a deck they are interested in, and clicks on a play button.
* User is immediately brought to a room perpetually serving the deck.
* This perpetual room may also be hosting other occupants.
* One joins the perpetual room in this manner.
* A perpetual room serves cards in uniform random manner.
  * TODO: anti-recency-biased manner
  * TODO: occupant-based optimized manner
* One leaves the perpetual room when one round passes in the perpetual
  room without a view from the user viewing the room.
* In the interest of saving computational resources, the quiz is halted when there are no occupants in a perpetual room.