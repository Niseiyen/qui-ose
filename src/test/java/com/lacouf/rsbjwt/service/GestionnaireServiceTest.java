package com.lacouf.rsbjwt.service;

import com.lacouf.rsbjwt.model.Gestionnaire;
import com.lacouf.rsbjwt.model.auth.Role;
import com.lacouf.rsbjwt.repository.GestionnaireRepository;
import com.lacouf.rsbjwt.repository.OffreDeStageRepository;
import com.lacouf.rsbjwt.service.dto.CredentialDTO;
import com.lacouf.rsbjwt.service.dto.GestionnaireDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class GestionnaireServiceTest {

    private Gestionnaire gestionnaireEntity;
    private GestionnaireDTO gestionnaireDTO;

    private GestionnaireService gestionnaireService;
    private GestionnaireRepository gestionnaireRepository;
    private PasswordEncoder passwordEncoder;
    private OffreDeStageRepository offreDeStageRepository;


    @BeforeEach
    void setUp() {
        gestionnaireRepository = Mockito.mock(GestionnaireRepository.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        gestionnaireService = new GestionnaireService(gestionnaireRepository, passwordEncoder, offreDeStageRepository);

        gestionnaireEntity = new Gestionnaire("Thiraiyan", "Moon", "titi@gmail.com", "password", "123-456-7890");
        gestionnaireDTO = new GestionnaireDTO(gestionnaireEntity);
    }

    @Test
    public void testCreerGestionnaire() {
        // Arrange
        when(gestionnaireRepository.save(any(Gestionnaire.class)))
                .thenReturn(gestionnaireEntity);

        // Act
        Optional<GestionnaireDTO> response = gestionnaireService.creerGestionnaire(gestionnaireDTO);
        GestionnaireDTO gestionnaireRecu = response.get();

        // Assert
        assert response.isPresent();
        assertEquals(gestionnaireDTO.getFirstName(), gestionnaireRecu.getFirstName());
        assertEquals(gestionnaireDTO.getLastName(), gestionnaireRecu.getLastName());
        assertEquals(gestionnaireDTO.getPhoneNumber(), gestionnaireRecu.getPhoneNumber());
    }

    @Test
    public void testCreerGestionnaireWithException() {
        // Arrange
        when(gestionnaireRepository.save(any(Gestionnaire.class)))
                .thenThrow(new RuntimeException());

        // Act
        Optional<GestionnaireDTO> response = gestionnaireService.creerGestionnaire(gestionnaireDTO);

        // Assert
        assert !response.isPresent();
    }
}
