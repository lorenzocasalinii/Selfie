### Server

Il server è sviluppato con Node.js ed Express.

#### Index.js
Il punto di ingresso dell'applicazione backend.

#### Config
Contiene le variabili d'ambiente e il setup di agenda.js.

#### Controllers
Contiene la logica di gestione delle richieste per le varie rotte dell'applicazione.

#### Jobs
Contiene i job che vengono schedulati da agenda.js.

#### Models
Contiene lo schema dei modelli MongoDB.

#### Routes
Definisce le API endpoint dell'applicazione.

#### Scheduler
Contiene gli scheduler che si occupano di lanciare i job.

#### Uploads
Cartella dedicata al salvataggio delle foto profilo degli utenti.

#### Utils
Contiene funzioni riutilizzabili.


# EVENTI

## File: `Event.js`

- **id**: Unico identificatore dell'evento.
- **userID**: ID dell'utente associato all'evento.
- **title**: Titolo dell'evento.
- **start**: Data di inizio dell'evento.
- **end**: Data di fine dell'evento.
- **allDay**: Booleano che indica se l'evento dura tutto il giorno.
- **rrule**: Regola di ricorrenza (per eventi ricorrenti).
- **duration**: Durata dell'evento in formato "hh:mm".
- **extendedProps**: Proprietà estese che includono informazioni aggiuntive come la descrizione, la location, gli utenti invitati e le impostazioni Pomodoro.

