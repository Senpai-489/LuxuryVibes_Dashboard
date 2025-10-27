import React, { useState, useEffect } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart, PieChart } from "@mui/x-charts";
import SimpleLineChart from "./ui/Line";



const DashboardPinewood = () => {
  const [fetchedData, setFetchedData] = useState<any[] | null>(null);
  let googleCompanyName = 'pinewoodGoogle';
  let metaCompanyName = 'pinewoodMeta';
  let whatsappCompanyName = 'pinewoodWhatsApp';

  const [googleCount, setGoogleCount] = useState<number>(0);
  const [metaCount, setMetaCount] = useState<number>(0);
  const [whatsAppCount, setWhatsAppCount] = useState<number>(0);

  React.useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [gRes, mRes, wRes] = await Promise.all([
        fetch(`https://serverdash-1.onrender.com/api/sheets/${googleCompanyName}`),
        fetch(`https://serverdash-1.onrender.com/api/sheets/${metaCompanyName}`),
        fetch(`https://serverdash-1.onrender.com/api/sheets/${whatsappCompanyName}`),
      ]);

      const [gSheets, mSheets, wSheets] = await Promise.all([gRes.json(), mRes.json(), wRes.json()]);

      // Aggregate counts from all sheets for each company
      const gTotal = Array.isArray(gSheets) 
        ? gSheets.reduce((sum, sheet) => sum + (sheet.data?.length || 0), 0) 
        : 0;
      const mTotal = Array.isArray(mSheets) 
        ? mSheets.reduce((sum, sheet) => sum + (sheet.data?.length || 0), 0) 
        : 0;
      const wTotal = Array.isArray(wSheets) 
        ? wSheets.reduce((sum, sheet) => sum + (sheet.data?.length || 0), 0) 
        : 0;

      setGoogleCount(gTotal);
      setMetaCount(mTotal);
      setWhatsAppCount(wTotal);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };
  const cards = [
    {
      title: "Total Leads",
      value: googleCount + metaCount + whatsAppCount,
    },
    
    {
      title: "Bot Leads",
      value: 2,
    },
    {
      title: "Webform Leads",
      value: 3,
    },
    {
      title: "Conversion Rate",
      value: 60,
    }
  ]
   const cards2 =[
    { title: "Meta Leads",
      value: metaCount,
    },
    { title: "Google Leads",
      value: googleCount,
    },
    { title: "WhatsApp Leads",
      value: whatsAppCount,
    },
  ]
  let [menuItem, setMenuItem] = useState("Overview");
  function changeMenu(e:any){
    setMenuItem(e.target.innerText)
  }
  return (
    <div className="flex flex-1 overflow-y-auto h-full w-full">
      <div className="flex min-h-screen w-full flex-1 flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 sm:p-6 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="text-2xl sm:text-3xl font-bold font-family-serif">Welcome to the Dashboard!</div>
        
        {/* Responsive grid for cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((i, idx) => (
            <div
              key={"first-array-demo-1" + idx}
              className="w-full min-h-[150px] rounded-lg bg-gray-100 dark:bg-neutral-800 p-4"
            >
              <h1 className="text-sm sm:text-base md:text-lg font-medium text-[#494949] dark:text-gray-300">{i.title}</h1>
              <h1 className="text-2xl sm:text-3xl text-green-300 py-2 font-bold">{i.value}</h1>
              <div className="bg-gray-900 h-4 w-full rounded-full overflow-hidden">
                {(() => {
                  const widthPercentage = (cards[idx].value / cards[0].value) * 100;
                  return (
                    <>
                      <div className="bg-green-400 h-4 rounded-full" style={{ width: `${cards[idx].title != "Conversion Rate" ? widthPercentage : cards[idx].value }%` }}></div>
                      <div className="text-xs sm:text-sm text-right mt-1">{cards[idx].title != "Conversion Rate" ? widthPercentage.toFixed(2) : cards[idx].value.toFixed(2)}%</div>
                    </>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* Responsive grid for secondary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards2.map((i, idx) => (
            <div
              key={"second-array-demo-" + idx}
              className="w-full min-h-[150px] rounded-lg bg-gray-100 dark:bg-neutral-800 p-4"
            >
              <h1 className="text-sm sm:text-base md:text-lg font-medium text-[#494949] dark:text-gray-300">{i.title}</h1>
              <h1 className="text-2xl sm:text-3xl text-green-300 py-2 font-bold">{i.value}</h1>
              <div className="bg-gray-900 h-4 w-full rounded-full overflow-hidden">
                {(() => {
                  const widthPercentage = (cards2[idx].value / cards[0].value) * 100;
                  return (
                  <>
                    <div className="bg-green-400 h-4 rounded-full" style={{ width: `${widthPercentage}%` }}></div>
                    <div className="text-xs sm:text-sm text-right mt-1">{widthPercentage.toFixed(2)}%</div>
                  </>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* Responsive tabs */}
        <div id="tabs" className="flex gap-4 sm:gap-8 p-2 border-2 h-12 items-center rounded-lg overflow-x-auto">
          <button onClick={changeMenu} className="hover:scale-110 duration-200 whitespace-nowrap text-sm sm:text-base">Overview</button>
          <button onClick={changeMenu} className="hover:scale-110 duration-200 whitespace-nowrap text-sm sm:text-base">Sources</button>
        </div>

        {menuItem === "Overview" ? <Overview data={cards} data2={cards2}/> : <Sources data={cards} data2={cards2}/> }
      </div>
    </div>
  );
};

