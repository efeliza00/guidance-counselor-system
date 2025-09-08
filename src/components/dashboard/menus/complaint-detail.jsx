import { useParams } from "react-router";
import useSWR from "swr";
import { useJwt } from "react-jwt";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Badge } from "primereact/badge";

import { Skeleton } from "primereact/skeleton";
import { TabPanel, TabView } from "primereact/tabview";

const complaintFetcher = async ({ id, complaintId }) => {
  const res = await window.complaint.getComplaint({ id, complaintId });
  if (!res.status) throw new Error(res.message);
  return res;
};

const useGetComplaint = () => {
  const token = localStorage.getItem("auth-token");
  const { decodedToken } = useJwt(token);
  const params = useParams();
  const { data, isLoading, error } = useSWR(
    decodedToken?.id
      ? { id: decodedToken?.id, complaintId: params?.complaintId }
      : null,
    complaintFetcher
  );
  return { data, isLoading, error };
};

const ComplaintHeader = ({ error }) => (
  <div className="w-full mt-4">
    <div className="px-4">
      <h3 className="text-2xl font-medium leading-12 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-10 shadow-md h-10 rounded-full bg-blue-100">
          <i className="pi pi-info-circle text-blue-400 text-2xl" />
        </span>
        Complaint Information
      </h3>
      <p className="text-gray-400">
        View all information and specifics of this complaint.
      </p>
      {error && (
        <Message
          severity="error"
          text={error.message}
          className="w-full !justify-start"
        />
      )}
    </div>
    <Divider />
  </div>
);

const ComplaintDetail = () => {
  const { data, isLoading, error } = useGetComplaint();

  const statusTemplate = (status) => {
    if (status === "PENDING")
      return (
        <Badge
          severity="warning"
          value={status}
          className="!text-white !font-normal !capitalize"
        />
      );
    if (status === "RESOLVED")
      return (
        <Badge
          severity="success"
          value={status}
          className="!text-white !font-normal !capitalize"
        />
      );
    if (status === "REJECTED")
      return (
        <Badge
          severity="danger"
          value={status}
          className="!text-white !font-normal !capitalize"
        />
      );
    if (status === "IN_PROGRESS")
      return (
        <Badge
          severity="contrast"
          value="IN PROGRESS"
          className="!text-white !font-normal !capitalize"
        />
      );
  };

  if (isLoading) {
    return (
      <div className="h-full w-full my-4 p-4">
        <Skeleton width="40%" height="2rem" className="mb-3" />
        <Skeleton width="20%" height="1rem" className="mb-6" />
        <Skeleton width="100%" height="20rem" className="mb-4" />
        <div className="grid grid-cols-12 gap-4">
          <Skeleton className="col-span-6 h-48" />
          <Skeleton className="col-span-6 h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full my-4">
      <ComplaintHeader error={error} />
      <div className="grid-cols-12 grid gap-4 p-4">
        <div className="col-span-12">
          <h1 className="text-4xl capitalize font-medium">
            {data?.data?.title}
          </h1>
          {statusTemplate(data?.data?.status)}
        </div>
        <div className="col-span-12">
          <h3 className="font-semibold text-gray-400 text-xl leading-5">
            Complaint Information
          </h3>
          <Divider />
          <article
            dangerouslySetInnerHTML={{ __html: data?.data?.overview }}
            className="prose max-w-full overflow-x-hidden  overflow-y-auto max-h-60"
          />
        </div>
        <Divider className="col-span-12" />

        <TabView className="col-span-12">
          <TabPanel header="Complainants">
            <ul className="w-full flex flex-col gap-4">
              <li className="flex items-center justify-between bg-gray-100 py-1 px-4  ">
                <h3 className="text-lg font-semibold ">Student's Name</h3>

                <h3 className="text-lg font-semibold ">Contact Information</h3>
              </li>
              {data?.data?.students
                .filter((s) => s.role === "COMPLAINANT")
                .map((complainant) => (
                  <li
                    key={complainant.id}
                    className=" flex items-center justify-between p-2 text-gray-400 gap-10"
                  >
                    <p className="uppercase">{complainant.name}</p>

                    <p>{complainant.contact}</p>
                  </li>
                ))}
            </ul>
          </TabPanel>
          <TabPanel header="Respondents">
            <ul className="w-full flex flex-col gap-4">
              <li className="flex items-center justify-between bg-gray-100 py-1 px-4  ">
                <h3 className="text-lg font-semibold ">Student's Name</h3>

                <h3 className="text-lg font-semibold ">Contact Information</h3>
              </li>
              {data?.data?.students
                .filter((s) => s.role === "RESPONDENT")
                .map((respondent) => (
                  <li
                    key={respondent.id}
                    className=" flex items-center justify-between p-2 text-gray-400 gap-10"
                  >
                    <p className="uppercase">{respondent.name}</p>

                    <p>{respondent.contact}</p>
                  </li>
                ))}
            </ul>
          </TabPanel>
        </TabView>
        <div className="col-span-12 pb-10">
          <h3 className="font-semibold text-gray-400 text-xl leading-5">
            Resolution
          </h3>
          <Divider />
          {data?.data?.resolution ? (
            <article
              dangerouslySetInnerHTML={{ __html: data?.data?.resolution }}
              className="prose max-w-full overflow-x-hidden  overflow-y-auto max-h-60 "
            />
          ) : (
            <div className="p-4 flex items-center flex-col">
              <span className="text-gray-400">No resolution yet.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
