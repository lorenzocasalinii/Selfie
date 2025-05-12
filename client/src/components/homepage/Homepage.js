import React, { useState } from "react";
import HomepageStyle from "../../styles/Homepage.css";
import PomodoroPreview from "../preview/PomodoroPreview";
import NotesPreview from "../preview/NotesPreview";
import TimeMachinePreview from "../preview/TimeMachinePreview";
import CalendarPreview from "../preview/CalendarPreview";
import { Link, useNavigate } from "react-router-dom";


const Homepage = () => {
  const [isCalendarPreviewOpen, setIsCalendarPreviewOpen] = useState(false);
  const [isPomodoroPreviewOpen, setIsPomodoroPreviewOpen] = useState(false);
  const [isNotePreviewOpen, setIsNotePreviewOpen] = useState(false);

  const navigate = useNavigate();


  //Scelta anteprima da mostrare
  const renderPreview = () => {
    //Nel caso si voglia aprire preview del calendario
    if (isCalendarPreviewOpen) {
      return (
        <div className="home-preview calendar-preview-mobile">
          <i
            className="bi bi-x-lg"
            onClick={() => setIsCalendarPreviewOpen(false)}
          ></i>
          <h1 className="title">CALENDARIO</h1>
          <p className="subtitle">
            <strong>Gestisci </strong>i tuoi eventi con facilità: <em>visualizza</em>, <em>organizza</em> e <em>pianifica </em>le attività in un'interfaccia intuitiva.
          </p>
          <CalendarPreview />
        </div>
      );
    }

    //Nel caso si voglia aprire preview delle note
    if (isNotePreviewOpen) {
      return (
        <div className="home-preview notes-preview-mobile">
          <i
            className="bi bi-x-lg"
            onClick={() => setIsNotePreviewOpen(false)}
          ></i>
          <div className="section-description">
            <h1 className="title">Note</h1>
            <p className="subtitle">
              Tieni traccia delle tue idee con il nostro{" "}
              <strong>blocco note digitale</strong>. Salva appunti rapidi,
              idee creative e <em>pensieri importanti</em> in un unico posto.

            </p>
          </div>
          <NotesPreview />
        </div>
      );
    }
    //Nel caso si voglia aprire preview del pomodoro
    if (isPomodoroPreviewOpen) {
      return (
        <div className="home-preview pomodoro-preview-mobile">
          <i
            className="bi bi-x-lg"
            onClick={() => setIsPomodoroPreviewOpen(false)}
          ></i>
          <div className="section-description">
            <h1 className="title">POMODORO TECHNIQUE</h1>
            <p className="subtitle">
              Aumenta la tua produttività con la tecnica{" "}
              <strong>Pomodoro</strong>. Lavora in sessioni di{" "}
              <em>tempo concentrato</em>, seguite da brevi pause. Ottieni il
              massimo dal tuo lavoro, rimanendo motivato e concentrato.
            </p>
          </div>
          <PomodoroPreview />
        </div>
      );
    }

    //Nel caso nessuna anteprima fosse aperta
    return (
      <div className="home-grid">
        <div className="elem-grid full-width">
          <i className="bi bi-calendar-event"></i>
          <div className="subsection-calendar" >
            <Link to="/calendar">
              <h2>Calendario</h2>
              <p>Organizza eventi, scadenze e attività in modo efficiente.</p>
            </Link>
            <i
              className="bi bi-box-arrow-up-right"
              onClick={() => setIsCalendarPreviewOpen(true)}
            ></i>
          </div>
          <span className="calendar-preview-tablet"><CalendarPreview /></span> {/* per versione tablet in cui sono direttamente visibili anteprime */}
        </div>


        <div className="elem-grid half-width" >
          <div className="pomodoro-content" >
            <Link to="/pomodoro">
              <i className="bi bi-clock-history"></i>
              <h2>Pomodoro</h2>
            </Link>
            <i
              className="bi bi-box-arrow-up-right"
              onClick={() => setIsPomodoroPreviewOpen(true)}
            ></i>

          </div>
          <span className="pomodoro-preview-tablet"><PomodoroPreview /></span>
        </div>


        <div className="elem-grid half-width">
          <div className="notes-content">
            <Link to='/notes' >
              <i className="bi bi-journal-plus"></i>
              <h2>Note</h2>
            </Link>
            <i
              className="bi bi-box-arrow-up-right"
              onClick={() => setIsNotePreviewOpen(true)}
            ></i>

          </div>
          <span className="notes-preview-tablet"><NotesPreview /></span>
        </div>
      </div>
    );
  };


  return (
    <div>
      <div className="homepage-top">
        <div className="homepage-header">
          <h1>Selfie</h1>
          <Link to="/profile"><i className="bi bi-person-fill" ></i></Link>
        </div>
        <div className="homepage-subheader">
          <p>
            <strong>Organizza</strong> il tuo studio, <br />
            <strong>Ottimizza</strong> il tempo, <br />
            <strong>Raggiungi</strong> i tuoi obiettivi.
          </p>
        </div>
      </div>

      <div className="time-machine-button">
        <TimeMachinePreview />
      </div>


      <div className="homepage-bottom">
        {renderPreview()}

        <div className="home-page-wide"> {/* Questo blocco visto solo se min width 1000px */}

          <div className="bottom-home-page-section section-white">
            <div className="section-description">
              <h1 className="title">Calendario</h1>
              <p className="subtitle">
                Organizza i tuoi impegni con il nostro{" "}
                <strong>calendario interattivo</strong>. Pianifica attività
                quotidiane, eventi e <em>scadenze importanti</em>. Mantieni il
                controllo del tuo tempo in modo semplice e visivamente chiaro.
              </p>
            </div>
            <div className="preview">
              <div className="preview-box">
                <CalendarPreview />
              </div>
            </div>
          </div>



          <div className="bottom-home-page-section section-blue">
            <div className="preview">
              <div className="preview-box">
                <PomodoroPreview />
              </div>
            </div>
            <div className="section-description">
              <h1 className="title">Pomodoro Technique</h1>
              <p className="subtitle">
                Aumenta la tua produttività con la tecnica{" "}
                <strong>Pomodoro</strong>. Lavora in sessioni di{" "}
                <em>tempo concentrato</em>, seguite da brevi pause. Ottieni il
                massimo dal tuo lavoro, rimanendo motivato e concentrato.
              </p>
            </div>
          </div>




          <div className="bottom-home-page-section section-white">
            <div className="section-description">
              <h1 className="title">Note</h1>
              <p className="subtitle">
                Tieni traccia delle tue idee con il nostro{" "}
                <strong>blocco note digitale</strong>. Salva appunti rapidi,
                idee creative e <em>pensieri importanti</em> in un unico posto.
                Semplice, veloce ed efficiente.
              </p>
            </div>
            <div className="preview">
              <div className="preview-box">
                <NotesPreview />
              </div>
            </div>
          </div>


          <div className=" section-blue footer">
            <div className="footer-info">
              <h2>Selfie</h2>
              <ul>
                <li>Lorenzo Casalini</li>
                <li>Gianluca Casaburi</li>
                <li>Vittorio Zedda</li>
              </ul>
            </div>

            <p>Università degli Studi di Bologna - Alma Mater Studiorum</p>

            <div className="footer-links">
              <h4 >Contatti</h4>
              <h4 >Privacy Policy</h4>
              <h4 >Termini di Servizio</h4>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Homepage;
