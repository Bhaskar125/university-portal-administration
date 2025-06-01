"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { semester: "Sem 1", grade: 85, gpa: 3.4 },
  { semester: "Sem 2", grade: 88, gpa: 3.5 },
  { semester: "Sem 3", grade: 92, gpa: 3.7 },
  { semester: "Sem 4", grade: 89, gpa: 3.6 },
  { semester: "Sem 5", grade: 94, gpa: 3.8 },
  { semester: "Sem 6", grade: 91, gpa: 3.6 },
]

const chartConfig = {
  grade: {
    label: "Average Grade",
    color: "hsl(var(--chart-1))",
  },
  gpa: {
    label: "GPA",
    color: "hsl(var(--chart-2))",
  },
}

export function GradeProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Progress</CardTitle>
        <CardDescription>Grade progression over semesters</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="grade"
                stroke="var(--color-grade)"
                strokeWidth={2}
                dot={{ fill: "var(--color-grade)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
