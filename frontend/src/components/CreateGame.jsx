import React from 'react';
import '../App.css';
import encapFetch from '../encap.js';

function CreateGame () {
  const [nameInput, setNameInput] = React.useState('');
  const token = localStorage.getItem('token');

  // File handling
  const [selectedFile, setSelectedFile] = React.useState();
  const [isFilePicked, setIsFilePicked] = React.useState(false);

  // File submission
  const selectFile = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const uploadGameFile = async () => {
    if (isFilePicked === false) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target.result;
      console.log(fileData);

      if (validateGameJSON(fileData) === false) {
        alert('File does not match valid JSON game data structure');
        return;
      }

      const game = JSON.parse(fileData);
      game.questions = game.questions.map((question) => {
        return {
          ...question,
          name: question.name,
          time: question.time,
          answers: question.answers.map((answer) => {
            return {
              text: answer.text,
              isCorrect: answer.isCorrect,
            };
          }),
          correctAnswers: question.answers.reduce((accumulator, answer, index) => {
            if (answer.isCorrect) {
              accumulator.push(index);
            }
            return accumulator;
          }, []),
        };
      });
      console.log('filegame', game);

      // Call createGameWithFile with the processed game data
      createGameWithFile(game);
    };
    reader.readAsText(selectedFile);
  };

  const createGameWithName = async () => {
    if (nameInput === '') {
      alert("Name can't be empty");
      return;
    }

    try {
      const createRequest = await encapFetch(
        'admin/quiz/new',
        token,
        'POST',
        '',
        { name: nameInput }
      );

      if (createRequest.status === 200) {
        const { quizId } = await createRequest.json();
        alert(`Game Created! id: ${quizId}`);
        setNameInput('');
      } else {
        throw createRequest.status;
      }
    } catch (error) {
      setNameInput('');
      alert(`Invalid New Quiz Request: ${error}`);
    }
  };

  const createGameWithFile = async (gameData) => {
    const createRequest = await encapFetch(
      'admin/quiz/new',
      token,
      'POST',
      '',
      { name: gameData.name }
    );
    if (createRequest.status === 200) {
      const { quizId } = await createRequest.json();
      const updateRequest = await encapFetch(
        'admin/quiz/',
        token,
        'PUT',
        `${quizId}`,
        {
          thumbnail: gameData.thumbnail,
          questions: gameData.questions,
        }
      );
      if (updateRequest.status === undefined || updateRequest.status === 200) {
        alert(`Game Created! id: ${quizId}`);
      } else {
        throw updateRequest.status;
      }
    } else {
      throw createRequest.status;
    }
  };

  const validateGameJSON = (gameData) => {
    let game;
    try {
      game = JSON.parse(gameData);
    } catch (error) {
      alert(error);
      return false;
    }

    if (!game.name) {
      alert('Missing game name');
      return false;
    }
    if (!game.thumbnail) {
      alert('Missing game thumbnail');
      return false;
    }
    if (!game.questions) {
      alert('Missing game questions');
      return false;
    }

    for (let i = 0; i < game.questions.length; i++) {
      if (!game.questions[i].name) {
        alert('Missing question name');
        return false;
      }
      if (!game.questions[i].time) {
        alert('Missing question time');
        return false;
      }
      if (!game.questions[i].answers) {
        alert('Missing answers');
        return false;
      }

      for (let j = 0; j < game.questions[i].answers.length; j++) {
        if (!game.questions[i].answers[j].text) {
          alert('Missing answer text');
          return false;
        }
        if (game.questions[i].answers[j].isCorrect === undefined) {
          alert('Missing isCorrect value');
          return false;
        }
      }
    }

    return true;
  };

  return (
    <>
      <div>
        Game name:
        <input
          type="text"
          onChange={(e) => setNameInput(e.target.value)}
          value={nameInput}
        />
        <br />
        Upload Game Data JSON File (optional):<br />
        <input type="file" name="file" onChange={selectFile} />
        {isFilePicked
          ? (
              <div><p>Filename: <b>{selectedFile.name}</b></p></div>
            )
          : (
              <div><p>No file chosen</p></div>
            )
        }
        <br />
        <button onClick={createGameWithName}>
          Create Game (with only name)
        </button>
        <br />
        <button onClick={uploadGameFile}>
          Create Game (with JSON file)
        </button>
      </div>
    </>
  );
}

export default CreateGame;
