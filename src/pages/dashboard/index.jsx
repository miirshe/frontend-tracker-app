import React from 'react'
import UsersSummaryCards from '@/views/users/usersSummaryCards'
import ProjectsSummaryCards from '@/views/projects/projectsSummaryCards'
import TasksSummaryCards from '@/views/tasks/tasksSummaryCards'

const Dashboard = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your project management system
        </p>
      </div>

      {/* Users Statistics */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Users Overview</h2>
        </div>
        <UsersSummaryCards />
      </section>

      {/* Projects Statistics */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Projects Overview</h2>
        </div>
        <ProjectsSummaryCards />
      </section>

      {/* Tasks Statistics */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tasks Overview</h2>
        </div>
        <TasksSummaryCards />
      </section>
    </div>
  )
}

export default Dashboard