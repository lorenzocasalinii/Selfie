import Event from "../models/Event.js";
import User from "../models/User.js";
import agenda from "../config/agenda.js";
import scheduleEventNotifications from "../scheduler/eventNotificationScheduler.js";
import nodemailer from "nodemailer";
import config from "../config/config.js"
import { createEvent } from "ics";

// Estrai tutti gli eventi
export const getEvents = async (req, res) => {
  const { userID } = req.query;
  try {
    const events = await Event.find({ userID });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero degli eventi" });
  }
};

// Estrai tutti gli eventi a cui è stato invitato
export const getInvitedEvents = async (req, res) => {
  const { userID } = req.query;
  try {
    const events = await Event.find({
      "extendedProps.invitedUsers": {
        $elemMatch: {
          userID: userID,
          status: { $ne: "rejected" }  
        }
      }
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero degli eventi" });
  }
};

// Estrai tutti gli eventi a cui è stato invitato
export const getUnavailableEvents = async (req, res) => {
  const { userID } = req.query;
  try {
    const events = await Event.find({
      userID: userID,
      "extendedProps.markAsUnavailable": true
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero degli eventi" });
  }
};

// Estrai un evento tramite il suo ID
export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOne({ id });

    if (!event) {
      return res.status(404).json({ error: "Evento non trovato" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Errore nel recupero dell'evento:", error);
    res.status(500).json({ error: "Errore durante il recupero dell'evento" });
  }
};

// Crea un evento
export const createNewEvent = async (req, res) => {
  const { eventData, userID } = req.body;

  try {
    const newEvent = new Event({
      ...eventData,
      userID,
    });

    const savedEvent = await newEvent.save();

    await scheduleEventNotifications(agenda, userID, savedEvent);

    if (eventData.extendedProps.invitedUsers.length > 0) {
      for (const invitee of eventData.extendedProps.invitedUsers) {
        const user = await User.findById(invitee.userID).select("name email");
        if (!user) continue;
    
        await agenda.schedule("in 1 second", "send-invite-email", {
          user: user,
          item: newEvent,
          invitee: invitee,
          type: "event"
        });
      }
    }

    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: "Errore nella creazione dell'evento" });
  }
};

// Aggiorna un evento
export const updateEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedEvent = await Event.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ error: "Evento non trovato" });
    }

    await agenda.cancel({
      "data.event.id": id,
      "data.event.userID": updatedEvent.userID,
    });    
    await scheduleEventNotifications(agenda, updatedEvent.userID, updatedEvent);

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento dell'evento" });
  }
};

// Cancella un evento
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findOneAndDelete({ id });

    if (!deletedEvent) {
      return res.status(404).json({ error: "Evento non trovato" });
    }

    await agenda.cancel({
      "data.event.id": id,
      "data.event.userID": deletedEvent.userID,
    });    

    res.status(200).json({ message: "Evento eliminato con successo" });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'eliminazione dell'evento" });
  }
};


//aggiorna cicli completati
export const updateCompletedCycles = async (req, res) => {
  const { id } = req.params;
  const { completedCycles } = req.body;


  if (typeof completedCycles !== "number" || completedCycles < 0) {

    return res
      .status(400)
      .json({ error: "Il valore di completedCycles deve essere un numero valido" });
  }

  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { id },
      { "extendedProps.pomodoroSettings.completedCycles": completedCycles },
      {
        new: true, //per returnare il file aggiornato
        runValidators: true, //per attivare i vari limiti e validatori di mongoose
      }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Evento non trovato" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento dell'evento" });
  }
};

// Accetto l'invito ad un evento
export const acceptEventInvitation = async (req, res) => {

  const { userID } = req.query;
  const { id } = req.params;

  try {
    const event = await Event.findOne({ id });
    if (!event) return res.status(404).send('Evento non trovato');

    const invitee = event.extendedProps.invitedUsers.find(
      (invitee) => invitee.userID === userID
    );
    if (!invitee) return res.status(404).send('Invitato non trovato');

    if (invitee.status !== 'pending') {
      return res.status(403).send('Non puoi modificare la risposta.');
    }

    invitee.status = 'accepted';
    await event.save();

    res.send(`Hai accettato l'invito per ${event.title}`);
  } catch (error) {
    res.status(500).send(`Errore durante la gestione dell'invito`);
  }
}

// Rifiuto l'invito ad un evento
export const rejectEventInvitation = async (req, res) => {
  const { userID } = req.query;
  const { id } = req.params;

  try {
    const event = await Event.findOne({ id });
    if (!event) return res.status(404).send('Evento non trovato');

    const invitee = event.extendedProps.invitedUsers.find(
      (invitee) => invitee.userID === userID
    );
    if (!invitee) return res.status(404).send('Invitato non trovato');

    invitee.status = 'rejected';
    await event.save();

    res.send(`Hai rifiutato l'invito per ${event.title}`);
  } catch (error) {
    res.status(500).send(`Errore durante la gestione dell'invito`);
  }
}

// Positicipo la risposta dell'invito ad un evento
export const resendEventInvitation = async (req, res) => {
  const { userID } = req.query;
  const { id } = req.params;

  try {
    const event = await Event.findOne({ id });
    if (!event) return res.status(404).send('Evento non trovato');

    const invitee = event.extendedProps.invitedUsers.find(
      (invitee) => invitee.userID === userID
    );
    if (!invitee) return res.status(404).send('Invitato non trovato');

    invitee.status = 'pending';
    await event.save();

    const user = await User.findById(invitee.userID).select("name email");

    await agenda.schedule("in 30 minutes", "send-invite-email", {
      user: user,
      item: event,
      invitee: invitee,
      type: "event"
    });

    res.send(`L'invito per ${event.title} verrà inviato nuovamente tra 30 minuti.`);
  } catch (error) {
    res.status(500).send(`Errore durante la gestione dell'invito`);
  }
}

// Invio l'evento per email come file ics
export const sendEventAsICalendar = async (req, res) => {
  try {
    const { event, email } = req.body;

    createEvent(event, async (error, value) => {
      if (error) {
        console.error("Error creating iCalendar event:", error);
        return res.status(500).send("Failed to create iCalendar event.");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.emailUser,
          pass: config.emailPass,
        },
      });

      const mailOptions = {
        from: config.EMAIL_USER,
        to: email,
        subject: "Exported Event",
        icalEvent: {
          filename: "event.ics",
          method: "REQUEST", 
          content: value, 
        },
      };

      await transporter.sendMail(mailOptions);
      res.status(200).send("Email sent successfully with iCalendar event.");
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).send("Failed to send email.");
  }
};