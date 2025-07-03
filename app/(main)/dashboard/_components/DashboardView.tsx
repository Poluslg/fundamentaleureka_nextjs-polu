"use client";
import {
  BrainIcon,
  BriefcaseIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  // Line,
  // AreaChart,
  // Area,
} from "recharts";

// import Header from "@/components/Header";
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// type Insights = {
//   salaryRanges: any;
//   marketOutlook: string;
//   lastUpdated: string;
//   nextUpdate: string;
//   growthRate: number;
//   demandLevel: string;
//   topSkills: string[];
//   keyTrends: string[];
//   recommendedSkills: string[];
// };

type SalaryRange = {
  role: string;
  min: number;
  max: number;
  median: number;
};

type Insights = {
  id: string;
  salaryRanges: SalaryRange[];
  marketOutlook: string | null;
  lastUpdated: Date;
  nextUpdate: Date | null;
  industry: string;
  growthRate: number | null;
  demandLevel: string | null;
  topSkills: string[];
  keyTrends: string[];
  recommendedSkills: string[];
};
// type User = {
//   id: string;
//   name: string;
//   email: string;
//   industry: string;
//   subIndustry?: string;
//   bio?: string;
//   experience?: number;
//   skills?: Array<string>;
// };

// const insights: {
//   id: string;
//   salaryRanges: JsonValue[];
//   marketOutlook: string | null;
//   lastUpdated: Date;
//   nextUpdate: Date | null;
//   industry: string;
//   growthRate: number | null;
//   demandLevel: string | null;
//   topSkills: string[];
//   keyTrends: string[];
//   recommendedSkills: string[];
// }

function DashboardView({ insights }: { insights: Insights }) {
  const salaryData = insights?.salaryRanges?.map((range: SalaryRange) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColour = (level: string) => {
    switch (level) {
      case "High":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  const getMarketOutlookInfo = (outlook: string) => {
    switch (outlook?.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook!).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook!).color;

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate!),
    { addSuffix: true }
  );

  const nextUpdateDate = insights.nextUpdate
    ? format(new Date(insights.nextUpdate), "dd/MM/yyyy")
    : "N/A";

  return (
    <>
      {/* <Header /> */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Badge variant={"outline"}>Next Updated : {nextUpdateDate}</Badge>
          <Badge variant={"outline"}>Last Updated : {lastUpdatedDate}</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Market Outlook
              </CardTitle>
              <OutlookIcon className={`w-4 h-4 ${outlookColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insights?.marketOutlook}
              </div>
              <p className="text-xs text-muted-foreground">
                Next update {nextUpdateDistance}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Industry Growth
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {insights?.growthRate?.toFixed(1)} %
              </div>
              <Progress
                value={insights?.growthRate}
                className="mt-2 bg-green-50"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Demand Level
              </CardTitle>
              <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights?.demandLevel}</div>
              <Progress
                value={100}
                className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColour(
                  insights.demandLevel!
                )}`}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
              <BrainIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights?.topSkills?.map((skill: string) => (
                  <Badge key={skill} variant={"secondary"}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Salary Ranges by Role</CardTitle>
              <CardDescription>
                Displaying minimum,median,and maximum salaries (in thousands)
                for common roles in the industry.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-1 sm:p-6">
            {/* <div className="h-[500px]">
              
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-md">
                            <p className="font-medium">{label}</p>
                            {payload.map((item) => (
                              <p key={item.name} className="text-sm">
                                {item.name}: ${item.value}K
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                  <Bar
                    dataKey="median"
                    fill="#64748b"
                    name="Median Salary (K)"
                  />
                  <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  width={500}
                  height={400}
                  data={salaryData}
                  margin={{
                    top: 0,
                    right: 10,
                    bottom: 30,
                    left: 10,
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="name" scale="band" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-md">
                            <p className="font-medium">{label}</p>
                            {payload.map((item) => (
                              <p key={item.name} className="text-sm">
                                {item.name}: ${item.value}K
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="min"
                    fill="#8884d8"
                    stroke="#8884d8"
                    name="Min Salary (K)"
                  />
                  <Bar
                    dataKey="max"
                    barSize={20}
                    fill="#413ea0"
                    name="Max Salary (K)"
                  />

                  <Scatter
                    dataKey="median"
                    fill="red"
                    name="Median Salary (K)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div> */}
            <div className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  width={500}
                  height={400}
                  data={salaryData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  {/* <YAxis /> */}
                  {/* <Tooltip /> */}
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-md">
                            <p className="font-medium">{label}</p>
                            {payload.map((item) => (
                              <p key={item.name} className="text-sm">
                                {item.name}: ${item.value}K
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="max"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Area
                    type="monotone"
                    dataKey="median"
                    stackId="2"
                    stroke="#ffc658"
                    fill="#ffc658"
                  />
                  <Area
                    type="monotone"
                    dataKey="min"
                    stackId="3"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Industry Trends</CardTitle>
              <CardDescription>
                Current trends shaping the industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {insights.keyTrends.map((trend: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                    <span>{trend}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Skills</CardTitle>
              <CardDescription>Skills to consider developing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.recommendedSkills.map((skill: string) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* <div className="flex items-center justify-center p-4">
          <EditInsightsTrigger insights={insights} user={user}/>
        </div> */}
      </div>
    </>
  );
}

export default DashboardView;
