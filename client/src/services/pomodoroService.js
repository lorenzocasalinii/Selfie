import axiosInstance from "./axiosInstance";

//Creare un nuovo Pomodoro
export const createPomodoro = async (pomodoroData) => {
  try {
    const res = await axiosInstance.post('pomodoro', pomodoroData);
    return res.data;
  } catch (error) {
    console.error("Errore nella creazione del Pomodoro:", error);
    throw error;
  }
};

//Ottenere Pomodori precedenti
export const getUserPomodoros = async (nPomodoro, userID) => {
  try {
    const res = await axiosInstance.get('pomodoro', {
      params: {
        limit: nPomodoro,
        userID: userID,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Errore nel recupero dei Pomodori precedenti:", error);
    throw error;
  }
};

//Invio notifica via mail
export const sendPomodoroEmail = async (email, settings) => {
  try {
    const res = await axiosInstance.post('/pomodoro/send-email', { email, settings });
    return res.data;
  } catch (error) {
    console.error("Errore durante l'invio dell'email:", error);
    throw error;
  }
};