# Client

Il client dell'applicazione è sviluppato con React.

## public
- **index.html**: Il file principale HTML che React utilizza come punto di ingresso.

## src

- **App.js**: Il componente principale dell'applicazione contenente le rotte.

- **index.js**: Il file di ingresso di React che renderizza l'applicazione.

- **assets**: Contiene le risorse statiche come immagini e icone.

- **context**: Contiene i file relativi alla gestione degli state React globali.
  1. **AuthContext**
  - **isAuthenticated**: Booleano che indica se l'utente è autenticato.  
  - **loading**: Booleano che indica se l'autenticazione è in fase di verifica.  
  - **login(token, userID)**: Salva il token e l'ID utente in `localStorage` e autentica l'utente.  
  - **logout()**: Rimuove il token e l'ID utente da `localStorage` e disconnette l'utente.  

  2. **TimeMachineContext**
  - *time* : valore della TimeMachine. Di default è allineato all'orario corrente e salvato in UTC. Viene sovrascritto dal valore che inserisce l'utente attraverso il componente TimeMachine
  - *isTimeMachineActive* : booleano che indica se la TimeMachine è attiva oppure no

- **fonts**: 

- **services**: Contiene le funzioni per effettuare chiamate API al backend.

- **styles**: Contiene i file CSS.

- **components**: Contiene i componenti dell'applicazione.
  1. **calendar**
     - events
       1. EventForm.js
       2. EventHandler.js
       3. EventInfo.js
       4. EventPomodoroRedistribution.js
       5. NotificationForm.js
       6. RecurrenceForm.js
       7. RecurrenceHandler.js
     - tasks
       1. TaskForm.js
       2. TaskHandler.js
       3. TaskInfo.js
     - Calendar.js
     - DateUtilites.js
     - InvitationHandler.js
     - TabSwitcher.js
     - TimeZoneForm.js
     - UserForm.js

  2. **common**
     - Modal.js

  3. **homepage**
     - Homepage.js

  4. **loginsignup**
     - ForgotPassword.js
     - Login.js
     - ProtectedRoute.js
     - ResetPassword.js
     - Signup.js

  5. **notes**
     - MarkdownLegend.js
     - Notes.js
     - NotesDetail.js
     - NotesFilter.js
     - NotesView.js
     - SortNotes.js

  6. **pomodoro**
     - Pomodoro.js
     - PomodoroAnimation.js
     - PomodoroEmailSender.js

  7. **preview** 
     - CalendarPreview.js
     - NotesPreview.js
     - PomodoroPreview.js
     - ProfilePreview.js
     - TimeMachinePreview.js

  8. **profile**
     - EditProfileForm.js
     - Inbox.js
     - Profile.js

  9. **timemachine**
     - TimeMachine.js


# 1.

## Calendar.js
- **Descrizione**: Questo file contiene il componente principale per la gestione del calendario. Permette agli utenti autenticati di creare, modificare, rimuovere task ed eventi. Utilizza la libreria @fullcalendar/react come base per il calendario, luxon per la gestione dei fusi orari, rrule per la gestione di eventi ricorrenti.

