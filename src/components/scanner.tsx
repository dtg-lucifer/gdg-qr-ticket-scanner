// import { QrReader } from "react-qr-reader";
// import { useEffect, useRef, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./ui/dialog";

// const Scanner = () => {
//   const btnRef = useRef<HTMLButtonElement>(null);
//   const [res, setRes] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<Record<string, string> | null>(null);

//   const controller = new AbortController();

//   const makeRequest = async (d: Record<string, string>) => {
//     try {
//       setLoading(true);
//       const res = await fetch(
//         "https://gdg-qr-ticket-scanner.vercel.app/api/scan",
//         {
//           signal: controller.signal,
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: d.name,
//             contact: d.contact,
//             email: d.email,
//           }),
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`HTTP Error: ${res.text()}`);
//       }

//       await res.json();
//     } catch (err) {
//       //something
//       alert(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (success) btnRef.current!.click();
//     if (res && res !== undefined && res !== null && res !== "") {
//       try {
//         setData(JSON.parse(res));
//         if (data && data["event"]) {
//           makeRequest({
//             name: data.name,
//             email: data.email,
//             contact: data.phone,
//             participation: data.event,
//           });
//         } else {
//           if (data)
//             makeRequest({
//               name: data.name,
//               email: data.email,
//               contact: data.phone,
//             });
//         }
//       } catch (e) {
//         alert(
//           "Error parsing the QR, make sure that the QR is valid, Error: " + e
//         );
//         window.location.reload();
//       }
//     }

//     return () => controller.abort();
//   }, [success, res]);

//   return (
//     <Dialog onOpenChange={(open) => !open && window.location.reload()}>
//       <DialogTrigger ref={btnRef} hidden></DialogTrigger>
//       <QrReader
//         scanDelay={50}
//         constraints={{ facingMode: "environment" }}
//         onResult={(r, e) => {
//           if (r !== null && r !== undefined) {
//             setRes(r.getText());
//             console.log(r.getText());
//             setSuccess(true);
//           }
//           if (e) console.log("Retrying!!");
//         }}
//         videoId="video"
//         videoStyle={{ width: "100dvw", height: "100dvh" }}
//         videoContainerStyle={{ width: "100dvw", height: "100dvh" }}
//       />
//       <p className="text-2xl text-center">Scan the QR Code</p>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Success !!</DialogTitle>
//           <DialogDescription>
//             {/* Attendee registered for the event successfully! */}
//             {success && (
//               <div className="place-items-center gap-8 grid text-xl">
//                 <img
//                   src={loading ? "/loading.gif" : "/tick.gif"}
//                   alt="verified_logo"
//                   className="width-[60%]"
//                 />
//                 <div>
//                   <p>
//                     <strong className="text-black">Attendee Name:</strong>{" "}
//                     {data?.name}
//                   </p>
//                   <p>
//                     <strong className="text-black">Attendee Email:</strong>{" "}
//                     {data?.email}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </DialogDescription>
//         </DialogHeader>
//         {/* <DialogFooter className="place-items-center grid p-4 px-[3.5rem]"> */}
//         {/* <DialogClose className="place-self-center">
//             <Button onClick={() => setSuccess(false)} variant="default">
//               Okay
//             </Button>
//           </DialogClose> */}
//         {/* </DialogFooter> */}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export { Scanner };

import { QrReader } from "react-qr-reader";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const Scanner = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [res, setRes] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, string> | null>(null);

  const makeRequest = async (d: Record<string, string>) => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      setLoading(true);
      const response = await fetch(
        "https://gdg-qr-ticket-scanner-backend.onrender.com/api/scan",
        {
          signal,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(d),
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      await response.json();
    } catch (err) {
      alert("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  // First Effect: Parses QR Result
  useEffect(() => {
    if (success) btnRef.current?.click();

    if (res) {
      try {
        const parsedData = JSON.parse(res);
        setData(parsedData); // Updates `data` state
      } catch (e) {
        alert("Invalid QR Code! " + e);
        window.location.reload();
      }
    }
  }, [success, res]);

  // Second Effect: Triggers `makeRequest` after `data` is set
  useEffect(() => {
    if (data) {
      const requestData = {
        name: data.name,
        email: data.email,
        contact: data.phone,
        ...(data.event ? { participation: data.event } : {}),
      };
      makeRequest(requestData);
    }
  }, [data]);

  return (
    <Dialog onOpenChange={(open) => !open && window.location.reload()}>
      <DialogTrigger ref={btnRef} hidden></DialogTrigger>
      <QrReader
        scanDelay={50}
        constraints={{ facingMode: "environment" }}
        onResult={(r, e) => {
          if (r) {
            setRes(r.getText());
            console.log("Scanned QR:", r.getText());
            setSuccess(true);
          }
          if (e) console.log("Retrying...");
        }}
        videoId="video"
        videoStyle={{ width: "100dvw", height: "100dvh" }}
        videoContainerStyle={{ width: "100dvw", height: "100dvh" }}
      />
      <p className="text-2xl text-center">Scan the QR Code</p>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Success !!</DialogTitle>
          <DialogDescription>
            {success && (
              <div className="place-items-center gap-8 grid text-xl">
                <img
                  src={loading ? "/loading.gif" : "/tick.gif"}
                  alt="verified_logo"
                  className="w-[60%]"
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
      </DialogContent>
    </Dialog>
  );
};

export { Scanner };
