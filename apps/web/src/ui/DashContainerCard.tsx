import { Container, Sensor } from "@acme/db";
import { Card, Title, Flex } from "@tremor/react";
import { DonutChart } from "@tremor/react";
import { List, ListItem } from "@tremor/react";
import { MouseEvent } from "react";

// DashContainerCard component
interface DashContainerCardProps {
  container: Container;
  onSelect: () => void;
  isSelected: boolean;
}

function DashContainerCard({
  container,
  onSelect,
  isSelected,
}: DashContainerCardProps) {
  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    onSelect();
  };

  return (
    <div>
      <a href="#" onClick={handleClick}>
        <Card
          className={`${
            isSelected ? "bg-gray-200" : "hover:bg-gray-100"
          } transition-colors`}
        >
          <Title>{container.name}</Title>
        </Card>
      </a>
    </div>
  );
}

export default DashContainerCard;
