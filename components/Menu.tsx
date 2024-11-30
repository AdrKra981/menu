"use client";
import React, { FC, useEffect, useId, useState } from "react";
import EmptyMenuView from "./EmptyMenuView";
import MenuPositionForm from "./MenuPositionForm";
import MenuItem from "./MenuItem";
import { FormSchema } from "@/helpers/FormSchema";

interface MenuProps {}

const uid = () => {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 12).padStart(12, "0")
  );
};

export type MenuPosition = {
  id: string;
  menus: Menu[];
};

export type Menu = {
  id: string;
  label: string;
  url: string;
  sub_menu: Menu[] | null;
  menu_position_id: string | null;
  parent_id: string | null;
};

const formatData = (onlyMenus: Menu[]) => {
  let menus: { [id: string]: MenuPosition } = {};
  let subMenus: { [id: string]: Menu[] } = {};
  let finalOnlyMenus: Menu[] = onlyMenus;

  onlyMenus.forEach((item) => {
    if (item.parent_id) {
      if (!subMenus[item.parent_id]) {
        subMenus[item.parent_id] = [item];
      } else {
        subMenus[item.parent_id] = [...subMenus[item.parent_id], item];
      }
    }
  });
  console.log("subMenus", subMenus);
  console.log(
    "first",
    finalOnlyMenus.map((menu) => {
      if (subMenus[menu.id]) {
        return { ...menu, sub_menu: subMenus[menu.id] };
      }

      return menu;
    })
  );

  finalOnlyMenus
    .map((menu) => {
      if (subMenus[menu.id]) {
        return { ...menu, sub_menu: subMenus[menu.id] };
      }

      return menu;
    })
    .forEach((item) => {
      if (item.menu_position_id) {
        if (!menus[item.menu_position_id]) {
          menus[item.menu_position_id] = {
            id: item.menu_position_id,
            menus: [item],
          };
        } else {
          menus[item.menu_position_id] = {
            id: item.menu_position_id,
            menus: [...menus[item.menu_position_id].menus, item],
          };
        }
      }
    });

  return Object.values(menus);
};

const Menu: FC<MenuProps> = () => {
  const [menus, setMenus] = useState<MenuPosition[]>([]);
  const [onlyMenus, setOnlyMenus] = useState<Menu[]>([]);
  const [showMenuPositionForm, setShowMenuPositionForm] =
    useState<Boolean>(false);
  const [showMenuInMenu, setShowMenuInMenu] = useState<string>("");
  const [showEditMenu, setShowEditMenu] = useState<string>("");

  useEffect(() => {
    if (onlyMenus.length > 0) {
      setMenus(formatData(onlyMenus));
    }
  }, [onlyMenus]);

  console.log("menus", menus);

  const handleClose = () => {
    setShowMenuPositionForm(false);
  };

  const handleEditClose = () => {
    setShowEditMenu("false");
  };

  const handleCloseMenuInMenus = () => {
    setShowMenuInMenu("");
  };

  const handleShowMenuInMenu = (id: string) => {
    setShowMenuInMenu(id);
  };

  const handleShowEditMenu = (id: string) => {
    setShowEditMenu(id);
  };

  const handleDeleteMenu = (id: string) => {
    setOnlyMenus(onlyMenus.filter((menu) => menu.id !== id));
  };

  const handleMenuEdit = (data: Menu) => {
    setOnlyMenus(
      onlyMenus.map((menu) => {
        if (menu.id === data.id) {
          return data;
        }

        return menu;
      })
    );

    setShowEditMenu("");
  };

  const handleNewMenuPositionCreate = (data: FormSchema) => {
    const menuPositionId = !data.menu_position_id
      ? uid()
      : !data.parent_id
      ? data.menu_position_id
      : null;
    let newMenu = {
      id: uid(),
      label: data.label,
      url: data.url || "",
      sub_menu: [],
      menu_position_id: menuPositionId,
      parent_id: data.parent_id || null,
    };

    setOnlyMenus([...onlyMenus, newMenu]);
    handleCloseMenuInMenus();
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#EAECF0]">
      <div className="px-6 w-full h-full">
        {menus.length === 0 && (
          <>
            <EmptyMenuView handleClick={() => setShowMenuPositionForm(true)} />
            {showMenuPositionForm && (
              <MenuPositionForm
                createMenu={handleNewMenuPositionCreate}
                handleClose={handleClose}
                margin
              />
            )}
          </>
        )}
        {menus.map((menu, index) => {
          return (
            <div
              key={`main_menu_${menu.id}`}
              className={`border border-[#D0D5DD] rounded-md flex flex-col justify-center items-center bg-[#F9FAFB] ${
                index === 0 ? "mt-[30px]" : "mt-[15px]"
              } mb-[15px] w-full`}
            >
              <div className="w-full h-full flex flex-col">
                {menu.menus.map((item) => {
                  return (
                    <MenuItem
                      key={`menu_item_${item.id}`}
                      menu={item}
                      handleShowMenuInMenu={handleShowMenuInMenu}
                      showMenuInMenu={showMenuInMenu}
                      showEditMenu={showEditMenu}
                      createMenu={handleNewMenuPositionCreate}
                      handleClose={handleCloseMenuInMenus}
                      handleEditClose={handleEditClose}
                      handleDeleteMenu={handleDeleteMenu}
                      handleShowEditMenu={handleShowEditMenu}
                      menu_position_id={menu.id}
                      updateMenu={handleMenuEdit}
                    />
                  );
                })}
                {showMenuInMenu === menu.id && (
                  <div className="py-4 px-6">
                    <MenuPositionForm
                      createMenu={handleNewMenuPositionCreate}
                      handleClose={handleCloseMenuInMenus}
                      menu_position_id={menu.id}
                    />
                  </div>
                )}
                <div className="bg-[#EAECF0] py-5 px-6 w-full h-full flex">
                  <button
                    onClick={() => handleShowMenuInMenu(menu.id)}
                    className="rounded-lg bg-white border border-[#D0D5DD] py-[10px] px-[14px] text-sm font-semibold"
                  >
                    Dodaj pozycję menu
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
