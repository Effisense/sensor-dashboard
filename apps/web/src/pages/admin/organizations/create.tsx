import { trpc } from "@/utils/trpc";

const CreateOrganizationPage = () => {
  const { data, isLoading } = trpc.auth.isAdmin.useQuery();

  console.log(data);

  return isLoading ? (
    <div>loading</div>
  ) : (
    <div>
      you are an admin if you have access to this page. Is admin:{" "}
      <span>{data}</span>
    </div>
  );
};

export default CreateOrganizationPage;
