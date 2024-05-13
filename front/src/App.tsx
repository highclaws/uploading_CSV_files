import "./App.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import UploadForm from "./features/upload/UploadForm";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const contextClass = {
    success: "bg-blue-600",
    error: "bg-red-600",
    info: "bg-gray-600",
    warning: "bg-orange-400",
    default: "bg-indigo-600",
    dark: "bg-white-600 font-gray-300",
  };
  return (
    <Provider store={store}>
      <div className="App">
          <UploadForm />
      </div>
      <ToastContainer
        toastClassName={(context) =>
          contextClass[context?.type || "default"] +
          " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        }
        icon={false}
        position="top-center"
        autoClose={15000}
        style={{ width: "400px" }} 
      />
    </Provider>
  );
};

export default App;
