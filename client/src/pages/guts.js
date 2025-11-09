// import React, { useContext, useState, useEffect } from "react";

// import { Box, Typography } from "@material-ui/core";

// import { SContent } from "../styled_components";

// import { io } from "socket.io-client";
// Array((3-(importData.length % 3))%3).fill(0).map(() => <div style={{flexGrow: '1',width: '400px', height: '50px', margin:'auto'}}><div style={{display: "inline-block", width: '50%', height: '50px', margin: 'auto', textAlign: 'center', border: 'solid 2px black', borderRight: '0px', paddingTop: '10px'}}></div><div style={{display: 'inline-block', width: '50%', height: '50px', margin: 'auto', textAlign: 'center', border: 'solid 2px black', borderLeft: '0px', paddingTop: '10px'}}></div></div>)
//             {Array(20)
//               .fill(0)
//               .map(() => (
//                 <div style={{ width: "400px", flexGrow: "1" }}></div>
//               ))}
//           </div>
//         }
//       </SContent>
//     </Box>
//   );
// };

// const socket = io("https://exetermathclub.com", { path: "/api/socket.io" });

// const Guts = () => {
//   const [lastTimestamp, setLastTimestamp] = useState(new Date());
//   const [importData, setImportData] = useState([]);
//   useEffect(() => {
//     console.log("connecting to network");
//     return () => {
//       console.log("disconnecting from network");
//     };
//   });
//   useEffect(() => {
//     socket.on("data transfer", (payload) => {
//       setLastTimestamp(new Date());
//       setImportData(payload);
//     });
//   }, []); //only re-run the effect if new message comes in

//   return (
//     <Box>
//       <SContent>
//         <br />
//         <Typography variant="h3" align="center">
//           Guts Live Scoreboard
//         </Typography>
//         <br />
//         {
//           <div
//             style={{
//               display: "flex",
//               flexFlow: "row wrap",
//               justifyContent: "space-between",
//               border: "solid 2px black",
//               borderWidth: "4px 0px 0px 4px"
//             }}
//           >
//             {importData.map((team) => (
//               <div
//                 style={{
//                   flexGrow: "1",
//                   width: "400px",
//                   height: "50px",
//                   margin: "auto"
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "inline-block",
//                     width: "50%",
//                     height: "50px",
//                     margin: "auto",
//                     textAlign: "center",
//                     border: "solid 2px black",
//                     borderWidth: "0px 2px 4px 0px",
//                     paddingTop: "10px"
//                   }}
//                 >
//                   {team.name}
//                 </div>
//                 <div
//                   style={{
//                     display: "inline-block",
//                     width: "50%",
//                     height: "50px",
//                     margin: "auto",
//                     textAlign: "center",
//                     border: "solid 2px black",
//                     borderWidth: "0px 4px 4px 0px",
//                     paddingTop: "10px"
//                   }}
//                 >
//                   {team.score}
//                 </div>
//               </div>
//             ))}
//             {*/ const Guts = () => {};

// export default Guts;
