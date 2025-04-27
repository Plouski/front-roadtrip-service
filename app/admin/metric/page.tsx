"use client";

import { useEffect, useState } from "react";
import { MetricsService } from "@/services/metrics-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // 👈 ajouter Button
import { Loader2, RotateCcw } from "lucide-react"; // 👈 ajouter une icône sympa
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function MetricsListPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [services, setServices] = useState<string[]>([]);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true); // 👈 important de remettre le loading à true
      const rawMetrics = await MetricsService.getMetrics();
      console.log("📈 Raw Metrics:", rawMetrics);

      const points = rawMetrics.flatMap((item: any) =>
        item.values.map(([timestamp, value]: [number, string]) => ({
          timestamp: new Date(timestamp * 1000).toISOString(),
          value: Number(value),
          service: item.metric.job,
        }))
      );

      const groupedByTimestamp: { [key: string]: any } = {};
      points.forEach((point) => {
        if (!groupedByTimestamp[point.timestamp]) {
          groupedByTimestamp[point.timestamp] = { timestamp: point.timestamp };
        }
        groupedByTimestamp[point.timestamp][point.service] = point.value;
      });

      const finalData = Object.values(groupedByTimestamp)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // <-- Tri ici
      const uniqueServices = [...new Set(points.map(p => p.service))];

      setChartData(finalData);
      setServices(uniqueServices);
    } catch (error) {
      console.error("Erreur lors de la récupération des métriques:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Métriques de Requêtes HTTP</CardTitle>
          <CardDescription>
            Analyse en temps réel des requêtes par microservice.
          </CardDescription>
        </div>
        <Button onClick={fetchMetrics} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Recharger
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(tick) => new Date(tick).toLocaleTimeString()} />
              <YAxis />
              <Tooltip />
              <Legend />
              {services.map((service, index) => (
                <Line
                  key={service}
                  type="monotone"
                  dataKey={service}
                  name={service}
                  stroke={`hsl(${(index * 60) % 360}, 70%, 50%)`}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
