import { useDroppable } from "@dnd-kit/core";
import React, { FC } from "react";

interface DroppableProps {
  children?: React.ReactNode;
}

const Droppable: FC<DroppableProps> = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  return <div ref={setNodeRef}>{children}</div>;
};

export default Droppable;
