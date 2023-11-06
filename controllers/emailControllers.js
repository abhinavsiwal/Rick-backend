const Imap = require("node-imap");
const simpleParser = require("mailparser").simpleParser;
const Email = require("../models/Email");
const { cities } = require("../constants/cities");
const imap = new Imap({
  user: "dagarharish931@gmail.com",
  password: "khaa blfv tkkd qinh",
  host: "imap.gmail.com",
  port: 993, // IMAPS (secure IMAP) port
  tls: true,
});

imap.once("ready", async () => {
  imap.openBox("INBOX", false, (err, mailbox) => {
    if (err) {
      console.error("Error opening mailbox:", err);
      return;
    }

    // Create an IMAP IDLE connection to listen for new messages
    imap.on("mail", async (numNewMsgs) => {
      console.log("numNewMsgs:", numNewMsgs);
      // Fetch the latest email address from the new email(s) and save it to MongoDB
      const fetch = imap.seq.fetch(
        mailbox.messages.total - numNewMsgs + 1 + ":*",
        {
          bodies: "",
          struct: true,
        }
      );
      fetch.on("message", async (msg) => {
        msg.on("body", async (stream) => {
          let buffer = "";

          stream.on("data", async (chunk) => {
            buffer += chunk.toString("utf8");
          });

          stream.on("end", () => {
            simpleParser(buffer, async (err, parsed) => {
              if (err) {
                console.error("Error parsing email:", err);
                return;
              }

              emailData = {
                from:
                  parsed?.headers?.get("from")?.text?.match(/<(.*)>/)[1] || "",
                text: parsed.text,
                date: parsed.date,
              };

              try {
                const emailDomain = emailData.from.split("@")[1];
                console.log(emailDomain);
                if (emailDomain !== "applore.in") {
                  console.log("Email domain is not applore.in");
                  return;
                }

                cities.forEach((city) => {
                  if (emailData.text.includes(city)) {
                    emailData.city = city;
                  }
                });

                const email = new Email(emailData);
                await email.save();
                console.log("Email saved to MongoDB:", email);
              } catch (error) {
                console.log(error);
              }
            });
          });
        });
      });
    });
  });
});

imap.connect();
