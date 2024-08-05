import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './Quiz.css';
import { data } from '../../assets/data';

const Quiz = () => {
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [lock, setLock] = useState(false);
    const [result, setResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30); // 30 seconds for each question

    const option1 = useRef(null);
    const option2 = useRef(null);
    const option3 = useRef(null);
    const option4 = useRef(null);

    const optionArray = [option1, option2, option3, option4];

    useEffect(() => {
        if (!result && !lock) {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        handleTimeOut();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [index, lock, result]);

    const handleTimeOut = () => {
        setLock(true);
        optionArray[question.ans - 1].current.classList.add("correct");
    };

    const checkAns = (e, ans) => {
        if (!lock) {
            if (question.ans === ans) {
                e.target.classList.add("correct");
                setScore(prev => prev + 1);
            } else {
                e.target.classList.add("wrong");
                optionArray[question.ans - 1].current.classList.add("correct");
            }
            setLock(true);
        }
    };

    const next = () => {
        if (lock) {
            if (index === data.length - 1) {
                setResult(true);
                return;
            }
            setIndex(prevIndex => prevIndex + 1);
            setLock(false);
            setTimeLeft(30);
            optionArray.forEach(option => {
                option.current.classList.remove("wrong");
                option.current.classList.remove("correct");
            });
        }
    };

    const reset = () => {
        setIndex(0);
        setScore(0);
        setLock(false);
        setResult(false);
        setTimeLeft(30);
        optionArray.forEach(option => {
            option.current.classList.remove("wrong");
            option.current.classList.remove("correct");
        });
    };

    const question = data[index];

    return (
        <div className='container'>
            <h1>React Quiz App</h1>
            <hr />
            {result ? (
                <>
                    <h2>You Scored {score} Out Of {data.length}</h2>
                    <button onClick={reset}>Reset</button>
                </>
            ) : (
                <>
                    <h2>{index + 1}. {question.question}</h2>
                    <ul>
                        <li ref={option1} onClick={(e) => checkAns(e, 1)}>{question.option1}</li>
                        <li ref={option2} onClick={(e) => checkAns(e, 2)}>{question.option2}</li>
                        <li ref={option3} onClick={(e) => checkAns(e, 3)}>{question.option3}</li>
                        <li ref={option4} onClick={(e) => checkAns(e, 4)}>{question.option4}</li>
                    </ul>
                    <div className="timer">Time Left: {timeLeft}s</div>
                    <button onClick={next}>Next</button>
                    <div className="index">{index + 1} of {data.length} questions</div>
                </>
            )}
        </div>
    );
};

export default Quiz;

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<Quiz />);
