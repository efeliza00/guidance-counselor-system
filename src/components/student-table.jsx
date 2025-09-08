import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";

const StudentTable = ({ students, isLoading }) => {
  if (isLoading) {
    return (
      <DataTable value={Array.from({ length: 5 })}>
        <Column header="Name" body={() => <Skeleton width="6rem" />} />
        <Column
          header="Contact Information"
          body={() => <Skeleton width="10rem" />}
        />
      </DataTable>
    );
  }
  return (
    <DataTable
      value={students}
      stripedRows
      dataKey="id"
      removableSort
      rowHover
      emptyMessage={() => (
        <span className="text-center font-semibold text-gray-400">
          No Students available.
        </span>
      )}
    >
      <Column
        field="name"
        header="Name"
        sortable
        body={(rowData) => rowData.name}
      />
      <Column
        field="contact"
        header="Contact Information"
        body={(rowData) => rowData.contact}
      />
    </DataTable>
  );
};

export default StudentTable;
