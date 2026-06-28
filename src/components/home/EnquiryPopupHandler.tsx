"use client"
import { useEffect, useState } from "react"
import EnquiryModal from "./EnquiryModal"
const EnquiryPopupHandler = () => {
  const [openModal, setOpenModal] = useState(false)
  useEffect(() => {
    const alreadyShown = localStorage.getItem("enquiry-popup")
    if (!alreadyShown) {
    const timer = setTimeout(() => {
    setOpenModal(true)
    localStorage.setItem(
      "enquiry-popup",
      "true"
    )}, 5000)
    return () => clearTimeout(timer)
  }}, [])
  return (
    <EnquiryModal
      open={openModal}
      onClose={() => setOpenModal(false)}
    />
  )
}

export default EnquiryPopupHandler