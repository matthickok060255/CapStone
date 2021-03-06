package com.werewolf.controller;

import com.werewolf.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.text.ParseException;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class GameController {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserRepository userRepository;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH", "OPTIONS");
            }
        };
    }

    @PostMapping(path = "/createGame") // Map ONLY POST Requests
    public @ResponseBody
    Game addNewGame(@RequestParam String name,
                      @RequestParam String password,
                      @RequestParam Integer maxPlayers,
                      @RequestParam Integer minPlayers,
                      @RequestParam Integer numWerewolfPlayers,
                      @RequestParam boolean isPsychics,
                      @RequestParam boolean isReporter,
                      @RequestParam boolean isCop,
                      @RequestParam Integer roundTimer,
                      @RequestParam GameStateEnum gameState,
                    @RequestParam String createdBy) throws ParseException {
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
        game.setRoundTimer(roundTimer);
        game.setGameState(gameState);
        game.setCreatedBy(createdBy);
        return gameRepository.save(game);
    }

    @GetMapping(path = "/allCreatedGames")
    public @ResponseBody
    Iterable<Game> getAllCreatedGames() {
        // This returns a JSON or XML with the Games

        return gameRepository.findByGameState(GameStateEnum.CREATED);
    }

    @GetMapping(path = "/allGames")
    public @ResponseBody
    Iterable<Game> getAllUsers() {
        // This returns a JSON or XML with the Games
        return gameRepository.findAll();
    }

    @GetMapping(path = "/games/{id}")
    public @ResponseBody
    Optional<Game> getUserById(@PathVariable Integer id) {
        // This returns a JSON or XML with the Games
        return gameRepository.findById(id);
    }

    @PutMapping("/games/{id}")
    Game updateGame(@RequestBody Game newGame, @PathVariable Integer id) {

        return gameRepository.findById(id)
                .map(game -> {
                    game.setName(newGame.getName());
                    game.setPassword(newGame.getPassword());
                    game.setMaxPlayers(newGame.getMaxPlayers());
                    game.setMinPlayers(newGame.getMinPlayers());
                    game.setNumWerewolfPlayers(newGame.getNumWerewolfPlayers());
                    game.setPsychic(newGame.isPsychic());
                    game.setReporter(newGame.isReporter());
                    game.setCop(newGame.isCop());
                    game.setStartTime(newGame.getStartTime());
                    game.setRoundTimer(newGame.getRoundTimer());
                    game.setCurrentPlayers(newGame.getCurrentPlayers());
                    ;
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

    @PostMapping(path = "/createUser") // Map ONLY POST Requests
    public @ResponseBody
    String addNewUser(@RequestParam String username,
                      @RequestParam String password,
                      @RequestParam String lastName,
                      @RequestParam String firstName
    ) throws ParseException {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request

        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setFirstName(firstName);
        user.setLastName(lastName);


        userRepository.save(user);
        return "User was successfully Created";
    }

    @PostMapping(path = "/login") // Map ONLY POST Requests
    public @ResponseBody
    User login(@RequestParam String username,
                      @RequestParam String password
    ) throws ParseException {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request

        User user = userRepository.findByUsername(username);
        boolean isValidLogIn = false;
        if( user != null) {
            isValidLogIn = user.getPassword() == password;
        }


        return user;
    }

}
