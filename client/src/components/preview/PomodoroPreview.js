import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserPomodoros } from "../../services/pomodoroService";
import { getEvents } from "../../services/eventService";
import "../../styles/Preview.css";
import pomodoroIcon from "../pomodoro/pomodoro.png";

const PomodoroPreview = () => {
  const [lastPomodoro, setLastPomodoro] = useState(null);
  const [nextPomodoro, setNextPomodoro] = useState(null);
  const [newStudyTime, setNewStudyTime] = useState(0);
  const [newBreakTime, setNewBreakTime] = useState(0);
  const [newCycles, setNewCycles] = useState(0);
  const [windowPreview, setWindowPreview] = useState("last");
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    //Funzione per ottenere ultimo pomodoro, in modo da mostrarne le informazioni nella preview
    const getLastPomodoro = async () => {
      try {
        const listaPomodoro = await getUserPomodoros(1, userID);
        if (listaPomodoro && listaPomodoro.length > 0) {
          setLastPomodoro(listaPomodoro[0]);
        } else {
          setLastPomodoro(null);
        }
      } catch (error) {
        console.error("Get pomodoro non okay: ", error);
      }
    };

    //Funzione per ottenere il prossimo pomodoro in programma nel calendario
    const getNextPomodoro = async () => {
      try {
        const listaEventiPomodoro = await getEvents(userID);
        const currentDate = new Date();

        // Filtra gli eventi per ottenere solo i pomodori futuri e non completati
        const pomodoriFuturi = listaEventiPomodoro.filter((event) => {
          const { isPomodoro } = event.extendedProps || {};
          const { end } = event;
          return (
            isPomodoro &&
            new Date(end) > new Date(currentDate)
          );
        });

        const prossimoPomodoro = pomodoriFuturi.sort((a, b) => new Date(a.end) - new Date(b.end))[0];
        setNextPomodoro(prossimoPomodoro);

      } catch (error) {
        console.error("Errore nel recupero del prossimo pomodoro:", error);
      }
    };

    getNextPomodoro();
    getLastPomodoro();
  }, []);

  //Funzione che genera i link per la preview
  const generatelink = () => {
    let dynamicLink = '';

    if (windowPreview === "last" && lastPomodoro) {
      //Rimanda alla pagina del pomodoro con le stesse impostazioni dell'ultimo
      dynamicLink = `http://localhost:3000/pomodoro?studyTime=${lastPomodoro.studyTime}&breakTime=${lastPomodoro.breakTime}&cycles=${lastPomodoro.cycles}`;
    } else if (windowPreview === "next" && nextPomodoro) {
      //Rimanda al calendario
      dynamicLink = `http://localhost:3000/calendar`;
    } else {
      //Rimanda alla pagina del pomodoro con le impostazioni appena definite
      dynamicLink = `http://localhost:3000/pomodoro?studyTime=${newStudyTime}&breakTime=${newBreakTime}&cycles=${newCycles}`;
    }
    return dynamicLink;
  }

  return (
    <div className="pomodoro-preview">

      <div className="button-container">
        <i
          className={`button-pomoprev-choice ${windowPreview === "add" ? "active" : ""} bi bi-plus`}
          onClick={() => setWindowPreview("add")}
        ></i>

        <i
          className={`button-pomoprev-choice ${windowPreview === "next" ? "active" : ""} bi bi-skip-forward`}
          onClick={() => setWindowPreview("next")}
        ></i>

        <i
          className={`button-pomoprev-choice ${windowPreview === "last" ? "active" : ""} bi bi-arrow-repeat`}
          onClick={() => setWindowPreview("last")}
        ></i>
      </div>



      {windowPreview === "add" ? (
        <div>
          <img src={pomodoroIcon}></img>
          <div className="pomodoro-elements">
            <p>
              <strong>Study Time:</strong>
              <br /> <input type="number" min={1} onChange={(e) => { setNewStudyTime(e.target.value) }}></input> <br />
            </p>
            <p>
              <strong>Break Time:</strong>
              <br /> <input type="number" min={1} onChange={(e) => { setNewBreakTime(e.target.value) }}></input> <br />
            </p>
            <p>
              <strong>Cycles:</strong> <br />
              <input type="number" min={1} onChange={(e) => { setNewCycles(e.target.value) }}></input>
            </p>
          </div>
        </div>
      ) : (windowPreview === "next" ? (
        <>
          {nextPomodoro ? (
            <div>
              <img src={pomodoroIcon}></img>
              <div className="pomodoro-elements">
                <p>
                  <strong>Data:</strong>
                  <br /> {new Date(nextPomodoro.start).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <strong>Durata:</strong>
                  <br /> {nextPomodoro.duration}
                </p>
              </div>
            </div>
          ) : (
            <>
              <img src={pomodoroIcon}></img>
              <p className="pomo-not-found">Nessun pomodoro in programma</p>
            </>
          )}
        </>
      ) : (
        <>
          {lastPomodoro ? (

            <div>
              <img src={pomodoroIcon}></img>
              <div className="pomodoro-elements">
                <p>
                  <strong>Study Time:</strong> <br /> {lastPomodoro.studyTime}{" "}
                  minuti
                </p>
                <p>
                  <strong>Break Time:</strong>
                  <br /> {lastPomodoro.breakTime} minuti
                </p>
                <p>
                  <strong>Cycles:</strong> <br />
                  {lastPomodoro.cycles}
                </p>
              </div>
            </div>
          ) : (
            <p className="pomo-not-found">Crea il tuo primo pomodoro</p>
          )}
        </>
      ))}
      <div className="link-container">
        <Link to={generatelink()} className="link">
          {windowPreview === "add" ? (<>Crea Pomodoro</>)
            : (windowPreview === "next" ? (<>Programma Pomodoro</>)
              : (<>Ripeti Pomodoro</>))
          }

        </Link>

      </div>
    </div>
  );
};

export default PomodoroPreview;
