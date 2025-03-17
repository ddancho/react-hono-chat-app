import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Camera, Mail, User } from "lucide-react";
import { updateProfileImage } from "../utils/auth";
import toast from "react-hot-toast";

function ProfilePage() {
  const { authUser } = useAuthContext();
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) {
      return;
    }

    if (!event.target.files[0].type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", event.target.files[0]);

    const res = await updateProfileImage(formData);
    if (res.status === "error") {
      toast.error(
        res.message ?? "Update profile image failed. Try again later."
      );

      return;
    }

    toast.success("Profile image updated successfully.");

    const fileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0]);

    fileReader.onloadstart = () => setIsUpdatingProfile(true);

    fileReader.onload = () => {
      setIsUpdatingProfile(false);

      const localImg = fileReader.result;
      if (localImg) {
        setUploadImage(localImg as string);
      }
    };

    fileReader.onabort = () => setIsUpdatingProfile(false);

    fileReader.onerror = () => setIsUpdatingProfile(false);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={uploadImage || authUser?.profilePicture || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}
              >
                <Camera className="size-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <fieldset className="fieldset bg-base-200 border border-base-300 p-4 rounded-box space-y-6">
            <div>
              <label className="fieldset-label mb-2">Full Name</label>
              <div className="relative flex items-center">
                <div className="absolute left-1 pr-2 pointer-events-none z-1">
                  <User className="size-5 text-base-content/40" />
                </div>
                <p className="input w-full pl-8 font-medium">
                  {authUser?.username}
                </p>
              </div>
            </div>

            <div>
              <label className="fieldset-label mb-2">Email</label>
              <div className="relative flex items-center">
                <div className="absolute left-1 pr-2 pointer-events-none z-1">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <p className="input w-full pl-8 font-medium">
                  {authUser?.email}
                </p>
              </div>
            </div>
          </fieldset>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
