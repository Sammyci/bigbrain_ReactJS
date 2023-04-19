import React, { useState, useEffect } from 'react';
import encapFetch from '../encap.js';

function EditGame ({ game, onClose }) {
  const token = localStorage.getItem('token');
  console.log(game.id)
  const [name, setName] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setName(game.name);
    setThumbnail(game.thumbnail);
    if (game.quizzes) {
      setQuestions(
        game.quizzes.map((q) => ({
          ...q,
          answers: q.answers.map((a) => ({
            ...a,
            isCorrect: a.isCorrect || false,
          })),
        }))
      );
    } else {
      setQuestions([]);
    }
  }, [game]);

  const handleUpdateGame = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        thumbnail,
        questions,
      };
      await encapFetch('admin/quiz/', token, 'PUT', `${game.id}`, payload);
      onClose();
    } catch (error) {
      console.error('Failed to update game:', error);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { name: '', time: 0, answers: [], correctAnswers: [] }]);
  };

  const updateQuestion = (index, updatedQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  const addAnswer = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.push({ text: '', isCorrect: false });
    setQuestions(updatedQuestions);
  };

  const updateAnswer = (questionIndex, answerIndex, updatedAnswer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex] = updatedAnswer;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  return (
    <div className="game-list-container">
      <h2>Edit Game</h2>
      <form onSubmit={handleUpdateGame}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="thumbnail">Thumbnail:</label>
        <input
          type="text"
          id="thumbnail"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />

        <h3>Questions:</h3>
        {questions.map((question, questionIndex) => (
          <div className="game-list-container" key={questionIndex}>
            <div key={questionIndex}>
              <label htmlFor={`question-name-${questionIndex}`}>Question Name:</label>
              <input
                type="text"
                id={`question-name-${questionIndex}`}
                value={question.name}
                onChange={(e) =>
                  updateQuestion(questionIndex, { ...question, name: e.target.value })
                }
              />
              <label htmlFor={`question-time-${questionIndex}`}>Answer Time:</label>
              <input
                type="number"
                id={`question-time-${questionIndex}`}
                value={question.time}
                onChange={(e) =>
                  updateQuestion(questionIndex, { ...question, time: parseInt(e.target.value) })
                }
              />

              <h4>Answers:</h4>
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex}>
                  <label htmlFor={`answer-text-${questionIndex}-${answerIndex}`}>Answer Text:</label>
                  <input
                    type="text"
                    id={`answer-text-${questionIndex}-${answerIndex}`}
                    value={answer.text}
                    onChange={(e) =>
                      updateAnswer(questionIndex, answerIndex, { ...answer, text: e.target.value })
                    }
                  />
                  <label htmlFor={`answer-correct-${questionIndex}-${answerIndex}`}>Correct:</label>
                  <input
                    type="checkbox"
                    id={`answer-correct-${questionIndex}-${answerIndex}`}
                    checked={answer.isCorrect}
                    onChange={(e) =>
                      updateAnswer(questionIndex, answerIndex, { ...answer, isCorrect: e.target.checked })
                    }
                  />
                </div>
              ))}
              <button type="button" onClick={() => addAnswer(questionIndex)}>Add Answer</button>
              <button onClick={() => handleRemoveQuestion(questionIndex)}>Remove Question</button>
            </div>
          </div>
        ))}
      <button type="button" onClick={addQuestion}>Add Question</button>
        <button type="submit">Update Game</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>);
}

export default EditGame;
