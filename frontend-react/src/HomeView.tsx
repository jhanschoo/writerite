import React, { PureComponent } from 'react';
import { Container, Segment, Grid, Header, Step, Icon, Divider } from 'semantic-ui-react';

import WrNavbar from './WrNavbar';
import WrSignin from './signin/WrSignin';
import { WriteRiteMark } from './util';

class HomeView extends PureComponent {
  public readonly render = () => {
    return (
      <div>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <WrNavbar />
          </Container>
        </Segment>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <Grid stackable={true} divided={true} container={true}>
              <Grid.Row>
                <Grid.Column width={9} textAlign="center" verticalAlign="middle">
                  <Header as="h1">
                    <WriteRiteMark /> is for learning with flashcards and
                    friends. Create decks. Launch quizzes off them. Track your progress (TODO).
                </Header>
                </Grid.Column>
                <Grid.Column width={7}>
                  <WrSignin />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <Header as="h1">
            How it works:
            </Header>
            <Step.Group widths={3}>
              <Step>
                <Icon name="pencil" />
                <Step.Content>
                  <Step.Title>Create a Deck</Step.Title>
                  <Step.Description>
                    Decks are made out of cards: the prompt goes in the front and the answer goes in the back.
                  </Step.Description>
                  <Divider horizontal={true}>or</Divider>
                  <Step.Description>
                    Use one of the decks that others have already created.
                  </Step.Description>
                </Step.Content>
              </Step>
              <Step>
                <Icon name="trophy" />
                <Step.Content>
                  <Step.Title>Host a Room</Step.Title>
                  <Step.Description>
                    Start quizzes where you compete to be the first the cards correctly!
                  </Step.Description>
                  <Divider horizontal={true}>or</Divider>
                  <Step.Description>
                    Join a room and quiz another user has started.
                  </Step.Description>
                </Step.Content>
              </Step>
              <Step>
                <Icon name="search" />
                <Step.Content>
                  <Step.Title>Review how you did (TODO)</Step.Title>
                  <Step.Description>
                    View stats on your cards; which you did well in, which not.
                  </Step.Description>
                </Step.Content>
              </Step>
            </Step.Group>
          </Container>
        </Segment>
      </div>
    );
  }
}

export default HomeView;
