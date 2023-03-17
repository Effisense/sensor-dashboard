import {
  Card,
  Title,
  AreaChart,
  CategoryBar,
  DateRangePicker,
  Flex,
  Text,
  Badge,
  Metric,
} from "@tremor/react";
import Map from "@/ui/Map";
import { BeakerIcon, SignalIcon } from "@heroicons/react/24/solid";

const chartdataOld = [
  {
    date: "Jan 22",
    SemiAnalysis: 2890,
    Fyllingsgrad: 2338,
  },
  {
    date: "Feb 22",
    SemiAnalysis: 2756,
    Fyllingsgrad: 2103,
  },
  {
    date: "Mar 22",
    SemiAnalysis: 3322,
    Fyllingsgrad: 2194,
  },
  {
    date: "Apr 22",
    SemiAnalysis: 3470,
    Fyllingsgrad: 2108,
  },
  {
    date: "May 22",
    SemiAnalysis: 3475,
    Fyllingsgrad: 1812,
  },
  {
    date: "Jun 22",
    SemiAnalysis: 3129,
    Fyllingsgrad: 1726,
  },
];

const dataFormatter = (number: number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
};

const getFillLevel = () => {
  return 40;
};

//const [chartdata, setChartData] = useState({});

function SensorData() {
  return (
    <div className="mx-auto flex w-full items-center justify-center ">
      <Card className="max-w-3xl">
        <Metric>Sensor: XGSJNE</Metric>
        <Flex className="justify-start pt-2">
          <Badge className="mr-3" icon={SignalIcon}>
            live
          </Badge>
          <Badge icon={BeakerIcon}>Gisle Johnsons Gate 6</Badge>
        </Flex>
        <Text>Her er en beskrivelse</Text>

        <Title className="pt-5">Fyllingsgrad: </Title>
        <CategoryBar
          categoryPercentageValues={[50, 20, 20, 10]}
          colors={["emerald", "yellow", "orange", "rose"]}
          percentageValue={80}
          className="mt-3"
        />
        <Title className="pt-5">Container: </Title>
        <Title className="pt-10">Fyllingsgrad over tid</Title>

        <DateRangePicker
          className="max-w-sm"
          enableDropdown={true}
          // onValueChange={(value: DateRangePickerValue) => setChartData(value)}
        />

        <AreaChart
          className="mt-4 h-72"
          data={chartdataOld}
          index="date"
          categories={["Fyllingsgrad"]}
          colors={["indigo", "cyan"]}
          valueFormatter={dataFormatter}
        />
        <Map />
      </Card>
    </div>
  );
}

export default SensorData;
