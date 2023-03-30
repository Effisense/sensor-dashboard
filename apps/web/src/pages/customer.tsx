import { useToast } from "@/hooks/toast/useToast";
import LoadingSpinner from "@/ui/LoadingSpinner";
import OrganizationSwitcher from "@/ui/OrganizationSwitcher";
import H1 from "@/ui/typography/H1";
import H2 from "@/ui/typography/H2";
import Subtle from "@/ui/typography/Subtle";
import { trpc } from "@/utils/trpc";
import { userIsMemberOfAnyOrganization } from "@acme/api/src/lib/clerk";
import { useAuth } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useEffect } from "react";

type CustomerPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const CustomerPage = ({ isMemberOfAnyOrganization }: CustomerPageProps) => {
  const { userId, orgId, isLoaded } = useAuth();
  const { toast } = useToast();
  const { mutateAsync, isLoading } =
    trpc.organization.addUserToOrganization.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully set active organization",
          severity: "success",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "An error occurred when setting the active organization",
          severity: "error",
        });
      },
    });

  useEffect(() => {
    const addUserToOrganization = async () => {
      if (!orgId) return;
      await mutateAsync({ userId });
    };

    addUserToOrganization();
  }, [mutateAsync, orgId, userId]);

  return (
    <div>
      <H1>Welcome to Effisense</H1>
      <Subtle>
        Before you can use the platform, you need to set an active organization.
      </Subtle>

      {isLoading && (
        <div className="flex items-center justify-center gap-x-2">
          <LoadingSpinner />
          <Subtle>Setting active organization</Subtle>
        </div>
      )}

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

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  if (orgId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const isMemberOfAnyOrganization = await userIsMemberOfAnyOrganization(userId);

  return {
    props: {
      isMemberOfAnyOrganization,
    },
  };
};

export default CustomerPage;
