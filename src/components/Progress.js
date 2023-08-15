function Progress({ index, numQuestions, points, maxScore, answer }) {
  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong> / {numQuestions}
      </p>
      <p>
        <strong>
          {points} / {maxScore}
        </strong>
      </p>
    </header>
  );
}

export default Progress;
