import Pomodoro from "../models/Pomodoro.js";
import sendEmailNotification from "../utils/sendEmailNotification.js"

// Funzione per creare un nuovo Pomodoro
export const createPomodoro = async (req, res) => {
  const { studyTime, breakTime, cycles, userID } = req.body;

  if (!studyTime || !breakTime || !cycles || !userID) {
    return res.status(400).json({ message: "Tutti i campi sono obbligatori." });
  }

  try {
    const newPomodoro = new Pomodoro({ studyTime, breakTime, cycles, userID });
    await newPomodoro.save();
    res.status(201).json(newPomodoro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Funzione per ottenere i pomodori eseguiti da un utente, si può scegliere il numero di pomodori da ottenere 
export const getUserPomodoros = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const userID = req.query.userID;

    if (!userID) {
      return res.status(400).json({ message: "userID è richiesto." });
    }

    const pomodoros = limit
      ? await Pomodoro.find({ userID }).limit(limit)
      : await Pomodoro.find({ userID });

    res.status(200).json(pomodoros);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Errore nel recupero dei pomodori",
        error: error.message,
      });
  }
};

//Funzione per inviare la notifica via mail del pomodoro
export const sendPomodoroEmail = async (req, res) => {
  const { email, settings } = req.body;

  if (!email || !settings) {
    return res.status(400).json({ message: "Email e impostazioni sono obbligatorie." });
  }

  try {
    const { studyTime, breakTime, cycles } = settings;
    const dynamicLink = `http://localhost:8000/pomodoro?studyTime=${studyTime}&breakTime=${breakTime}&cycles=${cycles}`;

    const subject = "Ti hanno condiviso delle impostazioni Pomodoro";
    const message = `
      <p>Ecco le impostazioni del timer Pomodoro:</p>
      <ul>
        <li><strong>Tempo di studio:</strong> ${studyTime} minuti</li>
        <li><strong>Tempo di pausa:</strong> ${breakTime} minuti</li>
        <li><strong>Cicli:</strong> ${cycles}</li>
      </ul>
      <p><a href="${dynamicLink}">Clicca qui per iniziare il Pomodoro</a></p>
    `;

    await sendEmailNotification(email, subject, message);
    res.status(200).json({ success: true, message: "Email inviata con successo!" });
  } catch (error) {
    console.error("Errore durante l'invio dell'email:", error);
    res.status(500).json({ success: false, message: "Errore durante l'invio dell'email." });
  }
};

