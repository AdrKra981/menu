import React, {
  createContext,
  CSSProperties,
  FC,
  useContext,
  useMemo,
} from "react";
import { Menu } from "./Menu";
import MenuPositionForm from "./MenuPositionForm";
import { FormSchema } from "@/helpers/FormSchema";
import EditMenuPositionForm from "./EditMenuPositionForm";
import {
  DndContext,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface MenuItemProps {
  menu: Menu;
  handleShowMenuInMenu: (id: string) => void;
  showMenuInMenu?: string;
  createMenu: (data: FormSchema) => void;
  handleClose: () => void;
  menu_position_id?: string | null;
  handleDeleteMenu: (id: string) => void;
  handleShowEditMenu: (id: string) => void;
  updateMenu: (data: Menu) => void;
  showEditMenu?: string;
  handleEditClose: () => void;
  handleMenuSort: (id_parent: string, sorted: Menu[]) => void;
}

export function DragIcon() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button className="DragHandle" {...attributes} {...listeners} ref={ref}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1482_384)">
          <path
            d="M4.16667 7.50002L1.66667 10M1.66667 10L4.16667 12.5M1.66667 10H18.3333M7.5 4.16669L10 1.66669M10 1.66669L12.5 4.16669M10 1.66669V18.3334M12.5 15.8334L10 18.3334M10 18.3334L7.5 15.8334M15.8333 7.50002L18.3333 10M18.3333 10L15.8333 12.5"
            stroke="#475467"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1482_384">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </button>
  );
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

const MenuItem: FC<MenuItemProps> = ({
  menu,
  handleShowMenuInMenu,
  showMenuInMenu,
  createMenu,
  handleClose,
  menu_position_id,
  handleDeleteMenu,
  updateMenu,
  handleShowEditMenu,
  showEditMenu,
  handleEditClose,
  handleMenuSort,
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: menu.id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <SortableItemContext.Provider value={context}>
      <li className="bg-[#F9FAFB] list-none" ref={setNodeRef} style={style}>
        {menu.id === showEditMenu ? (
          <EditMenuPositionForm
            data={menu}
            handleClose={handleEditClose}
            updateMenu={updateMenu}
          />
        ) : (
          <div className="flex flex-row gap-1 px-6 py-4 border-b border-[#EAECF0]">
            <div className="w-10 h-10 flex items-center justify-center cursor-pointer">
              <DragIcon />
            </div>
            <div className="flex flex-col w-full items-start">
              <span className="text-sm font-semibold text-[#101828]">
                {menu.label}
              </span>
              <p className="text-sm font-normal text-[#475467]">{menu.url}</p>
            </div>
            <div className="flex flex-row w-full items-end justify-end ">
              <div className="h-10 border border-[#D0D5DD] rounded-lg">
                <button
                  onClick={() => handleDeleteMenu(menu.id)}
                  className="py-2 px-4 h-10 font-semibold text-sm text-[#344054]"
                >
                  Usuń
                </button>
                <button
                  onClick={() => handleShowEditMenu(menu.id)}
                  className="border-l border-r border-[#D0D5DD] py-2 px-4 h-10 font-semibold text-sm text-[#344054]"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleShowMenuInMenu(menu.id)}
                  className=" py-2 px-4 h-10 font-semibold text-sm text-[#344054]"
                >
                  Dodaj pozycję menu
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="pl-16 bg-[#EAECF0]">
          {showMenuInMenu === menu.id && (
            <div className="py-4 px-6">
              <MenuPositionForm
                createMenu={createMenu}
                handleClose={handleClose}
                menu_position_id={menu_position_id}
                parent_id={menu.id}
              />
            </div>
          )}
          <DndContext
            sensors={sensors}
            onDragEnd={({ active, over }) => {
              if (over && active.id !== over?.id) {
                const activeIndex = menu.sub_menu!.findIndex(
                  ({ id }) => id === active.id
                );
                const overIndex = menu.sub_menu!.findIndex(
                  ({ id }) => id === over.id
                );

                handleMenuSort(
                  menu.id,
                  arrayMove(menu.sub_menu || [], activeIndex, overIndex)
                );
              }
            }}
          >
            <SortableContext items={menu.sub_menu || []}>
              {menu.sub_menu &&
                menu.sub_menu.map((item) => {
                  return (
                    <ul key={`sub_menu_item_${item.id}`}>
                      <MenuItem
                        menu={item}
                        handleShowMenuInMenu={handleShowMenuInMenu}
                        createMenu={createMenu}
                        handleClose={handleClose}
                        menu_position_id={menu_position_id}
                        showMenuInMenu={showMenuInMenu}
                        handleDeleteMenu={handleDeleteMenu}
                        updateMenu={updateMenu}
                        handleShowEditMenu={handleShowEditMenu}
                        showEditMenu={showEditMenu}
                        handleEditClose={handleEditClose}
                        handleMenuSort={handleMenuSort}
                      />
                    </ul>
                  );
                })}
            </SortableContext>
          </DndContext>
        </div>
      </li>
    </SortableItemContext.Provider>
  );
};

export default MenuItem;
