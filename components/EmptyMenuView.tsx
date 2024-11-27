import React, { FC } from "react";
import ComponentsWrapper from "./ComponentsWrapper";

interface EmptyMenuViewProps {
  handleClick: () => void;
}

const PlusIcon = () => {
  return (
    <svg
      width="19"
      height="20"
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.50002 6.66667V13.3333M6.16669 10H12.8334M17.8334 10C17.8334 14.6024 14.1024 18.3333 9.50002 18.3333C4.89765 18.3333 1.16669 14.6024 1.16669 10C1.16669 5.39763 4.89765 1.66667 9.50002 1.66667C14.1024 1.66667 17.8334 5.39763 17.8334 10Z"
        stroke="white"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const EmptyMenuView: FC<EmptyMenuViewProps> = ({ handleClick }) => {
  return (
    <ComponentsWrapper>
      <span className="font-semibold text-base text-[#101828]">
        Menu jest puste
      </span>
      <span className="text-sm text-[#475467]">
        W tym menu nie ma jeszcze żadnych linków.
      </span>
      <button
        onClick={handleClick}
        className=" flex flex-row text-white bg-[#7F56D9] border border-[#7F56D9] rounded-md px-[10px] py-[14px] gap-2"
      >
        <PlusIcon /> Dodaj pozycję menu
      </button>
    </ComponentsWrapper>
  );
};

export default EmptyMenuView;
