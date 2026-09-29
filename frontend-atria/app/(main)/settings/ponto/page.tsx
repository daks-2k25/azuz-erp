"use client";

import { EmployeeProfilesPanel } from "@/components/time-tracking/employee-profiles-panel";
import { WorkSchedulesPanel } from "@/components/time-tracking/work-schedules-panel";

export default function SettingsTimeTrackingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
          Ponto CLT
        </h1>
        <p className="text-sm text-[var(--atria-primary)]/50">
          Cadastre as jornadas de trabalho e os funcionários que batem ponto
        </p>
      </div>

      <WorkSchedulesPanel />
      <EmployeeProfilesPanel />
    </div>
  );
}
