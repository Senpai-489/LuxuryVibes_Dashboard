import React, { useState } from "react";
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
    <div className="flex flex-1 overflow-y-scroll h-full">
      <div className="flex h-[170vh] w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="text-3xl font-bold font-family-serif">Welcome to the Dashboard!</div>
      
        
        <div className="flex justify-between gap-4">
          {cards.map((i, idx) => (
            <div
              key={"first-array-demo-1" + idx}
              className=" w-full h-38 rounded-lg bg-gray-100 dark:bg-neutral-800"
            >
              <h1 className="text-lg p-2 font-medium text-[494949]">{i.title}</h1>
              <h1 className="text-3xl text-green-300 p-2 font-bold ">{i.value}</h1>
              <div className="bg-gray-900 h-4 m-2 w-[90%] mx-auto rounded-full">
                {(() => {
                  const widthPercentage = (cards[idx].value / cards[0].value) * 100;
                  return (
                    <>
                      <div className="bg-green-400 h-4 rounded-full" style={{ width: `${cards[idx].title != "Conversion Rate" ? widthPercentage : cards[idx].value }%` }}></div>
                      <div className="text-right">{cards[idx].title != "Conversion Rate" ? widthPercentage.toFixed(2) : cards[idx].value.toFixed(2)}%</div>
                    </>
                  );
                })()}
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
                {(() => {
                  const widthPercentage = (cards2[idx].value / cards[0].value) * 100;
                  return (
                  <>
                    <div className="bg-green-400 h-4 rounded-full" style={{ width: `${widthPercentage}%` }}></div>
                    <div className="text-right">{widthPercentage.toFixed(2)}%</div>
                  </>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>
        <div id="tabs" className="flex gap-8 p-2 border-2 h-12 items-center rounded-lg">
          <button onClick={changeMenu} className="hover:scale-110 duration-200">Overview</button>
          <button onClick={changeMenu} className="hover:scale-110 duration-200">Sources</button>
          
        </div>
        {menuItem === "Overview" ? <Overview data={cards} data2={cards2}/> : <Sources data={cards} data2={cards2}/> }
       
      </div>
    </div>
  );
};

const Overview = (props: { data: { value: number | null; }[]; data2: { value: number | null; }[]; }) => {
  return (<div>
     
              <BarChart className="p-12 h-72"
                series={[
                  {
                    data: [props.data[0].value, props.data2[1].value, props.data[1].value, props.data[2].value, props.data2[0].value, props.data2[2].value],
                    label: 'Pinewood Retreat Leads',
                  }
                ]}
                xAxis={[{ data: ['Total', 'Google', 'Bot', 'Webform', 'Meta', 'WhatsApp'] }]}
                height={700}
              />
            
       
        </div>
  );
}

const Sources = (props: { data: { value: number | null; }[]; data2: { value: number | null; }[]; }) => {
  return (<div className="h-screen">
    <div className="flex h-[120vh]  rounded-lg ease-in-out duration-500 bg-gray-100 dark:bg-neutral-800">
      <PieChart
      
      width={800}
      height={800}
      series={[
        {
        data: [
          { value: props.data2[0].value ?? 0, label: 'Meta' },
          { value: props.data2[1].value ?? 0, label: 'Google' }, 
          { value: props.data2[2].value ?? 0, label: 'WhatsApp' },
          { value: props.data[2].value ?? 0, label: 'WebForm' },
          { value: props.data[1].value ?? 0, label: 'Bot' },
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
export default DashboardPinewood;