import { styled as muiStyled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { Button, Typography } from "@mui/material";
import styled from "styled-components";
import React, { useEffect } from "react";
import Typewriter from "typewriter-effect";
import Stack from "@mui/material/Stack";
import { FixedSizeList } from "react-window";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import LanguageIcon from "@mui/icons-material/Language";
import { convert2Pinyin, getFirstLetters } from "simplified-chinese";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const themeOptions = {
    palette: {
        type: "light",
        primary: {
            main: "#263238",
        },
        secondary: {
            main: "#2962ff",
        },
    },
    typography: {
        fontFamily: "Noto Sans",
        fontSize: 16,
        fontWeightLight: 300,
    },
};

const Item = muiStyled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    padding: theme.spacing(1),
    textAlign: "center",
    height: "85vh",
    overflow: "auto",
}));

const CoverText = styled.h1`
    font-size: 3rem;
    font-weight: 900;
    color: #263238;
`;

const AboutText = styled.p`
    font-size: 1.5rem;
    font-weight: 300;
    font-decoration: underline;
    padding: 0 50px 30px 50px;
`;

const ColHeader = styled.h1`
    font-size: 2rem;
    font-weight: 450;
    margin: 20px;
`;

const StartButton = muiStyled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "light" ? "#1A2027" : "#fff",
    color: theme.palette.mode === "light" ? "#fff" : "#263238",
    fontSize: "1.5rem",
    fontWeight: "900",
    width: "100%",
}));

const CharButton = muiStyled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    color: theme.palette.mode === "dark" ? "#fff" : "#263238",
    fontSize: "1.5rem",
    fontWeight: "300",
    width: "100%",
    height: "100px",
}));

const CharCol = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 400px;
`;

const CoverCol = styled.div`
    display: flex;
    width: 750px;
    margin: 50px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    height: 100%;
    width: 100%;
    gap: 100px;
`;

const CodeBlock = styled.div`
    font-family: "Consolas", "Courier New", monospace;
    font-size: 1rem;
    font-weight: 300;
    padding: 10px;
    padding-left: 20px;
    margin: 0;
    background-color: #f7f7f7;
`;

const ApiListItem = styled.div`
    border-left: 5px solid #263238;
    padding: 10px;
