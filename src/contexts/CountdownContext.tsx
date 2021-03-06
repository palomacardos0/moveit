import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownProviderProps {
  children: ReactNode;
}

interface CountdownContextData {

  minutes:number;
  seconds: number;
  hasFinished: boolean;
  isActive: boolean;
  startCountdown: () => void;
  resetCountdown: () => void;

}

 export const CountdownContext = createContext({} as CountdownContextData);

export function CountdownProvider({children}: CountdownProviderProps){
  //para saber qual é o formato do time out 
  let countdownTimeout: NodeJS.Timeout;

  const { startNewChallenge } = useContext(ChallengesContext)

  const [time, setTime] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [hasFinished, setHahFinished] = useState(false)

  const minutes = Math.floor(time/60)
  const seconds = time % 60;

  function startCountdown(){
    setIsActive(true);
  }

  function resetCountdown(){
    clearTimeout(countdownTimeout)
    setIsActive(false)
    setTime(25*60)
    setHahFinished(false)
  }

  useEffect(()=> {
    if (isActive && time > 0){
      countdownTimeout = setTimeout(()=>{
        setTime(time - 1)
      }, 1000)
    }else if(isActive && time === 0){
      setHahFinished(true);
      setIsActive(false);
      startNewChallenge()
    }
  }, [isActive, time])

  return(
  <CountdownContext.Provider value={{
    minutes,
    seconds,
    hasFinished,
    isActive,
    startCountdown,
    resetCountdown
  }}>
    {children}
  </CountdownContext.Provider>)

}