const useContainerWidth = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState(800);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width ?? 800;
      setWidth(Math.max(280, w));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
};

const Overview = (props: { data: { value: number | null; }[]; data2: { value: number | null; }[]; }) => {
  const { ref, width } = useContainerWidth();
  const chartWidth = Math.min(1200, width);
  const chartHeight = Math.max(260, Math.min(520, Math.round(chartWidth * 0.55)));

  return (
    <div className="w-full">
      <div ref={ref} className="w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-3 sm:p-4">
        <BarChart
          width={chartWidth}
          height={chartHeight}
          series={[
            {
              data: [props.data[0].value, props.data2[1].value, props.data[1].value, props.data[2].value, props.data2[0].value, props.data2[2].value],
              label: 'Pinewood Retreat Leads',
            }
          ]}
          xAxis={[{ data: ['Total', 'Google', 'Bot', 'Webform', 'Meta', 'WhatsApp'], scaleType: 'band' }]}
          margin={{ top: 16, right: 16, bottom: 36, left: 36 }}
        />
      </div>
    </div>
  );
}

const Sources = (props: { data: { value: number | null; }[]; data2: { value: number | null; }[]; }) => {
  const { ref, width } = useContainerWidth();
  const size = Math.max(280, Math.min(640, width));
  const innerRadius = Math.round(size * 0.18);
  const outerRadius = Math.round(size * 0.42);
  const center = Math.round(size / 2);

  return (
    <div className="w-full">
      <div ref={ref} className="flex justify-center items-center rounded-lg bg-gray-100 dark:bg-neutral-800 p-3 sm:p-4">
        <PieChart
          width={size}
          height={size}
          series={[
            {
              data: [
                { value: props.data2[0].value ?? 0, label: 'Meta' },
                { value: props.data2[1].value ?? 0, label: 'Google' },
                { value: props.data2[2].value ?? 0, label: 'WhatsApp' },
                { value: props.data[2].value ?? 0, label: 'WebForm' },
                { value: props.data[1].value ?? 0, label: 'Bot' },
              ],
              innerRadius,
              outerRadius,
              paddingAngle: 5,
              cornerRadius: 5,
              startAngle: 0,
              endAngle: 360,
              cx: center,
              cy: center,
            }
          ]}
        />
      </div>
    </div>
  );
}

const Timeline = () => {
  return (<div>
    <div className="flex bg-gray-100 rounded-lg gap-2 h-[80vh]">
     <LineChart
    series={[
      { curve: "step", data: [1, 5, 2, 6, 3, 9.3] },
      { curve: "step", data: [6, 3, 7, 9.5, 4, 2] },
    ]}
    xAxis={[{
      label: 'Months', 
      data: [1, 2, 3, 4, 5, 6]
    }]}
  />
     </div>
        </div>
  );
}
export default DashboardPinewood;