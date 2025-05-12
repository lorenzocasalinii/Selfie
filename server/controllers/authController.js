import User from "../models/User.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import crypto from "crypto";
import sendEmailNotification from "../utils/sendEmailNotification.js";
import TimeMachine from "../models/TimeMachine.js";


// Funzione per registrare un nuovo utente
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Utente già registrato con questa email." });
    }

    // Crea un nuovo utente
    const user = new User({ name, email, password });
    await user.save();

    const userID = user._id;

    // Genera un token JWT
    const token = jwt.sign({ userId: userID }, config.jwtSecret, {
      expiresIn: "1h",
    });
    
    // Crea la TimeMachine associata all'utente
    const newTimeMachine = new TimeMachine({
      userID,
      time: new Date(),
      isActive: false,
    });

    await newTimeMachine.save();
    
    res.status(201).json({
      message: "Utente registrato con successo!",
      token,
      userID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore del server." });
  }
};

// Funzione per il login dell'utente
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email o password errati." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email o password errati." });
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "1h",
    });
    const userID = user._id;

    // Trova la TimeMachine associata all'utente e resetta il tempo
    const timeMachine = await TimeMachine.findOne({ userID });
    timeMachine.time = new Date();
    timeMachine.isActive = false;

    await timeMachine.save();

    res.status(200).json({
      message: "Login effettuato con successo!",
      token,
      userID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore del server." });
  }
};

// Funzione per il chiedere il reset della password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato." });
    }

    // Genera un token per il reset della password
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetURL = `http://localhost:8000/reset-password/${resetToken}`;
    
    const body = `
        <p>Hai richiesto di resettare la tua password.</p>
        <p>Clicca sul link sottostante per resettare la tua password:</p>
        <a href="${resetURL}" style="color: blue; text-decoration: underline;">Resetta la password</a>
        <p>Se non hai richiesto questa operazione, ignora questa email.</p>
      `;

    await sendEmailNotification(
      user.email,
      "Password Reset Request",
      body
    );

    res.status(200).json({ message: "Email inviata con successo!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore del server." });
  }
};

// Funzione per resettare la password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token non valido o scaduto." });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password aggiornata con successo!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore del server." });
  }
};
