import { memo, useMemo, useState } from "react";
import { useUser } from "../../../contexts/user.context";
import UserProfileCard from "./UserProfileCard";
import WorkspaceMetricsCard from "./WorkspaceMetricsCard";

const countFilesInTree = (node) => {
  if (!node || typeof node !== "object") return 0;
  let count = 0;
  for (const key in node) {
    const val = node[key];
    if (val && typeof val === "object" && "file" in val) {
      count++;
    } else if (val && typeof val === "object") {
      count += countFilesInTree(val);
    }
  }
  return count;
};

const StatsSidebar = ({ projects = [], pagination }) => {
  const { user } = useUser();
  const [mobileShowStats, setMobileShowStats] = useState(false);

  const stats = useMemo(() => {
    const userId = user?._id;
    const totalProjects = pagination?.totalProjects ?? projects.length;
    const ownedCount =
      pagination?.ownedCount ?? projects.filter((p) => p.owner === userId).length;
    const sharedCount =
      pagination?.sharedCount ?? Math.max(0, totalProjects - ownedCount);

    let totalFileCount = 0;
    let totalMemberSum = 0;
    let recent7DaysCount = 0;
    const collaboratorSet = new Set();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    projects.forEach((p) => {
      const memberCount = p.memberCount ?? 1;
      totalMemberSum += memberCount;

      if (Array.isArray(p.users)) {
        p.users.forEach((u) => {
          if (u?._id && u._id !== userId) {
            collaboratorSet.add(u._id);
          }
        });
      }

      if (p.fileTree) {
        totalFileCount += countFilesInTree(p.fileTree);
      }

      if (p.createdAt) {
        const createdDate = new Date(p.createdAt);
        if (createdDate >= sevenDaysAgo) {
          recent7DaysCount++;
        }
      }
    });

    const totalCollaborators =
      collaboratorSet.size > 0
        ? collaboratorSet.size
        : Math.max(0, totalMemberSum - projects.length);

    const calculatedFiles =
      totalFileCount > 0 ? totalFileCount : totalProjects * 4;

    const avgMembers =
      projects.length > 0
        ? (totalMemberSum / projects.length).toFixed(1)
        : "0";

    return {
      totalProjects,
      ownedCount,
      sharedCount,
      totalCollaborators,
      totalFileCount: calculatedFiles,
      avgMembers,
      recent7DaysCount,
    };
  }, [projects, pagination, user?._id]);

  return (
    <aside className="w-full md:w-[250px] lg:w-[290px] xl:w-[320px] shrink-0 flex flex-col gap-3 sm:gap-4 mb-4 md:mb-0 select-none overflow-y-auto hide-scrollbar pr-0.5 max-h-full">
      <UserProfileCard
        user={user}
        mobileShowStats={mobileShowStats}
        setMobileShowStats={setMobileShowStats}
        ownedCount={stats.ownedCount}
        sharedCount={stats.sharedCount}
      />

      <WorkspaceMetricsCard
        stats={stats}
        mobileShowStats={mobileShowStats}
      />
    </aside>
  );
};

export default memo(StatsSidebar);
