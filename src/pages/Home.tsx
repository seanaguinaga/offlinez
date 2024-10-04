import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import { useEffect, useState } from "react";
import MessageListItem from "../components/MessageListItem";
import { Message, subscribeToMessages } from "../data/messages";
import ComposeMessage from "./ComposeMessage";
import "./Home.css";

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(
      (msgs) => {
        setMessages(msgs);
      },
      (error) => {
        setError("Failed to load messages.");
        console.error("Subscription error:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const refresh = (e: CustomEvent) => {
    e.detail.complete();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inbox</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inbox</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonToast
          isOpen={!!error}
          message={error}
          duration={3000}
          onDidDismiss={() => setError("")}
        />

        <IonList>
          {messages.map((m) => (
            <MessageListItem key={m.id} message={m} />
          ))}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={openModal}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={isModalOpen} onDidDismiss={closeModal}>
          <ComposeMessage onDismiss={closeModal} />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
