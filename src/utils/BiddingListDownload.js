import * as Print from 'expo-print';

import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

// export const handleAdminDownload = async (item) => {
//   try {
//     // Construct HTML content dynamically based on item data
//     const htmlContent = `
//    <html lang="en">
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <title>Bid Data</title>
//    <style>
//  body {
//     font-family: Arial, sans-serif;
//     padding: 0;
//     margin: 0;
// }

// .header {
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 20px;
//     padding-left: 20px;
//     padding-right: 30px;
//     background-color: rgba(238, 238, 238, 1);

// }

// .header_logo {
//     justify-content: space-between;
//     align-items: center;
//     display: flex;
// }

// .company-name {
//     font-size: 24px;
//     font-weight: bold;
//     padding-left: 20px;
//     margin: 0; /* Remove default margin */
// }

// .itemContainer {
//     align-items: center;
//     margin-bottom: 10px; /* Adjust margin to reduce spacing */
//     display: flex;

//     width: 600px;
//         gap: 10px;
// }
// .itemContainer > div {
//     text-align: center; /* Center text horizontally */
//     flex: 1; /* Allow items to grow and shrink as needed */
//     display: flex; /* Enable flexbox for the child div */
//     flex-direction: row; /* Display items in a row */
//     justify-content: center; /* Center items horizontally */
//     align-items: center; /* Center items vertically */
// }

// .itemContainer > div {
//     margin-right: 10px; /* Add space between items */
//     gap: 10px;
// }

// .itemContainer h5 {
//     margin: 0; /* Remove default margin */
// }
// table {
//     width: 100%;
//     border-collapse: collapse;
//     margin-bottom: 20px;
//      margin-left: 20PX;
// margin-right: 20px;
// }

// th,
// td {
//     border-bottom: 1px solid #dddddd; /* Only bottom border */
//     padding: 8px;
//     text-align: left;
// }

// th {
//     background-color: #f2f2f2;
// }

//     </style>
// </head>

// <body>
//     <div class="header">
//         <div class="header_logo">
//             <div class="company-name">    <h4>${item?.ProjectName}</h4> </div>
//              <h4>GIGA GROUP</h4>
//         </div>

//         <div class="itemContainer">
//             <div class="">
//                 <h5>${item?.PropertyType}</h5>
//             </div>
//             <div>
//                 <h5>${item?.unit}</h5>
//                 <h5>Unit</h5>
//             </div>
//             <div class="">
//                 <h5>${item?.bedrooms}</h5>
//                 <h5>Bedroom</h5>
//             </div>
//         </div>
//         <div class="">
//             <p>${item?.description}</p>
//         </div>

//         <div class="header_logo">
//             <h4>Starting Bidding Price</h4>
//             <h4>${item?.price}PKR</h4>
//         </div>
//     </div>
//     <table>
//         <thead>
//             <tr>
//                 <th>Users</th>
//                 <th>Bidding Call</th>
//                 <th>Status</th>
//             </tr>
//         </thead>
//         <tbody>
//               <tr>
//                     <td>${item?.winner?.bidBy[0]?.fullName}</td>
//                     <td>${item?.winner?.bidPrice}PKR</td>
//                     <td>Winner</td>
//                 </tr>
//           ${item?.bids
//             .filter((bid) => bid._id !== item?.winner?._id) // Filter out the winner from the bids
//             .map(
//               (bid) => `
//                     <tr>
//                         <td>${bid.bidBy[0].fullName}</td>
//                         <td>${bid.bidPrice}PKR</td>
//                         <td>N/A</td>
//                     </tr>
//                 `,
//             )
//             .join('')}
//         </tbody>
//     </table>
// </body>
// </html>

//             `;

//     // Generate PDF file
//     const { uri } = await Print.printToFileAsync({
//       html: htmlContent,
//       width: 612, // 8.5 inch
//       height: 792, // 11 inch
//     });

//     const pdfUri = Platform.OS === 'ios' ? uri : 'file://' + uri; // Adjust URI for Android
//     // console.log('PDF URI:', pdfUri);

//     // Share PDF file
//     await Sharing.shareAsync(pdfUri, {
//       mimeType: 'application/pdf',
//       dialogTitle: 'Share PDF',
//       UTI: 'com.adobe.pdf',
//     });
//   } catch {
//     // console.error('Error generating PDF:', error);
//   }
// };

