<?php
if (isset($_POST['Name'])
    &&isset($_POST['CompanyOrWeb'])
    &&isset($_POST['Mail'])
    &&isset($_POST['Phone'])) {
  $name = urldecode($_POST['Name']);
  $companyOrWeb = urldecode($_POST['CompanyOrWeb']);
  $mail = urldecode($_POST['Mail']);
  $phone = urldecode($_POST['Phone']);
  $message = urldecode($_POST['Message']);

  // Content-Type helps email client to parse file as HTML
  // therefore retaining styles
  $headers =  'MIME-Version: 1.0' . "\r\n";
  $headers .= 'From: X-Bot <xolution@xolution.sk>' . "\r\n";
  $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
  $subject = "New request for contact from X-Bot page";
  $message =
  "<html>
    <head>
      <title>New message from website contact form</title>
    </head>

    <body>
      <div
          style='
              display: flex;
              justify-content: center;
              align-items: center;
              font-weight: bold;
              font-size: 24px;
              color: #361252;
              margin-bottom: .3em;
              '
      >
         New message from website contact form
      </div>
      <div
          style='
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              background: #36125214;
              border-radius: 4px;
              box-shadow: 0 5px 20px -5px #36125252;
              padding: 2em;
          '
      >
          <p style='
              margin: 0;
              padding-bottom: 1em;
          '
          >
              Name: <b style='color:#361252'>" . $name . "</b></p>
          <p style='
              margin: 0;
              padding-bottom: 1em;
          '
          >
              Company or web: <b style='color:#361252'>" . $companyOrWeb . "</b></p>
          <p style='
              margin: 0;
              padding-bottom: .5;
          '
          >
              Ask for the contact from X-Bot page:</b></p>
          <div style='
              height: .1em;
              width: 46%;
              background: #F7B63E;
              margin-bottom: .5em;
          '></div>
          <p style='
              margin: 0;
              padding-bottom: 1em;
          '
          >
              Email: <b style='color:#361252'>" . $mail . "</b></p>
          <p style='
              margin: 0;
              padding-bottom: 1em;
          '
          >
              Phone: <b style='color:#361252'>" . $phone . "</b></p>
          <p style='
              margin: 0;
              padding-bottom: 1em;
          '
          >
              Message:</p>
          <p style='
              margin: 0;
              padding-bottom: 1em;
          '
          >
          <b style='color:#361252'>
              " . $message . "
          </b>

          </p>
      </div>
    </body>
  </html>";

  //if (mail('xolution@xolution.sk', $subject, $message, $headers)) {
  if (mail('maros.hajnik@xolution.sk', $subject, $message, $headers)) {
   echo json_encode(array('status' => 'success'));
  }else{
   echo json_encode(array('status' => 'error'));
  }
}
?>
