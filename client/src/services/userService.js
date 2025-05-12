import axiosInstance from "./axiosInstance";

// Estrae l'oggetto utente tramite il suo id
export const getUser = async (id) => {
  try {
    const response = await axiosInstance.get(`users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || `Errore durante l'estrazione utente`
    );
  }
};

// Aggiorna un utente
export const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || `Errore durante l'aggiornamento utente`
    );
  }
};

// Aggiorna la pfp di un utente
export const updateUserProfilePicture = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await axiosInstance.put(`users/${id}/pfp`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        `Errore durante l'aggiornamento della pfp utente`
    );
  }
};

// Cancella un utente
export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Errore durante la cancellazione utente"
    );
  }
};

// Estrae userID, name, email di tutti gli utenti esistenti
export const getAllUsersBasicInfo = async () => {
  try {
    const response = await axiosInstance.get("users/");
    return response.data; 
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Errore durante il recupero delle informazioni utenti"
    );
  }
};
