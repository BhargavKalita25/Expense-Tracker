import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Papa from "papaparse";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import Button from "../components/common/Button";
import CategoryManager from "../components/features/categories/CategoryManager";
import { addCategory, deleteCategory, getCategoryList, importExpensesCSV } from "../services/api";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 20px;
  background: ${({ theme }) => theme.card || theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border || "#3A3B3C"};
  border-radius: 12px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
`;

const UploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  input[type="file"] {
    display: none;
  }
`;

const FilePickerLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.bg};
  border: 1px dashed ${({ theme }) => theme.border || "#3A3B3C"};
  color: ${({ theme }) => theme.text_primary};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const StatusMessage = styled.div`
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 6px;
  background: ${({ theme, $isError }) =>
    $isError ? (theme.red ? `${theme.red}18` : "rgba(255, 77, 79, 0.1)") : "rgba(74, 222, 128, 0.1)"};
  color: ${({ theme, $isError }) => ($isError ? theme.red || "#FF4D4F" : "#4ade80")};
  border: 1px solid
    ${({ theme, $isError }) =>
      $isError ? (theme.red ? `${theme.red}40` : "rgba(255, 77, 79, 0.3)") : "rgba(74, 222, 128, 0.3)"};
`;

const Grid = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const Card = styled.div`
  flex: 1;
  min-width: 320px;
  padding: 20px;
  border-radius: 12px;
  background: ${({ theme }) => theme.card || theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border || "#3A3B3C"};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardTitle = styled.h2`
  font-weight: 700;
  font-size: 16px;
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
`;

const CodeBox = styled.pre`
  background: ${({ theme }) => theme.bg};
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border || "#3A3B3C"};
  font-size: 13px;
  color: #38bdf8;
  overflow-x: auto;
  line-height: 1.5;
`;

export default function BudgetPage() {
  const [categoryList, setCategoryList] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importStatus, setImportStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const refreshCategories = async () => {
    try {
      const res = await getCategoryList();
      setCategoryList(res.data || []);
    } catch (e) {
      console.error("Failed to load categories:", e);
    }
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const addNewCategory = async (name) => {
    try {
      await addCategory({ categoryName: name });
      await refreshCategories();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to add category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    try {
      await deleteCategory(id);
      await refreshCategories();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete category");
    }
  };

  const handleUploadFile = () => {
    if (!uploadedFile) {
      setIsError(true);
      setImportStatus("Please choose a CSV file first");
      return;
    }

    setIsImporting(true);
    setIsError(false);
    setImportStatus("Parsing CSV file...");

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        try {
          const rawRows = results.data || [];
          const rows = rawRows.filter(
            (r) => r.description && r.amount !== undefined && r.amount !== ""
          );

          if (rows.length === 0) {
            setIsError(true);
            setImportStatus("CSV is empty or missing required headers (description, amount)");
            setIsImporting(false);
            return;
          }

          setImportStatus(`Importing ${rows.length} expenses...`);
          const res = await importExpensesCSV(rows);
          const count = res.data?.created ?? rows.length;

          setIsError(false);
          setImportStatus(`Successfully imported ${count} expenses!`);
          setUploadedFile(null);
          await refreshCategories();
        } catch (e) {
          console.error("CSV import error:", e);
          setIsError(true);
          setImportStatus(e?.response?.data?.message || "CSV import failed on server");
        } finally {
          setIsImporting(false);
        }
      },
      error: function (err) {
        console.error("Papa parse error:", err);
        setIsError(true);
        setImportStatus("Failed to parse CSV file format");
        setIsImporting(false);
      },
    });
  };

  return (
    <Container>
      <SectionHeader>
        <div>
          <Title>Budget & Tools</Title>
          <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.8 }}>
            Manage category buckets and bulk-import transactions via CSV
          </p>
        </div>

        <UploadRow>
          <FilePickerLabel htmlFor="csvFileInput">
            <UploadFileIcon fontSize="small" />
            <span>{uploadedFile ? uploadedFile.name : "Choose CSV File"}</span>
          </FilePickerLabel>
          <input
            id="csvFileInput"
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              setUploadedFile(e.target.files?.[0] || null);
              setImportStatus("");
            }}
          />

          <Button
            onClick={handleUploadFile}
            disabled={isImporting}
            isLoading={isImporting}
          >
            Upload & Import
          </Button>
        </UploadRow>
      </SectionHeader>

      {importStatus && (
        <StatusMessage $isError={isError}>{importStatus}</StatusMessage>
      )}

      <Grid>
        <Card>
          <CardTitle>Manage Categories</CardTitle>
          <CategoryManager
            addNewCategory={addNewCategory}
            onDelete={handleDeleteCategory}
            list={categoryList}
          />
        </Card>

        <Card>
          <CardTitle>CSV File Format Guide</CardTitle>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>
            Your CSV must contain header names in the first row. Valid format:
          </p>
          <CodeBox>{`dateStr,description,amount,categoryName
01/15/2026,Groceries,84.50,Food
01/16/2026,Gas station,45.00,Transport
01/17/2026,Internet Bill,70.00,Utilities`}</CodeBox>
          <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.5 }}>
            <b>Automatic Category Creation:</b> If a <code>categoryName</code> in your CSV doesn&apos;t exist yet in your account, Expense Tracker automatically creates it for you during the import process.
          </div>
        </Card>
      </Grid>
    </Container>
  );
}
