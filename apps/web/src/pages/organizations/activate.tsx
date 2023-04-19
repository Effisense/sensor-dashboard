import ActivateOrganizationDialog from "@/ui/ActivateOrganizationDialog";
import Alert from "@/ui/Alert";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import LoadingSpinner from "@/ui/LoadingSpinner";
import OrganizationSwitcher from "@/ui/OrganizationSwitcher";
import H1 from "@/ui/typography/H1";
import H2 from "@/ui/typography/H2";
import H4 from "@/ui/typography/H4";
import P from "@/ui/typography/P";
import Subtle from "@/ui/typography/Subtle";
import SeverityToIcon from "@/ui/utils/SeverityToIcon";
import becomeCustomerEmail from "@/utils/becomeCustomerEmail";
import isEmptyString from "@/utils/isEmptyString";
import {
  getUser,
  userIsMemberOfAnyOrganization,
} from "@acme/api/src/lib/clerk";
import { useAuth } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { inferAsyncReturnType } from "@trpc/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";

type ActivateOrganizationPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const ActivateOrganizationPage = ({
  // isMemberOfAnyOrganization,
  user,
}: ActivateOrganizationPageProps) => {
  const isMemberOfAnyOrganization = false;
  const { isLoaded } = useAuth();
  const [organizationName, setOrganizationName] = useState("");
  const [isCustomer, setIsCustomer] = useState<boolean | null>(null);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center">
      <ActivateOrganizationDialog
        open={isCustomer === true}
        onOpenChange={() => {
          setIsCustomer(null);
        }}
        title="Welcome to Effisense!"
        description="If your organization is already a customer, please ask your organization administrator to invite you."
        onConfirm={() => {
          setIsCustomer(null);
        }}
      />
      <ActivateOrganizationDialog
        open={isCustomer === false}
        onOpenChange={() => {
          setIsCustomer(null);
        }}
        title="Welcome to Effisense!"
        description="If your organization is not yet a customer, please reach out to Effisense to become a customer."
        onConfirm={() => {
          setIsCustomer(null);
        }}
        body={
          <div className="my-2 flex w-full items-center justify-center gap-x-2">
            <Input
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Organization name"
              className="flex-1 py-4"
            />

            {!isEmptyString(organizationName) && (
              <Link
                href={becomeCustomerEmail({
                  sender: user,
                  organizationName: organizationName,
                })}
              >
                <Button
                  variant="subtle"
                  className="flex items-center justify-center gap-x-2 bg-mint-6 hover:bg-mint-7"
                >
                  <RocketLaunchIcon className="w-4" />
                  <span>Become a customer</span>
                </Button>
              </Link>
            )}
          </div>
        }
      />

      <H1>Welcome to Effisense</H1>
      <Subtle>
        Before you can use the platform, you need to set an active organization.
      </Subtle>

      {!isMemberOfAnyOrganization && (
        <div className="my-4 flex flex-col items-center justify-center">
          <H4 className="flex items-center justify-center gap-x-2">
            {SeverityToIcon("warning", "w-6")}
            <span>
              It looks like you&apos;re not a member of any organization!
            </span>
          </H4>
          <P>
            Is your organization already a customer of the Effisense platform?
          </P>

          <div className="my-4 flex items-center justify-center gap-x-2">
            <Button
              variant="subtle"
              className="flex items-center justify-center gap-x-2 bg-mint-6 hover:bg-mint-7"
              onClick={() => setIsCustomer(true)}
            >
              <HandThumbUpIcon className="w-4" />
              <span>Yes</span>
            </Button>

            <Button
              variant="subtle"
              className="flex items-center justify-center gap-x-2 bg-mint-6 hover:bg-mint-7"
              onClick={() => setIsCustomer(false)}
            >
              <HandThumbDownIcon className="w-4" />
              <span>No</span>
            </Button>

            <Button
              variant="subtle"
              className="flex items-center justify-center gap-x-2 bg-mint-6 hover:bg-mint-7"
              onClick={() => setIsCustomer(false)}
            >
              <QuestionMarkCircleIcon className="w-4" />
              <span>I don&apos;t know</span>
            </Button>
          </div>
        </div>
      )}

      {isMemberOfAnyOrganization && (
        <div className="my-4 flex h-full flex-col items-center justify-center gap-y-2">
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
  const { userId } = getAuth(ctx.req);
  const user = JSON.parse(
    JSON.stringify(await getUser(userId)),
  ) as inferAsyncReturnType<typeof getUser>;
  const isMemberOfAnyOrganization = await userIsMemberOfAnyOrganization(userId);

  if (!user) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {
      isMemberOfAnyOrganization,
      user,
    },
  };
};

export default ActivateOrganizationPage;
