import React from "react";
import LogoHES from "../assets/HESLOGO.png"; // with import
import {motion} from "framer-motion"

export default function About(props) {
    return (
        <div className="place">

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
        </div>
    );
}