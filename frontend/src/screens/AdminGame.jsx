import React, { useEffect, useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import encapFetch from '../encap.js';

function AdminGame () {
  const setClassName = (elementId, className) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.className = className;
    }
  };
  const updateMenuVisibility = () => {
    setClassName('login', 'hidden');
    setClassName('register', 'hidden');
    setClassName('logout', '');
    setClassName('dashboard', '');
    setClassName('admin-game', '');
  };
  updateMenuVisibility();
  const token = localStorage.getItem('token');
  const [gameData, setGameData] = useState([]);
  const [sessionId, setSessionId] = useState([])
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      fetchGameList();
    }
  }, [token]);

  const fetchGameList = async () => {
    try {
      const request = await encapFetch('admin/quiz', token, 'GET');
      if (request) {
        console.log(gameData);
        navigate('/admin_game');
        const gameDataWithQuizzes = await Promise.all(
          request.quizzes.map(async (game) => {
            const quizzesRequest = await encapFetch('admin/quiz/', token, 'GET', `${game.id}`);
            return {
              ...game,
              quizzes: quizzesRequest.questions,
            };
          })
        );
        setGameData(gameDataWithQuizzes);
        console.log(gameData);
      }
    } catch (error) {
      alert(`Invalid Game List Request: ${error}`);
      console.log(error);
    }
  };
  const calculateTotalTime = (quizzes) => {
    return quizzes.reduce((totalTime, quiz) => totalTime + quiz.time, 0);
  };

  const startGame = async (gameId) => {
    try {
      const request = await encapFetch(`admin/quiz/${gameId}/`, token, 'POST', 'start')
      console.log(gameId);
      if (request.status === 200) {
        console.log('Successful Get Quiz Status');
        const data = await request.json();
        console.log('Quiz status data:')
        console.log(data)
        alert('Game Started!')
        const game = gameData.find((game) => game.id === gameId);
        setRemainingQuestions(game.quizzes.length);
        try {
          const request = await encapFetch('admin/quiz/', token, 'GET', `${gameId}`)
          console.log(request)
          if (request) {
            setSessionId(request.active);
            console.log(sessionId);
            localStorage.setItem('sessionIdForResults', request.active);
            fetchGameList();
            setShowCopyDialog(true);
          }
        } catch (error) {
          alert(`Couldnt Get Quiz Session: ${error}`);
        }
      } else if (request.status === 400) {
        alert('Game has already been started!');
      } else throw request.status
    } catch (error) {
    }
  }

  const copySessionId = () => {
    const urlToCopy = `localhost:3000/play/${sessionId}`;
    navigator.clipboard.writeText(urlToCopy).then(
      () => {
        alert('URL copied to clipboard');
        setShowCopyDialog(false);
      },
      (error) => {
        alert('Error copying URL: ' + error);
      }
    );
  };
  const endGame = async (gameId) => {
    try {
      const request = await encapFetch(`admin/quiz/${gameId}/`, token, 'POST', 'end')
      console.log(gameId);
      if (request.status === 200) {
        console.log('Successful Stop Quiz Status');
        const data = await request.json();
        console.log('Quiz status data:')
        console.log(data)
        alert('Game Stoped!')
        try {
          const request = await encapFetch('admin/quiz/', token, 'GET', `${gameId}`)
          console.log(request)
          if (request) {
            setSessionId(request.active);
            console.log(sessionId);
            localStorage.setItem('sessionIdForResults', request.active);
            fetchGameList();
          }
        } catch (error) {
          alert(`Couldnt Get Quiz Session: ${error}`);
        }
      } else if (request.status === 400) {
        alert('Game has already been ended!');
      } else throw request.status
    } catch (error) {
    }
  }
  const nextQuestion = async (gameId) => {
    const advanceQuestionRequest = async () => {
      try {
        const request = await encapFetch(`admin/quiz/${gameId}/advance`, token, 'POST', '');
        console.log(request)
        if (request.status === 200) {
          console.log('Advanced to next question');
          console.log('Advanced to next question');
          setRemainingQuestions((prevRemainingQuestions) => prevRemainingQuestions - 1);
        } else throw request.status
      } catch (error) {
        console.log(error)
      }
    }

    try {
      advanceQuestionRequest();
    } catch (error) {
      alert(`Couldnt Get Quiz Session: ${error}`);
    }
  };

  return (
    <>
    {showCopyDialog && (
    <div className="modal">
      <div className="modal-content">
        <h3>Session ID: {sessionId}</h3>
        <button onClick={copySessionId}>Copy Session ID</button>
      </div>
    </div>
    )}
      <div className="admin-game-container">
        <table className="admin-game-table">
          <thead className="admin-game-thead">
            <tr className="admin-game-tr">
              <th>Thumbnail</th>
              <th>Name</th>
              <th>Questions</th>
              <th>Total Time</th>
              <th>Active</th>
              <th>Created at</th>
              <th>Actions</th>
              <th>Question</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody className="admin-game-tbody">
            {gameData.map((game) => (
              <tr key={game.id}>
                <td>
                  <img src={game.thumbnail} alt="game-thumbnail" width="50" height="50" />
                </td>
                <td>{game.name}</td>
                <td>{game.quizzes.length}</td>
                <td>{calculateTotalTime(game.quizzes)}</td>
                <td>{game.active ? game.active : 'No'}</td>
                <td>{new Date(game.createdAt).toLocaleString()}</td>
                <td>
                   {/* Actions button */}
                   <button onClick={() => startGame(game.id)}>start</button>
                  <button onClick={() => endGame(game.id)}>end</button>
                </td>
                <td>
                  {/* Next question button */}
                  <button onClick={() => nextQuestion(game.id)}>
                    {remainingQuestions > 0 ? 'Next' : 'No more questions'}
                  </button>
                </td>
                <td>
                  {/* Result button */}
                  <button>Result</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminGame;
