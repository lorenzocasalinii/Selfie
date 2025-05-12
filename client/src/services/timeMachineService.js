import axiosInstance from "./axiosInstance";

// Aggiorna il valore della time machine
export const updateTimeMachine = async (userID, time) => {
    try {
        const updateResponse = await axiosInstance.put(`time-machine/update`, { userID, time });
        return updateResponse.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Errore durante l'aggiornamento della time machine"
      );
    }
  };

// Resetta il valore della time machine al tempo corrente
export const resetTimeMachine = async (userID) => {
  try {
    const response = await axiosInstance.put(`time-machine/reset`, { userID });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante il reset della time machine"
    );
  }
};
