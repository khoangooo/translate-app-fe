import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import api from "./api";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function TransitionsModal(props) {
  const {
    modalVisible: open,
    setModalVisible: setOpen,
    currentItem,
    setCurrentItem,
    setReFetch
  } = props;
  const classes = useStyles();
  const [data, setData] = useState({});

  useEffect(() => {
    if (open) {
      setData(currentItem);
    }
  }, [open, currentItem]);

  const handleClose = () => {
    setCurrentItem({});
    setOpen(false);
  };

  const handleChangeText = (e) => {
    setData({ ...data, translate: e.target.value })
  }

  const handleSave = async () => {
    try {
      const res = await api.put(`/notes/${currentItem.id}`, {translate: data.translate})
      setOpen(false)
      if (res.status) {
        setTimeout(() => setReFetch(Math.random()), 20)
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <TextField
              required
              type="text"
              id="origin_text"
              label="Tiếng Pháp"
              value={data?.sfld || ""}
              variant="outlined"
              style={{ marginBottom: 20 }}
            />
            <br />
            <TextField
              required
              type="text"
              id="translated_text"
              label="Tiếng Việt"
              value={data?.translate || ""}
              variant="outlined"
              style={{ marginBottom: 20 }}
              onChange={handleChangeText}
            />
            <br />
            <Button
              variant="contained"
              color="primary"
              fullWidth={true}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
