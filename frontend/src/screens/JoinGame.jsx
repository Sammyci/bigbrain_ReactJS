import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import encapFetch from '../encap';
function JoinGame () {
  const [playerName, setPlayerName] = useState('');
  const { sessionId } = useParams();
  const [playerId, setPlayerId] = useState('');
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: 处理玩家加入游戏的逻辑
    console.log(`Player ${playerName} joined game ${sessionId}`);
    try {
      const request = await encapFetch('play/join/', '', 'POST', `${sessionId}`, { name: playerName });
      if (request.ok) {
        const data = await request.json();
        setPlayerId(data.playerId);
        console.log(data.playerId);
        navigate(`/play/${sessionId}/${data.playerId}/${playerName}`)
      } else {
        throw new Error(`Error joining game: ${request.status} ${request.statusText}`);
      }
    } catch (error) {
      alert(error);
      console.error(error);
      console.log(playerId);
    }
  };
  return (
    <div style={{ color: 'white' }}>
      <h2>Join Game</h2>
      <p>Session ID: {sessionId}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="playerName">Your Name:</label>
        <input
          type="text"
          id="playerName"
          name="playerName"
          value={playerName}
          onChange={handleInputChange}
        />
        <button type="submit">Join Game</button>
      </form>
    </div>
  );
}

export default JoinGame;
