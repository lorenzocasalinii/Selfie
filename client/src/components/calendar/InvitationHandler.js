import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

const InvitationHandler = ({ action, type }) => {
  const { id } = useParams();
  const userID = new URLSearchParams(window.location.search).get("userID");
  const navigate = useNavigate();

  useEffect(() => {
    const handleInvitation = async () => {
      try {
        const response = await axiosInstance.put(
          `${type}/${id}/${action}`,
          {},
          {
            params: {
              userID: userID,
            },
          }
        );

        const mappedAction = {
          accept: "accettato",
          decline: "rifiutato",
          resend: "posticipato"
        };

        if (response.status === 200) {
          alert(
            `Hai correttamente ${mappedAction[action]} l'invito!`
          );
        } else if (response.status === 403) {
          alert(
            "Non puoi modificare la risposta. Contatta il creatore dell'evento per essere reinvitato."
          );
        } else {
          alert(`Errore durante la gestione dell'invito.`);
        }
      } catch (error) {
        console.error("Errore:", error);
        alert(`Errore durante la gestione dell'invito.`);
      }
      window.close();
    };

    handleInvitation();
  }, [id, userID, navigate, type, action]);

  return <div>Caricamento...</div>;
};


export default InvitationHandler;