`;

function App() {
    const [state, setState] = React.useState(null); // null means home, true means open character mode, false means open radical mode
    const [hiddenAPI, setHiddenAPI] = React.useState(true);
    const [firstTime, setFirstTime] = React.useState(true);

    const [leftColChars, setLeftColChars] = React.useState([]);
    const [rightColChars, setRightColChars] = React.useState([]);
    const [activeChar, setActiveChar] = React.useState("");
    const [rerender, setRerender] = React.useState(false);

    const [searchQuery, setSearchQuery] = React.useState("");

    const getEverything = new Promise((resolve, reject) => {
        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        let param = "";
        if (state === null) {
            return;
        } else if (state === true) {
            param = "chars";
        } else if (state === false) {
            param = "rads";
        }

        if (firstTime) {
            param = "chars";
            console.log("yes");
        }

        fetch("http://localhost:8000/api/hantable/" + param, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                resolve(result);
            })
            .catch((error) => console.log("error", error));
    });

    const getMatches = new Promise((resolve, reject) => {
        if (activeChar === "") return;

        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        let param = "";
        if (state === null) {
            return;
        } else if (state === true) {
            param = "char";
        } else if (state === false) {
            param = "rad";
        }

        fetch(
            "http://localhost:8000/api/hantable/" + param + "/" + activeChar,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                resolve(result);
            })
            .catch((error) => console.log("error", error));
    });

    const Row = ({ index, key, style }) => (
        <CharButton
            sx={style}
            onClick={() => {
                setActiveChar(leftColChars[index]);
                setState(state === null ? true : !state);
                setRerender(!rerender);
                setFirstTime(false);
            }}
        >
            {leftColChars[index]}
        </CharButton>
    );

    useEffect(() => {
        getEverything.then((result) => {
            setLeftColChars(result.data);
        });
    }, [rerender]);

    useEffect(() => {
        getMatches.then((result) => {
            setRightColChars(result.data);
        });
    }, [rerender]);

    console.log(state);

    if (state === null) {
        return (
            <ThemeProvider theme={createTheme(themeOptions)}>
                <Box sx={{ flexGrow: 1, margin: "2vh" }}>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="add"
                        sx={{
                            position: "absolute",
                            right: "2vh",
                        }}
                        onClick={(e) => {
                            setHiddenAPI(!hiddenAPI);
                        }}
                    >
                        <LanguageIcon sx={{ mr: 1 }} />
                        {hiddenAPI ? "Reveal Hidden API" : "Hide the API"}
                    </Fab>
                    <Wrapper>
                        <CoverCol>
                            <Stack spacing={2}>
                                <CoverText>
                                    Dead Simple Chinese <br />
                                    Radical and Character Lookup.
                                </CoverText>
                                <AboutText>
                                    Look up any Chinese character and find it's
                                    composite radicals. Given any radical, find
                                    the characters it can be composed with.
                                </AboutText>
                                <br />
                                <StartButton
                                    onClick={(e) => {
                                        setState(false);
                                        setRerender(!rerender);
                                    }}
                                >
                                    <Typewriter
                                        options={{
                                            strings: [
                                                "Get Started",
                                                "开始使用",
                                                "開始使用",
                                                "はじめに",
                                                "시작하다",
                                                "Bắt đầu",
                                            ],
                                            autoStart: true,
                                            loop: true,
                                        }}
                                    />
                                </StartButton>
                            </Stack>
                        </CoverCol>
                        {hiddenAPI ? (
                            <></>
                        ) : (
                            <CoverCol>
                                <Stack spacing={2}>
                                    <ColHeader>
                                        Feeling Technical Instead?
                                    </ColHeader>
                                    <AboutText>
                                        Use the API instead, and bake your own
                                        solution.
                                    </AboutText>
                                    <br />
                                    <br />
                                    <ApiListItem>
                                        Fetch the radicals that compose the
                                        character 国
                                        <CodeBlock>
                                            /api/hantable/char/国
                                        </CodeBlock>
                                        <br />
                                        Sample return:
                                        <CodeBlock>
                                            {
                                                '{"message":"success","data":["囗","玉"]}'
                                            }
                                        </CodeBlock>
                                    </ApiListItem>
                                    <ApiListItem>
                                        Fetch the characters that contain the
                                        radical 玉
                                        <CodeBlock>
                                            /api/hantable/rad/玉
                                        </CodeBlock>
                                        <br />
                                        Sample return:
                                        <CodeBlock>
                                            {
                                                '{"message":"success","data":["国","宝","玺","珏","琞","琧",...]}'
                                            }
                                        </CodeBlock>
                                    </ApiListItem>
                                </Stack>
                            </CoverCol>
                        )}
                    </Wrapper>
                </Box>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={createTheme(themeOptions)}>
            <Box sx={{ flexGrow: 1, margin: "2vh" }}>
                <Fab
                    variant="extended"
                    size="medium"
                    color="primary"
                    aria-label="add"
                    sx={{
                        position: "absolute",
                        right: "2vh",
                    }}
                    onClick={(e) => {
                        setState(!state);
                        setRerender(!rerender);
                    }}
                >
                    <LanguageIcon sx={{ mr: 1 }} />
                    Search for matching {state ? "Characters" : "Radicals"}{" "}
                    instead
                </Fab>
                <Wrapper>
                    <CharCol>
                        {activeChar === "" ? ( // if no active character set, load entire table into left column
                            leftColChars.length === 0 ? ( // if not loaded yet
                                <CircularProgress />
                            ) : (
                                // once entire table loaded
                                <>
                                    <ColHeader>Select a Character</ColHeader>
                                    <TextField
                                        id="search-query"
                                        key="search-query"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                setActiveChar(e.target.value);
                                                setRerender(!rerender);
                                                setState(
                                                    state === null
                                                        ? true
                                                        : !state
                                                );
                                                setSearchQuery("");
                                            }
                                        }}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                        }}
                                        autoFocus
                                    />
                                    <Item>
                                        <FixedSizeList
                                            width={400} // see style for leftcol
                                            height={0.85 * window.innerHeight} // see Item style to see it occupies 85% of height
                                            itemCount={leftColChars.length}
                                            itemSize={100}
                                        >
                                            {Row}
                                        </FixedSizeList>
                                    </Item>
                                </>
                            )
                        ) : (
                            // if active character selected, display it as such and query right col // TODO: option to clear active char
                            <>
                                <ColHeader>
                                    Selected
                                    {/* state ? " Character" : " Radical" */}:{" "}
                                    {activeChar}{" "}
                                    {convert2Pinyin(activeChar).trim() === ""
                                        ? ""
                                        : " (" +
                                          convert2Pinyin(
                                              activeChar
                                          ).toLowerCase() +
                                          ")"}
                                </ColHeader>
                                <TextField
                                    id="search-query"
                                    key="search-query"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            setActiveChar(e.target.value);
                                            setRerender(!rerender);
                                            setState(
                                                state === null ? true : !state
                                            );
                                            setSearchQuery("");
                                        }
                                    }}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                    }}
                                    autoFocus
                                />
                                <Item>
                                    <FixedSizeList
                                        width={450} // see xs prop in Grid item to see that it occupies 1/3d of width
                                        height={0.85 * window.innerHeight} // see Item style to see it occupies 85% of height
                                        itemCount={leftColChars.length}
                                        itemSize={100}
                                    >
                                        {Row}
                                    </FixedSizeList>
                                </Item>
                            </>
                        )}
                    </CharCol>
                    <CharCol>
                        {activeChar === "" ? (
                            <>Nothing Selected Yet</>
                        ) : rightColChars.length === 0 ? ( // if not loaded yet
                            <>
                                <ColHeader>
                                    Matching {state ? "Radicals" : "Characters"}
                                    :{" "}
                                </ColHeader>
                                <Item>
                                    <Container sx={{ width: 450 }}>
                                        <br />
                                        <br />
                                        <br />
                                        <CircularProgress />
                                        <br />
                                        <br />
                                        <br />
                                        If the data is not loading, <br />
                                        there may be no matches!
                                    </Container>
                                </Item>
                            </>
                        ) : (
                            // once entire table loaded
                            <>
                                <ColHeader>
                                    Matching {state ? "Radicals" : "Characters"}
                                </ColHeader>
                                <Item>
                                    <Stack sx={{ width: 450 }}>
                                        {rightColChars.map((char) => (
                                            <CharButton
                                                onClick={() => {
                                                    setActiveChar(char);
                                                    setState(
                                                        state === null
                                                            ? true
                                                            : !state
                                                    );
                                                    setRerender(!rerender);
                                                }}
                                            >
                                                {char}
                                            </CharButton>
                                        ))}
                                    </Stack>
                                </Item>
                            </>
                        )}
                    </CharCol>
                </Wrapper>
            </Box>
        </ThemeProvider>
    );
}

export default App;
