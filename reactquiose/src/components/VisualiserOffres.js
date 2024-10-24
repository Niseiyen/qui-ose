import React, { useEffect, useState } from "react";
import { useLocation,useNavigate, Link } from "react-router-dom";
import "../CSS/VisualiserOffres.css";
import EmployeurHeader from "./EmployeurHeader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";


function VisualiserOffres() {
    const location = useLocation();
    const navigate = useNavigate();
    const userData = location.state?.userData;
    const employeurEmail = userData.credentials.email;
    const [offres, setOffres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOffre, setSelectedOffre] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const {t} = useTranslation();

    useEffect(() => {
        const fetchOffres = async () => {
            if (!employeurEmail) {
                setError("Email employeur non fourni");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8081/offreDeStage/offresEmployeur/${employeurEmail}`);
                if (response.status === 404){
                    setOffres([]);
                    return;
                }

                const data = await response.json();
                console.log(data)

                if (data.length === 0) {
                    setOffres([]);
                } else {
                    setOffres(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOffres();
    }, [employeurEmail]);

    const getStatusClass = (status) => {
        switch (status) {
            case "Validé":
                return "status-green";
            case "Rejeté":
                return "status-red";
            default:
                return "status-yellow";
        }
    };

    const handleOffreClick = (index) => {
        if (selectedOffre === index) {
            setSelectedOffre(null);
        } else {
            setSelectedOffre(index);
        }
    };

    const openPDF = (data) => {
        const pdfWindow = window.open();
        pdfWindow.document.write(
            `<iframe src="${data}" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`
        );
    };

    const deleteOffre = async (id) => {
        const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette offre ?");
        if (confirmDelete) {
            setDeletingId(id);
            try {
                const response = await fetch(`http://localhost:8081/offreDeStage/${id}`, {
                    method: "DELETE",
                });
                if (response.status === 204) {
                    setOffres(offres.filter((offre) => offre.id !== id));
                    setSelectedOffre(null);
                } else {
                    setError("Erreur lors de la suppression de l'offre");
                }
            } catch (error) {
                setError("Erreur lors de la suppression de l'offre");
            } finally {
                setDeletingId(null);
            }
        }
    };

    const handleUpdateClick = (offre, employeurEmail) => {
        navigate("/update-offre", { state: { offre, employeurEmail, userData } });
    };

    const handleListeClick = (offre) => {
        navigate(`/offre/${offre.id}/etudiants`, { state: { userData, offre } });
    };

    if (isLoading) {
        return <div>{t('ChangementDesOffres')}</div>;
    }

    if (error) {
        return <div>{t('Erreur')} {error}</div>;
    }


    return (
        <>
            <EmployeurHeader userData={userData}/>
            <div className="container-fluid p-4">

                <div className="container mt-5">
                    <h1 className="text-center mt-5">{t('VosOffres')}</h1>

                    {offres.length === 0 ? (
                        <div className="alert alert-info mt-3">{t('AccuneOffreTrouve')}</div>
                    ) : (
                        <div className="row mt-3">
                            {offres.map((offre, index) => (
                                <div key={index} className="col-md-4 mb-4">
                                    <div
                                        className={`card offre-card ${deletingId === offre.id ? "fade-out" : ""}`}
                                        onClick={() => handleOffreClick(index)}
                                    >
                                        <div className="card-body">
                                            <h5 className="card-title">{offre.titre}</h5>
                                            <p className="card-text">
                                                <strong>{t('localisation')}</strong> {offre.localisation} <br/>
                                                <strong>{t('NombreDeCandidatsMax')}</strong> {offre.nbCandidats}
                                                <br/>
                                                {offre.status === "Validé" && (
	                                               <div onClick={() => handleListeClick(offre)} className="alert alert-link p-0 m-1 text-left text-primary text-decoration-underline">
                                                    		{t('VoirLaListeDesCandidats')} ({offre.nbCandidats})
	                                                </div>
						                        )}
                                            </p>
                                            <p className="info-stage">
                                                {t('DateDePublication')} {new Date(offre.datePublication).toLocaleDateString()}
                                                <br/>
                                                {t('DateLimite')} {new Date(offre.dateLimite).toLocaleDateString()}
                                            </p>
                                            <div className={`status-badge ${getStatusClass(offre.status)}`}>
                                                {t('Status')} {offre.status}
                                            </div>
                                            {offre.status === "Rejeté" && (
                                                <p className="info-stage">{t('RaisonDuRejet')}<strong>{offre.rejetMessage}</strong></p>
                                            )}

                                            {selectedOffre === index && (
                                                <>
                                                    <div
                                                        className="card pdf-card mt-4"
                                                        style={{backgroundColor: "#f0f0f0"}}
                                                        onClick={() => openPDF(offre.data)}
                                                    >
                                                        <div className="card-body text-center">
                                                            <h5 className="card-title">{t('VoirLeFichierPfd')}</h5>
                                                            <p className="card-text">{t('ClickToViewPdf')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-4">
                                                        <FontAwesomeIcon
                                                            icon={faEdit}
                                                            size="2x"
                                                            className="text-warning"
                                                            style={{cursor: "pointer"}}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUpdateClick(offre, employeurEmail);
                                                            }}
                                                        />

                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                            size="2x"
                                                            className="text-danger"
                                                            style={{cursor: "pointer"}}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteOffre(offre.id);
                                                            }}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default VisualiserOffres;
