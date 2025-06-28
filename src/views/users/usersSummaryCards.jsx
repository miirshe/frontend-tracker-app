import React from 'react';
import StatCard from '@/components/ui/stat-card';
import { useGetUserStatsQuery } from '@/redux/api/userApi';
import { Users, Shield, UserCheck, Clock } from 'lucide-react';

const UsersSummaryCards = () => {
  const { data: stats, isLoading, error } = useGetUserStatsQuery();

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full text-center text-red-500 p-4">
          Error loading user statistics
        </div>
      </div>
    );
  }

  const userStats = stats?.data || {};

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={userStats.totalUsers || 0}
        icon={Users}
        color="blue"
        description="All registered users"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Administrators"
        value={userStats.adminCount || 0}
        icon={Shield}
        color="red"
        description={`${userStats.adminPercentage || 0}% of total users`}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Regular Users"
        value={userStats.userCount || 0}
        icon={UserCheck}
        color="green"
        description={`${userStats.userPercentage || 0}% of total users`}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Recent Users"
        value={userStats.recentUsers || 0}
        icon={Clock}
        color="purple"
        description="Joined in last 7 days"
        isLoading={isLoading}
      />
    </div>
  );
};

export default UsersSummaryCards;
