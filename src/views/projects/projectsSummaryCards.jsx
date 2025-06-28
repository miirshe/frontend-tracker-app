import React from 'react';
import StatCard from '@/components/ui/stat-card';
import { useGetProjectStatsQuery } from '@/redux/api/projectApi';
import { FolderOpen, Play, CheckCircle, Archive, Users, Calendar } from 'lucide-react';

const ProjectsSummaryCards = () => {
  const { data: stats, isLoading, error } = useGetProjectStatsQuery();

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full text-center text-red-500 p-4">
          Error loading project statistics
        </div>
      </div>
    );
  }

  const projectStats = stats?.data || {};

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Projects"
        value={projectStats.totalProjects || 0}
        icon={FolderOpen}
        color="blue"
        description="All projects"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Active Projects"
        value={projectStats.activeCount || 0}
        icon={Play}
        color="green"
        description={`${projectStats.activePercentage || 0}% of total`}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Completed Projects"
        value={projectStats.completedCount || 0}
        icon={CheckCircle}
        color="indigo"
        description={`${projectStats.completedPercentage || 0}% completion rate`}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Archived Projects"
        value={projectStats.archivedCount || 0}
        icon={Archive}
        color="yellow"
        description="Archived projects"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Recent Projects"
        value={projectStats.recentProjects || 0}
        icon={Calendar}
        color="purple"
        description="Created in last 30 days"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Avg Team Size"
        value={projectStats.avgTeamSize ? `${projectStats.avgTeamSize} members` : '-'}
        icon={Users}
        color="orange"
        description={`Max: ${projectStats.maxTeamSize || 0}, Min: ${projectStats.minTeamSize || 0}`}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectsSummaryCards; 