- **ExtendedPropsSchema**: Contiene le proprietà aggiuntive dell'evento come la location, la descrizione, il tipo di ricorrenza, e altre configurazioni come le notifiche e gli utenti invitati.
- **NotificationSchema**: Definisce le notifiche relative agli eventi (tempo prima dell'invio e stato di invio).

---

## File: `eventController.js`

- **getEvents**: Recupera tutti gli eventi per un determinato utente.
- **getInvitedEvents**: Recupera gli eventi a cui un utente è stato invitato e che non sono stati rifiutati.
- **getUnavailableEvents**: Recupera gli eventi per cui l'utente ha contrassegnato come non disponibile per eventi di gruppo.
- **getEventById**: Recupera un evento tramite il suo ID.
- **createNewEvent**: Crea un nuovo evento, salva l'evento nel database e pianifica le notifiche per l'evento.
- **updateEvent**: Aggiorna un evento esistente. Se l'evento è ricorrente, aggiorna anche la pianificazione delle notifiche.
- **deleteEvent**: Elimina un evento dal database e cancella eventuali notifiche pianificate.
- **acceptEventInvitation**: Accetta un invito ad un evento.
- **rejectEventInvitation**: Rifiuta un invito ad un evento.
- **resendEventInvitation**: Positicipa l'invito ad un evento di 30 minuti.
- **sendEventAsICalendar**: Esporta l'evento come file iCalendar e lo invia tramite email.
- **updateCompletedCycles**: Aggiorna il numero di cicli completati in un evento Pomodoro.

---

## File: `eventRoutes.js`

Questo file contiene le rotte per gestire gli eventi. Ogni rotta è associata a una funzione di controllo definita in `eventController.js`.

### Rotte

- **GET `/events/`**
- **GET `/events/invited`**
- **GET `/events/unavailable`**
- **GET `/events/:id`**
- **POST `/events/`**
- **PUT `/events/:id`**
- **DELETE `/events/:id`**
- **PUT `/events/:id/accept`**
- **PUT `/events/:id/reject`**
- **PUT `/events/:id/resend`**
- **POST `/events/:id/ics`**
- **PUT `/events/:id/completed-cycles`**

---

Ecco la documentazione per le **task** in formato Markdown, seguendo lo stesso schema che hai fornito per gli eventi.

---

# TASK

## File: `Task.js`

- **id**: Unico identificatore della task.
- **userID**: ID dell'utente associato alla task.
- **title**: Titolo della task.
- **start**: Data di inizio della task.
- **end**: Data di fine della task.
- **allDay**: Booleano che indica se la task dura tutto il giorno.
- **duration**: Durata della task in formato "hh:mm".
- **extendedProps**: Proprietà estese che includono informazioni aggiuntive come la data di scadenza, stato, notifiche, utenti invitati e altro.

- **ExtendedPropsSchema**: Contiene le proprietà aggiuntive della task, come la scadenza, lo stato (completato o pendente), se la task è scaduta, le notifiche, e gli utenti invitati con lo stato dell'invito.

---

## File: `taskController.js`

- **getTasks**: Recupera tutte le task per un determinato utente.
- **getInvitedTasks**: Recupera le task a cui un utente è stato invitato e che non sono state rifiutate.
- **getTaskById**: Recupera una task tramite il suo ID.
- **createTask**: Crea una nuova task, la salva nel database e pianifica eventuali notifiche.
- **updateTask**: Aggiorna una task esistente, ripianificando le notifiche.
- **deleteTask**: Elimina una task dal database e cancella le notifiche pianificate.
- **acceptTaskInvitation**: Accetta un invito ad una task.
- **rejectTaskInvitation**: Rifiuta un invito ad una task.
- **resendTaskInvitation**: Positicipa l'invito ad una task di 30 minuti.

---

## File: `taskRoutes.js`

Questo file contiene le rotte per gestire le task. Ogni rotta è associata a una funzione di controllo definita in `taskController.js`.

### Rotte

- **GET `/tasks/`**
- **GET `/tasks/invited`**
- **GET `/tasks/:id`**
- **POST `/tasks/`**
- **PUT `/tasks/:id`**
- **DELETE `/tasks/:id`**
- **PUT `/tasks/:id/accept`**
- **PUT `/tasks/:id/reject`**
- **PUT `/tasks/:id/resend`**

--- 

Ecco la documentazione per la **Time Machine** in formato Markdown, seguendo lo stesso schema:

---

# TIME MACHINE

## File: `TimeMachine.js`

- **userID**: ID dell'utente associato alla Time Machine.
- **time**: Data e ora salvate nella Time Machine.
- **isActive**: Stato della Time Machine (attiva o non attiva).

---

## File: `timeMachineController.js`

- **updateTimeMachine**: Aggiorna il tempo della Time Machine per un utente specifico e la segna come attiva.
- **resetTimeMachine**: Ripristina la Time Machine per un utente, resettando il tempo e disattivandola.

---

## File: `timeMachineRoutes.js`

Questo file contiene le rotte per gestire la Time Machine. Ogni rotta è associata a una funzione di controllo definita in `timeMachineController.js`.

### Rotte

- **PUT `/time-machine/update`**
- **PUT `/time-machine/reset`**

---

# UTENTE E AUTENTICAZIONE

## File: `User.js`

Questo file definisce il modello di `User` che viene utilizzato per interagire con il database. Contiene la logica di crittografia della password e la validazione delle credenziali.

### Schema dell'Utente

- **name** (stringa): Il nome dell'utente (obbligatorio).
- **email** (stringa): L'email dell'utente (univoca e obbligatoria). Deve corrispondere a un pattern di email valido.
- **password** (stringa): La password dell'utente (obbligatoria).
- **profilePicture** (stringa): Il percorso dell'immagine del profilo (predefinito: "uploads/default.jpg").
- **bio** (stringa): La biografia dell'utente (predefinita: vuota).
- **birthday** (data): La data di nascita dell'utente (predefinita: `null`).
- **sex** (stringa): Il sesso dell'utente. Può essere uno tra: "male", "female", "prefer not to say" (predefinito: "prefer not to say").
- **resetPasswordToken** (stringa): Il token per il reset della password (opzionale).
- **resetPasswordExpires** (data): La data di scadenza del token per il reset della password (opzionale).

### Metodi

#### 1. **pre("save")**

- **Descrizione**: Questo metodo viene eseguito prima del salvataggio di un nuovo utente o quando viene modificata la password. Crittografa la password usando `bcrypt`.
- **Funzione**: Se la password è modificata, viene crittografata utilizzando un "salt" di 10 round.

#### 2. **matchPassword(password)**

- **Descrizione**: Confronta la password inserita con quella memorizzata nel database.
- **Input**: `password` (stringa): la password inserita dall'utente.
- **Output**: Restituisce `true` se la password corrisponde, altrimenti `false`.

---

## File: `userController.js`

Questo file contiene le funzioni di controllo per la gestione degli utenti, come il recupero, l'aggiornamento, la cancellazione e la gestione della foto profilo.

### Funzioni

#### 1. **getUser(req, res)**

- **Descrizione**: Recupera i dettagli di un utente specificato dall'ID.
- **Input**:
  - `id` (ObjectId): ID dell'utente da recuperare.
- **Output**:
  - Restituisce i dettagli dell'utente, escluso il campo `password`.
  - Restituisce un errore se l'utente non viene trovato.
- **Flusso**:
  1. Trova l'utente nel database usando l'ID.
  2. Restituisce i dettagli dell'utente se trovato.

#### 2. **updateUser(req, res)**

- **Descrizione**: Aggiorna le informazioni di un utente specificato dall'ID.
- **Input**:
  - `id` (ObjectId): ID dell'utente da aggiornare.
  - Dati opzionali nel corpo della richiesta:
    - `name` (stringa): Nuovo nome dell'utente.
    - `email` (stringa): Nuovo indirizzo email dell'utente.
    - `bio` (stringa): Nuova bio dell'utente.
    - `birthday` (data): Nuova data di nascita dell'utente.
    - `sex` (stringa): Nuovo sesso dell'utente.
- **Output**:
  - Restituisce le informazioni aggiornate dell'utente.
  - Restituisce un errore se l'utente non viene trovato.
- **Flusso**:
  1. Trova l'utente nel database.
  2. Aggiorna i campi dell'utente.
  3. Restituisce i dati aggiornati.

#### 3. **updateUserProfilePicture(req, res)**

- **Descrizione**: Aggiorna la foto del profilo di un utente specificato dall'ID.
- **Input**:
  - `id` (ObjectId): ID dell'utente da aggiornare.
  - `file` (file): Nuova immagine del profilo.
- **Output**:
  - Restituisce un messaggio di successo e il percorso dell'immagine aggiornata.
  - Restituisce un errore se l'utente non viene trovato o se c'è un problema nel caricamento del file.
- **Flusso**:
  1. Trova l'utente nel database.
  2. Carica e salva il percorso del file nel campo `profilePicture`.
  3. Restituisce il percorso dell'immagine aggiornata.

#### 4. **deleteUser(req, res)**

- **Descrizione**: Elimina un utente specificato dall'ID.
- **Input**:
  - `id` (ObjectId): ID dell'utente da eliminare.
- **Output**:
  - Restituisce un messaggio di successo se l'utente è stato eliminato.
  - Restituisce un errore se l'utente non viene trovato.
- **Flusso**:
  1. Trova l'utente nel database.
  2. Elimina l'utente dal database.
  3. Restituisce un messaggio di successo.

#### 5. **getAllUserIdsAndNames(req, res)**

- **Descrizione**: Recupera una lista di tutti gli utenti con ID e nome.
- **Output**:
  - Restituisce un array con gli ID e i nomi di tutti gli utenti.
  - Restituisce un errore se non ci sono utenti nel sistema.
- **Flusso**:
  1. Recupera tutti gli utenti con ID e nome dal database.
  2. Restituisce la lista di utenti.

#### 6. **getAllUsersBasicInfo(req, res)**

- **Descrizione**: Recupera una lista di tutti gli utenti con ID, nome ed email.
- **Output**:
  - Restituisce un array con gli ID, i nomi e le email di tutti gli utenti.
  - Restituisce un errore se non ci sono utenti nel sistema.
- **Flusso**:
  1. Recupera tutti gli utenti con ID, nome e email dal database.
  2. Restituisce la lista di utenti.

---

## File: `userRoutes.js`

Questo file contiene le rotte per gestire le operazioni sugli utenti. Ogni rotta è associata a una funzione di controllo definita in `userController.js`.

### Rotte

#### 1. **GET `/users`**

- **Funzione**: Recupera tutti gli utenti con ID e nome.
- **Controllore**: `getAllUserIdsAndNames`.

#### 2. **GET `/users/:id`**

- **Funzione**: Recupera i dettagli di un utente specificato dall'ID.
- **Controllore**: `getUser`.

#### 3. **PUT `/users/:id`**

- **Funzione**: Aggiorna le informazioni di un utente specificato dall'ID.
- **Controllore**: `updateUser`.

#### 4. **PUT `/users/:id/pfp`**

- **Funzione**: Aggiorna la foto del profilo di un utente specificato dall'ID.
- **Controllore**: `updateUserProfilePicture`.

#### 5. **DELETE `/users/:id`**

- **Funzione**: Elimina un utente specificato dall'ID.
- **Controllore**: `deleteUser`.

---

## File: `authController.js`

Questo file contiene le funzioni di autenticazione, incluse quelle per la registrazione, il login, la richiesta di reset della password e il reset effettivo della password.

### Funzioni

#### 1. **registrazione(req, res)**

- **Descrizione**: Gestisce la registrazione di un nuovo utente.
- **Input**: 
  - `nome` (stringa): nome dell'utente.
  - `email` (stringa): email dell'utente.
  - `password` (stringa): password dell'utente.
- **Output**: 
  - Restituisce un token JWT se l'utente viene registrato correttamente.
  - Restituisce un messaggio di errore se l'utente esiste già.
- **Flusso**:
  1. Verifica se l'utente esiste già nel database.
  2. Crea un nuovo utente e una `TimeMachine` associata.
  3. Genera un token JWT per l'autenticazione.
  4. Risponde con il token e l'ID dell'utente.

#### 2. **login(req, res)**

- **Descrizione**: Gestisce il login dell'utente.
- **Input**:
  - `email` (stringa): email dell'utente.
  - `password` (stringa): password dell'utente.
- **Output**:
  - Restituisce un token JWT se le credenziali sono corrette.
  - Restituisce un messaggio di errore se le credenziali sono errate.
- **Flusso**:
  1. Verifica se l'utente esiste.
  2. Confronta la password inviata con quella memorizzata.
  3. Restituisce un token JWT se la password è corretta.
  4. Resetta il tempo nella `TimeMachine` dell'utente.

#### 3. **richiestaResetPassword(req, res)**

- **Descrizione**: Gestisce la richiesta di reset della password.
- **Input**:
  - `email` (stringa): email dell'utente che ha richiesto il reset.
- **Output**:
  - Invia un'email con il link per il reset della password.
  - Restituisce un messaggio di errore se l'utente non è trovato.
- **Flusso**:
  1. Verifica se l'utente esiste nel database.
  2. Crea un token per il reset e lo associa all'utente.
  3. Invia un'email con il link per il reset.

#### 4. **resetPassword(req, res)**

- **Descrizione**: Gestisce il reset della password.
- **Input**:
  - `token` (stringa): il token per il reset della password.
  - `password` (stringa): la nuova password.
- **Output**:
  - Restituisce un messaggio di successo se la password è aggiornata correttamente.
  - Restituisce un messaggio di errore se il token non è valido o è scaduto.
- **Flusso**:
  1. Confronta il token con quello memorizzato.
  2. Verifica se il token è ancora valido.
  3. Aggiorna la password dell'utente.

---


## File: `authRoutes.js`

Questo file contiene le rotte per la gestione delle operazioni di autenticazione, come la registrazione, il login e la gestione del reset della password.

### Rotte

#### 1. **POST `/signup`**

- **Funzione**: Registra un nuovo utente.
- **Controllore**: `registrazione`.

#### 2. **POST `/login`**

- **Funzione**: Esegue il login dell'utente.
- **Controllore**: `login`.

#### 3. **POST `/forgot-password`**

- **Funzione**: Invia un'email per il reset della password.
- **Controllore**: `richiestaResetPassword`.

#### 4. **POST `/reset-password/:token`**

- **Funzione**: Esegue il reset della password utilizzando il token.
- **Controllore**: `resetPassword`.

---

# MESSAGGI

## File: `Message.js`

Questo file definisce il modello di `Message` che rappresenta un messaggio nel sistema. Utilizza Mongoose per interagire con il database MongoDB.

### Schema del Messaggio

- **content** (stringa): Il contenuto del messaggio (obbligatorio).
- **sender** (ObjectId): Riferimento all'utente che invia il messaggio. È un campo obbligatorio.
- **recipients** (array di ObjectId): Lista di utenti destinatari del messaggio (obbligatorio). Ogni destinatario è un riferimento a un oggetto `User`.
- **completed** (booleano): Indica se il messaggio è stato completato. Default: `false`.
- **timestamps** (oggetti): Questo campo è automaticamente gestito da Mongoose e include `createdAt` e `updatedAt`.

---

## File: `messageController.js`

Questo file contiene le funzioni di controllo per la gestione dei messaggi, come l'invio, la lettura, la cancellazione e la marcatura dei messaggi come completati.

### Funzioni

#### 1. **getMessages(req, res)**

- **Descrizione**: Recupera i messaggi associati a un utente specifico.
- **Input**:
  - `userID` (stringa): ID dell'utente di cui recuperare i messaggi.
- **Output**:
  - Restituisce una lista di messaggi con informazioni sul mittente (nome, email).
  - Restituisce un errore se non riesce a recuperare i messaggi.
- **Flusso**:
  1. Recupera i messaggi dalla collezione `Message` che sono destinati all'utente con `userID`.
  2. Popola i dati del mittente utilizzando il riferimento al modello `User`.
  3. Restituisce i messaggi.

#### 2. **sendMessage(req, res)**

- **Descrizione**: Invia un messaggio a uno o più destinatari.
- **Input**:
  - `sender` (ObjectId): ID dell'utente mittente.
  - `recipients` (array di ObjectId): Lista di destinatari del messaggio.
  - `content` (stringa): Contenuto del messaggio.
- **Output**:
  - Restituisce un messaggio di successo se il messaggio è inviato correttamente e l'email di notifica è stata inviata.
  - Restituisce un errore se il mittente o il destinatario non sono trovati.
- **Flusso**:
  1. Crea un nuovo messaggio utilizzando i dati ricevuti dalla richiesta.
  2. Verifica se il mittente e almeno un destinatario esistono nel database.
  3. Invia una notifica via email al destinatario.
  4. Restituisce il messaggio creato.

#### 3. **deleteMessage(req, res)**

- **Descrizione**: Elimina un messaggio specificato dal sistema.
- **Input**:
  - `id` (ObjectId): ID del messaggio da eliminare.
- **Output**:
  - Restituisce un messaggio di successo se il messaggio viene eliminato correttamente.
  - Restituisce un errore se non riesce a eliminare il messaggio.
- **Flusso**:
  1. Trova e elimina il messaggio dal database utilizzando l'ID passato come parametro.
  2. Restituisce un messaggio di successo.

#### 4. **completeMessage(req, res)**

- **Descrizione**: Marca un messaggio come "completato".
- **Input**:
  - `id` (ObjectId): ID del messaggio da aggiornare.
- **Output**:
  - Restituisce il messaggio aggiornato con il campo `completed` impostato su `true`.
  - Restituisce un errore se non riesce a completare l'operazione.
- **Flusso**:
  1. Trova il messaggio usando l'ID passato.
  2. Aggiorna il campo `completed` a `true`.
  3. Restituisce il messaggio aggiornato.

---

## File: `messageRoutes.js`

Questo file contiene le rotte per gestire i messaggi. Ogni rotta è associata a una funzione di controllo definita in `messageController.js`.

### Rotte

#### 1. **GET `/messages/:userID`**

- **Funzione**: Recupera tutti i messaggi per un utente.
- **Controllore**: `getMessages`.

#### 2. **POST `/messages`**

- **Funzione**: Invia un nuovo messaggio a uno o più destinatari.
- **Controllore**: `sendMessage`.

#### 3. **DELETE `/messages/:id`**

- **Funzione**: Elimina un messaggio specificato.
- **Controllore**: `deleteMessage`.

#### 4. **PATCH `/messages/:id`**

- **Funzione**: Marca un messaggio come completato.
- **Controllore**: `completeMessage`.

---

# NOTE

## File: `Note.js`

Questo file definisce il modello di `Note` che rappresenta una nota nel sistema. Utilizza Mongoose per interagire con il database MongoDB.

### Schema della Nota

- **title** (stringa): Titolo della nota (obbligatorio).
- **content** (stringa): Contenuto della nota (obbligatorio).
- **categories** (array di stringhe): Categorie assegnate alla nota (default: array vuoto).
- **userID** (ObjectId): Riferimento all'utente che ha creato la nota (obbligatorio).
- **accessList** (array di ObjectId): Lista di utenti autorizzati a visualizzare la nota se la visibilità è "restricted" (default: array vuoto).
- **visibility** (stringa): Visibilità della nota, che può essere "open", "restricted", o "private" (default: "open").
- **createdAt** (data): Data di creazione della nota (default: data corrente).

---

## File: `noteController.js`

Questo file contiene le funzioni di controllo per la gestione delle note, come la creazione, la lettura, l'aggiornamento, la cancellazione e la duplicazione delle note.

### Funzioni

#### 1. **createNote(req, res)**

- **Descrizione**: Crea una nuova nota e la salva nel sistema.
- **Input**:
  - `title` (stringa): Titolo della nota (obbligatorio).
  - `content` (stringa): Contenuto della nota (obbligatorio).
  - `categories` (array di stringhe): Categorie della nota (obbligatorio).
  - `userID` (ObjectId): ID dell'utente che crea la nota (obbligatorio).
  - `visibility` (stringa): Visibilità della nota, che può essere "open", "restricted", o "private".
  - `accessList` (array di ObjectId): Lista di utenti autorizzati a visualizzare la nota, necessaria se la visibilità è "restricted".
- **Output**:
  - Restituisce la nota creata.
  - Restituisce errori se mancano campi obbligatori o se la visibilità è invalida.
  - Invia un'email di notifica se la nota è "restricted" a tutti gli utenti nella `accessList`.
- **Flusso**:
  1. Verifica la validità dei dati di input.
  2. Crea una nuova nota.
  3. Salva la nota nel database.
  4. Invia un'email ai destinatari se la visibilità è "restricted".

#### 2. **getNotes(req, res)**

- **Descrizione**: Recupera tutte le note visibili per un utente, comprese le note pubbliche, private e le note ristrette a cui l'utente ha accesso.
- **Input**:
  - `userID` (ObjectId): ID dell'utente per il quale recuperare le note.
- **Output**:
  - Restituisce una lista di note visibili per l'utente.
  - Restituisce un errore se non riesce a recuperare le note.
- **Flusso**:
  1. Esegue una query per trovare tutte le note con visibilità "open" o quelle a cui l'utente ha accesso (visibilità "restricted").

#### 3. **updateNote(req, res)**

- **Descrizione**: Modifica una nota esistente.
- **Input**:
  - `id` (ObjectId): ID della nota da modificare.
  - `title` (stringa): Titolo della nota (obbligatorio).
  - `content` (stringa): Contenuto della nota (obbligatorio).
  - `categories` (array di stringhe): Categorie della nota (obbligatorio).
  - `visibility` (stringa): Nuova visibilità della nota (opzionale).
  - `accessList` (array di ObjectId): Lista aggiornata di utenti autorizzati a visualizzare la nota (opzionale).
- **Output**:
  - Restituisce la nota aggiornata.
  - Restituisce errori se la nota non esiste o se mancano dati obbligatori.
  - Invia un'email di notifica se la visibilità della nota è stata aggiornata a "restricted" e la `accessList` è stata modificata.
- **Flusso**:
  1. Verifica la validità dei dati di input.
  2. Trova la nota nel database.
  3. Modifica la nota con i nuovi dati.
  4. Invia un'email ai destinatari se la visibilità è "restricted" e la lista di accesso è aggiornata.

#### 4. **deleteNote(req, res)**

- **Descrizione**: Elimina una nota esistente.
- **Input**:
  - `id` (ObjectId): ID della nota da eliminare.
  - `userID` (ObjectId): ID dell'utente che richiede l'eliminazione.
- **Output**:
  - Restituisce un messaggio di successo se la nota è eliminata correttamente.
  - Restituisce errori se la nota non esiste o se l'utente non ha i permessi per eliminarla.
- **Flusso**:
  1. Trova la nota nel database.
  2. Verifica che l'utente sia l'autore della nota o abbia accesso a essa.
  3. Elimina la nota dal database.

#### 5. **duplicateNote(req, res)**

- **Descrizione**: Duplica una nota esistente.
- **Input**:
  - `id` (ObjectId): ID della nota da duplicare.
  - `userID` (ObjectId): ID dell'utente che sta duplicando la nota.
- **Output**:
  - Restituisce la copia della nota creata.
  - Restituisce errori se la nota originale non viene trovata.
- **Flusso**:
  1. Trova la nota originale nel database.
  2. Crea una copia della nota con un nuovo titolo e la visibilità impostata su "private".
  3. Salva la copia nel database.

---

## File: `noteRoutes.js`

Questo file contiene le rotte per gestire le note. Ogni rotta è associata a una funzione di controllo definita in `noteController.js`.

### Rotte

#### 1. **POST `/notes`**

- **Funzione**: Crea una nuova nota.
- **Controllore**: `createNote`.

#### 2. **GET `/notes`**

- **Funzione**: Recupera tutte le note visibili per un utente.
- **Controllore**: `getNotes`.

#### 3. **PUT `/notes/:id`**

- **Funzione**: Modifica una nota esistente.
- **Controllore**: `updateNote`.

#### 4. **DELETE `/notes/:id`**

- **Funzione**: Elimina una nota esistente.
- **Controllore**: `deleteNote`.

#### 5. **POST `/notes/:id/duplicate`**

- **Funzione**: Duplica una nota esistente.
- **Controllore**: `duplicateNote`.

---

Ecco la documentazione completa per il modulo **Pomodoro**, inclusi i file aggiuntivi che mi hai fornito:

---

# POMODORO

## File: `Pomodoro.js`

- **studyTime**: Durata dello studio in minuti.
- **breakTime**: Durata della pausa in minuti.
- **cycles**: Numero di cicli Pomodoro completati (studio + pausa).
- **userID**: ID dell'utente associato al Pomodoro.
- **date**: Data in cui è stato registrato il Pomodoro.

---

## File: `pomodoroRoutes.js`

Questo file contiene le rotte per gestire i Pomodori. Ogni rotta è associata a una funzione di controllo definita in `pomodoroController.js`.

### Rotte

- **POST `/pomodoro/`**: Crea un nuovo Pomodoro.
- **GET `/pomodoro/`**: Recupera i Pomodori eseguiti da un utente, con la possibilità di limitare il numero di risultati.
- **POST `/pomodoro/send-email`**: Invia un'email con le impostazioni di un Pomodoro.

---

## File: `pomodoroController.js`

### Funzioni

- **createPomodoro**: Crea un nuovo Pomodoro, salvandolo nel database. 
- **getUserPomodoros**: Recupera i Pomodori eseguiti da un utente, con la possibilità di limitare il numero di Pomodori recuperati.
- **sendPomodoroEmail**: Invia un'email con le impostazioni Pomodoro a un'email specificata, includendo un link dinamico per iniziare il Pomodoro.

---

# JOBS

### eventNotificationJob.js
- **Descrizione**:  
Funzione per definire il job `event-notification`, responsabile dell'invio di notifiche via email per eventi programmati.  

- **Funzionalità**:  
  - Estrae le informazioni sull'evento e sull'utente destinatario.  
  - Genera il contenuto dell'email usando `generateEventEmail()`.  
  - Invia la notifica email utilizzando `sendEmailNotification()`.  
  - Segna la notifica come inviata nel database.  
  - Rimuove il job dopo l'invio della notifica.  

---

### inviteNotificationJob.js
- **Descrizione**:  
Funzione per definire il job `send-invite-email`, utilizzato per inviare inviti a eventi o task via email.  

- **Funzionalità**:  
  - Costruisce il corpo dell'email con dettagli sull'evento o la task.  
  - Include link per accettare, rifiutare o reinviare l'invito.   
  - Invia la notifica email utilizzando `sendEmailNotification()`.  
  - Rimuove il job dopo l'invio dell'invito.  


### overdueTaskJob.js
- **Descrizione**:  
Funzione per definire il job `check-overdue-tasks`, responsabile della gestione delle task in ritardo.  

- **Funzionalità**:  
  - Estra tutte le task con non ancora completate e in ritardo.  
  - Aggiorna il campo `isOverdue` per indicare che la task è in ritardo.  
  - Imposta nuovi valori per `start` e `end` all'ora corrente.  
  - Salva le modifiche nel database.  


### taskNotificationJob.js
- **Descrizione**:  
Funzione per definire il job `task-notification`, responsabile dell'invio di notifiche per task in ritardo.  

- **Funzionalità**:  
  - Genera un'email di notifica in base al livello di urgenza della task.  
  - Invia la notifica email utilizzando `sendEmailNotification()`.  
  - Se il livello di urgenza non è il massimo (`4`), rimuove il job dopo l'invio.  


# SCHEDULER

### overdueTaskScheduler.js
- **Descrizione**:  
Funzione per schedulare un job che controlla le task in ritardo.  

- **Funzionalità**:  
  - Verifica se il job `check-overdue-tasks` esiste già nell'istanza di `agenda`.  
  - Se il job non è presente, lo pianifica per essere eseguito ogni minuto.  

### taskNotificationScheduler.js
- **Descrizione**:  
Funzione per schedulare notifiche email per attività in ritardo, in base al livello di urgenza.  

- **Funzionalità**:  
  - Recupera l'utente dal database escludendo la password.  
  - Controlla se l'attività ha notifiche abilitate e non è completata.  
  - Pianifica notifiche in base ai seguenti livelli di urgenza:  
    - **Livello 0**: Notifica immediata.  
    - **Livello 1**: Notifica dopo 1 settimana.  
    - **Livello 2**: Notifica dopo 3 giorni.  
    - **Livello 3**: Notifica dopo 1 giorno.  
    - **Livello 4**: Notifiche ricorrenti ogni 12 ore.   


### eventNotificationScheduler.js
- **Descrizione**:  
Funzione per schedulare notifiche email per eventi programmati o modificati.  

- **Funzionalità**:  
  - Recupera l'utente dal database escludendo la password.  
  - Controlla se l'evento ha notifiche abilitate.  
  - Pianifica notifiche basate sugli intervalli di tempo specificati nelle proprietà dell'evento.  

# UTILS

### generateEmail.js
- **Descrizione**: Questo file fornisce funzioni per generare email di notifica relative a eventi e task nel calendario, includendo dettagli come titolo, orario, luogo e urgenza.

- **Funzionalità**:  
  - `generateEventEmail(event, timeBefore)`: Crea un'email di promemoria per un evento, includendo dettagli come orario, luogo e regole di ricorrenza.  
  - `generateTaskEmail(task, urgencyLevel)`: Genera un'email di notifica per una task scaduta, con livelli di urgenza variabili e promemoria periodici.


### getRecurrenceSummary.js
- **Descrizione**:  
Funzione per generare un riepilogo leggibile di una regola di ricorrenza (RRule), traducendo le opzioni in un formato comprensibile in italiano.

- **Funzionalità**:  
  - `getRecurrenceSummary(rruleString)`:  
    - Converte una stringa RRule in un formato testuale leggibile. 


### removeTemporaryTasks.js
- **Descrizione**:  
Funzione per eliminare le task temporanee associate a un utente, generate dalla time machine.

- **Funzionalità**:  
  - `removeTemporaryTasks(userID)`:  
    - Filtra le task in base all'ID utente fornito.  
    - Cancella tutte le task con proprietà `temporary: true` dal database.  

### sendEmailNotification.js
- **Descrizione**:  
Funzione per l'invio di email di notifica utilizzando Nodemailer e un account Gmail.

- **Funzionalità**:  
  - `sendEmailNotification(to, subject, message)`:  
    - Invia un'email al destinatario specificato con un oggetto e un messaggio in formato HTML.  
    - Utilizza un trasporto SMTP configurato con credenziali Gmail.  


### timeMachineNotification.js
- **Descrizione**:  
Funzione che gestisce l'invio automatico di notifiche email per eventi e attività in scadenza o in ritardo, utilizzando un sistema di "Time Machine".

- **Funzionalità**:  
  - **Recupero dati utente**:  
    - Estrae le informazioni dell'utente senza includere la password.  
  - **Selezione degli eventi e attività**:  
    - Recupera eventi programmati per il giorno specificato.  
    - Recupera attività pendenti e temporanee con notifiche abilitate e scadute.  
  - **Invio notifiche per eventi**:  
    - Calcola l'orario di notifica in base al tempo prima dell'evento.  
    - Invia email se la notifica è programmata entro un intervallo di 30 secondi.  
    - Gestisce eventi giornalieri senza considerare un orario specifico.  
  - **Invio notifiche per attività scadute**:  
    - Calcola il livello di urgenza in base al tempo di ritardo rispetto alla scadenza.  
    - Invia email con un messaggio adeguato al livello di urgenza.  


### uploadUtils.js
- **Descrizione**:  
Funzione per la gestione dell'upload di immagini profilo utilizzando Multer, con filtri per tipo di file e dimensione massima.

- **Funzionalità**:  
  - **Gestione della directory di upload**:  
    - I file vengono salvati nella cartella `uploads/profilePictures`.  
  - **Configurazione dello storage**:  
    - Definisce il percorso di salvataggio delle immagini.  
    - Genera nomi unici per i file caricati.  
  - **Filtraggio dei file**:  
    - Accetta solo immagini nei formati `.jpeg`, `.jpg`, `.png`.  
    - Rifiuta file con estensioni o MIME type non validi.  
  - **Limitazione della dimensione**:  
    - Imposta un limite massimo di 5MB per i file caricati.  
