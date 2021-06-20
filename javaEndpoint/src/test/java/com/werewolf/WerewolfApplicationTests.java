package com.werewolf;



import com.werewolf.domain.Game;
import com.werewolf.domain.GameRepository;
import com.werewolf.domain.GameStateEnum;
import com.werewolf.utils.ISO8601DateParser;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.event.annotation.BeforeTestClass;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class WerewolfApplicationTests extends AbstractTest {

	@MockBean
	private GameRepository gameRepository;

	@Override
	@BeforeEach
	public void setUp() {
		super.setUp();


	}

	@Test
	public void getGamesList() throws Exception {
		String uri = "/allGames";
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.get(uri)
				.accept(MediaType.APPLICATION_JSON_VALUE)).andReturn();

		int status = mvcResult.getResponse().getStatus();
		Assertions.assertEquals(200, status);
		String content = mvcResult.getResponse().getContentAsString();

	}

	@Test
	public void createGame() throws Exception {
		String uri = "/createGame";
		Game game = new Game();
		game.setName("name");
		game.setPassword("password");
		game.setMaxPlayers(15);
		game.setMinPlayers(5);
		game.setNumWerewolfPlayers(3);
		game.setPsychic(true);
		game.setReporter(false);
		game.setCop(true);
		game.setStartTime("2010-10-27T11:58:22+03:00");
		game.setRoundTimer(60);
		game.setGameState(GameStateEnum.ACTIVE);

		String inputJson = super.mapToJson(game);
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.post(uri)
				.param("name", "name")
						.param("password", "password")
						.param("maxPlayers", "15")
						.param("minPlayers", "5")
						.param("numWerewolfPlayers", "3")
						.param("isPsychics", "true")
						.param("isCop", "true")
						.param("isReporter", "false")
						.param("startTime", "2010-10-27T11:58:22+03:00")
						.param("roundTimer", "60")
						.param("gameState", "ACTIVE")
				.contentType(MediaType.MULTIPART_FORM_DATA)
				).andReturn();

		int status = mvcResult.getResponse().getStatus();
		Assertions.assertEquals(200, status);
		String content = mvcResult.getResponse().getContentAsString();
		Assertions.assertEquals(content, "Game was successfully Created");
	}

	@Test
	public void updateGame() throws Exception {
		String uri = "/games/2";
		Game Game = new Game();
		Game.setName("Lemon");
		String inputJson = super.mapToJson(Game);
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.put(uri)
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.content(inputJson)).andReturn();

		int status = mvcResult.getResponse().getStatus();
		Assertions.assertEquals(200, status);
	}

	@Test
	public void deleteGame() throws Exception {
		String uri = "/games/2";
		MvcResult mvcResult = mvc.perform(MockMvcRequestBuilders.delete(uri)).andReturn();
		int status = mvcResult.getResponse().getStatus();
		Assertions.assertEquals(200, status);
	}
}