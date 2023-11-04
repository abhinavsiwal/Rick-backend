const Imap = require("node-imap");
const simpleParser = require("mailparser").simpleParser;
exports.emailHandler = () => {
  const imap = new Imap({
    user: "dagarharish931@gmail.com",
    password: "khaa blfv tkkd qinh",
    host: "imap.gmail.com",
    port: 993, // IMAPS (secure IMAP) port
    tls: true,
  });

  imap.once("ready", () => {
    imap.openBox("INBOX", false, (err, mailbox) => {
      if (err) {
        res.status(500).json({ error: "Error opening mailbox" });
        return;
      }

      const fetchOptions = {
        bodies: ['HEADER.FIELDS (FROM)','TEXT'],
        struct: true,
      };

      const messages = [];

      console.log("mailbox.messages.total:", mailbox.messages.total);

      const fetch = imap.seq.fetch(`1:*`, fetchOptions);
      fetch.on("message", (msg) => {
        msg.on("body", (stream) => {
          let buffer = "";
          stream.on("data", (chunk) => {
            buffer += chunk.toString("utf8");
          });

          stream.on("end", () => {
            // Parse email data as needed

            simpleParser(buffer, (err, parsed) => {
              if (err) {
                console.error("Error parsing email:", err);
                return;
              }

              emailData = {
                to: parsed?.headers?.get("from")?.text?.match(/<(.*)>/)[1]|| "",
                text: parsed.text,
                // html: parsed.html,
              };
              console.log("emailData:", emailData);
              messages.push(emailData);
            });
          });
        });
      });

      fetch.once("end", () => {
        // console.log(messages);
        imap.end();
      });
    });
  });

  imap.connect();
};
