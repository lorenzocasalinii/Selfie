import dotenv from "dotenv";
dotenv.config();

import Agenda from 'agenda';

import config from './config.js';
import defineNotificationJob from "../jobs/eventNotificationJob.js";
import defineTaskNotificationJob from "../jobs/taskNotificationJob.js";
import defineOverdueTaskJob from "../jobs/overdueTaskJob.js";
import defineInviteNotificationJob from "../jobs/inviteNotificationJob.js"

// Configuro l'agenda
const agenda = new Agenda({
  db: { address: config.dbURI, collection: 'jobs' }, 
  processEvery: '1 minute', 
  useUnifiedTopology: true,
});


// Definisco i job dell'agenda
defineNotificationJob(agenda);
defineTaskNotificationJob(agenda);
defineOverdueTaskJob(agenda);
defineInviteNotificationJob(agenda);


// Funzione per gestire lo spegnimento dell'agenda
const gracefulShutdown = async () => {
  try {    
    await agenda.stop();
    process.exit(0);
  } catch (err) {
    console.error("Error during graceful shutdown:", err);
    process.exit(1); 
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default agenda;
