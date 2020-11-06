import React from "react";
import LogoHES from "../assets/HESLOGO.png"; // with import
import styled from "styled-components";

const Container = styled.div`

text-align:justify;
padding:2em;
margin:2em;
font-size:75%;

  h1 {
    color: #24B9B6;
    text-align: center;
    border: 2px solid white;
    border-radius: 8px;
    padding:1em;
    margin: 0.5em;
    font-weight: bold;
    font-size: 200%;
  }
    h2 {
    text-align: center;
    color: #e6f9ff;
    padding:1em;
    margin: 0.5em;
    font-weight: bold;
    font-size: 200%;
    text-decoration: underline overline dotted #24B9B6;
  }
    h4 {
    color: #24B9B6;
    padding:1em;
    margin: 0.5em;
    text-align: center;
    font-style: italic;
  }
  img{
  text-align: center;
  display: block;
  margin-left: auto;
  margin-right: auto;
  // width: 50%;
  }
`


export default function Terms() {
    return (

        <Container>

            <h1>Terms of use</h1>

            <h2>Security <span>🛡️</span></h2>
            The personal information we collect is kept in a secure environment. The people working on this project are
            required
            to respect the confidentiality of your information.<br/><br/>

            Your personal data stored with us are :
            <ul>
                <li>Email address</li>
                <li>Nickname/pseudo (chosen on the site)</li>
                <li>Your means of connection (Github, Auth0)</li>
            </ul>
            We do not store your passwords. Security is fully managed by Auth0. More information can be found on <a
            href="https://auth0.com"/>. We are committed to maintaining a high level of confidentiality by incorporating
            the latest technological innovations to ensure the privacy of your information.

            <h2>Cookies <span>🍪</span></h2>
            We do not store cookies. The domain administrator and Auth0 may store cookies for your authentication and
            session. If you want to offer some we will gladly eat them ! <span>🍪🙋‍♂</span>

            <h2>Shelf life <span>⏳</span></h2>
            The 'personal' data mentioned will be kept until you have withdrawn from the property.

            <h2>Other third party services and content <span>🌐</span></h2>
            Our site may include third-party content such as Leaflet, OpenStreetMap, social network sharing buttons or
            other features.

            <h3>Developed by Mickaël, Ludovic & Brice</h3>

            <h4>Boosted by:</h4>
            <img class="center" width="200px" height="60px" src={LogoHES} alt="Logo HES-SO Valais-Wallis"></img>


        </Container>

    );
}