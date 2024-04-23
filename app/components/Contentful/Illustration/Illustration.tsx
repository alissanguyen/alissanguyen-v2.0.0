import * as React from "react";
import { ContentfulIllustration } from "~/contentful/types";
import { useTheme } from "~/providers/ThemeProvider";
import { SupportedTheme } from "~/types";

interface Props {
  rawData: ContentfulIllustration;
  location: "inside sticky" | "outside sticky";
}

const Illustration: React.FC<Props> = (props) => {
  const { theme } = useTheme();
  const rawDataIllustration = props.rawData.lightIllustration?.fields?.file;

  // If rawDataIllustration is undefined, don't render the component
  if (!rawDataIllustration) {
    return null;
  }

  const illustrationUrl = typeof rawDataIllustration.url === "string"
    ? "https://" + rawDataIllustration.url.split("//")[1]
    : "";
  const imageSrc = theme === SupportedTheme.DARK ? illustrationUrl : illustrationUrl;
  const padding = props.location === "inside sticky" ? "pt-3 pb-2" : "";

  return (
    <div className={`Illustration__Container rounded-lg ${padding}`}>
      <a href={imageSrc} target="_blank" rel="noreferrer">
        <img
          title={"Illustration for " + props.rawData.illustrationName}
          src={imageSrc}
          alt={"Illustration for " + props.rawData.illustrationName}
          className="Illustration__Image rounded-lg p-4"
          style={{ backgroundColor: `${theme === SupportedTheme.LIGHT ? "#ffffff" : "#212529"}` }}
        />
      </a>
    </div>
  );
};

export default Illustration;