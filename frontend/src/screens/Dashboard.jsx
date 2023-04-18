import React, { useEffect, useState } from 'react';
import CreateGame from '../components/CreateGame';
import Modal from '../components/Modal';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import encapFetch from '../encap.js';
import EditGame from '../components/EditGame';

function Dashboard () {
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
    setClassName('admingame', '');
  };
  updateMenuVisibility();
  const token = localStorage.getItem('token');
  const [gameData, setGameData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

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
        navigate('/dashboard');
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

  const deleteGame = async (quizId) => {
    try {
      await encapFetch(`admin/quiz/${quizId}`, token, 'DELETE');
      fetchGameList();
    } catch (error) {
      alert(`Failed to delete game: ${error}`);
      console.log(error);
    }
  };

  const createInput = {
    title: 'Create Game',
    content: <CreateGame />,
  };

  const handleCreateGameClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchGameList();
  };

  const handleEditGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleCloseEditGame = () => {
    setSelectedGame(null);
    fetchGameList();
  };

  return (
    <>
      <div className="App">
        <button to="/dashboard" onClick={handleCreateGameClick}>
          Create New Game
        </button>
        <button className="button hidden" onClick={fetchGameList}>
          Display Dash
        </button>
      </div>
      <div className="game-list-container">
        <div className="game-list">
          {gameData.map((game) => (
            <div key={game.id} className="game-item">
              <img src={game.thumbnail} alt="game-thumbnail" />
              <h3>{game.name}</h3>
              <p>Number of questions: {game.quizzes?.length ?? 0}</p>
              <p>
                Total time to complete:{''}
                {game.quizzes?.reduce((totalTime, question) => totalTime + question.time, 0) ?? 0}
              </p>
              <button onClick={() => handleEditGameClick(game)}>Edit
              </button>
          <button onClick={() => deleteGame(game.id)}>Delete</button>
        </div>
          ))}
    </div>
  </div>
  {selectedGame && (
    <EditGame
      game={selectedGame}
      onClose={handleCloseEditGame}
    />
  )}
  <Modal
    input={createInput}
    show={showModal}
    onClose={handleCloseModal}
  />
</>
  );
}

export default Dashboard;
