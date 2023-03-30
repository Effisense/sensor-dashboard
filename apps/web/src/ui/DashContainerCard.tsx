import { Container, Sensor } from "@acme/db";
import { Card, Title, Flex } from "@tremor/react";
import { DonutChart } from "@tremor/react";
import { List, ListItem } from "@tremor/react";

const cities = [
  {
    name: "New York",
    sales: 9800,
  },
  {
    name: "London",
    sales: 4567,
  },
  {
    name: "Hong Kong",
    sales: 3908,
  },
  {
    name: "San Francisco",
    sales: 2400,
  },
];

const binFullness = [
  {
    desc: "Tomme",
    num: 1,
  },
  {
    desc: "Halvfulle",
    num: 1,
  },
  {
    desc: "Nesten fulle",
    num: 1,
  },
  {
    desc: "Fulle",
    num: 1,
  },
];

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat("us").format(number).toString()}`;

function DashContainerCard(
  container: Container,
  sensors: Sensor[],
  header: boolean,
  selected: boolean,
) {
  return (
    <a href="">
      <Card className={`w-full max-w-lg ${selected ? "bg-yellow-50" : ""}`}>
        {/* If container is null, show header */}
        {header ? (
          <Title className="-my-3">
            {container.id} {container.length} stk
          </Title>
        ) : (
          <Title className="-my-3">
            Totaloversikt
            {container.length} 10 stk
          </Title>
        )}

        <Flex className="gap-0">
          <div className="w-48">
            <DonutChart
              className="mt-6"
              data={cities}
              category="sales"
              index="name"
              valueFormatter={valueFormatter}
              colors={["green", "yellow", "orange", "rose"]}
            />
          </div>
          <div className="w-full pl-4">
            <List>
              {binFullness.map((item) => (
                <ListItem key={item.desc}>
                  <span>{item.desc}</span>
                  <span>{item.num} stk</span>
                </ListItem>
              ))}
            </List>
          </div>
        </Flex>
      </Card>
    </a>
  );
}

export default DashContainerCard;
