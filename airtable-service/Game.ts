class Game {
    constructor(
      public GameID: string,
      public Levels: number,
      public resultsSubbmision: string,
      public scoreVisibilityForPlayers: string,
      public Roles: boolean,
      public IndividualInstructions: boolean,
      public Date: string
    ) {}
  }
  
  export default Game;
  