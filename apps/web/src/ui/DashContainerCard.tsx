import { Container } from "@acme/db";

function DashContainerCard(container: Container) {
  return (
    <div>
      <h1>{container.binHeightInMillimeters}</h1>
    </div>
  );
}

export default DashContainerCard;
