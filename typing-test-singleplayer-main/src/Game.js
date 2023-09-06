import React, { useState, useEffect ,useRef } from "react";
import "./App.css";
import { generate } from "random-words";

const noOfWords = 200;
const seconds = 60;

function Game() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(seconds);
  const [currInput, setCurrInput] = useState("");
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [status, setStatus] = useState("waiting");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const textInput = useRef(null);

  function generateWords() {
    return generate({ exactly: noOfWords });
  }
  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
      if(countDown !==seconds)
      setWordsPerMinute(Number(Math.round((60/seconds)*(correct*seconds)/(seconds - countDown))))
    }
  ,[countDown,correct])

  useEffect(() =>{
    if(status === "started")
    {
      textInput.current.focus();
    }
  },[status])

  const start = () => {
    
    if(status === "finished"){
  
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1)
      setCurrChar("");
    
    }
    if(status !== "started")
      setStatus("started")
    
    let interval = setInterval(() => {
      
      
      setCountDown((prevCount) => {
        if (prevCount === 0) {
       
          setStatus("finished");
          clearInterval(interval);
          setCurrInput("");
          return seconds;
        } else {
          return prevCount - 1;
        }
      });
    }, 1000);
    
  }

   const reset= () => {
    setCountDown(0);
    setStatus("waiting");
    setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1)
      setCurrChar("");
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  }

  function handleKeyDown({ keyCode , key}) {

    if (keyCode === 32) {
      checkMatch();
      setCurrInput("");
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
    }
    else if(keyCode === 8){
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    }

    else{
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
    
  }

  function getCharClass(wordInd, charInd, char){
    if(wordInd === currWordIndex && charInd === currCharIndex && currChar && status !== "finished")
    {
      if(char === currChar)
      return "success";
      else return "failure";
    }
    else if(wordInd === currWordIndex && currCharIndex >= words[currWordIndex].length)
    {
      return "failure";
    }
    else return '';
  }

  return (

    <div className="container App">
      <div className="fw-bold fs-1 mt-3 mx-auto">
        <p>Typing speed Test</p>
      </div>

      <div className="seconds fs-2 mx-auto">
        <p>{countDown}</p>
      </div>

      <div class="input-group mb-3 pt-3 pb-2">
        <input
          ref={textInput}
          disabled={status !== "started"}
          type="text"
          class="form-control"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
          onKeyDown={handleKeyDown}
          value={currInput}
          onChange={(e) => setCurrInput(e.target.value)}
        />
      </div>

      <div className="startButton d-grid gap-2 mb-3">
       {
        status === "waiting" || status === "finished" ?  <button type="button" class="nums btn btn-primary" onClick={start}>
        Start
      </button> :  <button type="button" class="nums btn btn-primary" onClick={reset}>
          Reset
        </button>
       }
      </div>
      {status === "started" && (
        <div className="words bg-body-secondary">
          {" "}
          {words.map((word, i) => (
            <>
              <span key={i}>
                {word.split("").map((char, idx) => (
                  <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                ))}
              </span>
              <span> </span>
            </>
          ))}
        </div>
      )}
      {status !== "waiting" && (
      <div className="container text-center">
      <div className="row align-items-start">
        <div className="col">
          <p className="fs-2">Words Per Minute :</p>
          <p className="seconds fs-1">{correct === 0 ? 0 : wordsPerMinute }</p>
        </div>
        <div className="col">
          <p className="fs-2">Accuracy :</p>
          <p className="seconds fs-1">
            {
              correct === 0 ? 0 :   Math.round((correct / (correct + incorrect)) * 100)
            }%
          </p>
        </div>
      </div>
    </div>
      )}
    </div>
  );
}

export default Game;
