import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECONDS_PER_QUESTION = 20;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  remainingSeconds: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return {
        ...initialState,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        remainingSeconds: state.questions.length * SECONDS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finished":
      return {
        ...state,
        status: "finish",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };
    case "tick":
      return {
        ...state,
        remainingSeconds: state.remainingSeconds - 1,
        status: state.remainingSeconds === 0 ? "finished" : state.status,
      };
    default:
      // throw new Error("Unknown action");
      console.log("Default action");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highScore, remainingSeconds },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxScore = questions.reduce((prev, cur) => prev + cur.points, 0);

  useEffect(function () {
    async function fetchQuestions() {
      try {
        const res = await fetch("questions");
        const data = await res.json();

        dispatch({ type: "dataRecieved", payload: data });
      } catch (error) {
        dispatch({ status: "error" });
      }
    }

    fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxScore={maxScore}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} remainingSeconds={remainingSeconds} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finish" && (
          <FinishScreen
            points={points}
            maxScore={maxScore}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