- **Funzionalità**:
  - Recupera eventi e task associati all'utente autenticato quando viene montata la componente
  - Ogni 10 secondi esegue una fetch al server per controllare sia eventuali task in ritardo sia eventuali inviti ad eventi
  - Creazione di eventi (singoli o ricorrenti) o task
  - Quando si clicca su una cella del calendario, il form per la creazione di eventi o task viene riempito con la data e ora selezionata (all day attivo se si è nella view mensile)
  - Rimozione/modifica di eventi o task 
  - Quando viene modificato un evento o task, il form viene riempito con i valori dell'evento o task che si sta modificando
  - Invitare utenti ad eventi o task tramite email (la risposta all'invito puo' essere anche gestita tramite il calendario)
  - Impostare il fuso orario di un evento o task
  - Aggiungere notifiche tramite email di eventi o task
  - Cambiare il fuso orario del Calendario (eventi o task vengono automaticamente convertiti nell'orario corretto in base al fuso orario selezionato)
  - Selezionare la view del calendario (mensile, settimanale, giornaliera, solo task)
  - Visualizzare informazioni su eventi o task creati
  - Esportare via email eventi in formato iCalendar
  - Importare eventi in formato iCalendar
  - Nel calendario task ed eventi vengono visualizzati con colori diversi in base al tipo di evento o task (es. evento standard, evento a cui ti hanno invitato, task in corso, task in ritardo, task completata, task completata in ritardo, etc...)
  - Le task in ritardo vengono automaticamente trascinate all'orario corrente fino a quando non sono segnate come completate
  - Creazione di eventi indicati come non disponibili per eventi di gruppo (anche ricorrenti)

## EventForm.js
- **Descrizione**: Questo file contiene il componente per la gestione del form degli eventi. 

- **Funzionalità**:
  Gestisce l'inserimento del nuovo evento che l'utente vuole creare/modificare aggiornando i seguenti campi
  - title
  - startDate
  - startTime
  - allDay
  - endDate
  - endTime
  - location
  - description
  - timeZone
  - isRecurring
  - recurrence
  - notifications
  - invitedUsers
  - markAsUnavailable

## EventHandler.js
- **Descrizione**: Questo file contiene il componente per la gestione degli eventi. 

- **Funzionalità**:
  - Gestisce l'inizializzazione dell'EventForm in base a data e ora selezionata
  - Gestisce il submit dell'EventForm (sia in caso di creazione che in caso di modifica)
  - Gestisce la modifica di eventi inizializzando l'EventForm con i dati dell'evento da modificare
  - Gestisce il click dell'utente sopra un evento del calendario per mostrare le relative informazioni
  - Gestisce la cancellazione di eventi (nel caso ricorrente si puo' scegliere di rimuovere anche una singola istanza)
  - Gestisce l'esportazione di eventi in formato iCalendar

## EventInfo.js
- **Descrizione**: Questo file contiene il componente per mostrare le informazioni di un evento.

- **Funzionalità**: 
  - Mostra a schermo le informazioni di un evento (il colore cambia in base al tipo di evento)
  - Permette all'utente di cancellare o modificare un evento (solo l'utente host dell'evento)
  - Permette all'utente di rispondere all'invito ad un evento da parte di un altro utente
  - Permette all'utente host di rimuovere gli utenti invitati
  - Permette all'utente di esportare un evento in formato iCalendar
  
## EventPomodoroRedistribution.js
- **Descrizione**: Questo file contiene la logica per la ridistribuzione dei Pomodori non completati. Se un Pomodoro non viene completato, viene riprogrammato per una data futura.

- **Funzionalità**:
 - Calcolo dei cicli rimanenti.
 - Riprogrammazione dei Pomodori non completati.

## NotificationForm.js
- **Descrizione**: Questo file contiene il componente per la gestione del form delle notifiche eventi.
  
- **Funzionalità**: 
  - Permette all'utente di aggiungere o rimuovere notifiche

## RecurrenceForm.js
- **Descrizione**: Questo file contiene il componente per la gestione del form di eventi ricorrenti.
  
- **Funzionalità**: 
  - Permette all'utente di scegliere il tipo di ricorrenza
  - Permette all'utente di scegliere quando far terminare la ricorrenza
  - Permette all'utente di creare tipo di ricorrenza standard e personalizzati

## RecurrenceHandler.js
- **Descrizione**: Questo file contiene il componente per la gestione di eventi ricorrenti.
  
- **Funzionalità**: 
  - Converte l'oggetto restituito da RecurrenceForm in una stringa RRule valida
  - Calcola la durata di un evento
  - Calcola automaticamente la data di fine ricorrenza in base alla data di inizio e al tipo di ricorrenza
  - Converte la stringa RRule in un formato facilmente leggibile per gli utenti

## TaskForm.js
- **Descrizione**: Questo file contiene il componente per la gestione del form delle task. 

- **Funzionalità**:
  Gestisce l'inserimento della nuova task che l'utente vuole creare/modificare aggiornando i seguenti campi
  - title
  - deadlineDate
  - deadlineTime
  - allDay
  - timeZone
  - notifications
  - invitedUsers

## TaskHandler.js
- **Descrizione**: Questo file contiene il componente per la gestione delle task. 

- **Funzionalità**:
  - Gestisce l'inizializzazione del taskForm in base a data e ora selezionata
  - Gestisce il submit del taskForm (sia in caso di creazione che in caso di modifica)
  - Gestisce la modifica di task inizializzando il taskForm con i dati della task da modificare
  - Gestisce il click dell'utente sopra una task del calendario per mostrare le relative informazioni
  - Gestisce la cancellazione di task 
  - Gestisce il click dell'utente per segnare una task come completata/non completata
  - Aggiornare le task in ritardo (solo a livello front-end) quando viene usata la time machine. 

## TaskInfo.js
- **Descrizione**: Questo file contiene il componente per mostrare le informazioni di una task.

- **Funzionalità**: 
  - Mostra a schermo le informazioni di un task (il colore cambia in base al tipo di task)
  - Permette all'utente di cancellare o modificare una task
  - Permette all'utente di rispondere all'invito ad una task da parte di un altro utente
  - Permette all'utente host di rimuovere gli utenti invitati

## DateUtilities.js
- **Descrizione**: Questo file contiene funzioni utilizzate per lavorare con date, orari e fusi orari

- **Funzionalità**: 
  - Decrementa la data di un giorno (gestisce il caso di submit per eventi allday)
  - Arrotonda i minuti a 00 o 30 in base all'orario passato
  - Incrementa di 1 ora l'orario (gestisce il caso in cui quando viene incrementato starTime, incrementa anche endTime in automatico)
  - Incrementa di 30 minuti l'orario (la endTime di una task è sempre 30 minuti dopo la sua deadline)
  - Converte un evento (anche ricorrente) o task al fuso orario del calendario

## InvitationHandler.js
- **Descrizione**: Questo file gestisce la risposta dell'utente ad un invito a partecipare ad un evento o task

- **Funzionalità**: 
  - Permette l'accettazione, rifiuto o reinvio di un invito

## TabSwitcher.js
- **Descrizione**: Questo file contiene il componente che permette di passare da eventForm a taskForm

- **Funzionalità**: 
  - Permette il passaggio da eventForm a taskForm in modo facile ed intuitivo
  - Se si sta modificando un evento allora il taskForm è disabilitato
  - Se si sta modificando una task, allora l'eventForm è disabilitato

## TimeZoneForm.js
- **Descrizione**: Questo file contiene il componente per la gestione del form dei fusi orari.

- **Funzionalità**:
  - Permette di selezionare quale fuso orario utilizzare 

## UserForm.js
- **Descrizione**: Questo file contiene il componente per la gestione del form degli utenti da invitare

- **Funzionalità**:
  - Iniziando ad inserire nome o email, gli utenti che fanno match vengono mostrati come possibili opzioni
  - Permette di aggiungere e rimuovere utenti

# 2.

## Modal.js
- **Descrizione**: Questo file contiene il componente utilizzato dal calendario come modale (eventForm, taskForm, eventInfo, taskInfo, timeZoneForm, etc...)

- **Funzionalità**:
  - Viene mostrato o nascosto in base alla necessità e mostra in alto il titolo
  
# 3.

## Homepage.js
- **Descrizione**: Questo file contiene il componente principale della homepage dell'applicazione. Gestisce la visualizzazione delle anteprime dinamiche delle diverse sezioni (Calendario, Pomodoro, Note) e permette di navigare tra di esse.

- **Funzionalità**:
  - Gestione dello stato per le anteprime aperte.
  - Navigazione tra le diverse sezioni dell'applicazione.
  - Visualizzazione dinamica delle anteprime in base alla larghezza dello schermo.
  
- **Componenti Utilizzati**:
  - PomodoroPreview, NotesPreview, TimeMachinePreview, CalendarPreview.

# 4. 

## Login.js
- **Descrizione**: Questo file contiene il componente per la gestione della pagina di login dell'applicazione. Permette agli utenti di autenticarsi utilizzando email e password.
- **Funzionalità**:
  - Gestione dello stato per email e password.
  - Autenticazione dell'utente tramite il servizio di login.
  - Gestione degli errori di autenticazione.
  - Navigazione verso la homepage in caso di login riuscito.
- **Componenti Utilizzati**:
  - useNavigate (da react-router-dom) per la navigazione.
  - useContext (da React) per l'accesso al contesto di autenticazione.

## Signup.js
- **Descrizione**: Questo file contiene il componente per la registrazione di nuovi utenti nell'applicazione. Permette la creazione di un nuovo account con nome, email e password.
- **Funzionalità**:
  - Gestione dello stato per nome, email e password.
  - Registrazione dell'utente tramite il servizio di signup.
  - Salvataggio del token di autenticazione e dell'ID utente nel localStorage.
  - Autenticazione automatica dell'utente dopo la registrazione.
  - Navigazione verso la homepage dopo la registrazione.
- **Componenti Utilizzati**:
  - useNavigate (da react-router-dom) per la navigazione.
  - useContext (da React) per l'accesso al contesto di autenticazione.


# 5.

## MarkdownLegend.js

- **Descrizione**: Questo file contiene il componente che fornisce una guida interattiva sull'utilizzo della sintassi Markdown. Gli utenti possono visualizzare esempi di formattazione per testo, liste, link, immagini e codice.
- **Funzionalità**:
  - Mostra una finestra modale con una guida Markdown.
  - Include esempi interattivi di sintassi Markdown.
  - Consente di chiudere la finestra di guida con un pulsante.
- **Componenti Utilizzati**:
  - `useState` (da React) per la gestione dello stato di visibilità.
  - Immagini e asset locali per esempi visivi.

## Notes.js

- **Descrizione**: Questo file contiene il componente principale per la gestione delle note. Permette agli utenti autenticati di creare, visualizzare e organizzare le loro note.
- **Funzionalità**:
  - Recupera e visualizza l'elenco delle note associate all'utente.
  - Consente la creazione di nuove note con supporto Markdown.
  - Permette di selezionare la visibilità delle note (pubblica, privata, ristretta).
  - Integra una sezione di anteprima Markdown.
  - Consente la selezione degli utenti per la condivisione delle note.
  - Gestisce errori e validazioni nel processo di creazione delle note.
- **Componenti Utilizzati**:
  - `useContext` (da React) per l'accesso al contesto di autenticazione.
  - `useState` e `useEffect` per la gestione dello stato locale e il recupero dati.
  - `createNote` e `getNotes` (da noteService) per interagire con il backend delle note.
  - `getAllUsersBasicInfo` (da userService) per recuperare l'elenco degli utenti.
  - `NotesView`, `NotesDetail`, `SortNotes`, `MarkdownLegend` per la gestione dell'interfaccia utente.
  - `marked` (libreria esterna) per la conversione del Markdown in HTML.

## NotesDetail.js

- **Descrizione**: Questo componente visualizza i dettagli di una nota, permettendo all'utente di modificarne il titolo, contenuto, categorie e visibilità. Inoltre, consente di vedere un'anteprima Markdown del contenuto.
- **Funzionalità**:
  - Mostra i dettagli della nota selezionata (titolo, contenuto, categorie e visibilità).
  - Consente di entrare in modalità di modifica della nota.
  - Permette di modificare titolo, contenuto, categorie e visibilità della nota.
  - Gestisce la selezione di utenti per note con visibilità "ristretta".
  - Fornisce un'anteprima Markdown del contenuto.
  - Salva le modifiche o annulla l'operazione.
- **Componenti Utilizzati**:
  - `useState` e `useEffect` (da React) per la gestione dello stato e la gestione delle modifiche.
  - `updateNote` (da noteService) per aggiornare la nota nel backend.
  - `getAllUsersBasicInfo` (da userService) per ottenere l'elenco degli utenti da selezionare nelle note con visibilità "ristretta".
  - `marked` (libreria esterna) per generare l'anteprima Markdown.
  
---

## NotesFilter.js

- **Descrizione**: Questo componente permette agli utenti di filtrare le note in base alla loro visibilità. Fornisce un menu a discesa per scegliere tra tutte, pubbliche, private o ristrette.
- **Funzionalità**:
  - Consente di selezionare la visibilità delle note da visualizzare.
  - Si integra con altri componenti per filtrare le note in base alla visibilità selezionata.
- **Componenti Utilizzati**:
  - `useState` (da React) per la gestione dello stato del filtro.
  
---

## NotesView.js

- **Descrizione**: Questo componente visualizza l'elenco delle note, con opzioni per visualizzare, duplicare o eliminare le note. Include anche filtri di visibilità e ricerca per categoria.
- **Funzionalità**:
  - Mostra un elenco di note con il titolo, le categorie, una parte del contenuto e la visibilità.
  - Permette di selezionare una nota per visualizzarne i dettagli.
  - Consente di duplicare ed eliminare le note.
  - Filtra le note in base alla visibilità e/o alla categoria.
  - Mostra icone per indicare se una nota contiene Markdown o è privata.
- **Componenti Utilizzati**:
  - `useState` (da React) per la gestione dello stato di visibilità del filtro e la ricerca per categoria.
  - `deleteNote` e `duplicateNote` (da noteService) per interagire con il backend delle note.
  - `VisibilityFilter` per il filtro di visibilità delle note.
  - Immagini locali per rappresentare le icone di Markdown, blocco e ricerca.

## SortNotes.js

- **Descrizione**: Questo componente consente agli utenti di ordinare un elenco di note in base a diversi criteri, come ordine alfabetico, data di creazione, lunghezza del contenuto o categoria. Mostra un menu a discesa per selezionare il tipo di ordinamento desiderato.
- **Funzionalità**:
  - Mostra un pulsante che apre un menu a discesa per selezionare il tipo di ordinamento.
  - Permette di ordinare le note in base ai seguenti criteri:
    - **Ordine Alfabetico**: Ordina le note in base al titolo in ordine crescente.
    - **Data**: Ordina le note dalla più recente alla più vecchia in base alla data di creazione.
    - **Lunghezza Contenuto**: Ordina le note in base alla lunghezza del contenuto, dalla più lunga alla più corta.
    - **Categoria**: Ordina le note in base alla categoria (se presente) in ordine alfabetico.
  - Aggiorna l'elenco delle note ordinate nel componente padre tramite `setNotes`.
- **Componenti Utilizzati**:
  - `useState` (da React) per la gestione dello stato del menu di ordinamento.

# 6.

## Pomodoro.js
- **Descrizione**: Questo file contiene il componente principale per la gestione della Pomodoro technique. Permette di impostare i tempi di studio e pausa, avviare e gestire le sessioni di studio, visualizzare l'animazione del timer e condividere le impostazioni di studio via email.

- **Funzionalità**:
   - Gestione del timer e delle sessioni di studio/pausa.
   - Invio dei dati del Pomodoro al backend per il salvataggio.
   - Visualizzazione di un'animazione del timer.
   - Condivisione impostazioni via email.

- **Componenti Utilizzati**:
   - PomodoroAnimation, PomodoroEmailSender.

## PomodoroAnimation.js
- **Descrizione**: Questo file contiene il componente per l'animazione del timer Pomodoro. Visualizza il tempo rimanente in modo dinamico, con uno stile diverso per le sessioni di studio e di pausa.

- **Funzionalità**:
   - Visualizzazione del tempo rimanente in formato mm:ss.
   - Cambio di stile in base alla sessione (studio o pausa).

## PomodoroEmailSender.js
- **Descrizione**: Questo file contiene il componente per l'invio delle impostazioni del Pomodoro via email. Permette di condividere le impostazioni con altri utenti.
 
- **Funzionalità**:
   - Apertura di una pop up per l'inserimento dell'email.
   - Validazione dell'email e invio delle impostazioni.

# 7.

## CalendarPreview.js
- **Descrizione**: Questo file contiene il componente per la visualizzazione della anteprima del Calendario. Utilizza sempre @fullcalendar/react

- **Funzionalità**:
  - Permette all'utente di selezionare la view del calendario (mensile, settimanale, giornaliera, task)
  - Quando viene cliccato un evento/task o una cella del calendario, si viene portati direttamente al Calendario
  - Fornisce un link per accedere direttamente al calendario

## NotesPreview.js

- **Descrizione**: Questo componente mostra una panoramica delle ultime note dell'utente, con la possibilità di filtrare in base alla visibilità (pubbliche, private, ristrette) e di configurare il numero di note da visualizzare. Mostra un elenco di note recenti, con titolo, categorie, contenuto parziale e visibilità.
- **Funzionalità**:
  - Recupera le note dell'utente autenticato e le filtra in base alla visibilità (tutte, pubbliche, private, ristrette).
  - Ordina le note per data di creazione (le più recenti in cima).
  - Permette di configurare il numero di note da visualizzare (da 1 a 5).
  - Visualizza un'anteprima delle note con titolo, categorie e un estratto del contenuto.
  - Mostra la visibilità della nota (pubblica, privata, ristretta).
  - Fornisce un link per accedere alla pagina completa delle note.
- **Componenti Utilizzati**:
  - `useState` e `useEffect` (da React) per la gestione dello stato e il recupero delle note.
  - `AuthContext` per ottenere lo stato di autenticazione dell'utente.
  - `Link` (da `react-router-dom`) per la navigazione tra le pagine.
  - `getNotes` (da `noteService`) per recuperare le note dal backend.
  - Icona locale per rappresentare le note.

## PomodoroPreview.js
- **Descrizione**: Questo file contiene il componente per la visualizzazione delle anteprime dei Pomodori. Mostra l'ultimo Pomodoro eseguito, il prossimo in programma, o permette di crearne uno nuovo.

- **Funzionalità**:
   - Visualizzazione delle informazioni dell'ultimo Pomodoro.
   - Visualizzazione del prossimo Pomodoro in programma.
   - Creazione di un nuovo Pomodoro con impostazioni personalizzate.

## ProfilePreview.js

- **Descrizione**:  
  - Questo componente visualizza un'anteprima del profilo dell'utente, mostrando la sua immagine profilo e fornendo un link alla pagina completa del profilo.

- **Funzionalità**:  
  - Recupera l'immagine del profilo dell'utente dal backend.  
  - Visualizza l'immagine del profilo se disponibile.  
  - Fornisce un link per accedere alla pagina completa del profilo.  
  - Gestisce eventuali errori nel recupero dell'immagine del profilo.  

- **Componenti Utilizzati**:  
  - `useState` per gestire lo stato dell'immagine del profilo e degli errori.  
  - `useEffect` per effettuare la richiesta di recupero dell'immagine all'avvio del componente.  
  - `Link` da `react-router-dom` per permettere la navigazione alla pagina del profilo.  
  - `getUser` da `userService` per ottenere le informazioni dell'utente.  

## TimeMachinePreview.js
- **Descrizione**: Questo file contiene il componente per la visualizzazione della anteprima della TimeMachine. 

- **Funzionalità**:
  - Viene sempre mostrata in basso a destra sia nella homepage sia nel calendario
  - Quando viene cliccata, apre la TimeMachine

# 8.

## Profile.js

- **Descrizione**: Questo componente gestisce la visualizzazione e modifica del profilo dell'utente. L'utente può modificare le proprie informazioni, cambiare la foto del profilo, fare il logout e cancellare il proprio account.
- **Funzionalità**:
  - Visualizza le informazioni del profilo dell'utente (nome, email, bio, compleanno, sesso, foto profilo).
  - Consente all'utente di modificare le informazioni del profilo tramite un form.
  - Permette di aggiornare la foto del profilo.
  - Fornisce un'opzione per fare il logout o cancellare il proprio account.
  - Apre un modal per la modifica del profilo.
  - Gestisce gli errori durante il recupero, l'aggiornamento o la cancellazione del profilo.
- **Componenti Utilizzati**:
  - `useState` e `useEffect` per la gestione dello stato e il recupero dei dati dell'utente.
  - `useNavigate` per la navigazione tra le pagine.
  - `AuthContext` per gestire l'autenticazione e il logout.
  - `Modal` per visualizzare un modal per l'editing del profilo.
  - `EditProfileForm` per il form di modifica del profilo.
  - Funzioni da `userService` per gestire l'utente: `getUser`, `updateUser`, `updateUserProfilePicture`, `deleteUser`.
  - Icona predefinita per la foto del profilo.

## Inbox.js

- **Descrizione**: Questo componente gestisce la visualizzazione e la gestione dei messaggi dell'utente. L'utente può leggere, completare, eliminare messaggi e inviare nuovi messaggi a uno o più destinatari.
- **Funzionalità**:
  - Recupera i messaggi dell'utente tramite `messageService`.
  - Permette di filtrare i messaggi in base al loro stato (completati, non completati, tutti).
  - Consente di completare o eliminare i messaggi.
  - Permette di inviare nuovi messaggi, selezionando uno o più destinatari.
  - Mostra la lista degli utenti disponibili a cui inviare messaggi.
- **Componenti Utilizzati**:
  - `useState` e `useEffect` per la gestione dello stato e il recupero dei messaggi.
  - `useNavigate` per la navigazione tra le pagine.
  - `messageService` per gestire le operazioni sui messaggi (recupero, completamento, eliminazione, invio).
  - Funzione `getAllUsersBasicInfo` per ottenere le informazioni di base degli utenti a cui inviare messaggi.
  - Icona di completamento per i messaggi completati.

## EditProfileForm.js

- **Descrizione**: Questo componente è un form per modificare le informazioni del profilo dell'utente, come nome, bio, data di nascita, sesso e foto del profilo.
- **Funzionalità**:
  - Permette di modificare il nome, la bio, la data di nascita, il sesso e la foto del profilo.
  - Gestisce la selezione di un file per la foto del profilo.
  - Invia i dati modificati tramite il form quando viene sottomesso.
  - Fornisce un'opzione per annullare la modifica.
- **Componenti Utilizzati**:
  - `useState` per gestire i dati del form.
  - Funzione `handleInputChange` per aggiornare i dati del form.
  - Funzione `handleFileChange` per gestire la selezione della foto del profilo.
  - Funzione `handleFormSubmit` per inviare i dati del form.
  - Gestisce l'invio dei dati al backend tramite i servizi di aggiornamento utente.

# 9.

## TimeMachine.js
- **Descrizione**: Questo componente gestisce la TimeMachine, ovvero una funzionalità che permette di andare avanti e indietro nel tempo. Tutti gli orari dell'applicazione sono basati su questo valore

- **Funzionalità**:
  - La data originale viene salvata in UTC
  - Incrementa automaticamente ogni secondo
  - Quando viene utilizzata dal calendario, prima viene convertita al fuso orario corretto
  - Permette all'utente di inserire tramite un form la data a cui vuole spostarsi
  - Permette all'utente di ritornare alla data corrente
  - Quando viene inserito un nuovo valore, vengono aggiornati sia lo state *time* che lo state *isTimeMachineActive*. Questi vengono usati all'interno dell'applicazione