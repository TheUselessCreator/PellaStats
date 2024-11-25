import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStats } from '../hooks/useStats';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Server, Activity } from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

export function PellaStats() {
  const stats = useStats();
  const [prevStats, setPrevStats] = useState<typeof stats>(null);

  useEffect(() => {
    if (stats && (!prevStats || stats.users !== prevStats.users || stats.servers !== prevStats.servers)) {
      setPrevStats(stats);
    }
  }, [stats, prevStats]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black text-purple-100 p-4 md:p-8 flex flex-col max-w-[1600px] mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-300">Pella.app Live Stats</h1>
      </header>
      
      <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <AnimatePresence>
          <motion.div
            key={`users-${stats?.users}`}
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-purple-900 text-purple-100 border-purple-700 shadow-lg shadow-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Total Users</CardTitle>
                <Users className="h-6 w-6 text-purple-300" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-200">{stats?.users.toLocaleString() || 0}</div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            key={`servers-${stats?.servers}`}
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-purple-900 text-purple-100 border-purple-700 shadow-lg shadow-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Total Servers</CardTitle>
                <Server className="h-6 w-6 text-purple-300" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-200">{stats?.servers.toLocaleString() || 0}</div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            key={`activity-${stats?.totalActivity}`}
            initial={{ scale: 0.95, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-purple-900 text-purple-100 border-purple-700 shadow-lg shadow-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Total Activity</CardTitle>
                <Activity className="h-6 w-6 text-purple-300" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-200">{stats?.totalActivity.toLocaleString() || 0}</div>
                <p className="text-sm text-purple-400">all time</p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="md:col-span-3 w-full">
          <Card className="bg-purple-900 text-purple-100 border-purple-700 shadow-lg shadow-purple-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-purple-200">User Growth Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] w-full">
              <ChartContainer
                config={{
                  users: {
                    label: "Users",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="w-full h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.userGrowth || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <XAxis 
                      dataKey="date" 
                      stroke="#a78bfa" 
                      tickFormatter={formatDate}
                      tick={{ fill: '#a78bfa' }}
                    />
                    <YAxis 
                      stroke="#a78bfa"
                      tick={{ fill: '#a78bfa' }}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-purple-800 p-2 rounded shadow">
                              <p className="text-purple-200">{`Date: ${formatDate(payload[0].payload.date)}`}</p>
                              <p className="text-purple-200">{`Users: ${payload[0].value.toLocaleString()}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="var(--color-users)" 
                      strokeWidth={2} 
                      dot={{ fill: "var(--color-users)", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 8, fill: "#f0abfc" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-purple-900 text-purple-100 border-purple-700 shadow-lg shadow-purple-500/20 md:col-span-3 w-full">
          <CardHeader>
            <CardTitle className="text-xl text-purple-200">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">Recent Joins</h3>
                <ul className="space-y-1">
                  {stats?.recentJoins?.slice(0, 3).map((join, index) => (
                    <li key={index} className="text-purple-200">{join}</li>
                  )) || <li className="text-purple-400">No recent joins</li>}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">Recent Servers</h3>
                <ul className="space-y-1">
                  {stats?.recentServers?.slice(0, 3).map((server, index) => (
                    <li key={index} className="text-purple-200">{server}</li>
                  )) || <li className="text-purple-400">No recent servers</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

