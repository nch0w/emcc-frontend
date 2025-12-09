import React from "react";

import { Typography } from "@material-ui/core";
import { Grid, Card, CardMedia, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// a set of app-wide constants in 1 place

// previously the configuration info was everywhere
// and I found it difficult and time-consuming
// to find them all and update them each year
// and sometimes even in-between the same year

// ironically, this file is called 'constants', but
// it's the one that changes from year to year

// contest year and date
export const contestYear = 2026;
export const contestDate = "January 18th, 2026";

// limits on teams and individuals per coach (used for display, NOT calculation)
// all limit calculation happens server-side
export const maxIndivsPerCoach = 3;
export const maxTeamsPerCoach = 3;
export const minTeamMembersPerTeam = 2;
export const maxTeamMembersPerTeam = 4;

// the EMCC server URL
export const emccServerUrl =
  //process.env.REACT_APP_SERVER_URL || "https://exetermathclub.com/api";
  process.env.REACT_APP_SERVER_URL || "http://localhost:3000/api";

export const pageWidth = 900;

const contactInfoStyles = makeStyles({
  media: {
    height: 200
  }
});

const members = [
  {
    name: "Benny Wang",
    email: "bbwang@exeter.edu",
    role: "Tournament Director"
  },
  {
    name: "Grant Blitz",
    email: "gblitz@exeter.edu"
  },
  {
    name: "Albert Lu",
    email: "aklu@exeter.edu"
  },
  {
    name: "Evan Fan",
    email: "etfan@exeter.edu"
  },
  {
    name: "Harini Venkatesh",
    email: "hvenkatesh@exeter.edu"
  },
  {
    name: "Michael Yang",
    email: "mmyang@exeter.edu"
  }
];

// names, emails, and picture locations of the current EMCC directors and web/registration guy
export const ContactInfo = () => {
  const classes = contactInfoStyles();
  return (
    <Grid container spacing={3}>
      {members.map((member) => (
        <Grid item xs={4}>
          <Card>
            {member.image && (
              <CardMedia
                className={classes.media}
                image={require(`./assets/${member.image}`)}
                title="Sanath Govindarajan"
              />
            )}
            <CardContent>
              <Typography variant="body1">
                <b>{member.name}</b>
                {member.role ? (
                  <>
                    <br />
                    {member.role}
                  </>
                ) : (
                  ""
                )}
                <br />
                Email: <a href={`mailto:${member.email}`}>{member.email}</a>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const archiveURLs = [
  {
    year: "2025",
    links: [
      "/papers/emcc25results.pdf",
      "/papers/emcc25speed.pdf",
      "/papers/emcc25accuracy.pdf",
      "/papers/emcc25team.pdf",
      "/papers/emcc25guts.pdf",
      "/papers/emcc25answers.pdf",
      "/papers/emcc25solutions.pdf"
    ],
    labels: [
      "Results",
      "Speed Round",
      "Accuracy Round",
      "Team Round",
      "Guts Round",
      "Answers",
      "Solutions & Acknowledgements"
    ]
  },
  {
    year: "2024",
    links: ["/papers/results-2024.pdf", "/papers/emcc24all.pdf"],
    labels: ["Results", "Full document"]
  },
  {
    year: "2023",
    links: ["/papers/emcc23all.pdf"],
    labels: ["Full document"]
  },
  {
    year: "2022",
    links: ["/papers/emcc22all.pdf"],
    labels: ["Full document"]
  },
  {
    year: "2021",
    links: [
      "/papers/emcc21speed.pdf",
      "/papers/emcc21accuracy.pdf",
      "/papers/emcc21team.pdf",
      "/papers/emcc21guts.pdf",
      "/papers/emcc21speedsol.pdf",
      "/papers/emcc21accuracysol.pdf",
      "/papers/emcc21teamsol.pdf",
      "/papers/emcc21gutsans.pdf",
      "/papers/emcc21results.pdf"
    ],
    labels: [
      "Speed Round",
      "Accuracy Round",
      "Team Round",
      "Guts Round",
      "Speed Solutions",
      "Accuracy Solutions",
      "Team Solutions",
      "Guts Answers",
      "Statistics"
    ]
  },
  {
    year: "2020",
    links: ["/papers/emcc20all.pdf"],
    labels: ["Full document"]
  },
  {
    year: "2019",
    links: ["/papers/emcc19all.pdf", "/papers/emcc19results.pdf"],
    labels: ["Full document", "Results"]
  },
  {
    year: "2018",
    links: ["/papers/emcc18all.pdf"],
    labels: ["Full document"]
  },
  {
    year: "2017",
    links: ["/papers/emcc17all.pdf", "/papers/emcc17results.pdf"],
    labels: ["Full document", "Results"]
  },
  {
    year: "2016",
    links: ["/papers/emcc16all.pdf", "/papers/emcc16results.pdf"],
    labels: ["Full document", "Results"]
  },
  {
    year: "2015",
    links: ["/papers/emcc15all.pdf", "/papers/emcc15results.pdf"],
    labels: ["Full document", "Results"]
  },
  {
    year: "2014",
    links: ["/papers/emcc14all.pdf"],
    labels: ["Full document"]
  },
  {
    year: "2013",
    links: ["/papers/emcc13all.pdf"],
    labels: ["Full document"]
  },
  {
    year: "2012",
    links: ["/papers/emcc12all.pdf"],
    labels: ["Full document"]
  },
  {
    year: "2011",
    links: ["/papers/emcc11all.pdf"],
    labels: ["Full document"]
  },
  {
    year: "2010",
    links: ["/papers/emcc10all.pdf"],
    labels: ["Full document"]
  }
];
export const ArchiveList = () => {
  return (
    <div className="archive-list">
      <Grid container spacing={3}>
        {archiveURLs.map((entry) => (
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Typography variant="h5">
                  <b>{entry.year}</b>
                  <br />
                </Typography>
                {entry.links.length > 0 && (
                  <div>
                    {entry.links.map((link, idx) => (
                      <div key={idx} className="archive-entry">
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {entry.labels[idx]}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

// instructions for coaches to send their checks (may change)
export const CheckInstructions = () => {
  return (
    <div>
      Please make a check payable to
      <br />
      <b>Phillips Exeter Academy, Attn. Exeter Math Club Competition</b>
      <br />
      and mail it to:
      <br />
      <br />
      Zuming Feng
      <br />
      20 Main Street
      <br />
      Exeter, NH 03833
      <br />
      <br />
      We do not currently accept PayPal or other forms of electronic payment.
    </div>
  );
};
