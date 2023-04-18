import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import encapFetch from '../encap';

function Game () {
  const { sessionId, playerId, playerName } = useParams();
  const [questionData, setQuestionData] = useState(null);
  // const flag = 1;
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  // const [pollStatus, setPollStatus] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const handleAnswerChange = (answerId) => {
    const newSelectedAnswers = [...selectedAnswers];
    if (newSelectedAnswers.includes(answerId)) {
      const index = newSelectedAnswers.indexOf(answerId);
      newSelectedAnswers.splice(index, 1);
    } else {
      newSelectedAnswers.push(answerId);
    }
    setSelectedAnswers(newSelectedAnswers);
    handleSubmit();
  };
  const [started, setStarted] = useState(false);

  const getPlayerStatus = async () => {
    try {
      const request = await encapFetch(`play/${playerId}/status`, '', 'GET', '', '');
      if (request) {
        const data1 = request;
        console.log(data1)
        setStarted(data1.started);
      }
    } catch (error) {
      alert(`Invalid: ${error}`);
    }
  };

  const fetchQuestion = async () => {
    try {
      const request = await encapFetch(`play/${playerId}/question`, '', 'GET', '', '');
      if (request) {
        const data = request;
        console.log('Question data:', data);
        const error1 = { error: 'Session has not started yet' };
        const error2 = { error: 'Session ID is not an active session' };
        if (data === error1) {
          alert('Session has not started yet');
        } else if (data === error2) {
          alert('Session ID is not an active session');
        } else {
          setQuestionData(data);
          setTimeLeft(data.question.time);
        }
      }
    } catch (error) {
      alert(`Invalid: ${error}`);
    }
  };
  const handleSubmit = async () => {
    // Replace this path with the actual API endpoint path for your application
    console.log('Submitting selected answers:', selectedAnswers);
    const path = `play/${playerId}/answer`;
    try {
      const request = await encapFetch(path, '', 'PUT', '', { answerIds: selectedAnswers });
      // Check if the request is OK
      if (!request.ok) {
        console.log(request);
        throw new Error("Can't move to the next question");
      }
      // Handle request data here
      const data = await request.json();
      console.log(data);
    } catch (error) {
      console.error('Error sending answer:', error);
    }
  };
  const fetchCorrectAnswers = async () => {
    try {
      const request = await encapFetch(`play/${playerId}/answer`, '', 'GET', '', '');
      if (request) {
        const data = request;
        console.log('Correct answers:', data);
        setCorrectAnswers(data.answerIds);
        console.log('data.answerIds: ', data.answerIds);
      }
    } catch (error) {
      console.error('Error fetching correct answers:', error);
    }
  };
  // useEffect(() => {
  //   getPlayerStatus();
  //   if (started) {
  //     fetchQuestion();
  //   }
  //   const statusIntervalId = setInterval(() => {
  //     setPollStatus((prevPollStatus) => !prevPollStatus);
  //   }, 5000); // Poll player status every 5 seconds
  //   return () => clearInterval(statusIntervalId); // Clear polling when the component unmounts
  // }, [pollStatus, started]);
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000); // Reduce timeLeft by 1 every second
      return () => clearTimeout(timerId);
    } else {
      // Show the answer and stop the timer (you can replace this with your desired logic)
      console.log("Time's up!");
    }
  }, [timeLeft]);
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000); // Reduce timeLeft by 1 every second
      return () => clearTimeout(timerId);
    } else {
      // Fetch the correct answers and stop the timer
      console.log("Time's up!");
      fetchCorrectAnswers();
    }
  }, [timeLeft]);
  return (
    <>
      <div style={{ color: 'white' }}>
        <h2>Game Room</h2>
        <p>Session Id: {sessionId}</p>
        <p>Player Name: {playerName}</p>
        <p>Player Id: {playerId}</p>
        <p style={{ color: 'white' }}>
          Current Question:{' '}
          {questionData && questionData.question ? questionData.question.name : 'Waiting for question...'}
        </p>
        {questionData?.question
          ? (
    <form>
      {questionData.question.answers.map((answer, index) => (
        <div key={index}>
          <label>
            <input
              type="checkbox"
              name="answer"
              value={index}
              onChange={() => handleAnswerChange(index)}
            />
            {answer.text ? answer.text : 'Waiting for answer...'}
          </label>
        </div>
      ))}
    </form>
            )
          : (
    <p>...</p>
            )
}<button
  onClick={() => {
    getPlayerStatus();
    if (started) {
      fetchQuestion();
    }
  }}
  disabled={timeLeft && timeLeft > 0} // Disable the button when timeLeft is greater than 0
>
  Next
</button>
<p>Time left: {timeLeft === null ? '...' : timeLeft}</p>
{timeLeft === 0 && questionData && questionData.question && (
  <div>
    <h3>Correct answers:</h3>
    <ul>
      {correctAnswers.map((answerIndex) => (
        <li key={answerIndex}>{correctAnswers}</li>
      ))}
    </ul>
  </div>
)}
      </div>
    </>
  );
}

export default Game;
