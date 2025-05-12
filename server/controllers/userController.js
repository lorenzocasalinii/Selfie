import User from "../models/User.js";
import path from "path";

// Funzione per prendere un utente tramite l'ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Funzione per aggiornare un utente tramite l'ID
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Aggiorna i campi
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    user.birthday = req.body.birthday || user.birthday;
    user.sex = req.body.sex || user.sex;

    const updatedUser = await user.save();

    res.status(200).json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      birthday: updatedUser.birthday,
      sex: updatedUser.sex,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Funzione per aggiornare la foto profilo di un utente
export const updateUserProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      const uploadedFilePath = `uploads/profilePictures/${req.file.filename}`;
      user.profilePicture = uploadedFilePath;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Funzione per cancellare un utente tramite l'ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Funzione per ottenere tutti gli ID e i nomi degli utenti
export const getAllUserIdsAndNames = async (req, res) => {
  try {
    const users = await User.find({}, { _id: 1, name: 1 });

    console.log("Utenti trovati:", users);  

    if (users.length === 0) {
      return res.status(404).json({ message: "Nessun utente trovato" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Errore nel recupero degli utenti:", error.message);  
    res.status(500).json({ message: "Errore nel recupero degli utenti", error: error.message });
  }
};

// Funzione per ottenere tutti gli utenti con ID, nome ed email
export const getAllUsersBasicInfo = async (req, res) => {
  try {
    const users = await User.find({}, { _id: 1, name: 1, email: 1 });

    if (users.length === 0) {
      return res.status(404).json({ message: "Nessun utente trovato" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero degli utenti", error: error.message });
  }
};
