import logo from "./logo.svg";
import "./App.css";
import BasicButtons from "./tast";
import { createTheme, Typography } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { useEffect, useState } from "react";
//material ui components
import Container from "@mui/material/Container";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
//EXTERNAL LIBRARIES
import axios from "axios";
import moment from "moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});
let cancelAxios = null;
function App() {
  const { t, i18n } = useTranslation();
  const [dateAndTime, setDateAndTime] = useState("");
  const [locale, setLocale] = useState("ar");
  const direction = locale === "en" ? "ltr" : "rtl";
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  // EVENT HANDELARS
  function handleLangugeClick() {
    if (locale === "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocale("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setDateAndTime(moment().format("dddd Do - YYYY"));
  }
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, []);
  useEffect(() => {
    // Make a request for a user with a given ID

    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=24.470901&lon=39.612236&appid=b7bce6c561e00b191a4f9bba3300be09",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        // handle success

        const responseTemp = Math.round(response.data.main.temp - 272.15);
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;
        setTemp({
          number: responseTemp,
          min,
          max,
          description,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
      })
      .catch(function (error) {
        // handle error
        // console.log(error);
      })
      .finally(function () {
        // always executed
      });
    return () => {
      cancelAxios();
    };
  }, []);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm" style={{}}>
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {/*CARD*/}
            <div
              style={{
                backgroundColor: "rgb(28 52 91 /26%)",
                color: "white",
                padding: "10px",
                borderRadius: "10px",
                width: "100%",
                boxShadow: "0 11px 1px rgba(0,0,0,0.05)",
              }}
            >
              {/*CONTENT*/}
              <div>
                {/*CITY &TIMA*/}
                <div
                  dir={direction}
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start",
                  }}
                >
                  <Typography
                    variant="h2"
                    style={{ marginRight: "20px", fontWeight: 600 }}
                  >
                    {t("Medina")}
                  </Typography>
                  <Typography variant="h5" style={{ marginRight: "20px" }}>
                    {dateAndTime}
                  </Typography>
                </div>
                {/*---CITY &TIMA---*/}
                <hr />
                {/* CONTAINER OF DIGREE & ICON */}
                <div
                  dir={direction}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  {/* DEGREE & DESCRIPTION */}
                  <div>
                    {/* TIMP */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="h1" style={{ textAlign: "right" }}>
                          {temp.number}
                        </Typography>
                        <img src={temp.icon} />
                      </div>
                      <Typography
                        variant="h6"
                        style={{ textAlign: locale == "ar" ? "right" : "left" }}
                      >
                        {t(temp.description)}
                      </Typography>
                      {/* MIN & MAX */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h5>
                          {t("min")}: {temp.min}{" "}
                        </h5>
                        <h5 style={{ margin: "0px 5px" }}>|</h5>

                        <h5>
                          {t("max")} : {temp.max}
                        </h5>
                      </div>
                      {/* ---MIN & MAX--- */}
                    </div>
                    {/* ---TIMP--- */}
                  </div>
                  {/* ---DEGREE & DESCRIPTION---*/}
                  {/* ICON */}
                  <CloudIcon style={{ fontSize: "200px", color: "white" }} />
                  {/* ---ICON--- */}
                  {/* ---CONTAINER OF DIGREE & ICON--- */}
                </div>
              </div>
              {/*---CONTENT---*/}
            </div>
            {/*---CARD---*/}
            {/*TRANSITION CONTAINER*/}
            <div
              dir={direction}
              style={{ width: "100%", display: "flex", justifyContent: "end" }}
            >
              <Button
                variant="text"
                style={{ color: "white", marginTop: "20px" }}
                onClick={handleLangugeClick}
              >
                {locale === "en" ? "Arabic" : "إنجليزي"}
              </Button>
            </div>
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
