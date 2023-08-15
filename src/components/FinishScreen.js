function FinishScreen({ points, maxScore, highScore, dispatch }) {
  const scorePercentage = (points / maxScore) * 100;
  return (
    <>
      <p className="result">
        You scored <strong>{points}</strong> out of {maxScore} (
        {Math.ceil(scorePercentage)}
        %)
      </p>
      <p className="highscore">Your max score: {highScore} points</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
