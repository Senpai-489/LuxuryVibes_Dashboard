const Dashboard = () => {
  const cards = [
    {
      title: "Total Sales",
      value: 25024,
    },
    {
      title: "Today's Sales",
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
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
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
        <div className="flex flex-1 gap-2">
          {[...new Array(2)].map((i, idx) => (
            <div
              key={"second-array-demo-1" + idx}
              className="h-92 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;