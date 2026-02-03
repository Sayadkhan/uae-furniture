import { Suspense } from "react";
import Profile from "./components/Profile";

export const dynamic = "force-dynamic";

const page = async () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            Loading profile data....
          </div>
        }
      >
        <Profile />
      </Suspense>
    </div>
  );
};

export default page;
