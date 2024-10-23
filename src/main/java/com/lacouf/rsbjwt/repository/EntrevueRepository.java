package com.lacouf.rsbjwt.repository;

import com.lacouf.rsbjwt.model.Entrevue;
import com.lacouf.rsbjwt.model.Etudiant;
import com.lacouf.rsbjwt.model.OffreDeStage;
import com.lacouf.rsbjwt.service.dto.EntrevueDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EntrevueRepository extends JpaRepository<Entrevue, Long> {
    boolean existsByEtudiantAndOffreDeStage(Etudiant etudiant, OffreDeStage offreDeStage);
    List<Entrevue> findByOffreDeStageId(Long offreDeStageId);

    List<Entrevue> findAllByEtudiantId(Long etudiantId);

    @Query("SELECT e FROM Entrevue e WHERE e.etudiant.id = :etudiantId AND e.offreDeStage.id = :offreDeStageId")
    Optional<Entrevue> findByEtudiantIdAndOffreDeStageId(@Param("etudiantId") Long etudiantId, @Param("offreDeStageId") Long offreDeStageId);

    List<Entrevue> findByOffreDeStageIdAndStatus(Long offreDeStageId, String status);
}
