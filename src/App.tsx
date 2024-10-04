import {
  IonApp,
  IonContent,
  IonFooter,
  IonItem,
  IonRouterOutlet,
  IonToggle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { disableNetwork, enableNetwork } from "firebase/firestore";
import { useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { db } from "./main";
import Home from "./pages/Home";
import ViewMessage from "./pages/ViewMessage";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [status, setStatus] = useState("Online");

  const toggleNetwork = async () => {
    if (isOnline) {
      try {
        await disableNetwork(db);
        setIsOnline(false);
        setStatus("Offline");
        console.log("Network disabled!");
      } catch (error) {
        console.error("Error disabling network:", error);
      }
    } else {
      try {
        await enableNetwork(db);
        setIsOnline(true);
        setStatus("Online");
        console.log("Network enabled!");
      } catch (error) {
        console.error("Error enabling network:", error);
      }
    }
  };

  return (
    <IonApp>
      <IonContent>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/" exact>
              <Redirect to="/home" />
            </Route>
            <Route path="/home" exact>
              <Home />
            </Route>
            <Route path="/message/:id">
              <ViewMessage />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonItem
            lines="none"
            style={{ marginLeft: "auto", marginRight: "0" }}
          >
            <IonToggle
              color="success"
              justify="start"
              checked={isOnline}
              onIonChange={toggleNetwork}
              labelPlacement="end"
            >
              {status}
            </IonToggle>
          </IonItem>
        </IonToolbar>
      </IonFooter>
    </IonApp>
  );
};

export default App;
