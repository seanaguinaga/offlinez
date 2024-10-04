import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonNote,
  IonPage,
  IonTextarea,
  IonToast,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  createOutline,
  personCircle,
  saveOutline,
  trashOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Timestamp } from "../components/Timestamp";
import {
  deleteMessage,
  Message,
  subscribeToMessage,
  updateMessage,
} from "../data/messages";
import "./ViewMessage.css";

function ViewMessage() {
  const [message, setMessage] = useState<Message | undefined>();
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedSubject, setEditedSubject] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const router = useIonRouter();

  useEffect(() => {
    const unsubscribe = subscribeToMessage(
      id,
      (msg) => {
        setMessage(msg);
        if (msg) {
          setEditedSubject(msg.subject);
          setEditedContent(msg.content || "");
        }
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
        router.canGoBack() ? router.goBack() : router.push("/home", "back");
      } catch (error) {
        setError("Failed to delete message.");
        console.error("Error deleting message:", error);
      }
    }
  };

  const handleSave = async () => {
    if (message) {
      setLoading(true);
      try {
        await updateMessage(message.id, {
          subject: editedSubject,
          content: editedContent,
        });
        setIsEditing(false);
        setLoading(false);
      } catch (error) {
        setError("Failed to update message.");
        console.error("Error updating message:", error);
        setLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    if (message) {
      setEditedSubject(message.subject);
      setEditedContent(message.content || "");
    }
    setIsEditing(false);
  };

  return (
    <IonPage id="view-message-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Inbox" defaultHref="/home" />
          </IonButtons>
          {!isEditing && (
            <IonButtons slot="end">
              <IonButton onClick={() => setIsEditing(true)}>
                <IonIcon slot="icon-only" icon={createOutline} />
              </IonButton>
              <IonButton color="danger" onClick={handleDelete}>
                <IonIcon slot="icon-only" icon={trashOutline} />
              </IonButton>
            </IonButtons>
          )}
          {isEditing && (
            <IonButtons slot="end">
              <IonButton onClick={handleSave}>
                <IonIcon slot="icon-only" icon={saveOutline} />
              </IonButton>
              <IonButton onClick={handleCancelEdit}>Cancel</IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonLoading isOpen={loading} message={"Updating message..."} />
        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          onDidDismiss={() => setError("")}
          color="danger"
        />
        {message ? (
          <>
            <IonItem>
              <IonIcon aria-hidden="true" icon={personCircle} color="primary" />
              <IonLabel className="ion-text-wrap">
                <h2>
                  {message.fromName}
                  <span className="date">
                    <Timestamp date={message.date} />
                    {message.pending && !isEditing && (
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
              {!isEditing ? (
                <>
                  <h1>{message.subject}</h1>
                  <p>{message.content || "No content available."}</p>
                </>
              ) : (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Subject</IonLabel>
                    <IonInput
                      value={editedSubject}
                      onIonChange={(e) => setEditedSubject(e.detail.value!)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Content</IonLabel>
                    <IonTextarea
                      value={editedContent}
                      onIonInput={(e) => {
                        setEditedContent(e.detail.value!);
                        console.log(e.detail.value);
                      }}
                    />
                  </IonItem>
                </>
              )}
            </div>
          </>
        ) : (
          <div>Message not found</div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default ViewMessage;
