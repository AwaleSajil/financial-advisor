import React from "react";
import { StyleSheet, View, Platform, useWindowDimensions } from "react-native";
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

// ---- Native implementation using WebView + Plotly.js ----

function PlotlyChartNative({ chartJson }: { chartJson: string }) {
  const { WebView } = require("react-native-webview");
  const { width: screenWidth } = useWindowDimensions();
  const [webViewHeight, setWebViewHeight] = React.useState(400);
  const [error, setError] = React.useState<string | null>(null);

  // Wide bubble (98% of screen) with reduced padding
  const bubbleContentWidth = Math.floor(screenWidth * 0.98) - 16 - 8;
  const chartWidth = Math.max(bubbleContentWidth, 200);
  const chartHeight = Math.round(chartWidth * 0.85);
  const fontSize = Math.max(9, Math.min(11, Math.round(chartWidth / 30)));

  // Base64-encode the chart JSON so it survives template literal injection safely.
  // This avoids issues with backticks, ${}, or special chars in the JSON breaking the HTML.
  const chartJsonB64 = React.useMemo(() => {
    try {
      // Ensure it's valid JSON first; re-stringify to normalise
      const parsed = JSON.parse(chartJson);
      const clean = JSON.stringify(parsed);
      // btoa works in RN's JSC/Hermes for ASCII; chart JSON is ASCII-safe after stringify
      return btoa(unescape(encodeURIComponent(clean)));
    } catch {
      return "";
    }
  }, [chartJson]);

  const html = React.useMemo(() => {
    if (!chartJsonB64) return "";

    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: transparent; overflow: hidden; font-family: -apple-system, sans-serif; }
    #chart { width: ${chartWidth}px; }
    #status { color: #888; text-align: center; padding: 20px; font-size: 13px; }
    .modebar { top: 0 !important; right: 4px !important; }
    .modebar-btn { font-size: 14px !important; }
    .modebar-group { padding: 0 2px !important; }
  </style>
</head>
<body>
  <div id="status">Loading chart...</div>
  <div id="chart"></div>
  <script>
    var CHART_B64 = "${chartJsonB64}";

    function msg(obj) { window.ReactNativeWebView.postMessage(JSON.stringify(obj)); }

    function reportHeight() {
      setTimeout(function() {
        var el = document.getElementById('chart');
        var h = el ? el.offsetHeight : 0;
        if (h > 0) msg({ height: h });
      }, 200);
    }

    function renderChart() {
      try {
        var raw = decodeURIComponent(escape(atob(CHART_B64)));
        var chartData = JSON.parse(raw);

        var xaxis = Object.assign({}, chartData.layout && chartData.layout.xaxis || {}, {
          tickangle: -45,
          automargin: true,
          fixedrange: true
        });
        var yaxis = Object.assign({}, chartData.layout && chartData.layout.yaxis || {}, {
          automargin: true,
          fixedrange: true
        });

        var layout = Object.assign({}, chartData.layout || {}, {
          width: ${chartWidth},
          height: ${chartHeight},
          autosize: false,
          margin: { l: 0, r: 0, t: 40, b: 0, pad: 0, autoexpand: true },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { size: ${fontSize} },
          xaxis: xaxis,
          yaxis: yaxis,
          legend: {
            orientation: 'h',
            yanchor: 'top',
            y: -0.2,
            xanchor: 'center',
            x: 0.5,
            font: { size: ${Math.max(8, fontSize - 1)} }
          },
          dragmode: false
        });

        document.getElementById('status').style.display = 'none';

        Plotly.newPlot('chart', chartData.data, layout, {
          responsive: false,
          displayModeBar: false,
          displaylogo: false,
          scrollZoom: false,
          staticPlot: false
        }).then(function() {
          reportHeight();
          var gd = document.getElementById('chart');
          gd.on('plotly_relayout', function() { setTimeout(reportHeight, 100); });
          gd.on('plotly_afterplot', function() { setTimeout(reportHeight, 100); });
        });
      } catch(e) {
        document.getElementById('status').innerText = 'Chart error: ' + e.message;
        msg({ height: 60, error: e.message });
      }
    }

    // Load Plotly with retry
    var retries = 0;
    function loadPlotly() {
      var script = document.createElement('script');
      script.src = 'https://cdn.plot.ly/plotly-2.35.0.min.js';
      script.onload = function() { setTimeout(renderChart, 50); };
      script.onerror = function() {
        retries++;
        if (retries <= 2) {
          document.getElementById('status').innerText = 'Retrying chart load...';
          setTimeout(loadPlotly, 1000 * retries);
        } else {
          document.getElementById('status').innerText = 'Failed to load chart library. Check your connection.';
          msg({ height: 60, error: 'CDN load failed' });
        }
      };
      document.head.appendChild(script);
    }
    loadPlotly();
  </script>
</body>
</html>`;
  }, [chartJsonB64, chartWidth, chartHeight, fontSize]);

  if (!chartJsonB64) {
    return (
      <View style={[styles.chartContainer, { padding: 16 }]}>
        <Text style={{ color: colors.textSecondary, textAlign: "center" }}>
          Could not parse chart data
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.chartContainer, { height: webViewHeight + 24 }]}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={{ width: chartWidth, height: webViewHeight, backgroundColor: "transparent" }}
        scrollEnabled={false}
        nestedScrollEnabled
        javaScriptEnabled
        allowsInlineMediaPlayback
        mixedContentMode="compatibility"
        onMessage={(event: any) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.height) {
              setWebViewHeight(data.height);
            }
            if (data.error) {
              setError(data.error);
            }
          } catch {}
        }}
        onError={() => {
          setError("WebView failed to load");
        }}
      />
      {error && (
        <Text style={{ color: colors.textTertiary, fontSize: 11, textAlign: "center", marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
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
    padding: 4,
  },
});
