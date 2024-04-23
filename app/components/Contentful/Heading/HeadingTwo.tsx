import * as React from "react";

interface Props {
  children: React.ReactNode;
}

const HeadingTwo: React.FC<Props> = (props) => {
  return (
    <h3 className="BlogPost__HeadingTwo text-3xl xs:text-4xl custom2:text-[2.5rem] mt-8 mb-5 text-post-bodyTextLg">
      {props.children}
    </h3>
  );
};

export default HeadingTwo;
