import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import UserGuest from "./UserGuest";
import UserLoggued from "./UserLoggued";
import Loading from "../../components/Loading";

export default function Account() {
    const [login, setLogin] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            !user ? setLogin(false) : setLogin(true);
        });
    }, []);

    if (login === null) return <Loading isVisible={true} text="Cargando..." />;

    return login ? <UserLoggued /> : <UserGuest />;
}