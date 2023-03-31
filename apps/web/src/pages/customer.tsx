import LoadingSpinner from "@/ui/LoadingSpinner";
import OrganizationSwitcher from "@/ui/OrganizationSwitcher";
import H1 from "@/ui/typography/H1";
import H2 from "@/ui/typography/H2";
import Subtle from "@/ui/typography/Subtle";
import { userIsMemberOfAnyOrganization } from "@acme/api/src/lib/clerk";
import { useAuth } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

type CustomerPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const CustomerPage = ({ isMemberOfAnyOrganization }: CustomerPageProps) => {
  const { isLoaded } = useAuth();

  return (
    <div>
      <H1>Welcome to Effisense</H1>
      <Subtle>
        Before you can use the platform, you need to set an active organization.
      </Subtle>

      {!isMemberOfAnyOrganization && (
        <div>
          <H2>TODO</H2>
          <Subtle>
            Handle the case where the user does not belong to any organization
            yet.
          </Subtle>
        </div>
      )}
      {isMemberOfAnyOrganization && (
        <div className="flex flex-col items-center justify-center gap-y-2">
          <H2>Select active organization</H2>
          {!isLoaded && (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          {isLoaded && <OrganizationSwitcher />}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { userId, orgId } = getAuth(ctx.req);

  const isMemberOfAnyOrganization = await userIsMemberOfAnyOrganization(userId);

  return {
    props: {
      isMemberOfAnyOrganization,
    },
  };
};

export default CustomerPage;
