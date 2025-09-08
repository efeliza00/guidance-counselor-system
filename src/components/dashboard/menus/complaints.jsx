import useSWR from "swr";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { useJwt } from "react-jwt";
import ComplaintTable from "../../complaint-table";
import { Paginator } from "primereact/paginator";
import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import SearchComplaint from "../../search-complaint";

const complaintFetcher = async ({ id, page, limit, search }) => {
  const res = await window.complaint.getComplaints({ id, page, limit, search });

  if (!res.status) {
    throw new Error(res.message);
  } else {
    return res;
  }
};

const useGetComplaints = (page, limit) => {
  const token = localStorage.getItem("auth-token");
  const [search, setSearch] = useState("");
  const { decodedToken } = useJwt(token);

  const { data, error, isLoading } = useSWR(
    decodedToken?.id ? { id: decodedToken?.id, page, limit, search } : null,
    complaintFetcher
  );

  return { data, error, isLoading, search, setSearch };
};

const ComplaintsContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState(10);

  const { data, error, isLoading, search, setSearch } = useGetComplaints(
    currentPage,
    rows
  );

  const onPageChange = (event) => {
    setCurrentPage(event.page + 1); // Paginator uses 0-based page index
    setRows(event.rows);
  };

  const paginatorTemplate = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
      ];

      return (
        <React.Fragment>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Items per page:{" "}
          </span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
          />
        </React.Fragment>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first + 1} - {options.last} of {options.totalRecords}
        </span>
      );
    },
  };

  return (
    <div className="px-4 space-y-1.5">
      {error && (
        <Message
          severity="error"
          text="Failed to load complaints."
          className="w-full !justify-start"
        />
      )}
      <SearchComplaint search={search} setSearch={setSearch} />
      <ComplaintTable
        complaints={data?.data?.complaints}
        isLoading={isLoading}
      />
      <Paginator
        first={(currentPage - 1) * rows}
        rows={rows}
        totalRecords={data?.data?.pagination.total}
        onPageChange={onPageChange}
        rowsPerPageOptions={[5, 10, 20, 50]}
        template={paginatorTemplate}
      />
    </div>
  );
};

const ComplaintHeader = () => (
  <div className="w-full mt-4">
    <div className="px-4">
      <h3 className="text-2xl font-medium leading-12 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-10 shadow-md h-10 rounded-full bg-purple-100">
          <i className="pi pi-folder-open text-purple-400 text-2xl" />
        </span>
        Complaints
      </h3>
      <p className="text-gray-400">View and track complaint details.</p>
    </div>
    <Divider />
  </div>
);

const Complaints = () => (
  <>
    <ComplaintHeader />
    <ComplaintsContent />
  </>
);

export default Complaints;
