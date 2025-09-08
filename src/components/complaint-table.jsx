import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
import { ButtonGroup } from "primereact/buttongroup";
import { Skeleton } from "primereact/skeleton";
import { useNavigate } from "react-router";
import EditComplaintButton from "./edit-complaint";
import DeleteComplaintButton from "./delete-complaint";
const ComplaintTable = ({ complaints, isLoading }) => {
  const navigate = useNavigate();
  const overviewTemplate = (rowData) => (
    <div
      dangerouslySetInnerHTML={{ __html: rowData?.overview }}
      className="line-clamp-2"
    />
  );

  const complainantsTemplate = (rowData) =>
    rowData.students.filter((student) => student.role === "COMPLAINANT")
      ?.length || 0;
  const respondentsTemplate = (rowData) =>
    rowData.students.filter((student) => student.role === "RESPONDENT")
      ?.length || 0;

  const handleNavigateRow = (e) => {
    const id = e.data.id;
    navigate(`/dashboard/complaints/${id}`);
  };

  const actionTemplate = (rowData) => {
    return (
      <ButtonGroup>
        <EditComplaintButton complaint={rowData} />
        <DeleteComplaintButton complaintId={rowData?.id} />
      </ButtonGroup>
    );
  };

  const statusTemplate = (rowData) => {
    if (rowData.status === "PENDING")
      return (
        <Badge
          severity="warning"
          value={rowData?.status}
          className="!text-white !font-normal !capitalize"
        />
      );
    if (rowData.status === "RESOLVED")
      return (
        <Badge
          severity="success"
          value={rowData?.status}
          className="!text-white !font-normal !capitalize"
        />
      );
    if (rowData.status === "REJECTED")
      return (
        <Badge
          severity="danger"
          value={rowData?.status}
          className="!text-white !font-normal !capitalize"
        />
      );
    if (rowData.status === "IN_PROGRESS")
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
      <DataTable value={Array.from({ length: 5 })}>
        <Column header="Status" body={() => <Skeleton width="6rem" />} />
        <Column header="Title" body={() => <Skeleton width="10rem" />} />
        <Column header="Overview" body={() => <Skeleton width="100%" />} />
        <Column header="Complainants" body={() => <Skeleton width="3rem" />} />
        <Column header="Respondents" body={() => <Skeleton width="3rem" />} />
        <Column header="Resolution" body={() => <Skeleton width="6rem" />} />
      </DataTable>
    );
  }

  return (
    <DataTable
      value={complaints}
      onRowClick={handleNavigateRow}
      stripedRows
      dataKey="id"
      removableSort
      rowHover
      emptyMessage={() => (
        <span className="text-center font-semibold text-gray-400">
          No complainants available.
        </span>
      )}
    >
      <Column field="status" header="Status" sortable body={statusTemplate} />
      <Column
        field="title"
        header="Title"
        sortable
        body={(rowData) => rowData.title}
      />
      <Column header="Overview" body={overviewTemplate} />
      <Column header="Complainants" body={complainantsTemplate} />
      <Column header="Respondents" body={respondentsTemplate} />
      <Column header="Actions" body={actionTemplate} />
    </DataTable>
  );
};

export default ComplaintTable;
