import type { Preview } from "@storybook/vue3-vite";
import { setup } from "@storybook/vue3";
import Unicon from "vue-unicons";
import {
  uniTimes,
  uniCheck,
  uniTrashAlt,
  uniCircle,
  uniCheckCircle,
} from "vue-unicons/dist/icons";
import router from "../src/stories/mocks/router";
import "../src/style.css";

// Register icons and plugins globally for all stories
Unicon.add([uniTimes, uniCheck, uniTrashAlt, uniCircle, uniCheckCircle]);
setup((app) => {
  app.use(Unicon, { height: 32, width: 32 });
  app.use(router);
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
