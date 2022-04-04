import { createContext, ReactNode, useEffect, useState } from 'react'
import challenges from '../../challenges.json'
import Cookies from 'js-cookie'
import { LevelUpModal } from '../components/LevelUpModal';

//38:08
interface ChallengesProviderProps {
  children: ReactNode;
  
  level:number;
  currentExperience:number;
  challengeCompleted: number  ;
}

interface Challenge{
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChalengesContextData{
  level: number;
  currentExperience: number; 
  challengeCompleted: number; 
  experienceToNextLevel: number;
  activeChallenge:Challenge;
  levelUp: () => void;
  startNewChallenge:() => void;
  resetChallenge:() => void;
  completeChallenge: () => void;
  closeLevelUpModal: () => void;
}

export const ChallengesContext = createContext({} as ChalengesContextData)
export function ChallengesProvider({children, ...rest} :ChallengesProviderProps){
  const [level, setLevel] = useState(rest.level ?? 1);
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
  const [challengeCompleted, setchallengeCompleted] = useState(rest.challengeCompleted ?? 0);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  const [activeChallenge, setActiveChallenge] = useState(null);

  const experienceToNextLevel = Math.pow((level+1)*4, 2);

  useEffect(() => {
    Notification.requestPermission();
  }, [])

  useEffect(() => {
    Cookies.set('level', String(level))
    Cookies.set('currentExperience', String(currentExperience))
    Cookies.set('challengeCompleted', String(challengeCompleted))
  }, [level, currentExperience, challengeCompleted])

  function levelUp(){
    setLevel(level+1);
    setIsLevelUpModalOpen(true)
  }

  function closeLevelUpModal(){
    setIsLevelUpModalOpen(false)
  }

  function startNewChallenge(){
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge);

    new Audio('/notification.mp3').play();

    if (Notification.permission === 'granted'){
      new Notification('Novo desafio!', {
        body: `Valendo ${challenge.amount} xp`
      })
    }
  }

  function resetChallenge(){
    setActiveChallenge(null);
  }

  function completeChallenge(){
    if(!activeChallenge){
      return
    }
    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount

    if (finalExperience >= experienceToNextLevel){
      finalExperience = finalExperience - experienceToNextLevel;
      levelUp();
    }
    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setchallengeCompleted(challengeCompleted + 1);
  }

  return(
    <ChallengesContext.Provider value={{
      level, 
      currentExperience, 
      challengeCompleted, 
      levelUp,
      experienceToNextLevel,
      startNewChallenge, 
      activeChallenge,
      resetChallenge,
      completeChallenge,
      closeLevelUpModal}}>
      {children}
      {isLevelUpModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  )
}