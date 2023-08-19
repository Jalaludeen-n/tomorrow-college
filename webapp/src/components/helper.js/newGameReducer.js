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
