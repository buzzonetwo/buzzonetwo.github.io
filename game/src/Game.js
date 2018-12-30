

var game = new Kiwi.Game('content', 'RoguelikeGame', null,  {width:1000, height:1000});


game.states.addState(GamePlay);

game.states.switchState("Gameplay");
