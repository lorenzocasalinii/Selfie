import Message from '../models/Message.js';
import User from '../models/User.js';
import sendEmailNotification from '../utils/sendEmailNotification.js';


// funzione per ottenere i messaggi associati ad un utente
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipients: req.params.userID })
      .populate('sender', 'name email');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};


// funzione per inviare un messaggio ad utente/i
export const sendMessage = async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();


    const senderId = req.body.sender;
    const sender = await User.findById(senderId, { name: 1 });
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }


    const recipientId = req.body.recipients[0];
    const recipient = await User.findById(recipientId, { name: 1, email: 1 });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Invia l'email di notifica
    const subject = `Nuovo messaggio da ${sender.name}`;
    const message = `Hai ricevuto un nuovo messaggio. <a href="http://localhost:3000/inbox">Leggilo qui</a>`;
    await sendEmailNotification(recipient.email, subject, message);

    res.status(201).json({ message: 'Message sent and email notification delivered.', newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};


// funzione per eliminare un messaggio
export const deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};

export const completeMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error completing message', error: error.message });
  }
};

