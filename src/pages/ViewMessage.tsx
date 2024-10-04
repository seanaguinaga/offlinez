import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { personCircle } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { deleteMessage, Message, subscribeToMessage } from "../data/messages";
import "./ViewMessage.css";

function ViewMessage() {
  const [message, setMessage] = useState<Message | undefined>();
  const [error, setError] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = subscribeToMessage(
      id,
      (msg) => {
        setMessage(msg);
      },
      (error) => {
        setError("Failed to load message.");
        console.error(`Error subscribing to message with id ${id}:`, error);
      }
    );
    return () => unsubscribe();
  }, [id]);

  const handleDelete = async () => {
    if (message) {
      try {
        await deleteMessage(message.id);
        history.push("/home");
      } catch (error) {
        setError("Failed to delete message.");
        console.error("Error deleting message:", error);
      }
    }
  };

  return (
    <IonPage id="view-message-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Inbox" defaultHref="/home" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          onDidDismiss={() => setError("")}
        />
        {message ? (
          <>
            <IonItem>
              <IonIcon aria-hidden="true" icon={personCircle} color="primary" />
              <IonLabel className="ion-text-wrap">
                <h2>
                  {message.fromName}
                  <span className="date">
                    <IonNote>{message.date}</IonNote>
                    {message.pending && (
                      <IonNote color="warning">Draft</IonNote>
                    )}
                  </span>
                </h2>
                <h3>
                  To: <IonNote>Me</IonNote>
                </h3>
              </IonLabel>
            </IonItem>

            <div className="ion-padding">
              <h1>{message.subject}</h1>
              <p>{message.content || "No content available."}</p>
            </div>

            <IonButton expand="block" color="danger" onClick={handleDelete}>
              Delete Message
            </IonButton>
          </>
        ) : (
          <div>Message not found</div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default ViewMessage;
