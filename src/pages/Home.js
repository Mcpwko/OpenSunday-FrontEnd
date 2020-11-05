import React from "react";
import Carousel from 'react-bootstrap/Carousel'
import "./Home.css";
import {Link} from "react-router-dom";
import {NavLink} from "reactstrap";
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
  h5 {
  color: #24B9B6;
  }
`

export default function Home() {

    return (
        <>
            <Container>
                <h1>Welcome on OpenSunday</h1>
                <div className="slideDiv">
                    <Carousel>
                        <Carousel.Item interval={3800}>
                            <img
                                className="slide"
                                src={require('../assets/Screen1.PNG')}
                                alt="First slide"
                            />
                            <Carousel.Caption>
                                <h3>Discover places open on Sunday and on special days</h3>
                                <h5>Find the coolest or most needed places and their information</h5>

                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={3800}>
                            <img
                                className="slide"
                                src={require('../assets/Screen3.png')}
                                alt="Second slide"
                            />
                            <Carousel.Caption>
                                <h3>Choose only the types of place that fits you</h3>
                                <h5>Tick the cases and find only the places you are interesting in</h5>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item interval={3800}>
                            <img
                                className="slide"
                                src={require('../assets/Screen2.PNG')}
                                alt="Third slide"
                            />
                            <Carousel.Caption>
                                <h3>Add the places you want</h3>
                                <h5>Enter information of your favorite place and help the community find the best places
                                    open
                                    on
                                    sunday or on special days</h5>
                            </Carousel.Caption>
                        </Carousel.Item>

                    </Carousel>

                    <h5>By navigating on this website, you agree to our
                        <Link to="/terms-of-use"> terms of use</Link>
                    </h5>

                </div>


                <div className="buttonsMap">
                    <Link
                        className="App-link"
                        to={`/map`}
                    >
                        <button className="add">Go to map</button>
                    </Link>
                </div>


            </Container>
        </>


    )

}
