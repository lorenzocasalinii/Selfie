import axiosInstance from "./axiosInstance";


export const getNotes = async (userID) => {
  try {
    const response = await axiosInstance.get(`notes`, {
      params: { userID },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante il recupero delle note"
    );
  }
};


export const createNote = async (noteData) => {
  try {
    const response = await axiosInstance.post(`notes`, noteData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante la creazione della nota"
    );
  }
};


export const updateNote = async (id, noteData) => {
  try {
    const response = await axiosInstance.put(`notes/${id}`, noteData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante l'aggiornamento della nota"
    );
  }
};

export const deleteNote = async (id) => {
  const userID = localStorage.getItem("userID"); // Ottieni l'ID dell'utente corrente
  return axiosInstance.delete(`notes/${id}`, {
    params: { userID },
  });
};

export const duplicateNote = async (id, userID) => {
  try {
    const response = await axiosInstance.post(`notes/${id}/duplicate`, { userID });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante la duplicazione della nota"
    );
  }
};
