import { Skeleton } from "antd";

export const SkeletonLoading = () => {
  return (
    <>
      <Skeleton active />
      <Skeleton active className="mt-3" />
    </>
  );
};
