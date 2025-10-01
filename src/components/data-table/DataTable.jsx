import PropTypes from "prop-types";
import { ArrowDown } from "lucide-react";
import { useEffect, useCallback } from "react";
import isPropValid from "@emotion/is-prop-valid";
import { StyleSheetManager } from "styled-components";
import { useTheme } from "@/lib/contexts/theme-provider";
import { default as DataTableComponent } from "react-data-table-component";

const DataTable = ({ columns, data, isFooter = false, children }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const rootStyles = getComputedStyle(document.documentElement);
  const getCSSVar = useCallback(
    (variable) => rootStyles.getPropertyValue(variable).trim(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const customStyles = {
    table: {
      style: {
        backgroundColor: `hsl(${getCSSVar("--table-bg")})`,
        borderSpacing: "0 4px",
        borderCollapse: "separate",
        outline: "none",
      },
    },
    headRow: {
      style: {
        backgroundColor: `hsl(${getCSSVar("--table-head-row-bg")})`,
        borderBottomColor: `hsl(${getCSSVar("--table-border")})`,
        minHeight: "56px",
      },
    },
    headCells: {
      style: {
        fontSize: "17.5px",
        fontWeight: "600",
        color: `hsl(${getCSSVar("--table-head-color")})`,
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "12px",
        paddingBottom: "12px",
      },
    },
    rows: {
      style: {
        fontSize: "15px",
        backgroundColor:`hsl(${getCSSVar("--table-bg")})` ,
        color: `hsl(${getCSSVar("--table-text")})` ,
        minHeight: "52px",
        "&:not(:last-of-type)": {
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
          borderBottomColor: `hsl(${getCSSVar("--table-border")})`,
        },
        "&:hover": {
          backgroundColor: `hsl(${getCSSVar("--table-row-hover")})`,
          cursor: "pointer",
          transform: "translateY(-1px)",
          transition: "all 0.2s ease-in-out",
          boxShadow: isDarkMode
            ? "0 2px 4px rgba(0, 0, 0, 0.2)"
            : "0 2px 4px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "20px",
        paddingBottom: "20px",
      },
    },
    pagination: {
      style: {
        backgroundColor: `hsl(${getCSSVar("--table-bg")})`,
        color: `hsl(${getCSSVar("--table-text")})`,
        borderTop: `1px solid hsl(${getCSSVar("--table-border")})`,
        padding: "8px",
        borderBottomRightRadius: "10px",
        borderBottomLeftRadius: "10px",
      },
      pageButtonsStyle: {
        borderRadius: "100px",
        height: "32px",
        minwidth: "32px",
        padding: "0 8px",
        margin: "0 4px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover:not(:disabled)": {
          backgroundColor: `hsl(${getCSSVar("--accent")})`,
        },
      },
      rowsPerPageText: {
        style: {
          color: `hsl(${getCSSVar("--table-text")})`,
        },
      },
      select: {
        style: {
          borderRadius: "4px",
          padding: "4px 8px",
          cursor: "pointer",
          "&:focus": {
            outline: "none",
          },
        },
      },
      selectOptions: {
        style: {
          backgroundColor: `hsl(${getCSSVar("--table-bg")})`,
          color: `hsl(${getCSSVar('--table-text')})`,
          borderRadius: "4px",
        },
      },
    },
    noData: {
      style: {
        backgroundColor: `hsl(${getCSSVar("--table-bg")})`,
        color: `hsl(${getCSSVar('--table-text')})`,
      },
    },
  };

  useEffect(() => {
    if (isDarkMode) {
      const style = document.createElement("style");
      style.textContent = `
        .rdt_Pagination select option {
          background-color: hsl(${getCSSVar(`--table-row-hover`)}) !important;
          color: hsl(${getCSSVar(`--table-text`)}) !important;
        }
      `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }
  }, [isDarkMode,getCSSVar]);

  useEffect(() => {
    const removeHeaderTabIndex = () => {
      const headers = document.querySelectorAll('div[role="columnheader"]');
      headers.forEach((header) => {
        header.removeAttribute("tabindex");
        header.style.outline = "none";
      });
    };

    // Delay slightly to ensure DOM has rendered
    const timeoutId = setTimeout(removeHeaderTabIndex, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <StyleSheetManager
      shouldForwardProp={(prop) => isPropValid(prop) && prop !== "hide"}
    >
      <div
        className="flex flex-col rounded-xl"
        style={{ border: `1px solid hsl(var(--table-border))` }}
      >
        <DataTableComponent
          columns={columns}
          data={data}
          fixedHeader
          fixedHeaderScrollHeight={
            data?.length > 10 ? "calc(100vh - 300px)" : "calc(100vh - 250px)"
          }
          customStyles={customStyles}
          sortIcon={<ArrowDown className="ml-2 h-4 w-4" />}
          reorderable={false}
          disableColumnReorder={true}
          direction="auto"
          pagination={data?.length > 10}
          persistTableHead
          pointerOnHover
          responsive
          selectableRowsHighlight
          subHeaderAlign="right"
          subHeaderWrap
          theme={isDarkMode ? "dark" : "light"}
        />
        {isFooter && (
          <div
            className={`rounded-b-xl overflow-hidden py-3`}
            style={{
              borderTop: `1px solid hsl(var(--table-border))`,
              backgroundColor: `hsl(var(--table-head-row-bg))`,
              color: `hsl(${getCSSVar("--table-text")})`
            }}
          >
            {children}
          </div>
        )}
      </div>
    </StyleSheetManager>
  );
};

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  isFooter: PropTypes.bool,
  children: PropTypes.node,
};

export default DataTable;