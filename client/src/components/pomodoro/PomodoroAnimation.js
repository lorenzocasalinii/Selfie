import React from 'react';
import '../../../src/styles/PomodoroAnimation.css';

//Animazione del pomodoro, parametri usati per settare la durata e eventuali pause e start del pomodoro
const PomodoroAnimation = ({ studyTime, breakTime, cycles, convertTime, timeLeft, onBreak, isRunning }) => {
  return (
    <div
      className={`timer-animation-countdown ${onBreak ? 'break-mode' : 'study-mode'} ${isRunning ? '' : 'paused'}`}
      style={{
        '--timer-length': studyTime * 60,
        '--pause-length': breakTime * 60,
        '--cycles': cycles,
      }}
    >
      {convertTime(timeLeft)}
    </div>
  );
};

export default PomodoroAnimation;
