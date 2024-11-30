import { useDraggable } from "@dnd-kit/core";
import React, { FC } from "react";

interface DraggableProps {
  children?: React.ReactNode;
  className?: string;
}

const Draggable: FC<DraggableProps> = ({ children, className }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={className}
    >
      {children}
    </button>
  );
};

export default Draggable;
