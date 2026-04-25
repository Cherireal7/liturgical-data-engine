"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { calculateBahireHasab, ethiopianMonths } from "@/engine/bahireHasab";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeastTimeline() {
  const [year, setYear] = useState(2018);
  const data = useMemo(() => calculateBahireHasab(year), [year]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 1500;
    const height = 380;
    const margin = { top: 88, right: 64, bottom: 88, left: 64 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const getDayOfYear = (month: number, day: number) => (month - 1) * 30 + day;
    const feastsList = [
      { id: "NINEVEH", ...data.nineveh },
      ...Object.entries(data.feasts).map(([id, f]) => ({ id, ...f }))
    ];
    const feastDays = feastsList.map(feast => getDayOfYear(feast.month, feast.day));
    const minDay = Math.min(...feastDays);
    const maxDay = Math.max(...feastDays);
    const minVisibleDay = Math.max(getDayOfYear(1, 1), minDay - 24);
    const maxVisibleDay = Math.min(getDayOfYear(13, 5), maxDay + 24);

    const xScale = d3.scaleLinear()
      .domain([minVisibleDay, maxVisibleDay])
      .range([margin.left, width - margin.right]);

    const firstTickMonth = Math.max(1, Math.floor((minVisibleDay - 1) / 30) + 1);
    const lastTickMonth = Math.min(13, Math.floor((maxVisibleDay - 1) / 30) + 1);
    const xAxis = d3.axisBottom(xScale)
      .tickValues(d3.range(firstTickMonth, lastTickMonth + 1).map(m => getDayOfYear(m, 1)))
      .tickFormat(d => ethiopianMonths[Math.floor((Number(d) - 1) / 30)] || "");

    svg.append("g")
      .attr("transform", `translate(0,${height / 2})`)
      .attr("class", "text-[#888] font-ethiopic text-sm")
      .call(xAxis)
      .call(g => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .call(g => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.1)"));

    const feastPoints = feastsList.map((feast, index) => {
      const dayOfYear = getDayOfYear(feast.month, feast.day);

      return {
        ...feast,
        dayOfYear,
        index,
        actualX: xScale(dayOfYear),
        x: xScale(dayOfYear),
      };
    });
    type FeastPoint = (typeof feastPoints)[number];

    const sortedPoints = [...feastPoints].sort((a, b) => a.actualX - b.actualX);
    const minDotGap = 26;
    let lastPointX = Number.NEGATIVE_INFINITY;

    sortedPoints.forEach((feast) => {
      feast.x = Math.max(feast.actualX, lastPointX + minDotGap);
      lastPointX = feast.x;
    });

    const overflow = lastPointX - (width - margin.right);
    if (overflow > 0) {
      sortedPoints.forEach((feast) => {
        feast.x -= overflow;
      });
    }

    const labelLanes = [-74, 74, -50, 50, -28, 28];
    const laneLastX = new Map<number, number>();
    const labelPositions = new Map<string, { y: number }>();

    [...feastPoints]
      .sort((a, b) => a.x - b.x)
      .forEach((feast) => {
        const estimatedWidth = Math.max(56, feast.name.length * 7.5);
        const preferred = feast.index % 2 === 0 ? [0, 2, 4, 1, 3, 5] : [1, 3, 5, 0, 2, 4];
        const laneIndex = preferred.find((lane) => {
          const lastRight = laneLastX.get(lane) ?? Number.NEGATIVE_INFINITY;
          return feast.x - estimatedWidth / 2 - lastRight >= 10;
        }) ?? preferred[preferred.length - 1];

        laneLastX.set(laneIndex, feast.x + estimatedWidth / 2);
        labelPositions.set(feast.id, { y: labelLanes[laneIndex] });
      });

    const tooltip = d3.select("body").append("div")
      .attr("class", "absolute hidden bg-[#111] text-[#ededed] p-3 rounded-md border border-white/10 font-ethiopic shadow-xl pointer-events-none z-50 text-sm");

    const abiyStart = getDayOfYear(data.feasts["ABIY_TSOME"].month, data.feasts["ABIY_TSOME"].day);
    const siklet = getDayOfYear(data.feasts["SIKLET"].month, data.feasts["SIKLET"].day);
    
    // Fasting band
    svg.append("rect")
      .attr("x", xScale(abiyStart))
      .attr("y", height / 2 - 10)
      .attr("width", xScale(siklet) - xScale(abiyStart))
      .attr("height", 20)
      .attr("fill", "rgba(255,255,255,0.05)")
      .attr("rx", 4);

    const points = svg.selectAll(".point")
      .data(feastPoints)
      .enter()
      .append("g")
      .attr("class", "point transition-transform duration-500 cursor-pointer")
      .attr("transform", d => `translate(${d.x}, ${height / 2})`);

    points.append("circle")
      .attr("r", 8)
      .attr("fill", "#fff")
      .attr("stroke", "#000")
      .attr("stroke-width", 2)
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).attr("r", 12).attr("fill", "#fff");
        tooltip.classed("hidden", false)
          .html(`
            <div class="font-bold text-white mb-1">${d.name}</div>
            <div class="text-[#888]">${ethiopianMonths[d.month - 1]} ${d.day}</div>
          `)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget)
          .attr("r", 8)
          .attr("fill", "#fff");
        tooltip.classed("hidden", true);
      });

    points.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", d => (labelPositions.get(d.id)?.y ?? 36) - Math.sign(labelPositions.get(d.id)?.y ?? 36) * 14)
      .attr("stroke", "rgba(255,255,255,0.14)")
      .attr("stroke-width", 1);

    points.append("text")
      .attr("y", d => labelPositions.get(d.id)?.y ?? 36)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("class", "text-[11px] font-ethiopic fill-[#9a9a9a]")
      .text(d => d.name);

    const feastLine = d3.line<FeastPoint>()
      .x(d => d.x)
      .y((d, i) => height / 2 + (i % 2 === 0 ? -10 : 10))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(feastPoints)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.2)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4")
      .attr("d", feastLine);

    return () => {
      tooltip.remove();
    };
  }, [data]);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-white tracking-tight">Movable Feasts Orbit</h2>
        <div className="flex items-center gap-4">
          <button onClick={() => setYear(y => y - 1)} className="p-2 border border-white/10 rounded-md hover:bg-white/5 transition">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <div className="text-xl font-bold text-white w-20 text-center tracking-tighter">
            {year}
          </div>
          <button onClick={() => setYear(y => y + 1)} className="p-2 border border-white/10 rounded-md hover:bg-white/5 transition">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full border border-white/10 rounded-lg bg-[#050505]">
        <svg ref={svgRef} viewBox="0 0 1500 380" className="w-full min-w-[1200px] h-auto" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm font-ethiopic">
        {data && Object.entries(data.feasts).map(([key, f]) => (
          <div key={key} className="flex justify-between p-4 border border-white/10 rounded-lg hover:bg-[#111] transition-colors">
            <span className="text-[#888] font-medium">{f.name}</span>
            <span className="text-white font-bold">{ethiopianMonths[f.month - 1]} {f.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
