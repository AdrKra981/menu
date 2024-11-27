import React, { FC } from "react";

interface ComponentsWrapperProps {
  children?: React.ReactNode;
}

const ComponentsWrapper: FC<ComponentsWrapperProps> = ({ children }) => {
  return (
    <div className="px-4 py-6 border border-[#EAECF0] rounded-md flex flex-col gap-2 justify-center items-center h-40 bg-[#F9FAFB] mt-[30px] w-full">
      {children}
    </div>
  );
};

export default ComponentsWrapper;
