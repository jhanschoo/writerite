# Create room with external friends

* User is acquainted with User2 outside platform.
* User and User2 become friends on the platform, adding each other in a matter of minutes.
  * This may happen on the dashboard or in the profile page.
* User spies User2 on their friend widget on their dashboard or profile.
  * User2 because User2 has recent activity. That is, User2 has an active session.
    * What does active session mean? The frontend client should request a new session token on a timer. On a potential request, it skips the request if it is not an active tab.
* On the list item displaying User2 is a button that User can click to go to a room with User2.
  * The room chosen is this:
  * If there is no room with just User and User2, no room is immediately created, but upon the first message from either User or User2, a room will be created and every subsequent message will be sent to that room.