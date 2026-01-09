import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface SimpleBarChartProps {
    data: { name: string; value: number }[]
    color?: string
    xAxisLabel?: string
    height?: number
}

// Default colors if specific color not provided (Athar Branding & Extensions)
const COLORS = ['#1a27c9', '#ffe92c', '#0d0e0e', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function SimpleBarChart({ data, color, height = 300 }: SimpleBarChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={data.length > 5 ? -45 : 0}
                    textAnchor={data.length > 5 ? 'end' : 'middle'}
                    height={data.length > 5 ? 100 : 30}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    textAnchor={data.length > 5 ? 'start' : 'middle'}

                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={color || COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}
