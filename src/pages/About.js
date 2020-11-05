import React from "react";
import LogoHES from "../assets/HESLOGO.png"; // with import
import {motion} from "framer-motion"
import styled from "styled-components";

const Container = styled.div`
  h1 {
    color: #24B9B6;
    text-align: center;
    background-color:#282c34;
    border: 2px solid white;
    border-radius: 8px;
    padding:0.5em;
    margin: 0.5em;
  }
    h2 {
    padding:0.5em;
    margin: 0.5em;
    color: #00ace6;
  }
    h4 {
    color: #24B9B6;
    padding:0.5em;
    margin: 0.5em;
    font-style: italic;
  }
`


export default function About(props) {
    return (
        <div className="place">
            <Container>

                <h1>About</h1>

                <motion.div
                    animate={{
                        scale: 1.1,
                        rotate: [0, 10, 10, 10, 0],
                        borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                    }}
                    transition={{duration: 5}}
                >
                    <h2>Developed by Mickaël, Ludovic & Brice</h2>
                </motion.div>

                <motion.div
                    animate={{
                        scale: [1, 2, 2, 1, 1],
                        rotate: [0, 0, 360, 360, 0],
                        borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                    }}
                    transition={{duration: 5}}
                >
                    <h4>Boosted by:</h4>
                    <img width="200px" height="60px" src={LogoHES} alt="Logo HES-SO Valais-Wallis"></img>
                </motion.div>
                <motion.div
                    animate={{
                        scale: [1, 2, 2, 1, 1],
                        rotate: [0, 0, 10, 10, 0],
                        borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                    }}
                    transition={{duration: 5}}
                >
                    <h4>Source code:</h4>
                    <a href="https://github.com/Mcpwko/OpenSunday-FrontEnd">Github</a>
                </motion.div>
            </Container>
        </div>
    );
}