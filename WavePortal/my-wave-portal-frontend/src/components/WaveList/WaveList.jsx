import { Modal } from "@mui/material"
import React from "react"
import MessageWindow from "../MessageWindow/MessageWindow.jsx";
import Wave from "../Wave/Wave.jsx"
import "./WaveList.css"

export default function WaveList(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  function sortWaves(waveOne, waveTwo) {
    if (waveOne.timestamp > waveTwo.timestamp) {
      return -1
    } else {
      return 1
    }
  }

  const waveElements = props.waves.sort(sortWaves).map((wave, index) => {
    return (<Wave key={index} address={wave.address} timestamp={wave.timestamp} message={wave.message} handleOpen={handleOpen} />
    )
  })
  return (
    <div className="dataContainer">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <MessageWindow />
      </Modal>
      {waveElements}
    </div>
  )
}
