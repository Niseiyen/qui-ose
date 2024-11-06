package com.lacouf.rsbjwt.repository;

import com.lacouf.rsbjwt.model.EvaluationStageProf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvaluationStageProfRepository extends JpaRepository<EvaluationStageProf, Long> {
}
