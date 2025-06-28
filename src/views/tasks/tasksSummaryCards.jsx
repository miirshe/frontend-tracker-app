import React from 'react';
import StatCard from '@/components/ui/stat-card';
import { useGetTaskStatsQuery } from '@/redux/api/taskApi';
import { 
  CheckSquare, 
  Clock, 
  PlayCircle, 
  AlertTriangle, 
  Zap, 
  CalendarClock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const TasksSummaryCards = () => {
  const { data: stats, isLoading, error } = useGetTaskStatsQuery();

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full text-center text-red-500 p-4">
          Error loading task statistics
        </div>
      </div>
    );
  }

  const taskStats = stats?.data || {};

  return (
    <div className="space-y-6">
      {/* Main Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={taskStats.totalTasks || 0}
          icon={CheckSquare}
          color="blue"
          description="All tasks"
          isLoading={isLoading}
        />
        
        <StatCard
          title="Pending Tasks"
          value={taskStats.pendingCount || 0}
          icon={Clock}
          color="yellow"
          description={`${taskStats.pendingPercentage || 0}% of total`}
          isLoading={isLoading}
        />
        
        <StatCard
          title="In Progress"
          value={taskStats.inProgressCount || 0}
          icon={PlayCircle}
          color="orange"
          description={`${taskStats.inProgressPercentage || 0}% of total`}
          isLoading={isLoading}
        />
        
        <StatCard
          title="Completed Tasks"
          value={taskStats.completedCount || 0}
          icon={CheckSquare}
          color="green"
          description={`${taskStats.completionRate || 0}% completion rate`}
          isLoading={isLoading}
        />
      </div>

      {/* Priority & Time Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="High Priority"
          value={taskStats.highPriorityCount || 0}
          icon={AlertTriangle}
          color="red"
          description="High priority tasks"
          isLoading={isLoading}
        />
        
        <StatCard
          title="Urgent Tasks"
          value={taskStats.urgentPriorityCount || 0}
          icon={Zap}
          color="red"
          description="Urgent priority tasks"
          isLoading={isLoading}
        />
        
        <StatCard
          title="Overdue Tasks"
          value={taskStats.overdueCount || 0}
          icon={AlertCircle}
          color="red"
          description="Past due date"
          isLoading={isLoading}
        />
        
        <StatCard
          title="Due This Week"
          value={taskStats.tasksDueThisWeek || 0}
          icon={CalendarClock}
          color="purple"
          description="Tasks due in 7 days"
          isLoading={isLoading}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Recent Tasks"
          value={taskStats.recentTasks || 0}
          icon={TrendingUp}
          color="indigo"
          description="Created in last 7 days"
          isLoading={isLoading}
        />
        
        <StatCard
          title="Medium Priority"
          value={taskStats.mediumPriorityCount || 0}
          icon={Clock}
          color="yellow"
          description="Medium priority tasks"
          isLoading={isLoading}
        />
        
        <StatCard
          title="Low Priority"
          value={taskStats.lowPriorityCount || 0}
          icon={Clock}
          color="green"
          description="Low priority tasks"
          isLoading={isLoading}
        />
        
        <StatCard
          title="Cancelled Tasks"
          value={taskStats.cancelledCount || 0}
          icon={AlertCircle}
          color="red"
          description="Cancelled tasks"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TasksSummaryCards; 