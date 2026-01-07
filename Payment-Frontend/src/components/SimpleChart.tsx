import React from 'react'
import { Box, Typography } from '@mui/material'

interface ChartData {
  labels: string[]
  data: number[]
  colors?: string[]
}

interface SimpleChartProps {
  title: string
  data: ChartData
  type: 'bar' | 'pie' | 'line'
  height?: number
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
  title,
  data,
  type,
  height = 300
}) => {
  const maxValue = Math.max(...data.data)
  const colors = data.colors || ['#1976d2', '#dc004e', '#ff9800', '#4caf50', '#9c27b0']

  const renderBarChart = () => (
    <Box sx={{ display: 'flex', alignItems: 'end', gap: 1, height: height - 50, p: 2 }}>
      {data.labels.map((label, index) => {
        const barHeight = (data.data[index] / maxValue) * (height - 100)
        return (
          <Box key={label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Typography variant="caption" sx={{ mb: 1, fontWeight: 600 }}>
              {data.data[index]}
            </Typography>
            <Box
              sx={{
                width: '100%',
                maxWidth: 60,
                height: barHeight || 5,
                backgroundColor: colors[index % colors.length],
                borderRadius: '4px 4px 0 0',
                transition: 'all 0.3s ease'
              }}
            />
            <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', fontSize: '0.7rem' }}>
              {label}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )

  const renderPieChart = () => {
    const total = data.data.reduce((sum, val) => sum + val, 0)
    let currentAngle = 0

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 2 }}>
        <Box sx={{ position: 'relative', width: 200, height: 200 }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            {data.data.map((value, index) => {
              const angle = (value / total) * 360
              const startAngle = currentAngle
              const endAngle = currentAngle + angle
              currentAngle += angle

              const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180)
              const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180)
              const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180)
              const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180)
              const largeArc = angle > 180 ? 1 : 0

              return (
                <path
                  key={index}
                  d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={colors[index % colors.length]}
                  stroke="#fff"
                  strokeWidth="2"
                />
              )
            })}
          </svg>
        </Box>
        <Box>
          {data.labels.map((label, index) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: colors[index % colors.length],
                  borderRadius: '2px',
                  mr: 1
                }}
              />
              <Typography variant="body2">
                {label}: {data.data[index]} ({((data.data[index] / total) * 100).toFixed(1)}%)
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  const renderLineChart = () => {
    const maxVal = Math.max(...data.data)
    const minVal = Math.min(...data.data)
    const range = maxVal - minVal || 1
    const paddingX = 10 // Horizontal padding inside SVG

    return (
      <Box sx={{ p: 2, height: height - 50 }}>
        <svg width="100%" height={height - 100} viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors[0]} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors[0]} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={i * 40}
              x2="400"
              y2={i * 40}
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          ))}

          {/* Line path */}
          <path
            d={`M ${data.data.map((value, index) => {
              const x = paddingX + (index / (data.data.length - 1)) * (400 - 2 * paddingX)
              const y = 200 - ((value - minVal) / range) * 180
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
            }).join(' ')}`}
            fill="none"
            stroke={colors[0]}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Area fill */}
          <path
            d={`M ${data.data.map((value, index) => {
              const x = paddingX + (index / (data.data.length - 1)) * (400 - 2 * paddingX)
              const y = 200 - ((value - minVal) / range) * 180
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
            }).join(' ')} L ${400 - paddingX} 200 L ${paddingX} 200 Z`}
            fill="url(#lineGradient)"
          />

          {/* Data points */}
          {data.data.map((value, index) => {
            const x = paddingX + (index / (data.data.length - 1)) * (400 - 2 * paddingX)
            const y = 200 - ((value - minVal) / range) * 180
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={colors[0]}
                stroke="#fff"
                strokeWidth="2"
              />
            )
          })}
        </svg>

        {/* X-axis labels */}
        <Box sx={{ position: 'relative', height: 20, mt: 1 }}>
          {data.labels.map((label, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                position: 'absolute',
                left: `${(paddingX / 400 + (index / (data.labels.length - 1)) * ((400 - 2 * paddingX) / 400)) * 100}%`,
                transform: 'translateX(-50%)',
                fontSize: '0.7rem',
                whiteSpace: 'nowrap'
              }}
            >
              {label}
            </Typography>
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      {type === 'bar' && renderBarChart()}
      {type === 'pie' && renderPieChart()}
      {type === 'line' && renderLineChart()}
    </Box>
  )
}