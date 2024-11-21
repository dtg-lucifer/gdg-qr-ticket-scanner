import { QrReader } from "react-qr-reader"
import { DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer"
import { Button } from "./ui/button"
import { ReactNode, useEffect, useRef, useState } from "react"

const Scanner = () => {
  const btnRef = useRef(null)
  const [res, setRes] = useState("")
  const [success, setSuccess] = useState(false)
  const [data, setData] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    // @ts-ignore
    if (success) btnRef.current.click()
    if (!!res) {
      try {
        setData(JSON.parse(res))
      } catch (e) {
        alert("Error parsing the QR, make sure that the QR is valid")
      }
    }
  }, [success])

  return (
    <>
    <DrawerTrigger ref={btnRef} hidden>Open</DrawerTrigger>
    <QrReader
      scanDelay={1000}
      constraints={{facingMode: "environment"}}
      onResult={(r, e) => {
          if (!!r) {
            setRes(r.getText())
            setSuccess(true)
          }
          if (!!e) console.log("Retry, something is wrong!!")
      }}
      
      videoId='video'
      videoStyle={{width: "100dvw", height: "100dvh"}}
      videoContainerStyle={{width: "100dvw", height: "100dvh"}}
    />  
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Success !!</DrawerTitle>
        <DrawerDescription>Attendee registered for the event successfully!</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter className="px-[3.5rem]">
        <pre>
          {data ? data : JSON.parse("{}")}
        </pre>
        <DrawerClose>
          <Button onClick={() => setSuccess(false)} variant="default">Okay</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
    </>
  )
}

export {Scanner}
