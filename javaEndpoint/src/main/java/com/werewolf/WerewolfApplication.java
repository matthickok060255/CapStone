package com.werewolf;

import com.werewolf.domain.Game;
import com.werewolf.domain.GameRepository;
import com.werewolf.utils.ISO8601DateParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@SpringBootApplication
@RestController
public class WerewolfApplication {

public static void main(String[] args) {
SpringApplication.run(WerewolfApplication.class, args);
}

@Autowired
private GameRepository gameRepository;

    @PostMapping(path="/createGame") // Map ONLY POST Requests
    public @ResponseBody
    String addNewUser (@RequestParam String name,
                       @RequestParam String password,
                               @RequestParam Integer maxPlayers,
                               @RequestParam Integer minPlayers,
                               @RequestParam Integer numWerewolfPlayers,
                               @RequestParam boolean isPsychics,
                               @RequestParam boolean isReporter,
                               @RequestParam boolean isCop,
                               @RequestParam String startTime,
                               @RequestParam Integer roundTimer) throws ParseException {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request

        Game game = new Game();
        game.setName(name);
        game.setPassword(password);
        game.setMaxPlayers(maxPlayers);
        game.setMinPlayers(minPlayers);
        game.setNumWerewolfPlayers(numWerewolfPlayers);
        game.setPsychic(isPsychics);
        game.setReporter(isReporter);
        game.setCop(isCop);
        game.setStartTime(startTime);
        game.setRoundTimer(roundTimer);
        gameRepository.save(game);
        return "Game was successfully Created";
    }

    @GetMapping(path="/allGames")
    public @ResponseBody Iterable<Game> getAllUsers() {
        // This returns a JSON or XML with the users
        return gameRepository.findAll();
    }

    @PutMapping("/games/{id}")
    Game updateGame(@RequestBody Game newGame, @PathVariable Integer id) {

        return gameRepository.findById(id)
                .map(game -> {
                    game.setName(game.getName());
                    game.setPassword(game.getPassword());
                    game.setMaxPlayers(game.getMaxPlayers());
                    game.setMinPlayers(game.getMinPlayers());
                    game.setNumWerewolfPlayers(game.getNumWerewolfPlayers());
                    game.setPsychic(game.isPsychic());
                    game.setReporter(game.isReporter());
                    game.setCop(game.isCop());
                    game.setStartTime(game.getStartTime());
                    game.setRoundTimer(game.getRoundTimer());;
                    return gameRepository.save(game);
                })
                .orElseGet(() -> {
                    newGame.setId(id);
                    return gameRepository.save(newGame);
                });
    }

    @DeleteMapping("/games/{id}")
    void deleteGame(@PathVariable Integer id) {
        gameRepository.deleteById(id);
    }

}