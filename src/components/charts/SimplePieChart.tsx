import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface SimplePieChartProps {
    data: { name: string; value: number }[]
    height?: number
    colors?: string[]
}

const DEFAULT_COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#84cc16", // Lime
]

export function SimplePieChart({ data, height = 300, colors = DEFAULT_COLORS }: SimplePieChartProps) {
    // Filter out zero values to avoid ugly empty segments or label clutter
    const activeData = data.filter(d => d.value > 0);

    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={activeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {activeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
        </ResponsiveContainer>
    )
}
