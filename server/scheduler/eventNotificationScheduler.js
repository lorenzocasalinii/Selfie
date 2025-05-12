import User from "../models/User.js";

// Scheduler per inviare le notifiche all'utente quando un evento viene creato o modificato
const scheduleEventNotifications = async (agenda, userID, event) => {
  try {

    if (!userID || !event || !event.extendedProps.notifications.length) {
      return;
    }

    const user = await User.findById(userID).select("-password");

    if (!user) {
      return;
    }

    const eventStartTime = new Date(event.start);

    for (let i = 0; i < event.extendedProps.notifications.length; i++) {
      const notification = event.extendedProps.notifications[i];
      const notificationTime = new Date(
        eventStartTime.getTime() - notification.timeBefore * 60 * 1000
      );

      // Schedulo la notifica in base al valore indicato
      if (!notification.isSent) {
        await agenda.schedule(notificationTime, "event-notification", {
          event,
          notificationIndex: i,
          userEmail: user.email,
        });
      }
    }
  } catch (err) {
    console.error("Errore durante lo schedule dell'event notification job:", err);
  }
};

export default scheduleEventNotifications;