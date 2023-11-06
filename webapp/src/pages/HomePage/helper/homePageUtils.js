const handleError = (error) => {
  console.error("Error:", error);
};

export const decryptAndStoreData = async (decryptedData, dispatch) => {
  try {
    dispatch({ type: "SET_GAME_NAME", payload: decryptedData.GameName });
    dispatch({ type: "SET_GROUP_NAME", payload: decryptedData.groupName });
    dispatch({
      type: "SET_NUM_ROUNDS",
      payload: decryptedData.NumberOfRounds,
    });
    const gameInstruction = localStorage.getItem("gameInstruction");
    dispatch({ type: "SET_GAME_INSTRUCTIONS", payload: gameInstruction });
    dispatch({ type: "SET_NAME", payload: decryptedData.name });
    dispatch({ type: "SET_EMAIL", payload: decryptedData.email });
    dispatch({ type: "SET_ROOM_NUMBER", payload: decryptedData.roomNumber });
    dispatch({ type: "SET_GAME_ID", payload: decryptedData.gameID });
    dispatch({
      type: "SET_SCORE_VISIBILITY_FOR_PLAYERS",
      payload: decryptedData.ScoreVisibilityForPlayers,
    });
    if (decryptedData.roleAutoAssigned) {
      dispatch({ type: "SET_ROLE", payload: decryptedData.role });
      dispatch({ type: "SET_ROLES", payload: [] });
    }
    dispatch({
      type: "SET_AUTO_SELECTION",
      payload: decryptedData.roleAutoAssigned,
    });
    dispatch({
      type: "SET_RESULTS_SUBBMISION",
      payload: decryptedData.ResultsSubmission,
    });
  } catch (error) {
    handleError(error);
  }
};
