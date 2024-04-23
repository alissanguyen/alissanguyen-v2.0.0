import * as React from "react";


const Footer: React.FC = () => {
  return (
    <div className="w-full relative">
      <div className="bottom-0 py-2 w-full flex flex-col items-center justify-center text-xs text-textSmColor">
        <p>Built and designed by Alissa Nguyen a.k.a Tam Nguyen.</p>
        <p>Copyright © {new Date().getFullYear()} All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;

