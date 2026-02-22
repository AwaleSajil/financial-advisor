import React from "react";
import { StyleSheet, View, Platform, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { colors } from "../styles/theme";

interface PlotlyChartProps {
  chartJson: string;
}

export function PlotlyChart({ chartJson }: PlotlyChartProps) {
  if (Platform.OS === "web") {
    return <PlotlyChartWeb chartJson={chartJson} />;
  }

  return <PlotlyChartNative chartJson={chartJson} />;
}

// ---- Native implementation using react-native-gifted-charts ----

const CHART_COLORS = [
  colors.primary,
  colors.secondary,
  "#06b6d4",
  colors.success,
  colors.warning,
  colors.error,
  "#ec4899",
  "#14b8a6",
];

function PlotlyChartNative({ chartJson }: { chartJson: string }) {
  const { BarChart, LineChart, PieChart } = require("react-native-gifted-charts");

  let parsed: any;
  try {
    parsed = JSON.parse(chartJson);
  } catch {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>Could not parse chart data</Text>
      </View>
    );
  }

  const trace = parsed.data?.[0];
  if (!trace) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>No chart data available</Text>
      </View>
    );
  }

  const title = parsed.layout?.title?.text || parsed.layout?.title || "";
  const chartType = trace.type || "bar";

  // --- Pie Chart ---
  if (chartType === "pie") {
    const labels: string[] = Array.isArray(trace.labels) ? trace.labels : [];
    const values: number[] = Array.isArray(trace.values)
      ? trace.values.map((v: any) => (typeof v === "number" ? v : Number(v) || 0))
      : [];
    const pieData = labels.map((label: string, i: number) => ({
      value: values[i] || 0,
      color: CHART_COLORS[i % CHART_COLORS.length],
      text: truncateLabel(label, 12),
      textColor: "#fff",
      textSize: 10,
    }));

    return (
      <View style={styles.chartContainer}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <View style={styles.centered}>
          <PieChart
            data={pieData}
            donut
            radius={100}
            innerRadius={50}
            showText
            textSize={9}
            focusOnPress
          />
        </View>
        <View style={styles.legend}>
          {labels.map((label: string, i: number) => (
            <View key={i} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: CHART_COLORS[i % CHART_COLORS.length] },
                ]}
              />
              <Text style={styles.legendText} numberOfLines={1}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // --- Bar & Line Charts ---
  const xValues: any[] = Array.isArray(trace.x) ? trace.x : [];
  const yValues: number[] = Array.isArray(trace.y)
    ? trace.y.map((v: any) => (typeof v === "number" ? v : Number(v) || 0))
    : [];

  if (xValues.length === 0 && yValues.length === 0) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>No chart data available</Text>
      </View>
    );
  }

  const barData = xValues.map((x: any, i: number) => ({
    value: yValues[i] || 0,
    label: truncateLabel(String(x), 8),
    frontColor: CHART_COLORS[i % CHART_COLORS.length],
    topLabelComponent: () => (
      <Text style={styles.barLabel}>{formatValue(yValues[i])}</Text>
    ),
  }));

  const maxValue = Math.max(...yValues.filter((v) => typeof v === "number"), 0);
  const yStep = computeStep(maxValue);

  if (chartType === "scatter" || chartType === "line") {
    const lineData = xValues.map((x: any, i: number) => ({
      value: yValues[i] || 0,
      label: truncateLabel(String(x), 8),
      dataPointText: formatValue(yValues[i]),
    }));

    return (
      <View style={styles.chartContainer}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={lineData}
            width={Math.max(xValues.length * 60, 250)}
            height={200}
            color={colors.primary}
            dataPointsColor={colors.primaryDark}
            textColor={colors.textSecondary}
            textFontSize={9}
            xAxisLabelTextStyle={styles.axisLabel}
            yAxisTextStyle={styles.axisLabel}
            stepValue={yStep}
            maxValue={yStep * Math.ceil(maxValue / yStep)}
            noOfSections={4}
            curved
            areaChart
            startFillColor={colors.primary}
            startOpacity={0.2}
            endOpacity={0}
          />
        </ScrollView>
      </View>
    );
  }

  // Default: bar chart
  return (
    <View style={styles.chartContainer}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={barData}
          width={Math.max(xValues.length * 60, 250)}
          height={200}
          barWidth={32}
          spacing={20}
          xAxisLabelTextStyle={styles.axisLabel}
          yAxisTextStyle={styles.axisLabel}
          stepValue={yStep}
          maxValue={yStep * Math.ceil(maxValue / yStep)}
          noOfSections={4}
          isAnimated
        />
      </ScrollView>
    </View>
  );
}

function truncateLabel(label: string, max: number): string {
  return label.length > max ? label.slice(0, max - 1) + "\u2026" : label;
}

function formatValue(v: number): string {
  if (v == null) return "";
  if (Math.abs(v) >= 1000) return `${(v / 1000).toFixed(1)}k`;
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(1);
}

function computeStep(max: number): number {
  if (max <= 0) return 1;
  const rough = max / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  return Math.ceil(rough / mag) * mag;
}

// ---- Web implementation (unchanged) ----

function PlotlyChartWeb({ chartJson }: { chartJson: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    const loadPlotly = async () => {
      try {
        const Plotly = (window as any).Plotly || (await import("plotly.js-dist-min" as any)).default;
        const parsed = JSON.parse(chartJson);
        Plotly.newPlot(
          ref.current,
          parsed.data,
          {
            ...parsed.layout,
            autosize: true,
            margin: { l: 40, r: 20, t: 40, b: 40 },
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
          },
          { responsive: true, displayModeBar: false }
        );
      } catch (e) {
        console.error("Failed to render chart:", e);
      }
    };

    if (!(window as any).Plotly) {
      const script = document.createElement("script");
      script.src = "https://cdn.plot.ly/plotly-2.35.0.min.js";
      script.onload = loadPlotly;
      document.head.appendChild(script);
    } else {
      loadPlotly();
    }
  }, [chartJson]);

  return (
    <View style={styles.chartContainer}>
      <div ref={ref} style={{ width: "100%", minHeight: 350 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.surface,
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  centered: {
    alignItems: "center",
    marginVertical: 8,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
    maxWidth: 80,
  },
  axisLabel: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  barLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  fallback: {
    padding: 20,
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    marginTop: 8,
  },
  fallbackText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
