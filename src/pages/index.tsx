import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/ProfileBar";
import Head from "next/head";
import { GetServerSideProps } from "next";

import styles from '../styles/pages/Home.module.css'
import { ChallengeBox } from "../components/ChallengeBox";
import { CountdownProvider } from "../contexts/CountdownContext";
import { ChallengesProvider } from "../contexts/ChallengesContext";

interface HomeProps{
  level:number;
  currentExperience:number;
  challengeCompleted: number  ;
}
export default function Home(props : HomeProps) {

  console.log(props)
  return (
  <ChallengesProvider 
    level={props.level} 
    currentExperience={props.currentExperience}
    challengeCompleted={props.challengeCompleted}
  >
    <div className={styles.container}>
      <Head>
        <title>Início | move.it</title>
      </Head>

      <ExperienceBar />
      <CountdownProvider>
        <section>
          <div>
            <Profile/>
            <CompletedChallenges/>
            <Countdown/>

          </div>
          <div>
            <ChallengeBox/>

          </div>
        </section>
      </CountdownProvider>
    </div>
  </ChallengesProvider>
  )

}

export const getServerSideProps: GetServerSideProps = async (ctx)=> {

  const { level, currentExperience, challengeCompleted } = ctx.req.cookies

  return {
    props: {
      level: Number(level), 
      currentExperience: Number(currentExperience), 
      challengeCompleted: Number(challengeCompleted),
    }
  }
}