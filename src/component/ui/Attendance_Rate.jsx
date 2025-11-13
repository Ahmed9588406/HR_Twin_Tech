import React from "react";

/**
 * Tailwind CSS version of the Attendance Rate card.
 *
 * Props:
 *  - data (object) from API with totalEmployees, totalAttendaceToday, totalAbsentToday, totalFreeToday
 *  - title (string) default "ATTENDANCE Rate"
 *  - label (string) default "Today"
 */
export default function AttendanceRate({
  data,
  title = "ATTENDANCE Rate",
  label = "Today",
}) {
  // Extract values from API data
  const totalEmployees = data?.totalEmployees || 0;
  const onTime = data?.totalAttendaceToday || 0;
  const absent = data?.totalAbsentToday || 0;
  const dayOff = data?.totalFreeToday || 0;

  // Calculate percentage (attendance rate)
  const percentage =
    totalEmployees > 0
      ? Math.round((onTime / totalEmployees) * 100)
      : 0;

  // Calculate widths for progress bar
  const total = Math.max(1, totalEmployees);
  const widths = {
    absent: (absent / total) * 100,
    dayOff: (dayOff / total) * 100,
    onTime: (onTime / total) * 100,
  };

  return (
    <div
      className="h-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
      role="region"
      aria-label="Attendance card"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-xl font-semibold text-green-600 tracking-wide">{title}</h3>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{label}</div>
      </div>

      {/* Main content */}
      <div className="flex flex-col space-y-6">
        <div>
          <div
            className="text-5xl font-bold text-gray-800 mb-2"
            aria-live="polite"
            aria-atomic="true"
          >
            {percentage}%
          </div>
          <p className="text-sm text-gray-500">Overall Attendance Rate</p>
        </div>

        <div className="flex-1">
          {/* Progress bar */}
          <div
            className="w-full h-6 bg-gray-100 rounded-full overflow-hidden flex items-stretch shadow-inner"
            role="img"
            aria-label={`Attendance breakdown: ${Math.round(widths.absent)}% absent, ${Math.round(
              widths.dayOff
            )}% day off, ${Math.round(widths.onTime)}% on time`}
          >
            <div
              className="h-full bg-red-500 hover:bg-red-600 transition-colors"
              style={{
                width: `${widths.absent}%`,
                minWidth: widths.absent > 0 && widths.absent < 1 ? "2px" : undefined,
              }}
              title={`Absent: ${absent} (${Math.round(widths.absent)}%)`}
            />
            <div
              className="h-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
              style={{
                width: `${widths.dayOff}%`,
                minWidth: widths.dayOff > 0 && widths.dayOff < 1 ? "2px" : undefined,
              }}
              title={`Day Off: ${dayOff} (${Math.round(widths.dayOff)}%)`}
            />
            <div
              className="h-full bg-green-500 hover:bg-green-600 transition-colors"
              style={{
                width: `${widths.onTime}%`,
                minWidth: widths.onTime > 0 && widths.onTime < 1 ? "2px" : undefined,
              }}
              title={`On Time: ${onTime} (${Math.round(widths.onTime)}%)`}
            />
          </div>

          {/* Legend */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-4 h-4 rounded-full bg-red-500 inline-block" aria-hidden="true" />
                <span className="text-xs font-medium text-gray-700">Absent</span>
              </div>
              <span className="text-lg font-bold text-gray-800">{absent}</span>
              <span className="text-xs text-gray-500">{Math.round(widths.absent)}%</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-4 h-4 rounded-full bg-yellow-500 inline-block" aria-hidden="true" />
                <span className="text-xs font-medium text-gray-700">Day Off</span>
              </div>
              <span className="text-lg font-bold text-gray-800">{dayOff}</span>
              <span className="text-xs text-gray-500">{Math.round(widths.dayOff)}%</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-4 h-4 rounded-full bg-green-500 inline-block" aria-hidden="true" />
                <span className="text-xs font-medium text-gray-700">On Time</span>
              </div>
              <span className="text-lg font-bold text-gray-800">{onTime}</span>
              <span className="text-xs text-gray-500">{Math.round(widths.onTime)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}