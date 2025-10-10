import { Provider } from "react-redux";
import { store } from "./store/store";
import TwilioDialler from "./twilioDialler/TwilioDialler";

const App = () => {
  return (
    <Provider store={store}>
      <div className="flex justify-center items-center min-h-screen">
        <TwilioDialler />
      </div>
    </Provider>
  );
};

export default App;
