"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
type Assessment = {
  createdAt: Date;
  updatedAt: Date;
  quizScore: number;
};

type Props = { assessments: Assessment[] };

function PerformanceChart({ assessments }: Props) {
  const [chartData, setChartData] = useState<{ date: string; score: number }[]>(
    []
  );

  useEffect(() => {
    if (assessments) {
      const formattedData = assessments.map((assessment: Assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
      }));
      setChartData(formattedData);
    }
  }, [assessments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">
          Performance Trend
        </CardTitle>
        <CardDescription>Your quiz scores over times</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-background rounded-lg p-2 shadow-md">
                        <p className="text-sm font-medium">
                          Score: {payload[0].value}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payload[0].payload.data}
                        </p>
                      </div>
                    );
                  }
                }}
              />
              <Area type="monotone" dataKey="score" stroke="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default PerformanceChart;
