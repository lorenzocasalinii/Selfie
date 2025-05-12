import Task from "../models/Task.js";
import User from "../models/User.js";
import agenda from "../config/agenda.js";
import scheduleTaskNotifications from "../scheduler/taskNotificationScheduler.js";

// Estrai tutti le task
export const getTasks = async (req, res) => {
  const { userID } = req.query;
  try {
    const tasks = await Task.find({ userID, "extendedProps.temporary": false });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero delle task" });
  }
};

// Estrai tutte le task a cui è stato invitato
export const getInvitedTasks = async (req, res) => {
  const { userID } = req.query;
  try {
    const tasks = await Task.find({
      "extendedProps.invitedUsers": {
        $elemMatch: {
          userID: userID,
          status: { $ne: "rejected" }  
        }
      }
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero delle task" });
  }
};

// Estrai una task tramite il suo ID
export const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ id });

    if (!task) {
      return res.status(404).json({ error: "Task non trovata" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Errore nel recupero della task:", error);
    res.status(500).json({ error: "Errore durante il recupero della task" });
  }
};

// Crea una task
export const createTask = async (req, res) => {
  const { taskData, userID } = req.body;
  try {
    const newTask = new Task({
      ...taskData,
      userID,
    });

    const savedTask = await newTask.save();

    if (!savedTask.extendedProps.temporary) {
      await scheduleTaskNotifications(agenda, userID, savedTask);

      if (taskData.extendedProps.invitedUsers.length > 0) {
        for (const invitee of taskData.extendedProps.invitedUsers) {
          const user = await User.findById(invitee.userID).select("name email");
          if (!user) continue;
      
          await agenda.schedule("in 1 second", "send-invite-email", {
            user: user,
            item: newTask,
            invitee: invitee,
            type: "task"
          });
        }
      }
    }

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: "Errore nella creazione della task" });
  }
};

// Aggiorna una task
export const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTask = await Task.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: "Task non trovata" });
    }
    
    await agenda.cancel({
      "data.task.id": id,
      "data.task.userID": updatedTask.userID,
    });    
    await scheduleTaskNotifications(agenda, updatedTask.userID, updatedTask);
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento della task" });
  }
};

// Cancella una task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findOneAndDelete({ id });

    if (!deletedTask) {
      return res.status(404).json({ error: "Task non trovata" });
    }

    await agenda.cancel({
      "data.task.id": id,
      "data.task.userID": deletedTask.userID,
    }); 

    res.status(200).json({ message: "Task eliminata con successo" });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'eliminazione della task" });
  }
};

// Accetto l'invito ad una task
export const acceptTaskInvitation = async (req, res) => {

  const { userID } = req.query;
  const { id } = req.params;

  try {
    const task = await Task.findOne({ id });
    if (!task) return res.status(404).send('Task non trovata');

    const invitee = task.extendedProps.invitedUsers.find(
      (invitee) => invitee.userID === userID
    );
    if (!invitee) return res.status(404).send('Invitato non trovato');

    if (invitee.status !== 'pending') {
      return res.status(403).send('Non puoi modificare la risposta.');
    }

    invitee.status = 'accepted';
    await task.save();

    res.send(`Hai accettato l'invito per ${task.title}`);
  } catch (error) {
    res.status(500).send(`Errore durante la gestione dell'invito`);
  }
}

// Rifiuto l'invito ad una task
export const rejectTaskInvitation = async (req, res) => {
  const { userID } = req.query;
  const { id } = req.params;

  try {
    const task = await Task.findOne({ id });
    if (!task) return res.status(404).send('Task non trovata');

    const invitee = task.extendedProps.invitedUsers.find(
      (invitee) => invitee.userID === userID
    );
    if (!invitee) return res.status(404).send('Invitato non trovato');

    invitee.status = 'rejected';
    await task.save();

    res.send(`Hai rifiutato l'invito per ${task.title}`);
  } catch (error) {
    res.status(500).send(`Errore durante la gestione dell'invito`);
  }
}

// Positicipo la risposta dell'invito ad una task
export const resendTaskInvitation = async (req, res) => {
  const { userID } = req.query;
  const { id } = req.params;

  try {
    const task = await Task.findOne({ id });
    if (!task) return res.status(404).send('Task non trovata');

    const invitee = task.extendedProps.invitedUsers.find(
      (invitee) => invitee.userID === userID
    );
    if (!invitee) return res.status(404).send('Invitato non trovato');

    invitee.status = 'pending';
    await task.save();

    const user = await User.findById(invitee.userID).select("name email");

    await agenda.schedule("in 30 minutes", "send-invite-email", {
      user: user,
      item: task,
      invitee: invitee,
      type: "task"
    });

    res.send(`L'invito per ${task.title} verrà inviato nuovamente tra 30 minuti.`);
  } catch (error) {
    res.status(500).send(`Errore durante la gestione dell'invito`);
  }
}