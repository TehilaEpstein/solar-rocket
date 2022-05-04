import { Card, CircularProgress, Container } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AppLayout } from "../layouts/AppLayout";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { TableContainer } from "@mui/material";
import { Table } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { TableBody } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

const Weather = (): JSX.Element => {
  const [content, setContent] = useState<Array<string>>([]);

  useEffect(() => {
    setWeather();
  }, []);

  const setWeather = async () => {
    const jsonLink = await fetch(
      "https://api.weatherapi.com/v1/forecast.json?key=ea1f6ce0bc30430ca2981436220105&q=Israel&days=5&aqi=yes&alerts=no"
    );
    const jsonContent = await jsonLink.json();
    console.log("jsonContent", jsonContent);
    setContent(jsonContent.forecast.forecastday);
    console.log("content", content);
    console.log("one 1  content: ", content[0]);
  };

  return (
    <AppLayout title="Weather">
      <Container maxWidth="lg">
        <div>what is the weather for: </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "yellow" }}>
                <TableCell>Date</TableCell>
                <TableCell align="right">Temp c</TableCell>
                <TableCell align="right">Temp f</TableCell>
                <TableCell align="right">What is the weather? </TableCell>
                <TableCell align="right">Pic </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.map((row: any) => {
                return (
                  <TableRow key={row.date} sx={{ backgroundColor: "#C0C0C0" }}>
                    <TableCell component="th" scope="row">
                      {row.date}
                    </TableCell>
                    <TableCell align="right">{row.day.avgtemp_c}</TableCell>
                    <TableCell align="right">{row.day.avgtemp_f}</TableCell>
                    <TableCell align="right">
                      {row.day.condition.text}
                    </TableCell>
                    <TableCell align="right">
                      <img src={row.day.condition.icon} alt="new" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </AppLayout>
  );
};
export { Weather };
