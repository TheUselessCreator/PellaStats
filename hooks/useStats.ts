import { useState, useEffect } from 'react';

interface Stats {
  users: number;
  servers: number;
  recentJoins: string[];
  recentServers: string[];
  totalActivity: number;
  userGrowth: { date: string; users: number }[];
}

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://api.pella.app/stats/open');
        const data = await response.json();
        
        // Simulating historical data for the graph
        const today = new Date();
        const userGrowth = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          return {
            date: date.toISOString().split('T')[0],
            users: Math.floor(data.users * (1 - i * 0.05)) // Simulated growth
          };
        }).reverse();

        setStats(prevStats => ({
          ...data,
          totalActivity: (prevStats?.totalActivity || 0) + (data.users - (prevStats?.users || 0)),
          userGrowth
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats(); // Initial fetch
    const interval = setInterval(fetchStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return stats;
}

