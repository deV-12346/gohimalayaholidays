"use client"
import { useEffect, useRef, useState } from "react"
import EnquiryModal from "./EnquiryModal"
const EnquiryPopupHandler = () => {
  const [openModal, setOpenModal] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const delayRef = useRef(5000)
  useEffect(() => {
     const showPopup = () => {
      timerRef.current = setTimeout(() => {
        setOpenModal(true)
        // double delay
        delayRef.current = delayRef.current * 2
        showPopup()
      }, delayRef.current)
    }
    showPopup()
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
  }
  }, [])
  return (
    <EnquiryModal
      open={openModal}
      onClose={() => setOpenModal(false)}
    />
  )
}

export default EnquiryPopupHandler