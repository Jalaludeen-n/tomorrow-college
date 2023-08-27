// newGameReducer.js

export const initialState = {
  gameName: "",
  rounds: 0,
  excel: "",
  gameInstructions: null,
  result: "",
  scoreVisibility: "",
  allowAutoSelection: false,
  individualInstructions: false,
  roleValues: [{ role: "", dublicate: false, submit: false }],
  pdfInstructions: [{}],
};

export const newGameReducer = (state, action) => {
  switch (action.type) {
    case "SET_GAME_NAME":
      return { ...state, gameName: action.payload };
    case "SET_NUM_ROUNDS":
      return { ...state, rounds: action.payload };
    case "SET_EXCEL":
      return { ...state, excel: action.payload };
    case "SET_GAME_INSTRUCTIONS":
      return {
        ...state,
        gameInstructions: action.payload,
      };
    case "SET_RESULT":
      return { ...state, result: action.payload };
    case "SET_SCORE_VISIBILITY":
      return { ...state, scoreVisibility: action.payload };
    case "SET_ALLOW_AUTO_SELECTION":
      return { ...state, allowAutoSelection: action.payload };
    case "SET_INDIVIDUAL_INSTRUCTIONS":
      return { ...state, individualInstructions: action.payload };
    case "SET_ROLE_VALUES":
      const { index, role, dublicate, submit } = action.payload;
      const updatedRoleValues = [...state.roleValues];
      if (index >= 0 && index < updatedRoleValues.length) {
        updatedRoleValues[index] = {
          role: role,
          dublicate: dublicate,
          submit: submit,
        };
      } else {
        updatedRoleValues.push({ role, dublicate, submit });
      }
      return {
        ...state,
        roleValues: updatedRoleValues,
      };

    default:
      return state;
  }
};

// newGameReducer.js

export const initialStateForGameDetails = {
  gameName: "",
  groupName: "",
  rounds: 0,
  gameInstructions: null,
  name: "",
  email: "",
  autoSelection: false,
  roles: [],
  role: "",
  roomNumber: "",
  gameID: "",
  resultsSubbmision: "",
  scoreVisibilityForPlayers: "",
  participants: [{}],
};

export const newGameDetailsReducer = (state, action) => {
  switch (action.type) {
    case "SET_GAME_NAME":
      return { ...state, gameName: action.payload };
    case "SET_GAME_ID":
      return { ...state, gameID: action.payload };
    case "SET_GROUP_NAME":
      return { ...state, groupName: action.payload };
    case "SET_NUM_ROUNDS":
      return { ...state, rounds: action.payload };
    case "SET_GAME_INSTRUCTIONS":
      return { ...state, gameInstructions: action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_AUTO_SELECTION":
      return { ...state, autoSelection: action.payload };
    case "SET_ROLES":
      return { ...state, roles: action.payload };
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "SET_ROOM_NUMBER":
      return { ...state, roomNumber: action.payload };
    case "SET_PARTICIPANTS":
      return { ...state, participants: action.payload };
    case "SET_RESULTS_SUBBMISION":
      return { ...state, resultsSubbmision: action.payload };
    case "SET_SCORE_VISIBILITY_FOR_PLAYERS":
      return { ...state, scoreVisibilityForPlayers: action.payload };

    default:
      return state;
  }
};
