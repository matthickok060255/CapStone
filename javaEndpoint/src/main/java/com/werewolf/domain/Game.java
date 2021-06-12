package com.werewolf.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Entity // This tells Hibernate to make a table out of this class
public class Game {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;
    private String name;
    private String password;
    private Integer maxPlayers;
    private Integer minPlayers;
    private Integer numWerewolfPlayers;
    private boolean isPsychic;
    private boolean isReporter;
    private boolean isCop;
    private String startTime;
    private Integer roundTimer;

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
}