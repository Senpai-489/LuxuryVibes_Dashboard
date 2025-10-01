import React, { useState } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart, PieChart } from "@mui/x-charts";
import SimpleLineChart from "./ui/Line";
import { jsonData } from "../luxuryvibesstay/MetaLeads/page";


const DashboardLuxury = () => {
 
  const cards = [
    {
      title: "Total Leads",
      value: 25024,
    },
    {
      title: "Today's Leads",
      value: 2330,
    },
    {
      title: "Bot Leads",
      value: 1025,
    },
    {
      title: "Webform Leads",
      value: 1230,
    },
    {
      title: "Conversion Rate",
      value: 60,
    }
  ]
  const cards2 =[
    { title: "Meta Leads",
      value: 5690,
    },
    { title: "Google Leads",
      value: 2330,
    },
    { title: "WhatsApp Leads",
      value: 1025,
    },
  ]
  let [menuItem, setMenuItem] = useState("Overview");
  function changeMenu(e:any){
    setMenuItem(e.target.innerText)
  }
  return (
    <div className="flex flex-1 overflow-y-scroll h-full">
      <div className="flex h-[200vh] w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="text-3xl font-bold font-family-serif">Welcome to the Dashboard!</div>
      <select className="w-48 p-2 border border-gray-300 rounded-lg mb-4">
  <option>All time</option>
  <option>Last 7 Days</option>
  <option>Last 30 Days</option>
  <option>Last 90 Days</option>
  
</select>
        
        <div className="flex justify-between gap-4">
          {cards.map((i, idx) => (
            <div
              key={"first-array-demo-1" + idx}
              className=" w-full h-38 rounded-lg bg-gray-100 dark:bg-neutral-800"
            >
              <h1 className="text-lg p-2 font-medium text-[494949]">{i.title}</h1>
              <h1 className="text-3xl text-green-300 p-2 font-bold ">{i.value}</h1>
              <div className="bg-gray-900 h-4 m-2 w-[90%] mx-auto rounded-full">
                <div className={`bg-green-400 h-4 rounded-full w-[60%]`}></div>
                <div className="text-right">20%</div>
              </div>
            </div>
          ))}
        </div>
          <div className="flex justify-between gap-4">
          {cards2.map((i, idx) => (
            <div
              key={"first-array-demo-1" + idx}
              className=" w-full h-38 rounded-lg bg-gray-100 dark:bg-neutral-800"
            >
              <h1 className="text-lg p-2 font-medium text-[494949]">{i.title}</h1>
              <h1 className="text-3xl text-green-300 p-2 font-bold ">{i.value}</h1>
              <div className="bg-gray-900 h-4 m-2 w-[90%] mx-auto rounded-full">
                <div className={`bg-green-400 h-4 rounded-full w-[60%]`}></div>
                <div className="text-right">20%</div>
              </div>
            </div>
          ))}
        </div>
        <div id="tabs" className="flex gap-8 p-2 border-2 h-12 items-center rounded-lg">
          <button onClick={changeMenu} className="hover:scale-110 duration-200">Overview</button>
          <button onClick={changeMenu} className="hover:scale-110 duration-200">Sources</button>
          <button onClick={changeMenu} className="hover:scale-110 duration-200">Timeline</button>
        </div>
        {menuItem === "Overview" ? <Overview/> : menuItem === "Sources" ? <Sources/> : <Timeline/>}
       
      </div>
    </div>
  );
};

const Overview = () => {
  return (<div>
     <div className="flex gap-2">
          {[...new Array(2)].map((i, idx) => (
            <div
              key={"second-array-demo-1" + idx}
              className=" w-full rounded-lg bg-gray-100 dark:bg-neutral-800"
            >
              <BarChart className="p-4"
                series={[
                  {
                    data: [4, 3, 5, 7, 8],
                    label: 'Series 1',
                  }
                ]}
                xAxis={[{ data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] }]}
                height={300}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex  gap-2">
          {[...new Array(2)].map((i, idx) => (
            <div
              key={"second-array-demo-1" + idx}
              className="p-4 w-full rounded-lg bg-gray-100 dark:bg-neutral-800"
            >
              <SimpleLineChart/>
            </div>
          ))}
        </div>
        </div>
  );
}

const Sources = () => {
  return (<div className="h-screen">
    <div className="flex h-[120vh]  rounded-lg ease-in-out duration-500 bg-gray-100 dark:bg-neutral-800">
      <PieChart
      
      width={800}
      height={800}
      series={[
        {
        data: [
          { value: 30, label: 'Meta' },
          { value: 40, label: 'Google' }, 
          { value: 30, label: 'WhatsApp' },
          { value: 20, label: 'WebForm' }
        ],
        innerRadius: 100,
        outerRadius: 300,
        paddingAngle: 5,
        cornerRadius: 5,
        startAngle: 0,
        endAngle: 360,
        cx: 300,
        cy: 400,
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
export default DashboardLuxury;