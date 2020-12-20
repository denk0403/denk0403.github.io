import React from "react";
import Header from "./header";
import mainLayoutStyles from "./mainLayout.module.css";

export default function MainLayout({ children }) {
    return (
        <div className={mainLayoutStyles.mainLayoutGrid}>
            <Header />
            {children}
        </div>
    );
}
