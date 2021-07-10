package com.werewolf.domain;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity // This tells Hibernate to make a table out of this class
public class Game {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;
    private String name;
    private String password;
    private Integer maxPlayers;
    private Integer minPlayers;
    private String currentPlayers;
    private String createdBy;
    private Integer numWerewolfPlayers;
    private boolean isPsychic;
    private boolean isReporter;
    private boolean isCop;
    private String startTime;
    private Integer roundTimer;
    private GameStateEnum gameState;

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public Integer getMaxPlayers() {
        return maxPlayers;
    }

    public Integer getMinPlayers() {
        return minPlayers;
    }

    public Integer getNumWerewolfPlayers() {
        return numWerewolfPlayers;
    }

    public boolean isPsychic() {
        return isPsychic;
    }

    public boolean isReporter() {
        return isReporter;
    }

    public boolean isCop() {
        return isCop;
    }

    public String getStartTime() {
        return startTime;
    }

    public Integer getRoundTimer() {
        return roundTimer;
    }

    public GameStateEnum getGameState() {
        return gameState;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setMaxPlayers(Integer maxPlayers) {
        this.maxPlayers = maxPlayers;
    }

    public void setMinPlayers(Integer minPlayers) {
        this.minPlayers = minPlayers;
    }

    public void setNumWerewolfPlayers(Integer numWerewolfPlayers) {
        this.numWerewolfPlayers = numWerewolfPlayers;
    }

    public void setPsychic(boolean psychic) {
        isPsychic = psychic;
    }

    public void setReporter(boolean reporter) {
        isReporter = reporter;
    }

    public void setCop(boolean cop) {
        isCop = cop;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public void setRoundTimer(Integer roundTimer) {
        this.roundTimer = roundTimer;
    }

    public void setGameState(GameStateEnum gameState) {
        this.gameState = gameState;
    }

    public String getCurrentPlayers() {
        return currentPlayers;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCurrentPlayers(String currentPlayers) {
        this.currentPlayers = currentPlayers;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}