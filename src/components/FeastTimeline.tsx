"use client";

import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { calculateBahireHasab, ethiopianMonths, BahireHasabResult } from "@/engine/bahireHasab";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeastTimeline() {
  const [year, setYear] = useState(2018);
  const [data, setData] = useState<BahireHasabResult | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setData(calculateBahireHasab(year));
  }, [year]);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const width = 1000;
    const height = 300;
    const margin = { top: 60, right: 40, bottom: 60, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const getDayOfYear = (month: number, day: number) => (month - 1) * 30 + day;
    const minDay = getDayOfYear(5, 1);
    const maxDay = getDayOfYear(12, 30);

    const xScale = d3.scaleLinear()
      .domain([minDay - 10, maxDay + 10])
      .range([margin.left, width - margin.right]);

    const xAxis = d3.axisBottom(xScale)
      .tickValues(d3.range(5, 13).map(m => getDayOfYear(m, 1)))
      .tickFormat((d, i) => ethiopianMonths[4 + i] || "");

    svg.append("g")
      .attr("transform", `translate(0,${height / 2})`)
      .attr("class", "text-[#888] font-ethiopic text-sm")
      .call(xAxis)
      .call(g => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .call(g => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.1)"));

    const feastsList = [
      { id: "NINEVEH", ...data.nineveh },
      ...Object.entries(data.feasts).map(([id, f]) => ({ id, ...f }))
    ];

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
      .data(feastsList)
      .enter()
      .append("g")
      .attr("class", "point transition-transform duration-500 cursor-pointer")
      .attr("transform", d => `translate(${xScale(getDayOfYear(d.month, d.day))}, ${height / 2})`);

    points.append("circle")
      .attr("r", 8)
      .attr("fill", d => d.id === "NINEVEH" ? "#fff" : "#fff")
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
      .on("mouseout", (event, d) => {
        d3.select(event.currentTarget)
          .attr("r", 8)
          .attr("fill", "#fff");
        tooltip.classed("hidden", true);
      });

    points.append("text")
      .attr("y", (d, i) => i % 2 === 0 ? -25 : 35)
      .attr("text-anchor", "middle")
      .attr("class", "text-xs font-ethiopic fill-[#888]")
      .text(d => d.name);

    svg.append("path")
      .datum(feastsList)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.2)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4")
      .attr("d", d3.line<any>()
        .x(d => xScale(getDayOfYear(d.month, d.day)))
        .y((d, i) => height / 2 + (i % 2 === 0 ? -10 : 10))
        .curve(d3.curveMonotoneX)
      );

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
        <svg ref={svgRef} viewBox="0 0 1000 300" className="w-full min-w-[800px] h-auto" />
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
