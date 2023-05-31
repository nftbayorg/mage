import type { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useState } from 'react'

import { User, Wallet } from "prisma/prisma-client";
import fetchMageUser from "../../../server/data/fetchUserProfile";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import UserProfileForm from "../../../components/forms/UserProfile";
import { readFiles } from "../../../utils/files";
import { determineResult } from "../../../utils/promises";
import { trpc } from "../../../utils/trpc";

const UserProfilePage = ({ user, wallet }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageUploaded, setProfileImageUploaded] = useState(false);
  const [bannerImageUploaded, setBannerImageUploaded] = useState(false);
  const [hasBannerImage, setHasBannerImage] = useState(false);
  const [hasProfileImage, setHasProfileImage] = useState(false);

  const updateUser = trpc.user.update.useMutation();

  const handleOnSumbit = async (data: UserProfileFormValues) => {
    setHasBannerImage(data.bannerImageFile ? true : false);
    setHasProfileImage(data.profileImageFile ? true : false);

    const fileReaderResults = await readFiles([
      data.profileImageFile,
      data.bannerImageFile,
    ]);

    if (data.bannerImageFile) {
      await updateUser.mutateAsync({
        bannerImageFile: determineResult<ArrayBuffer | string | null | undefined>(fileReaderResults[1])?.toString() || '',
      });

      setBannerImageUploaded(true);
    }

    if (data.profileImageFile) {
      await updateUser.mutateAsync({
        profileImageFile: determineResult<ArrayBuffer | string | null | undefined>(fileReaderResults[0])?.toString() || '',
      });

      setProfileImageUploaded(true);
    } 
  };


  return (
    <div className="flex items-center justify-center w-full">
      <UserProfileForm onSubmit={handleOnSumbit} user={user} wallet={wallet} />
    </div>
  );
};

type UserProfilePageProps = {
  user: User;
  wallet: Wallet;
}

export const getServerSideProps: GetServerSideProps<UserProfilePageProps> = async (
  ctx: GetServerSidePropsContext
) => {

  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: { destination: "/login", permanent: false },
      props: {},
    };
  }

  const { user, wallet } = await fetchMageUser(session.user?.id as string || '');

  return {
    props: {
      user,
      wallet
    }
  };
};

export default UserProfilePage;
