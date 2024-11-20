import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../CSS/Header.css'
import logo from '../../images/logo.png';
import "../../CSS/BoutonLangue.css";
import i18n from "i18next";
import {FaCross, FaTimes} from "react-icons/fa";
import {calculateNextSessions} from "../../utils/methodes/dateUtils";
import {hardCodedSessions} from "../../utils/variables/hardCodedSessions";
import {Button} from "react-bootstrap";


function translateTimeAgo(time, unit) {
    const currentLanguage = i18n.language ? i18n.language.split('-')[0].toLowerCase() : 'fr';
    const translatedUnit = i18n.t(unit, { lng: currentLanguage });
    const ago = i18n.t('ago', { lng: currentLanguage });
    if (currentLanguage === 'fr') {
        return `${ago} ${time} ${translatedUnit}`;
    } else {
        return `${time} ${translatedUnit} ${ago}`;
    }
}

function extractTimeAndUnit(tempsDepuisReception) {
    const regex = /(\d+)\s*(secondes|minutes|heures|jours)/;
    const match = tempsDepuisReception.match(regex);
    if (match) {
        return { time: match[1], unit: match[2] };
    }
    return null;
}

function EtudiantHeader({ userData ,onSendData}) {
    const { t } = useTranslation();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [file, setFile] = useState(null);
    const [stagesAppliquees, setStagesAppliquees] = useState([]);
    const [activeLink, setActiveLink] = useState(location.pathname);
    const [nbEntrevuesEnAttente, setNbEntrevuesEnAttente] = useState(0);
    const [availableSessions, setAvailableSessions] = useState([]);
    const nextSession = calculateNextSessions();
    const initialSession = nextSession.slice(0, -2);
    const [session, setSession] = useState(() => {
        return localStorage.getItem('session') || initialSession;
    });

    const handleSessionChange = (newSession) => {
        setSession(newSession);
        localStorage.setItem('session', newSession);
        sendData("session", newSession);
    };

    const sendData = (key, value) => {
        onSendData({
            [key]: value
        });
    };

    const handleClickLogo = () => {
        if (userData) {
            navigate("/accueilEtudiant", { state: { userData: userData } });
        }
    };

    const handleLinkClick = (path) => {
        setActiveLink(path);
        if (userData) {
            navigate(path, { state: { userData: userData } });
        }
    };

    async function deplacementVersNotif(url, index, NotifId) {
        await handleDeleteNotification(index, NotifId)
        handleLinkClick(url)
    }

    const handleDeleteNotification = async (index, notifId) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((_, i) => i !== index)
        );

        try {
            const response = await fetch(`http://localhost:8081/notification/markAsRead/${notifId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de la notification');
            }
        } catch (err) {
            console.error('Erreur:', err);
        }
    };

    const toggleProfileMenu = () => {
        setProfileMenuOpen(!profileMenuOpen);
        setNotificationMenuOpen(false);
    };

    function toggleNotificationMenu() {
        setNotificationMenuOpen(!notificationMenuOpen);
        setProfileMenuOpen(false)
    }

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    useEffect(() => {
        onSendData({
            session: session
        });
        setAvailableSessions(hardCodedSessions);
    }, []);

   useEffect(() => {
        if (userData) {
            const url = `http://localhost:8081/etudiant/credentials/${userData.credentials.email}`;

            fetch(url)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Erreur lors de la requête: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    //console.log('Réponse du serveur:', data);

                    if (data.cv) {
                        setFile(data.cv);
                        setStagesAppliquees(data.offresAppliquees);

                        //console.log('CV:', data.cv);
                        //console.log('Stages appliquées:', data.offresAppliquees);
                    }
                })
                .catch((error) => {
                    console.error('Erreur:', error);
                });
        }
    },[userData]);

    useEffect(() => {
        fetch(`http://localhost:8081/entrevues/enAttente/etudiant/${userData.credentials.email}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des entrevues');
                }
                return response.json();
            })
            .then(data => {
                console.log('Réponse du serveur :', data);
                setNbEntrevuesEnAttente(data.length);
            })
            .catch(err => {
                console.error('Erreur:', err);
            });

    }, [userData]);


    useEffect(() => {
        if (userData) {
            const fetchNotifications = () => {
                console.log('Fetching notifications...')
                const url = `http://localhost:8081/notification/allUnread/${userData.credentials.email}`;
                fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Erreur lors de la requête: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Réponse du serveur:', data);
                        setNotifications(data);
                    })
                    .catch(error => {
                        console.error('Erreur:', error);
                    });
            };

            fetchNotifications(); // Fetch notifications initially

            const intervalId = setInterval(fetchNotifications, 60000); // Fetch notifications every 60 seconds

            return () => clearInterval(intervalId); // Clear interval on component unmount
        }
    }, [userData]);


    return (
        <header className="gestionnaire-header">
            <nav className="navbar">
                <div className="logo" onClick={handleClickLogo} style={{cursor: 'pointer'}}>
                    <img src={logo} alt="Logo" className="header-logo"/>
                    <div className="logo-text">Qui-Ose</div>
                </div>

                <div className="nav-links">
                    <span
                        className={`nav-link ${activeLink === '/accueilEtudiant' ? 'active' : ''}`}
                        onClick={() => handleLinkClick('/accueilEtudiant')}
                    >
                        {t('accueil')}
                    </span>
                    {file && file.status === "validé" && (
                        <span
                            className={`nav-link ${activeLink === '/stagesAppliquees' ? 'active' : ''}`}
                            onClick={() => handleLinkClick('/stagesAppliquees')}
                        >
                            {t('stagesAppliquées')} ({stagesAppliquees.length})
                        </span>
                    )}

                    <span
                        className={`nav-link ${activeLink === '/mesEntrevues' ? 'active' : ''}`}
                        onClick={() => handleLinkClick('/mesEntrevues')}
                    >
                        {t('mesEntrevues')} ({nbEntrevuesEnAttente || 0})
                    </span>
                    <span
                        className={`nav-link ${activeLink === '/signerContrat' ? 'active' : ''}`}
                        onClick={() => handleLinkClick('/signerContrat')}
                    >
                        {t('SignerContrat')}
                    </span>
                </div>
                <div className="filter-options">
                    <label>Filtre :</label>
                    <div className="session-dropdown">
                        <select value={session} onChange={(e) => handleSessionChange(e.target.value)}>
                            {availableSessions.map(sessionOption => (
                                <option key={sessionOption.id}
                                        value={sessionOption.id}>{sessionOption.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="profile-menu">
                    <div className="notification-icon" onClick={toggleNotificationMenu}>
                        🕭 <span className="notification-count">{notifications.length}</span>
                    </div>
                    {notificationMenuOpen && (
                        <div className="dropdown notification-dropdown">
                            {notifications.length > 0 ? (
                                notifications.map((notification, index) => {
                                    const {time, unit} = extractTimeAndUnit(notification.tempsDepuisReception);
                                    const translatedTime = translateTimeAgo(time, unit);
                                    return (
                                        <React.Fragment key={notification.id}>
                                            <div className="dropdown-link">
                                                <div
                                                    onClick={() => deplacementVersNotif(notification.url, index, notification.id)}>
                                                    {t(notification.message)} {notification.titreOffre} - {translatedTime}
                                                </div>
                                                <div data-testid="delete-icon" className="delete-icon"
                                                     onClick={() => handleDeleteNotification(index, notification.id)}>
                                                    <FaTimes/>
                                                </div>
                                            </div>
                                            <hr className="m-1"/>
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <div className="dropdown-link">{t('noNotifications')}</div>
                            )}
                        </div>
                    )}

                    <div className="profile-button" onClick={toggleProfileMenu}>
                        {t('profile')} ▼
                    </div>
                    {profileMenuOpen && (
                        <div className="dropdown profile-dropdown">
                            <Link className="dropdown-link" to="/profile">{t('myProfile')}</Link>
                            <Link className="dropdown-link" to="/settings">{t('settings')}</Link>
                            <Link className="dropdown-link" to="/login">{t('logout')}</Link>
                            <button onClick={() => changeLanguage('en')} className="language-button dropdown-link">
                                {t('Anglais')}
                            </button>
                            <button onClick={() => changeLanguage('fr')} className="language-button dropdown-link">
                                {t('Francais')}
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}

export {translateTimeAgo, extractTimeAndUnit};
export default EtudiantHeader;