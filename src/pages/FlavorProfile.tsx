
import { Drink } from "@/types/models";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookPlus,CircleSlash } from "lucide-react";
import { useEffect, useState } from "react";

interface FlavorProfileProps {
  drinks: Drink[];
}

export default function FlavorProfile({ drinks }: FlavorProfileProps) {
  // Use state to manage calculated data
  const [tagData, setTagData] = useState<Array<{tag: string, count: number}>>([]);
  const [brandData, setBrandData] = useState<Array<{brand: string, count: number}>>([]);
  const [typeData, setTypeData] = useState<Array<{type: string, count: number}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure component is mounted for rendering
    setMounted(true);
    
    // Calculate data even if drinks is empty
    setIsLoading(true);
    
    // Calculate data for radar chart (flavor tags)
    const tagCount: Record<string, number> = {};
    drinks.forEach((drink) => {
      drink.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    const calculatedTagData = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({
        tag,
        count,
      }));
    setTagData(calculatedTagData);

    // Calculate data for bar chart (top brands)
    const brandCount: Record<string, number> = {};
    drinks.forEach((drink) => {
      if (drink.brand) {
        brandCount[drink.brand] = (brandCount[drink.brand] || 0) + 1;
      }
    });

    const calculatedBrandData = Object.entries(brandCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([brand, count]) => ({
        brand,
        count,
      }));
    setBrandData(calculatedBrandData);

    // Calculate data for pie chart (drink types)
    const typeCount: Record<string, number> = {};
    drinks.forEach((drink) => {
      typeCount[drink.type] = (typeCount[drink.type] || 0) + 1;
    });

    const calculatedTypeData = Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({
        type,
        count,
      }));
    setTypeData(calculatedTypeData);
    
    setIsLoading(false);
  }, [drinks]);

  // Colors
  const COLORS = ["#6A2C3E", "#1D4E4F", "#D4AF37", "#8A4F4F", "#2D7778", "#E6C66E", "#A13B58", "#295E5F"];

  // If component is not mounted yet, don't render
  if (!mounted) {
    return <div className="py-4 text-foreground">Loading flavor profile...</div>;
  }

  // If no drinks, show empty state that stays visible
  if (drinks.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in border rounded-lg p-8 bg-card">
        <CircleSlash className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
        <h3 className="text-xl font-semibold mb-2 text-foreground">No flavor data yet</h3>
        <p className="text-muted-foreground mb-6">
          Add drinks to your journal to start building your flavor profile
        </p>
        {/* <Button className="hover-scale">
          <BookPlus className="mr-2 h-4 w-4" /> Add Your First Drink
        </Button> */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold animate-fade-in text-foreground">Your Flavor Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-foreground">Flavor Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {tagData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={tagData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis 
                      dataKey="tag" 
                      tick={{ fill: "var(--foreground)" }} 
                      style={{ fill: "var(--foreground)" }}
                    />
                    <Radar
                      name="Flavor Tags"
                      dataKey="count"
                      stroke="#6A2C3E"
                      fill="#6A2C3E"
                      fillOpacity={0.4}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                      labelStyle={{
                        color: "var(--foreground)",
                      }}
                      itemStyle={{
                        color: "var(--foreground)",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full border rounded-lg bg-card">
                  <p className="text-muted-foreground">No tag data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="text-foreground">Top Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {brandData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={brandData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, bottom: 20, left: 60 }}
                  >
                    <XAxis 
                      type="number" 
                      tick={{ fill: "var(--foreground)" }} 
                    />
                    <YAxis
                      dataKey="brand"
                      type="category"
                      width={100}
                      tick={{ fill: "var(--foreground)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                      labelStyle={{
                        color: "var(--foreground)",
                      }}
                      itemStyle={{
                        color: "var(--foreground)",
                      }}
                    />
                    <Bar dataKey="count" fill="#1D4E4F" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full border rounded-lg bg-card">
                  <p className="text-muted-foreground">No brand data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 hover-elevate">
          <CardHeader>
            <CardTitle className="text-foreground">Drink Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {typeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <Pie
                      data={typeData}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#D4AF37"
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        color: "var(--foreground)",
                      }}
                      labelStyle={{
                        color: "var(--foreground)",
                      }}
                      itemStyle={{
                        color: "var(--foreground)",
                      }}
                    />
                    <Legend formatter={(value) => <span style={{ color: "var(--foreground)" }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full border rounded-lg bg-card">
                  <p className="text-muted-foreground">No drink type data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
