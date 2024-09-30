import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/GestionnaireHeader.css';

function GestionnaireHeader() {
    return (
        <header className="gestionnaire-header">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/accueilGestionnaire">Tableau de Bord</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/listeEtudiants">Étudiant</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/role/professeur">Professeur</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/role/employeur">Employeur</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default GestionnaireHeader;