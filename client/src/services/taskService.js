import axiosInstance from "./axiosInstance";

// Ottieni tutte le task associate ad un utente
export const getTasks = async (userID) => {
  try {
    const response = await axiosInstance.get(`tasks`, {
      params: { userID },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante il recupero delle task"
    );
  }
};

// Ottieni tutte le task a cui l'utente è stato invitato
export const getInvitedTasks = async (userID) => {
  try {
    const response = await axiosInstance.get(`tasks/invited`, {
      params: { userID },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante il recupero delle task"
    );
  }
};

// Ottieni una task tramite il suo ID
export const getTaskById = async (id) => {
  try {
    const response = await axiosInstance.get(`tasks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante il recupero della task"
    );
  }
};

// Crea una nuova task
export const createTask = async (taskData, userID) => {
  try {
    const response = await axiosInstance.post(`tasks`, { taskData, userID });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante la creazione della task"
    );
  }
};

// Aggiorna una task esistente
export const updateTask = async (id, taskData) => {
  try {
    const response = await axiosInstance.put(`tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante l'aggiornamento della task"
    );
  }
};

// Cancella una task
export const deleteTask = async (id) => {
  try {
    const response = await axiosInstance.delete(`tasks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante l'eliminazione della task'"
    );
  }
};

// Gestisce la risposta all'invito di una task di gruppo
export const handleInvitationResponse = async (id, userID, responseType) => {
  try {
    const response = await axiosInstance.put(
      `tasks/${id}/${responseType}`,
      {},
      { params: { userID } }
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante la gestione della risposta all'invito"
    );
  }
};
