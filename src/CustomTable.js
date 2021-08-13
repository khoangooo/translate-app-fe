import React, { useState, useRef } from "react";
import CustomModal from "./CustomModal";
import api from "./api";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Pagination from "@material-ui/lab/Pagination";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

export default function CustomPaginationActionsTable() {
  const classes = useStyles2();
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [refetch, setReFetch] = useState("");
  const [pagination, setPagination] = useState({
    per_page: 20,
    page_number: 1,
    total: 0,
  });
  const mounted = useRef(false);

  React.useEffect(() => {
    mounted.current = true;
    setLoading(true);
    const params = {
      per_page: pagination.per_page,
      page_number: pagination.page_number
    }
    api.get("/notes", {params}).then((res) => {
      if (res.status) {
        const newPagination = {
          per_page: res.pagination.per_page,
          page_number: res.pagination.page_number,
          total: res.pagination.total,
        };
        setData(res.data);
        setPagination(newPagination);
        setLoading(false);
      } else {
        setLoading(false);
        setData([]);
      }
    });
    return () => (mounted.current = false);
  }, [refetch, pagination.page_number, pagination.per_page]);

  const handleChangePagination = (event, value) => {
    setPagination({...pagination, page_number: value})
  }

  const handleTranslate = (item) => () => {
    setCurrentItem(item);
    setModalVisible(true);
  };

  return loading ? (
    <div className="shapes-4" style={{ margin: "0 auto" }}></div>
  ) : (
    <>
      <CustomModal
        currentItem={currentItem}
        setCurrentItem={setCurrentItem}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setReFetch={setReFetch}
      />

      <TableContainer component={Paper} style={{marginTop: 20}}>
      <Pagination
        style={{margin: "20px auto"}}
        count={Math.ceil(pagination?.total / pagination.per_page) || 0}
        page={pagination.page_number || 1}
        showFirstButton
        showLastButton
        onChange={handleChangePagination}
      />
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">ID</StyledTableCell>
              <StyledTableCell>Tiếng Pháp</StyledTableCell>
              <StyledTableCell>Tiếng Việt</StyledTableCell>
              <StyledTableCell align="right">Cập nhật</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length && data.map((item) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell style={{ width: 160 }} aligh="center">
                  {item.id}
                </StyledTableCell>
                <StyledTableCell>{ReactHtmlParser(item.flds)}</StyledTableCell>
                <StyledTableCell>{item.translate}</StyledTableCell>
                <StyledTableCell
                  style={{ width: 160, cursor: "pointer" }}
                  align="right"
                >
                  <span onClick={handleTranslate(item)}>
                    <EditOutlinedIcon />
                  </span>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
