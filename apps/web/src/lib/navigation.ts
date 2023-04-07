export type Navigation = {
  href: string;
  label: string;
};

const navigation: Navigation[] = [
  {
    href: "/containers/create",
    label: "Add container",
  },
  {
    href: "/sensors/create",
    label: "Add sensor",
  },
];

export default navigation;
