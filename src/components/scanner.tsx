import { QrReader } from "react-qr-reader";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const Scanner = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [res, setRes] = useState("");
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (success) btnRef.current!.click();
    if (res && res !== undefined && res !== null && res !== "") {
      try {
        setData(JSON.parse(res));
      } catch (e) {
        alert(
          "Error parsing the QR, make sure that the QR is valid, Error: " + e
        );
        window.location.reload();
      }
    }
  }, [success, res]);

  return (
    <Dialog>
      <DialogTrigger ref={btnRef} hidden></DialogTrigger>
      <QrReader
        scanDelay={1000}
        constraints={{ facingMode: "environment" }}
        onResult={(r, e) => {
          if (r !== null && r !== undefined) {
            setRes(r.getText());
            console.log(r.getText());
            setSuccess(true);
          }
          if (e) console.log("Retry, something is wrong!!");
        }}
        videoId="video"
        videoStyle={{ width: "100dvw", height: "100dvh" }}
        videoContainerStyle={{ width: "100dvw", height: "100dvh" }}
      />
      <DialogContent>
        <DialogHeader>
          {/* <DialogTitle>Success !!</DialogTitle> */}
          <DialogDescription>
            {/* Attendee registered for the event successfully! */}
            {success && (
              <div className="place-items-center gap-8 grid text-xl">
                <img
                  src="/tick.gif"
                  alt="verified_logo"
                  className="width-[60%]"
                />
                <div>
                  <p>
                    <strong className="text-black">Attendee Name:</strong>{" "}
                    {data?.name}
                  </p>
                  <p>
                    <strong className="text-black">Attendee Email:</strong>{" "}
                    {data?.email}
                  </p>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        {/* <DialogFooter className="place-items-center grid p-4 px-[3.5rem]"> */}
        {/* <DialogClose className="place-self-center">
            <Button onClick={() => setSuccess(false)} variant="default">
              Okay
            </Button>
          </DialogClose> */}
        {/* </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export { Scanner };
