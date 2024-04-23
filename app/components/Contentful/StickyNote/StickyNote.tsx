import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import * as React from "react";

import { STICKY_BORDER, STICKY_HIGHLIGHT } from "~/constants";
import { stickyOptions } from "~/contentful/richTextMarkdownForStickies";
import { ContentfulStickyNote } from "~/contentful/types";
interface Props {
  stickyData: ContentfulStickyNote;
}

const StickyNote: React.FC<Props> = (props) => {
  const stickyColorCode = props.stickyData.stickyColor;
  const stickyBgColor = contentfulStickyBackgrounds[stickyColorCode];
  const stickyBorderColor = contentfulStickyBorders[stickyColorCode];

  const body = documentToReactComponents(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props.stickyData.stickyBodyRichText as any,
    stickyOptions
  );

  return (
    <div
      className="Sticky__Container mt-4 px-5 pt-2 pb-3 rounded-r-xl"
      style={{
        borderLeft: `solid 6px ${stickyBorderColor}`,
        backgroundColor: `${stickyBgColor}`,
        color: `${stickyBorderColor}`
      }}
    >
      {props.stickyData.shouldDisplayTitle ? (
        <p className="Sticky__Title font-extrabold tracking-wide mb-1">
          {props.stickyData.stickyTitle}
        </p>
      ) : null}
      <div className="Sticky__Body font-medium">{body}</div>
    </div>
  );
};

export default StickyNote;

const contentfulStickyBackgrounds: Record<string, string> = {
  yellow: STICKY_HIGHLIGHT.YELLOW,
  blue: STICKY_HIGHLIGHT.BLUE,
  pink: STICKY_HIGHLIGHT.PINK,
  green: STICKY_HIGHLIGHT.GREEN,
  orange: STICKY_HIGHLIGHT.ORANGE,
  purple: STICKY_HIGHLIGHT.PURPLE,
  red: STICKY_HIGHLIGHT.RED
};

const contentfulStickyBorders: Record<string, string> = {
  yellow: STICKY_BORDER.YELLOW,
  blue: STICKY_BORDER.BLUE,
  pink: STICKY_BORDER.PINK,
  green: STICKY_BORDER.GREEN,
  orange: STICKY_BORDER.ORANGE,
  purple: STICKY_BORDER.PURPLE,
  red: STICKY_BORDER.RED
};
