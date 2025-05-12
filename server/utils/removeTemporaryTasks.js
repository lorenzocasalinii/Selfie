import Task from "../models/Task.js";

// Funzione per rimuovere le task temporanee generate dalla time machine
const removeTemporaryTasks = async (userID) => {
  try {
    await Task.deleteMany({
      "extendedProps.temporary": true,
      userID: userID,
    });
    
    console.log("Task temporanei rimosse");
  } catch (error) {
    console.log("Errore durante la rimozione delle task temporanee: ", error);
  }
};

export default removeTemporaryTasks;
