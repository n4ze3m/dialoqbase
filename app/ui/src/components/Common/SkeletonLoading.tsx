import { Skeleton } from "antd";

export const SkeletonLoading = ({ className = "mt-6" }: { className?: string }) => {
  return (
    <div className={className}>
      <Skeleton active />
      <Skeleton active className="mt-3" />
    </div>
  );
};
