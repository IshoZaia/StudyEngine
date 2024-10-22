import React, { useState, useEffect } from 'react';

const AnimatedChoice = ({
  choice,
  question,
  userAnswer,
  showResults,
  onPress,
  disabled,
}) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const isWrongAnswer =
    showResults && userAnswer === choice && choice !== question.answer;

  useEffect(() => {
    let intervalId;
    if (isWrongAnswer) {
      intervalId = setInterval(() => {
        setIsFlashing((prev) => !prev);
      }, 500);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isWrongAnswer]);

  const getBackgroundColor = () => {
    if (!showResults) {
      return userAnswer === choice ? 'cornflowerblue' : 'white';
    }
    if (choice === question.answer) {
      return 'forestgreen';
    }
    if (isWrongAnswer) {
      return isFlashing ? 'red' : 'lightcoral';
    }
    return 'white';
  };

  return (
    <div
      style={{
        backgroundColor: getBackgroundColor(),
        padding: '10px',
        margin: '5px',
        borderRadius: '5px',
        cursor: disabled ? 'default' : 'pointer',
        border: '1px solid #ccc',
      }}
      onClick={() => !disabled && onPress()}
    >
      <span
        style={{
          color: showResults || userAnswer === choice ? 'white' : 'black',
        }}
      >
        {choice}
      </span>
      {isWrongAnswer && (
        <span style={{ marginLeft: '10px', fontSize: '0.8em' }}>
          (Your Choice)
        </span>
      )}
    </div>
  );
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [allAnswered, setAllAnswered] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectid, setProjectid] = useState('');
  const [studygroupID, setStudygroupID] = useState('');
  const [email, setEmail] = useState('');


  useEffect(() => {
    if (!projectid) {
      setIsLoading(true);
    }
    else
    {
    setIsLoading(false);
    const fetchQuestions = async () => {
      try {

        const response = await fetch(`http://localhost:8000/api/project/getQuestions/${projectid}`, {
          headers: {
            'Authorization': `${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          
        }
        const data = await response.json();
        setQuestions(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }
  }, [projectid]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const name = searchParams.get('name');
    const projectid = searchParams.get('project');
    const studygroupID = searchParams.get('studygroup');
    const email = searchParams.get('email');
    setProjectid(projectid);
    setStudygroupID(studygroupID);
    setEmail(email);
    setUserName(name || 'User');
  }, []);

  useEffect(() => {
    const checkAllAnswered = (answers) => {
      const isAllAnswered = questions.every((question) => answers[question.id]);
      setAllAnswered(isAllAnswered);
    };
    if (questions.length > 0) {
      checkAllAnswered(userAnswers);
    }
  }, [questions, userAnswers]);

  const unansweredQuestions =
    questions.length - Object.keys(userAnswers).length;

  const handleAnswerChange = (questionId, choice) => {
    const updatedAnswers = {
      ...userAnswers,
      [questionId]: choice,
    };
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    if (!allAnswered) {
        alert('Please answer all questions before submitting.');
        return;
    }

    let newScore = 0;
    questions.forEach((question) => {
        if (question.answer === userAnswers[question.id]) {
            newScore += 1;
        }
    });
    setScore(newScore);
    setShowResults(true);

    const scoresData = [{
        name: userName, 
        email: email, 
        score: newScore
    }];

    try {
        const response = await fetch(`http://localhost:8000/api/studygroup/${studygroupID}/addscores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ scores: scoresData })
        });

        if (!response.ok) {
            throw new Error('Failed to submit scores');
        }

        const result = await response.json();
        console.log('Scores submitted:', result);
        alert('Your score has been successfully submitted!');
    } catch (error) {
        console.error('Error submitting score:', error);
        alert('There was an error submitting your score. Please try again later.');
    }
};


  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {userName}'s Quiz
      </h1>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '10px',
        }}
      >
        {questions.map((question) => (
          <div
            key={question.id}
            style={{
              marginBottom: '20px',
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '5px',
            }}
          >
            <h3>{question.text}</h3>
            <div>
              {question.choices.map((choice) => (
                <AnimatedChoice
                  key={choice}
                  choice={choice}
                  question={question}
                  userAnswer={userAnswers[question.id]}
                  showResults={showResults}
                  onPress={() =>
                    !showResults && handleAnswerChange(question.id, choice)
                  }
                  disabled={showResults}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        {!showResults && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            style={{
              backgroundColor: allAnswered ? '#4CAF50' : '#ccc',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: allAnswered ? 'pointer' : 'default',
              width: '100%',
            }}
          >
            Submit Answers
            {unansweredQuestions > 0 && ` (${unansweredQuestions} remaining)`}
          </button>
        )}

        {showResults && (
          <div
            style={{
              marginTop: '20px',
              fontSize: '1.2em',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {userName}'s Score: {score} out of {questions.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;