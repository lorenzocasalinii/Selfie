import axiosInstance from "./axiosInstance";

// Ottieni tutti gli eventi associati ad un utente
export const getEvents = async (userID) => {
  try {
    const response = await axiosInstance.get(`events`, {
      params: { userID },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante il recupero degli eventi"
    );
  }
};

// Ottieni tutti gli eventi a cui l'utente è stato invitato
export const getInvitedEvents = async (userID) => {
  try {
    const response = await axiosInstance.get(`events/invited`, {
      params: { userID },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante il recupero degli eventi"
    );
  }
};

// Ottieni tutti gli eventi unavailable
export const getUnavailableEvents = async (userID) => {
  try {
    const response = await axiosInstance.get(`events/unavailable`, {
      params: { userID },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante il recupero degli eventi"
    );
  }
};

// Ottieni un evento tramite il suo ID
export const getEventById = async (id) => {
  try {
    const response = await axiosInstance.get(`events/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante il recupero dell'evento"
    );
  }
};

// Crea un nuovo evento
export const createNewEvent = async (eventData, userID) => {
  try {
    const response = await axiosInstance.post(`events`, { eventData, userID });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante la creazione dell'evento"
    );
  }
};

// Aggiorna un evento esistente
export const updateEvent = async (id, eventData) => {
  try {
    const response = await axiosInstance.put(`events/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante l'aggiornamento dell'evento"
    );
  }
};

// Cancella un evento
export const deleteEvent = async (id) => {
  try {
    const response = await axiosInstance.delete(`events/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante l'eliminazione dell'evento"
    );
  }
};

// Gestisce la risposta all'invito di un evento di gruppo
export const handleInvitationResponse = async (id, userID, responseType) => {
  try {
    const response = await axiosInstance.put(
      `events/${id}/${responseType}`,
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

// Gestisce la conversione di un evento in formato iCalendar
export const sendEventAsICalendar = async (id, email, event) => {
  try {
    const response = await axiosInstance.post(`events/${id}/ics`, {
      event,
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante l'invio dell'evento in formato iCalendar"
    );
  }
};

// Aggiorna i cicli completati di un evento pomodoro
export const updateCompletedCycles = async (id, completedCycles) => {
  try {
    const response = await axiosInstance.put(`events/${id}/completed-cycles`, {
      completedCycles,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante l'aggiornamento dei cicli completati"
    );
  }
};
