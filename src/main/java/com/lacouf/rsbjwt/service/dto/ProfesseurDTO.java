package com.lacouf.rsbjwt.service.dto;

import com.lacouf.rsbjwt.model.Professeur;
import com.lacouf.rsbjwt.model.auth.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ProfesseurDTO extends UserDTO {
    private Long id;
    private CredentialDTO credentials;
    private String departement;

    public ProfesseurDTO(String firstName, String lastName, Role role, String phoneNumber, CredentialDTO credentials, String departement) {
        super(firstName, lastName, phoneNumber, role);
        this.credentials = credentials;
        this.departement = departement;
    }

    public ProfesseurDTO(Professeur professeur) {
        super(professeur);
        this.id = professeur.getId();
        this.credentials = new CredentialDTO(professeur.getEmail(), professeur.getPassword());
        this.departement = professeur.getDepartement();
    }


    public ProfesseurDTO() {}

    public static ProfesseurDTO empty() {
        return new ProfesseurDTO();
    }
}
