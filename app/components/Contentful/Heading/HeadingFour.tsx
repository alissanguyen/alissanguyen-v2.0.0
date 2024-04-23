import * as React from "react";

import { useTheme } from "~/providers/ThemeProvider";
import { SupportedTheme } from "~/types";

interface Props {
  children: React.ReactNode;
}

const HeadingFour: React.FC<Props> = (props) => {
  const { theme } = useTheme();
  return (
    <h5
      className={`BlogPost__HeadingFour text-2xl xs:text-3xl mt-10 ${
        theme === SupportedTheme.LIGHT ? "text-purple-500" : "text-fuchsia-400"
      } font-medium`}
    >
      {props.children}
    </h5>
  );
};

export default HeadingFour;
