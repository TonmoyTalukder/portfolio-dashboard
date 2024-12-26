"use client";

import { Card } from "@nextui-org/react";

import { useFetchSkills } from "@/src/hooks/skill.hooks";
import { useFetchProjects } from "@/src/hooks/project.hooks";

const Dashboard = () => {
  const {
    data: skills,
    isLoading: skillsLoading,
    isError: skillsError,
  } = useFetchSkills();

  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
  } = useFetchProjects();

  const totalSkills = skills?.length || 0;
  const totalProjects = projectsData?.data?.length || 0;
  const maxCount = Math.max(totalSkills, totalProjects);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {(skillsLoading || projectsLoading) && (
        <div className="flex items-center justify-center h-screen">
          <div>Loading Data...</div>
        </div>
      )}

      {(skillsError || projectsError) && (
        <div className="mt-10 text-center">
          <div color="error">Error fetching data. Please try again later.</div>
        </div>
      )}

      {!skillsLoading && !projectsLoading && !skillsError && !projectsError && (
        <Card className="w-full max-w-4xl p-6 shadow-md">
          <div className="text-center text-xl md:text-2xl mb-4">
            Dashboard Overview
          </div>

          <div className="flex items-end justify-center gap-8 md:gap-16 h-64">
            <div className="flex flex-col items-center">
              <div
                className="w-16 bg-blue-500 rounded transition-all duration-300"
                style={{ height: `${(totalSkills / maxCount) * 100}%` }}
              />
              <div className="mt-2 text-center text-gray-700 font-medium">
                Skills
              </div>
              <div className="text-center text-gray-500">({totalSkills})</div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="w-16 bg-green-500 rounded transition-all duration-300"
                style={{ height: `${(totalProjects / maxCount) * 100}%` }}
              />
              <div className="mt-2 text-center text-gray-700 font-medium">
                Projects
              </div>
              <div className="text-center text-gray-500">({totalProjects})</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
