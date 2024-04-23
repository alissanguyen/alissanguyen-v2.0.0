import * as React from "react";

interface Props {
  children: React.ReactNode;
}

const HeadingSix: React.FC<Props> = (props) => {
  return (
    <p className={`font-bold text-xl mb-5 mt-10 xs:font-medium`}>
      {props.children}
    </p>
  );
};

export default HeadingSix;