// export const handleUserDownload = async (item) => {
//   try {
//     // Construct HTML content dynamically based on item data
//     const htmlContent = `
//    <html lang="en">
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <title>Bid Data</title>
//    <style>
//  body {
//     font-family: Arial, sans-serif;
//     padding: 0;
//     margin: 0;
// }

// .header {
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 20px;
//     padding-left: 20px;
//     padding-right: 30px;
//     background-color: rgba(238, 238, 238, 1);

// }

// .header_logo {
//     justify-content: space-between;
//     align-items: center;
//     display: flex;
// }

// .company-name {
//     font-size: 24px;
//     font-weight: bold;
//     padding-left: 20px;
//     margin: 0; /* Remove default margin */
// }

// .itemContainer {
//     align-items: center;
//     margin-bottom: 10px; /* Adjust margin to reduce spacing */
//     display: flex;

//     width: 600px;
//         gap: 10px;
// }
// .itemContainer > div {
//     text-align: center; /* Center text horizontally */
//     flex: 1; /* Allow items to grow and shrink as needed */
//     display: flex; /* Enable flexbox for the child div */
//     flex-direction: row; /* Display items in a row */
//     justify-content: center; /* Center items horizontally */
//     align-items: center; /* Center items vertically */
// }

// .itemContainer > div {
//     margin-right: 10px; /* Add space between items */
//     gap: 10px;
// }

// .itemContainer h5 {
//     margin: 0; /* Remove default margin */
// }
// table {
//     width: 100%;
//     border-collapse: collapse;
//     margin-bottom: 20px;
//      margin-left: 20PX;
// margin-right: 20px;
// }

// th,
// td {
//     border-bottom: 1px solid #dddddd; /* Only bottom border */
//     padding: 8px;
//     text-align: left;
// }

// th {
//     background-color: #f2f2f2;
// }

//     </style>
// </head>

// <body>
//     <div class="header">
//         <div class="header_logo">
//             <div class="company-name">    <h4>${item?.ProjectName}</h4> </div>
//              <h4>GIGA GROUP</h4>
//         </div>

//         <div class="itemContainer">
//             <div class="">
//                 <h5>${item?.PropertyType}</h5>
//             </div>
//             <div>
//                 <h5>${item?.unit}</h5>
//                 <h5>Unit</h5>
//             </div>
//             <div class="">
//                 <h5>${item?.bedrooms}</h5>
//                 <h5>Bedroom</h5>
//             </div>
//         </div>
//         <div class="">
//             <p>${item?.description}</p>
//         </div>

//         <div class="header_logo">
//             <h4>Starting Bidding Price</h4>
//             <h4>${item?.price}PKR</h4>
//         </div>
//     </div>
//     <table>
//         <thead>
//             <tr>
//                 <th>Users</th>
//                 <th>Bidding Call</th>
//                 <th>Status</th>
//             </tr>
//         </thead>
//         <tbody>
//               <tr>
//                     <td>${item?.winner?.bidBy[0]?.code}</td>
//                     <td>${item?.winner?.bidPrice}PKR</td>
//                     <td>Winner</td>
//                 </tr>
//           ${item?.bids
//             .filter((bid) => bid._id !== item?.winner?._id) // Filter out the winner from the bids
//             .map(
//               (bid) => `
//                     <tr>
//                         <td>${bid.bidBy[0].code}</td>
//                         <td>${bid.bidPrice}PKR</td>
//                         <td>N/A</td>
//                     </tr>
//                 `,
//             )
//             .join('')}
//         </tbody>
//     </table>
// </body>
// </html>

//             `;

//     // Generate PDF file
//     const { uri } = await Print.printToFileAsync({
//       html: htmlContent,
//       width: 612, // 8.5 inch
//       height: 792, // 11 inch
//     });

//     const pdfUri = Platform.OS === 'ios' ? uri : 'file://' + uri; // Adjust URI for Android
//     // console.log('PDF URI:', pdfUri);

