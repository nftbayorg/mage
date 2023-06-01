import { useForm } from "react-hook-form";
import FileUpload from "./controls/FileUpload";
import { useCallback, useState } from "react";
import { User, Wallet } from "prisma/prisma-client";
import { UserProfileFormValues } from "../../types/user-profile";

type ComponentProps = {
  user: User;
  wallet: Wallet;
  onSubmit: (data: UserProfileFormValues) => void;
}

const UserProfileForm = ({ onSubmit, user, wallet }: ComponentProps) => {

  // const [profileImageFile, setProfileImageFile] = useState<File>();
  // const [bannerImageFile, setBannerImageFile] = useState<File>(user.image);

  const {
    formState: { errors, isValid },
  } = useForm<UserProfileFormValues>({
    mode: "onChange",
    reValidateMode: "onChange" 
  });

  // const handleProfileImageUploaded = (file: File | undefined) => {
  //   onSubmit({
  //     profileImageFile: file,
  //   });
  // }

  // const handleBannerImageUploaded = (file: File | undefined) => {
  //   onSubmit({
  //     bannerImageFile: file,
  //   });
  // }
 
  return (
    <div className="w-full h-screen">
      {/* <FileUpload 

        captionSize="md" 
        dropZoneSize="sm"
        required={true}
        onChange={(file) => handleProfileImageUploaded(file)}
      />
      <FileUpload 
        captionSize="md"
        dropZoneSize="lg"
        onChange={(file) => handleBannerImageUploaded(file)}
      /> */}
      <div className="flex flex-col items-center md:gap-10">
        <div className="text-4xl font-semibold py-5 text-gray-700 dark:text-gray-400">
          {user.email}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg text-gray-600 dark:text-gray-400">Wallet Address</div>
        </div>
        <div className="flex gap-x-2 items-center">
          <div className="text-1xl text-gray-700 dark:text-gray-400">
            {wallet.address}
          </div>
        </div>

      </div>

    </div>
  );
};

export default UserProfileForm;
