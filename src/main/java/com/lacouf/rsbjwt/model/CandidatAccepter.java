package com.lacouf.rsbjwt.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CandidatAccepter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "entrevue_id", nullable = false)
    private Entrevue entrevue;

    @Column(nullable = false)
    private boolean accepte;


    public CandidatAccepter(Entrevue entrevue, boolean accepte) {
        this.entrevue = entrevue;
        this.accepte = accepte;
    }

    @Override
    public String toString() {
        return "CandidatAccepter{" +
                "id=" + id +
                ", entrevue=" + entrevue.getId() +
                ", accepte=" + accepte +
                '}';
    }
}