//     // Share PDF file
//     await Sharing.shareAsync(pdfUri, {
//       mimeType: 'application/pdf',
//       dialogTitle: 'Share PDF',
//       UTI: 'com.adobe.pdf',
//     });
//   } catch {
//     // console.error('Error generating PDF:', error);
//   }
// };
export const handleUserDownload = async (item) => {
  try {
    // Construct HTML content dynamically based on item data
    const htmlContent = `
   <html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bid Data</title>
   <style>
 body {
    font-family: Arial, sans-serif;
    padding: 0;
    margin: 0;
}

.header {
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-left: 20px;
    padding-right: 30px;
    background-color: rgba(238, 238, 238, 1);
}

.header_logo {
    justify-content: space-between;
    align-items: center;
    display: flex;
}

.company-name {
    font-size: 24px;
    font-weight: bold;
    padding-left: 20px;
    margin: 0;
}

.itemContainer {
    align-items: center;
    margin-bottom: 10px;
    display: flex;
    width: 600px;
    gap: 10px;
}
.itemContainer > div {
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.itemContainer > div {
    margin-right: 10px;
    gap: 10px;
}

.itemContainer h5 {
    margin: 0;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    margin-left: 20px;
    margin-right: 20px;
}

th,
td {
    border-bottom: 1px solid #dddddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

    </style>
</head>

<body>
  <div class="header">
            <div class="header_logo">
                <div class="company-name">
                    <h4>${item?.projectName}</h4>
                </div>
                <h4>GIGA GROUP</h4>
            </div>
            </div>
${item?.projectItems
  .map(
    (project) => `
    <div>
   
        <table>
            <thead>
                <tr>
                    <th>Users</th>
                    <th>Project </th>
                    <th>Property Type</th>
                    <th>Bidding Call</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${project?.bids
                  .map(
                    (bid) => `
                    <tr>
                        <td>${bid.bidBy.map((user) => user.code).join(', ')}</td>
                        <td>${bid?.bidOn?.ProjectName}</td>
                     
                        <td>${bid?.bidOn?.PropertyType}</td>

                        <td>${bid.bidPrice}PKR</td>
                        <td>${bid._id === project?.winner?._id ? 'Winner' : 'N/A'}</td>
                    </tr>
                `,
                  )
                  .join('')}
            </tbody>
        </table>
    </div>
`,
  )
  .join('')}
</body>
</html>
    `;

    // Generate PDF file
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      width: 612, // 8.5 inch
      height: 792, // 11 inch
    });

    const pdfUri = Platform.OS === 'ios' ? uri : 'file://' + uri; // Adjust URI for Android
    // console.log('PDF URI:', pdfUri);

    // Share PDF file
    await Sharing.shareAsync(pdfUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share PDF',
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const handleAdminDownload = async (item) => {
  try {
    // Construct HTML content dynamically based on item data
    const htmlContent = `
   <html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bid Data</title>
   <style>
 body {
    font-family: Arial, sans-serif;
    padding: 0;
    margin: 0;
}

.header {
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-left: 20px;
    padding-right: 30px;
    background-color: rgba(238, 238, 238, 1);
}

.header_logo {
    justify-content: space-between;
    align-items: center;
    display: flex;
}

.company-name {
    font-size: 24px;
    font-weight: bold;
    padding-left: 20px;
    margin: 0;
}

.itemContainer {
    align-items: center;
    margin-bottom: 10px;
    display: flex;
    width: 600px;
    gap: 10px;
}
.itemContainer > div {
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.itemContainer > div {
    margin-right: 10px;
    gap: 10px;
}

.itemContainer h5 {
    margin: 0;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    margin-left: 20px;
    margin-right: 20px;
}

th,
td {
    border-bottom: 1px solid #dddddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

    </style>
</head>

<body>
  <div class="header">
            <div class="header_logo">
                <div class="company-name">
                    <h4>${item?.projectName}</h4>
                </div>
                <h4>GIGA GROUP</h4>
            </div>
            </div>
${item?.projectItems
  .map(
    (project) => `
    <div>
   
        <table>
            <thead>
                <tr>
                    <th>Users</th>
                    <th>Project </th>
                    <th>Property Type</th>
                    <th>Bidding Call</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${project?.bids
                  .map(
                    (bid) => `
                    <tr>
                        <td>${bid.bidBy.map((user) => user?.fullName).join(', ')}</td>
                        <td>${bid?.bidOn?.ProjectName}</td>
                     
                        <td>${bid?.bidOn?.PropertyType}</td>

                        <td>${bid.bidPrice}PKR</td>
                        <td>${bid._id === project?.winner?._id ? 'Winner' : 'N/A'}</td>
                    </tr>
                `,
                  )
                  .join('')}
            </tbody>
        </table>
    </div>
`,
  )
  .join('')}
</body>
</html>
    `;

    // Generate PDF file
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      width: 612, // 8.5 inch
      height: 792, // 11 inch
    });

    const pdfUri = Platform.OS === 'ios' ? uri : 'file://' + uri; // Adjust URI for Android
    // console.log('PDF URI:', pdfUri);

    // Share PDF file
    await Sharing.shareAsync(pdfUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share PDF',
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
