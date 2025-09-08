import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import React from "react";
import { Chart } from "primereact/chart";
import useSWR from "swr";
import { useJwt } from "react-jwt";
import { Message } from "primereact/message";
const overviewFetcher = async ({ id }) => {
  const res = await window.complaint.getOverview({ id });
  if (!res.status) throw new Error(res.message);
  return res;
};

const useGetOverview = () => {
  const token = localStorage.getItem("auth-token");
  const { decodedToken } = useJwt(token);
  const { data, isLoading, error } = useSWR(
    decodedToken?.id ? { id: decodedToken.id } : null,
    overviewFetcher
  );

  return { data, isLoading, error };
};

const OverviewCounter = ({ summary, chart, respondents }) => {
  const statuses = ["RESOLVED", "PENDING", "IN_PROGRESS", "REJECTED"];
  const titleCards = {
    RESOLVED: "Resolved",
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    REJECTED: "Rejected",
  };

  const counts = Object.fromEntries(
    (summary ?? []).map((s) => [s.status, s._count._all])
  );

  const dailyCounts = (chart ?? []).reduce((acc, c) => {
    const day = new Date(c.createdAt).toISOString().split("T")[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  const chartData = {
    labels: Object.keys(dailyCounts),
    datasets: [
      {
        label: "Complaints per day",
        data: Object.values(dailyCounts),
        fill: true,
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        ticks: {
          maxTicksLimit: 10,
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="grid grid-col-2 lg:grid-cols-4 gap-4 p-4">
      <h1 className="text-2xl font-semibold text-green-900 col-span-4">
        Summary
      </h1>

      {statuses.map((status) => (
        <Card
          key={status}
          className="!border-t-8 hover:-translate-y-2 transition-transform duration-300 border-green-400"
        >
          <h1 className="text-4xl font-medium text-green-900">
            {counts[status] ?? 0}
          </h1>
          <p className=" capitalize font-semibold text-green-900">
            {titleCards[status]}
          </p>
        </Card>
      ))}
      <Card
        title="Respondents"
        subTitle="Students that are being held as respondents in a complain"
        className="col-span-1"
        pt={{
          title: { className: "text-green-900 font-bold leading-3" },
          subTitle: { className: "text-green-700 italic text-xs" },
          footer: { className: "hidden" },
        }}
      >
        <ul className="w-full h-full bg-green-400/8 rounded-lg flex flex-col gap-1 p-2">
          {respondents?.map((student) => (
            <li
              key={student.id}
              className="bg-green-100 hover:scale-103 cursor-auto transition-transform duration-300 flex items-center font-semibold text-green-900 justify-between px-4 py-2 rounded-xl"
            >
              <span className="capitalize">{student.name}</span>
              <span>{student._count.id}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card
        subTitle="Number of complaints per day"
        pt={{
          subTitle: { className: "text-green-900 font-bold text-lg" },
        }}
        className="col-span-2"
      >
        <Chart
          type="line"
          data={chartData}
          options={chartOptions}
          className="!w-full !h-full"
        />
      </Card>
    </div>
  );
};
const Overview = () => {
  const { data, isLoading, error } = useGetOverview();
  return (
    <div className="h-full w-full">
      <div className="p-4">
        <h3 className="text-2xl font-medium leading-12 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-10 shadow-md h-10 rounded-full bg-green-100">
            <i className="pi pi-chart-bar text-green-400 text-2xl" />
          </span>
          Overview
        </h3>
        <p className="text-gray-300">
          Here you can find a summary of key metrics and recent activities.
        </p>
        {error && (
          <Message
            severity="error"
            text={error.message}
            className="w-full !justify-start my-5"
          />
        )}
      </div>
      <Divider />
      {!isLoading ? (
        <OverviewCounter
          summary={data?.data?.complaintsByStatus}
          chart={data?.data?.complaintTracks}
          respondents={data?.data?.topRespondents}
        />
      ) : (
        <span>loading...</span>
      )}
    </div>
  );
};

export default Overview;
