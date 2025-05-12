import React, { useEffect, useState, useContext } from "react";
import {
  createPomodoro,
} from "../../services/pomodoroService";
import PomodoroAnimation from "./PomodoroAnimation";
import PomodoroEmailSender from "./PomodoroEmailSender";
import { updateCompletedCycles, updateEvent } from "../../services/eventService";
import { useLocation } from "react-router-dom";
import "../../styles/Pomodoro.css";
import pomodoroIcon from "../pomodoro/pomodoro.png";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


const Pomodoro = () => {
  const [studyTime, setStudyTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [initialStudyTime, setInitialStudyTime] = useState(0);
  const [initialBreakTime, setInitialBreakTime] = useState(0);
  const [remainingcycles, setRemainingCycles] = useState(0);
  const [initialCycles, setInitialCycles] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [isRunning, setIsRunning] = useState(false); //Se il timer è in esecuzione
  const [timeLeft, setTimeLeft] = useState(0);
  const [onBreak, setOnBreak] = useState(false); //Se in pausa o in studio
  const [sessionNumber, setSessionNumber] = useState(0);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0); //Chiave per re-render dell'animazione
  const [isProposalOpen, setisProposalOpen] = useState(false); //Per proposte di studio

  const [searchParams] = useSearchParams();
  const userID = localStorage.getItem("userID");

  const { isAuthenticated } = useContext(AuthContext);

  const location = useLocation();
  const { id, title, pomodoroSettings, selectedEvent } = location.state || {};


  //Funzione per il submit del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Inizio ciclo di studio");
    setTimeLeft(studyTime * 60);
    setRemainingCycles(initialCycles);
    setIsRunning(true);
    setOnBreak(false);
    setSessionNumber(sessionNumber + 1)
    setIsAnimationRunning(true)
    setAnimationKey((prevKey) => prevKey + 1);

    setInitialBreakTime(breakTime)
    setInitialStudyTime(studyTime)

    //Dati da salvare nel database
    const pomodoroData = {
      studyTime: studyTime,
      breakTime: breakTime,
      cycles: initialCycles,
      userID: userID,
    };

    //Se c'è un evento selezionato, aggiorna le impostazioni. Usato per il collegamento tra il calendario e il pomodoro.
    if (selectedEvent) {
      const updatedEventPomodoroSettings = {
        ...selectedEvent,
        extendedProps: {
          ...selectedEvent.extendedProps,
          pomodoroSettings: {
            ...selectedEvent.extendedProps.pomodoroSettings,
            cycles: initialCycles,
            studyTime: studyTime,
            breakTime: breakTime,
          },
        },
      };

      //Aggiorna anche nel database
      try {
        await updateEvent(id, updatedEventPomodoroSettings);
      } catch (error) {
        console.error("Errore aggiornamento sessione pomdooro:", error);
      }
    }

    //Crea il pomodoro nel database
    try {
      await createPomodoro(pomodoroData);
    } catch (error) {
      console.error("Errore creazione pomodoro:", error);
    }
  };


  //Funzione per calcolare proposte di studio
  const calculateProposals = () => {
    const breakTime = Math.floor(totalMinutes * 0.2);
    const studyTime = totalMinutes - breakTime;
    return [
      { study: studyTime, break: breakTime, cycles: 1 },
      { study: Math.floor(studyTime / 2), break: breakTime, cycles: 2 },
      { study: Math.floor(studyTime / 3), break: breakTime, cycles: 3 },
    ];
  };


  //Funzione per convertire i secondi in hh:ss
  const convertTime = () => {
    const seconds = Math.floor(timeLeft);
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = (seconds % 60).toString().padStart(2, "0");

    return `${minutes}:${remainderSeconds}`;
  };


  //Funzione per gestire il completamento di un ciclo, utile per gestione di recupero di pomodori passati non completati
  const handleCycleCompletion = async (eventId, completedCycles) => {
    try {
      const updatedEvent = await updateCompletedCycles(eventId, completedCycles);
    } catch (error) {
      console.error("Errore durante l'aggiornamento dei cicli completati:", error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      //Se passo parametri tramite l'url
      if (searchParams) {
        const studyTime = searchParams.get("studyTime");
        const breakTime = searchParams.get("breakTime");
        const cycles = searchParams.get("cycles");
        setStudyTime(Number(studyTime));
        setBreakTime(Number(breakTime));
        setInitialCycles(Number(cycles));
      }
      //Se passo impostazioni predefinite tramite useLocation
      if (pomodoroSettings) {
        setStudyTime(pomodoroSettings.studyTime)
        setBreakTime(pomodoroSettings.breakTime)
        setInitialCycles(pomodoroSettings.cycles)
      }
    }
  }, [])

  //Per gestire il timer
  useEffect(() => {
    if (isRunning) {
      if (timeLeft > 0) {
        const startTime = Date.now(); //Aumento la precisione dello scorrere del tempo
        const interval = setInterval(() => { //per evitere desync mettendo in pausa
          const elapsed = Date.now() - startTime;
          setTimeLeft((prevTime) => Math.max(prevTime - elapsed / 1000, 0));
        }, 100);

        return () => clearInterval(interval);

      } else if (timeLeft === 0) {
        if (remainingcycles > 0) {
          //Se onBreak falso (quindi non in pausa) allora setta pausa, se onBreak vero (quindi in pausa)allora setta studio
          if (!onBreak) {
            setRemainingCycles((prevCycles) => prevCycles - 1);
            alert("Inizio pausa");
            setTimeLeft(initialBreakTime * 60);
            if (pomodoroSettings && sessionNumber > 0) {
              handleCycleCompletion(id, ((initialCycles - remainingcycles) + 1));
            }
          } else {
            alert("Inizio studio");
            setTimeLeft(initialStudyTime * 60);
          }
          setOnBreak(!onBreak);
        } else {
          //Se finiti cicli
          setIsRunning(false);
          setIsAnimationRunning(false)
          setRemainingCycles(initialCycles);
          alert("Fine ciclo di studio");
        }
      }
    }
  }, [isRunning, timeLeft]);

  return (
    <div>
      <div className="pomodoro">
        <div className="pomodoro-body">
          <div className="left-pomodoro">
            <img src={pomodoroIcon}></img>
            <h1>Pomodoro Technique</h1>

            {/* Form per le impostazioni */}
            <form className="study-form" onSubmit={handleSubmit} id="pomodoro-form">
              <div className="pomo-info-form">
                <label htmlFor="total-time" className="long-label">Tempo complessivo:</label>
                <label htmlFor="total-time" className="short-label">Quanto tempo vuoi studiare? (min)</label>
                <input
                  type="number"
                  id="total-time"
                  value={totalMinutes}
                  onChange={(e) => {
                    setTotalMinutes(e.target.value);
                    if (e.target.value > 5) {
                      setisProposalOpen(true) //Mostra proposte se tempo > 5 min
                    } else setisProposalOpen(false)
                  }}
                />{" "}
                <br />
                {(totalMinutes > 5 && isProposalOpen) && (
                  <>
                    <div className="form-proposals">
                      {calculateProposals().map(
                        (
                          proposal,
                          index //Setta i valori scelti dalle proposte
                        ) => (
                          <button
                            className="proposal-button"
                            key={index}
                            type="button"
                            onClick={() => {
                              setStudyTime(proposal.study);
                              setBreakTime(proposal.break);
                              setInitialCycles(proposal.cycles);
                              setRemainingCycles(proposal.cycles);
                              setisProposalOpen(false);
                            }}
                          >
                            <strong>Studio</strong>: {proposal.study} minuti, <br /> <strong>Pausa</strong>: {proposal.break} minuti, <strong>Cicli</strong>: {proposal.cycles}
                          </button>
                        )
                      )}
                    </div>

                  </>
                )}
              </div>


              {!isProposalOpen && (  //Se proposte non sono aperte
                <>
                  <span className="or">OR</span>

                  <div className="pomo-info-form">
                    <label className="long-label">Tempo di studio (minuti):</label>
                    <label className="short-label">Studio</label>
                    <input
                      type="number"
                      id="study-time"
                      min={1}
                      value={studyTime}
                      required
                      onChange={(e) => {
                        setStudyTime(Number(e.target.value))
                      }}
                    />{" "}
                    <br />
                  </div>

                  <div className="pomo-info-form">
                    <label className="long-label">Tempo di pausa (minuti):</label>
                    <label className="short-label">Break</label>
                    <input
                      type="number"
                      id="break-time"
                      min={1}
                      value={breakTime}
                      required
                      onChange={(e) => setBreakTime(Number(e.target.value))}
                    />{" "}
                    <br />
                  </div>

                  <div className="pomo-info-form">
                    <label className="long-label">Cicli:</label>
                    <label className="short-label">Cicli</label>
                    <input
                      type="number"
                      id="cycles"
                      min={1}
                      value={initialCycles}
                      required
                      onChange={(e) => {
                        setInitialCycles(Number(e.target.value));
                      }}
                    />{" "}
                    <br />
                    <button
                      className="but-start horizontal-layout primary"
                      type="submit"
                    >
                      Inizia Sessione
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          <div className="right-pomodoro">

            {pomodoroSettings && ( //Se proviene dal calendario mostra il titolo dell'evento
              <h2 className="pomodoro-calendar-title">{title}</h2>
            )}


            {(isAnimationRunning) ? (  //Se animazione attiva o in pausa
              <PomodoroAnimation key={animationKey} studyTime={initialStudyTime} breakTime={initialBreakTime} cycles={remainingcycles} timeLeft={timeLeft} convertTime={convertTime} onBreak={onBreak} isRunning={isRunning} />
            ) : (
              <PomodoroAnimation key={animationKey} studyTime={0} breakTime={0} cycles={0} timeLeft={0} convertTime={convertTime} onBreak={onBreak} isRunning={isRunning} />
            )}


            <div className="pomodoro-applyers"> {/* Pulsante di condivisione del pomodoro e di play/pausa */}
              <PomodoroEmailSender studyTime={studyTime} breakTime={breakTime} cycles={initialCycles} />
              <i
                className={`bi ${isRunning ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'} pause-start-button`}
                onClick={() => {
                  if (timeLeft > 0) {
                    setIsRunning(!isRunning);
                  }
                }}
                style={{ cursor: timeLeft > 0 ? 'pointer' : 'not-allowed', opacity: timeLeft > 0 ? '1' : '0.3' }}
              ></i>
            </div>

            <div className="pomodoro-applyers"> {/* Pulsanti per gestire il pomodoro */}
              <button onClick={() => {
                if (timeLeft > 0) {
                  setTimeLeft(0)
                }
              }
              }
                className="pomo-button secondary"
                disabled={timeLeft <= 0}
              >Prossima fase</button>


              <button onClick={() => {
                if (timeLeft > 0) {
                  if (onBreak) {
                    setTimeLeft(initialBreakTime * 60)
                  } else {
                    setTimeLeft(initialStudyTime * 60)
                  }
                  setAnimationKey((prevKey) => prevKey + 1);
                  alert('Ricomincia questa fase')
                }

              }}
                className="pomo-button secondary"
                disabled={timeLeft <= 0}
              >Ricomincia fase</button>


              <button onClick={handleSubmit}
                className="pomo-button secondary"
                disabled={timeLeft <= 0}
              >
                Ricomincia sessione</button>


              <button onClick={() => {
                if (timeLeft > 0) {
                  setIsRunning(false);
                  setIsAnimationRunning(false);
                  setTimeLeft(0)
                  setRemainingCycles(0)
                  alert('Ciclo terminato forzato')
                }

              }}
                className="pomo-button "
                disabled={timeLeft <= 0}
              >Concludi Sessione</button>
            </div>


          </div>
        </div>

        <button //Pulsante creato per la visione del sito da mobile
          className="but-start vertical-layout primary"
          type="submit"
          form="pomodoro-form"
        >
          Inizia Sessione
        </button>
      </div>
    </div>
  );
};

export default Pomodoro;
