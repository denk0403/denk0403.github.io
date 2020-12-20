import { Link } from "gatsby";
import React from "react";
import githubImage from "../img/github.svg";
import linkedinImage from "../img/linkedin.svg";
import twitterImage from "../img/twitter.svg";
import headerStyles from "./header.module.css";

export default function Header() {
    return (
        <header className={headerStyles.headerParent}>
            <Link to="/" className={headerStyles.unlink}>
                <h1 className={headerStyles.nameHeading} title="Home Page">
                    Dennis Kats
                </h1>
            </Link>
            <div className={headerStyles.socialMediaIconList}>
                <a href="https://twitter.com/denk0403" title="Twitter Profile">
                    <img
                        className={headerStyles.socialMediaIcon}
                        src={twitterImage}
                        alt="Twitter Icon"
                    ></img>
                </a>
                <a href="https://github.com/denk0403" title="GitHub Profile">
                    <img
                        className={`${headerStyles.socialMediaIcon} ${headerStyles.keepFilter}`}
                        src={githubImage}
                        alt="GitHub Icon"
                    ></img>
                </a>
                <a href="https://www.linkedin.com/in/dennis-kats/" title="LinkedIn Profile">
                    <img
                        className={headerStyles.socialMediaIcon}
                        src={linkedinImage}
                        alt="LinkedIn Icon"
                    ></img>
                </a>
            </div>
        </header>
    );
}
