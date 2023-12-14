import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import { Navigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useState, useMemo, useCallback, useRef } from "react";

import axiosInstance from "../../api/axios";

import "./index.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const gridRef = useRef();
  const [data, setData] = useState([]);
  const [colsDef, setColsDef] = useState([
    {
      field: "firstName",
      filter: "agTextColumnFilter",
      cellDataType: "text",
    },
    { field: "lastName", filter: "agTextColumnFilter", cellDataType: "text" },
    { field: "email", filter: "agTextColumnFilter", cellDataType: "text" },
    { field: "gender", filter: "agTextColumnFilter", cellDataType: "text" },
    { field: "dob", filter: "agTextColumnFilter", cellDataType: "text" },
    { field: "country", filter: "agTextColumnFilter", cellDataType: "text" },
    { field: "state", filter: "agTextColumnFilter", cellDataType: "text" },
    { field: "city", filter: "agTextColumnFilter", cellDataType: "text" },
    { field: "zip", filter: "agTextColumnFilter", cellDataType: "text" },
    {
      field: "areaOfInterest",
      filter: "agTextColumnFilter",
      cellDataType: "object",
    },
    { field: "password", cellDataType: "text" },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      cellDataType: true,
    };
  }, []);

  const paginationPageSizeSelector = useMemo(() => {
    return [5, 10, 20];
  }, []);

  const onGridReady = useCallback(() => {
    axiosInstance
      .get("/api/users/getData")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCellValueChanged = (params) => {
    console.log(params);

    axiosInstance
      .put("api/users/updateUser", {
        email: params.data.email,
        columnName: params.column.colId,
        columnValue: params.newValue,
      })
      .then((response) => {
        alert(
          `Value of column ${params.column.colId} changed for ${params.data.email}`
        );
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (!localStorage.getItem("authenticated")) {
    return <Navigate replace to="/login" />;
  }

  return (
    <>
      <h1 className="form-heading">Dashboard</h1>
      <div className="logout-button">
        <Button
          className="my-button"
          justify="flex-end"
          mt="lg"
          onClick={() => {
            localStorage.removeItem("authenticated");
            localStorage.removeItem("email");
            localStorage.removeItem("password");
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </div>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={data}
          columnDefs={colsDef}
          pagination={true}
          paginationPageSize={5}
          paginationPageSizeSelector={paginationPageSizeSelector}
          onGridReady={onGridReady}
          defaultColDef={defaultColDef}
          onCellValueChanged={handleCellValueChanged}
          rowSelection="single"
        />
      </div>

      <div className="logout-button">
        <Button
          className="my-button"
          justify="flex-end"
          mt="lg"
          onClick={() => {
            const selectedRows = gridRef.current.api.getSelectedRows();
            console.log(selectedRows[0].email);

            if (selectedRows.length === 0) {
              alert("Please select a row to delete");
            } else {
              axiosInstance
                .put("/api/users/deleteUser", {
                  email: selectedRows[0].email,
                  password: selectedRows[0].password,
                })
                .then(() => {
                  alert("User successfully deleted");
                  onGridReady();
                })
                .catch((error) => {
                  console.log(error);
                  alert("Error!");
                });
            }
          }}
        >
          Delete
        </Button>
      </div>
    </>
  );
}
