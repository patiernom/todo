import { createApp } from "vue";
import Unicon from "vue-unicons";
import {
  uniTimes,
  uniCheck,
  uniTrashAlt,
  uniCircle,
  uniCheckCircle,
} from "vue-unicons/dist/icons";

import router from "@/router";
import "./style.css";
import App from "./App.vue";

Unicon.add([uniTimes, uniCheck, uniTrashAlt, uniCircle, uniCheckCircle]);

createApp(App).use(router).use(Unicon, { height: 32, width: 32 }).mount("#app");
