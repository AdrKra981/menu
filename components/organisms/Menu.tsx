"use client";
import React, { FC, useEffect, useState } from "react";
import EmptyMenuView from "./EmptyMenuView";
import MenuPositionForm from "./MenuPositionForm";
import MenuItem from "./MenuItem";
import { FormSchema } from "@/helpers/FormSchema";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

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

const formatData = (onlyMenus: Menu[], sort?: boolean) => {
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

  finalOnlyMenus = finalOnlyMenus.map((menu) => {
    if (subMenus[menu.id]) {
      return {
        ...menu,
        sub_menu:
          menu.sub_menu && menu.sub_menu.length > 0 && sort
            ? menu.sub_menu
            : subMenus[menu.id],
      };
    }

    return menu;
  });

  finalOnlyMenus.forEach((item) => {
    if (item.menu_position_id) {
      if (!menus[item.menu_position_id]) {
        menus[item.menu_position_id] = {
          id: item.menu_position_id,
          menus: [
            {
              ...item,
              sub_menu:
                item.sub_menu &&
                item.sub_menu?.map((sub) => {
                  const findInFinal = finalOnlyMenus.find(
                    (element) => element.id === sub.id
                  );
                  if (findInFinal) {
                    return findInFinal;
                  }
                  return sub;
                }),
            },
          ],
        };
      } else {
        menus[item.menu_position_id] = {
          id: item.menu_position_id,
          menus: [
            ...menus[item.menu_position_id].menus,
            {
              ...item,
              sub_menu:
                item.sub_menu &&
                item.sub_menu?.map((sub) => {
                  const findInFinal = finalOnlyMenus.find(
                    (element) => element.id === sub.id
                  );
                  if (findInFinal) {
                    return findInFinal;
                  }
                  return sub;
                }),
            },
          ],
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
    handleClose();
    handleCloseMenuInMenus();
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSort = (menu_position_id: string, sorted: Menu[]) => {
    setMenus(
      menus.map((item) => {
        if (item.id === menu_position_id) {
          return { ...item, menus: sorted };
        }

        return item;
      })
    );
  };

  const handleMenuSort = (id_parent: string, sorted: Menu[]) => {
    setMenus(
      formatData(
        onlyMenus.map((item) => {
          if (item.id === id_parent) {
            return { ...item, sub_menu: sorted };
          }

          return item;
        }),
        true
      )
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#EAECF0]">
      <div className="px-6 w-full h-full">
        <EmptyMenuView handleClick={() => setShowMenuPositionForm(true)} />
        {showMenuPositionForm && (
          <MenuPositionForm
            createMenu={handleNewMenuPositionCreate}
            handleClose={handleClose}
            margin
          />
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
                <DndContext
                  sensors={sensors}
                  onDragEnd={({ active, over }) => {
                    if (over && active.id !== over?.id) {
                      const activeIndex = menu.menus.findIndex(
                        ({ id }) => id === active.id
                      );
                      const overIndex = menu.menus.findIndex(
                        ({ id }) => id === over.id
                      );

                      handleSort(
                        menu.id,
                        arrayMove(menu.menus, activeIndex, overIndex)
                      );
                    }
                  }}
                >
                  <SortableContext items={menu.menus}>
                    <ul>
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
                            handleMenuSort={handleMenuSort}
                          />
                        );
                      })}
                    </ul>
                  </SortableContext>
                </DndContext>
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
