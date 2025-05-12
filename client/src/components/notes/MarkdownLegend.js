import React from "react";
import "../../styles/MarkdownLegend.css";
import TuxIcon from "../../assets/Tux.png"; 

const MarkdownLegend = ({ onClose }) => {
  return (
    <div className="markdown-legend-overlay">
      <div className="markdown-legend-card">
        <h2>Guida Markdown</h2>
        <p>Markdown è un linguaggio semplice per la formattazione del testo. Ecco come usarlo:</p>
        
        <div className="legend-section">
          <h3>Stile del testo</h3>
          <ul>
            <li>
              <b>Grassetto:</b> <code>**testo**</code> ➡️ <strong>testo</strong>
            </li>
            <li>
              <b>Corsivo:</b> <code>*testo*</code> ➡️ <em>testo</em>
            </li>
            <li>
              <b>Grassetto + Corsivo:</b> <code>***testo***</code> ➡️ <strong><em>testo</em></strong>
            </li>
            <li>
              <b>Barrato:</b> <code>~~testo~~</code> ➡️ <s>testo</s>
            </li>
          </ul>
        </div>
  
        <div className="legend-section">
          <h3>Struttura</h3>
          <ul>
            <li>
              <b>Titoli:</b> Usa <code>#</code> per i titoli.
              <br />
              <code># Titolo 1</code> ➡️ <h1>Titolo 1</h1>
              <br />
              <code>## Titolo 2</code> ➡️ <h2>Titolo 2</h2>
            </li>
            <li>
              <b>Liste puntate:</b> <code>- elemento</code> o <code>* elemento</code>
              <ul>
                <li>Esempio:</li>
                <li>
                  <code>- Uno</code>
                </li>
                <li>
                  <code>- Due</code>
                </li>
              </ul>
            </li>
            <li>
              <b>Liste numerate:</b> <code>1. elemento</code>
              <ol>
                <li>Uno</li>
                <li>Due</li>
              </ol>
            </li>
          </ul>
        </div>
  
        <div className="legend-section">
          <h3>Link e immagini</h3>
          <ul>
            <li>
              <b>Link:</b> <code>[nome](url)</code> ➡️ <a href="https://www.markdowntutorial.com/lesson/1/"> Tutorial Markdown</a>
            </li>
            <li>
              <b>Immagini:</b> <code>![alt](url)</code> ➡️ <img src={TuxIcon} alt="Tux" className="tux-icon" />
            </li>
          </ul>
        </div>
  
        <div className="legend-section">
          <h3>Codice</h3>
          <ul>
            <li>
              <b>Inline:</b> Usa <code>`codice`</code> per creare <code>codice inline</code>.
            </li>
            <li>
              <b>Blocco di codice:</b>
              <pre>
                <code>
                  ```
                  <br />
                  console.log("Un pinguino cammina in un bar...");
                  <br />
                  ```
                </code>
              </pre>
            </li>
          </ul>
        </div>
  
        <button className="primary" onClick={onClose}>
          Chiudi
        </button>
      </div>
    </div>
  );
  
};

export default MarkdownLegend;
