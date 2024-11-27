"use client";
import React, { FC, useState } from "react";
import EmptyMenuView from "./EmptyMenuView";
import MenuPositionForm from "./MenuPositionForm";

interface MenuProps {}

const Menu: FC<MenuProps> = ({}) => {
  const [showMenuPositionForm, setShowMenuPositionForm] =
    useState<Boolean>(false);

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#EAECF0]">
      <div className="px-6 w-full">
        <EmptyMenuView handleClick={() => setShowMenuPositionForm(true)} />
        {showMenuPositionForm && <MenuPositionForm />}
      </div>
    </div>
  );
};

export default Menu;
