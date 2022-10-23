# TreasureHunterProject

## Introduction
As course project I created simple platform game from week 7 exercise. Main idea of game is to collect all stars, survive all three levels and find treasure.  

![image](https://user-images.githubusercontent.com/78799868/197366079-3b812e2f-64aa-49f7-890a-62ad92db98ec.png)

## What was done
### gaming and levels
Game includes three levels, where one is always more difficult than the other. Code behind them are a bit similar in all of them, but each of them has their own thing which make them different. In levels one tand two has hidden door and in level three has the hidden treasure. From the door, the player go to next level and from the treasure the palyer wins and game ends. To reveal the secret of the level, player have to collect enough points. Player got those point by collecting stars. There is two kind of them, and they give different amount of points. If the player dies, the game ends and the player has to click to return to start. Each level the player has three lives.

###  Stars and Enemys
There is two different stars: yellow and red ones. Yellow ones give player 5 point and red ones 10 points. Each level is possible to collect a total of 65 point, but each level has to collect different amount of points. In the level one 50 points is enoug, in the second 55 points but in the third level needs them all so secret will reveal.

There is also two kind of enemys: rockets and bombs. Both of them take from the player one of lives if they hit the player. The rockets moves only horizontal but the bombs pounce around the map. In the first level there is only two rocket, in the second there is two bombs but in the third there is two of both of them.

### Platforms
There is used three kind of platforms in the game. In the level one there has used only normal static platforms, but in the level two, there is one moving platform and one hidden paltform. In the level three there is  platform which need to be moved with mouse click.

### Audio
I used some audios in this game too. There is background sound and there is also sound effect almost everything player do. There is sound when player collect star, jump, get damage, found door, go through the door, die or win.


## What tools were used: 

I used CodeSandbox, Phaser, Freesound, Pixlr X and internet as my tools. 

I used CodeSandbox as my developing environment and in the dependencies I included phaser. With phaser’s features I managed to build this simple game. Also, with Phaser’s websites I were able to find some tutorials how to make some features to my game and some images to use in my game. From Freesound I found my game audios and with Pixlr X I edited some of my game's images. 

Also, internet was very important tool with this project. From there I looked in some examples and ideas how to implement my game’s features in practise. I have list all my sources top of my “index.js” -file. 

## Points Wishes

![image](https://user-images.githubusercontent.com/78799868/197398757-650ba765-7030-4d1f-8780-53b519069458.png)

1) Game is responsive, but it doesn’t look good 

2) Player doesn’t die after one hit, There is three lives in each level 

3) Mouse is included in game. Player needs to click map, to move platform in the level three. 

