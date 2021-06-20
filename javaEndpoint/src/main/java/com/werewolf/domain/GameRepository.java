package com.werewolf.domain;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface GameRepository extends CrudRepository<Game, Integer> {



    Iterable<Game> findByGameState(GameStateEnum gameState);
}
